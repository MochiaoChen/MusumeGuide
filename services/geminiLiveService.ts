import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

// Helper to encode ArrayBuffer to Base64
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper to decode Base64 to ArrayBuffer
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to decode raw PCM data into an AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  // Use byteOffset and byteLength to ensure we access the correct portion if it's a view
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Helper to create the specific Blob format required by Gemini Live API
function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // Clamp values to avoid overflow
    let val = data[i];
    val = Math.max(-1, Math.min(1, val));
    int16[i] = val * 32767;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export class GeminiLiveService {
  private ai: GoogleGenAI;
  private sessionPromise: Promise<any> | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  private active = false;
  
  // Callbacks for UI updates
  public onVolumeUpdate: ((volume: number) => void) | null = null;
  public onConnect: (() => void) | null = null;
  public onDisconnect: (() => void) | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async connect() {
    if (this.active) return;
    
    this.active = true;
    
    // INPUT: Request 16kHz to match model requirements directly.
    // Note: Browser support for specific sampleRates is generally good, but if this fails, we might need resampling logic.
    this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    
    // OUTPUT: Use system default sample rate for maximum hardware compatibility.
    // We will decode the 24kHz model output into a 24kHz buffer, and the context will handle resampling on playback.
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Setup Audio Output Node
    const outputNode = this.outputAudioContext.createGain();
    outputNode.connect(this.outputAudioContext.destination);

    // CRITICAL: Explicitly resume audio context to handle autoplay policies
    if (this.outputAudioContext.state === 'suspended') {
      await this.outputAudioContext.resume();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.sessionPromise = this.ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Connection Opened');
            if (this.onConnect) this.onConnect();

            // Setup Input Stream
            if (!this.inputAudioContext) return;
            const source = this.inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              if (!this.active) return;
              
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              
              // Calculate volume for visualizer
              let sum = 0;
              for(let i=0; i < inputData.length; i++) {
                sum += inputData[i] * inputData[i];
              }
              const rms = Math.sqrt(sum / inputData.length);
              if (this.onVolumeUpdate) this.onVolumeUpdate(rms * 5); 

              const pcmBlob = createBlob(inputData);
              
              if (this.sessionPromise) {
                this.sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              }
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(this.inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (!this.active || !this.outputAudioContext) return;

            // Iterate through parts to find audio data, as it might be mixed with text or other data
            const parts = message.serverContent?.modelTurn?.parts;
            if (!parts) return;

            for (const part of parts) {
                const base64EncodedAudioString = part.inlineData?.data;
                
                if (base64EncodedAudioString) {
                    // Initialize nextStartTime on first packet or reset
                    if (this.nextStartTime < this.outputAudioContext.currentTime) {
                        this.nextStartTime = this.outputAudioContext.currentTime;
                    }

                    // Visualizer blip
                    if (this.onVolumeUpdate) this.onVolumeUpdate(0.4); 
                    
                    const audioBuffer = await decodeAudioData(
                        decode(base64EncodedAudioString),
                        this.outputAudioContext,
                        24000,
                        1
                    );
                    
                    const source = this.outputAudioContext.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(outputNode);
                    
                    source.addEventListener('ended', () => {
                        this.sources.delete(source);
                        if (this.sources.size === 0 && this.onVolumeUpdate) {
                            this.onVolumeUpdate(0); 
                        }
                    });

                    // Schedule playback
                    // Add a tiny buffer to nextStartTime to prevent glitching if we fell slightly behind
                    const scheduleTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime + 0.01);
                    source.start(scheduleTime);
                    
                    this.nextStartTime = scheduleTime + audioBuffer.duration;
                    this.sources.add(source);
                }
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              console.log('Interrupted');
              this.sources.forEach(s => s.stop());
              this.sources.clear();
              this.nextStartTime = 0;
            }
          },
          onclose: () => {
            console.log('Gemini Live Connection Closed');
            this.disconnect();
          },
          onerror: (e) => {
            console.error('Gemini Live Error', e);
            this.disconnect();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: `
            你是一个对外经贸博物馆（UIBE Museum）的专业、热情且博学的电子导游。
            你的名字叫“博雅”。
            
            你的主要职责是：
            1. 向游客介绍博物馆关于中国对外贸易历史的展览。
            2. 深入讲解中国传统文化（如丝绸之路、瓷器、茶叶贸易等）。
            3. 用生动、优雅的中文与游客交流。
            
            性格特点：
            - 声音温和，语速适中。
            - 引经据典，但通俗易懂。
            - 当谈到中国传统文化时，语气充满自豪感。
            
            如果用户问你不知道的信息，礼貌地表示你还在学习中，并建议他们参观特定的展厅。
            请保持对话简短互动，不要一次性输出长篇大论，鼓励用户提问。
          `,
        },
      });
    } catch (error) {
      console.error("Failed to initialize Live API", error);
      this.disconnect();
    }
  }

  disconnect() {
    this.active = false;
    
    // Stop all playing audio
    this.sources.forEach(s => s.stop());
    this.sources.clear();
    this.nextStartTime = 0;

    // Close Audio Contexts
    if (this.inputAudioContext) {
      try { this.inputAudioContext.close(); } catch(e) {}
      this.inputAudioContext = null;
    }
    if (this.outputAudioContext) {
      try { this.outputAudioContext.close(); } catch(e) {}
      this.outputAudioContext = null;
    }
    
    if (this.sessionPromise) {
        this.sessionPromise.then(session => {
            try {
                (session as any).close && (session as any).close(); 
            } catch(e) {
                // Ignore close errors
            }
        });
        this.sessionPromise = null;
    }

    if (this.onDisconnect) this.onDisconnect();
  }
}

export const geminiLiveService = new GeminiLiveService();