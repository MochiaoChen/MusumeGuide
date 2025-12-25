import React, { useState, useEffect, useCallback } from 'react';
import { geminiLiveService } from '../services/geminiLiveService';
import AudioVisualizer from './AudioVisualizer';
import { ViewState } from '../types';

interface LiveGuideProps {
  onNavigate: (view: ViewState) => void;
}

const LiveGuide: React.FC<LiveGuideProps> = ({ onNavigate }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [volume, setVolume] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // Setup Service Callbacks
    geminiLiveService.onConnect = () => setIsConnected(true);
    geminiLiveService.onDisconnect = () => setIsConnected(false);
    geminiLiveService.onVolumeUpdate = (vol) => setVolume(vol);

    return () => {
      // Cleanup: Disconnect when component unmounts to save resources
      if (isConnected) {
        geminiLiveService.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run setup once

  const toggleConnection = useCallback(async () => {
    if (isConnected) {
      geminiLiveService.disconnect();
    } else {
      await geminiLiveService.connect();
    }
  }, [isConnected]);

  // 使用稳定的 v7 API，不仅风格更正式，而且加载更可靠
  // 设置为亚洲女性特征的导游形象
  const avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=Coco&eyebrows=default&eyes=happy&mouth=smile&top=longHairStraight&topColor=2c2c2c&clothing=blazerAndShirt&clothingColor=990000&skinColor=f5d0c5&accessories=spectacles";

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-stone-50">
      
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-uibe-red rounded-full blur-3xl mix-blend-multiply filter opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-uibe-gold rounded-full blur-3xl mix-blend-multiply filter opacity-20 animate-pulse" style={{animationDuration: '4s'}}></div>
          {/* Traditional Cloud Pattern Overlay */}
          <div className="absolute inset-0 bg-cloud-pattern opacity-30"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-4 z-10">
        
        {/* Header Section - More Compact */}
        <div className="mt-2 text-center shrink-0">
            <h2 className="text-xl font-serif text-uibe-red tracking-widest font-bold flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-uibe-red"></span>
                博雅 · 智能导游
                <span className="w-2 h-2 rounded-full bg-uibe-red"></span>
            </h2>
        </div>

        {/* Avatar/Digital Human Section */}
        {/* Added min-height to prevent collapse */}
        <div className="relative flex-1 w-full flex flex-col items-center justify-center min-h-[280px]">
             
             {/* Avatar Container with Breathing Animation */}
             <div 
                className={`relative transition-transform duration-100 ease-out`}
                style={{ 
                    // Subtle breathing + volume reaction
                    transform: `scale(${1 + (volume * 0.2)}) translateY(${isConnected ? Math.sin(Date.now() / 500) * 5 : 0}px)` 
                }}
             >
                {/* Glow Effect behind avatar */}
                <div className={`absolute inset-0 bg-gradient-to-t from-uibe-gold/40 to-transparent blur-2xl rounded-full transform translate-y-4 transition-opacity duration-700 ${isConnected ? 'opacity-100' : 'opacity-30'}`}></div>

                {/* Main Avatar Image */}
                <div className="relative z-10 w-56 h-56 md:w-64 md:h-64 filter drop-shadow-2xl">
                    {!imgError ? (
                        <img 
                            src={avatarUrl} 
                            alt="Boya Avatar" 
                            className="w-full h-full object-contain"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        // Fallback if image fails to load
                        <div className="w-full h-full flex items-center justify-center bg-stone-200 rounded-full border-4 border-white text-stone-400">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                             </svg>
                        </div>
                    )}
                </div>

                {/* Status Badge */}
                <div className={`absolute bottom-2 right-4 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm transition-all duration-300 flex items-center gap-1 ${isConnected ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-stone-400'}`}></div>
                    {isConnected ? '在线' : '休息中'}
                </div>
             </div>

             {/* Speech Bubble / Interaction Prompt */}
             <div className="mt-8 relative w-full max-w-[90%] md:max-w-[80%]">
                 <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-stone-200"></div>
                 <div className="bg-white/95 backdrop-blur border border-stone-200 rounded-2xl p-4 shadow-lg text-center min-h-[80px] flex items-center justify-center transition-all duration-300">
                    <p className={`text-sm font-medium leading-relaxed ${isConnected ? 'text-ink-black' : 'text-stone-500'}`}>
                        {isConnected 
                            ? (volume > 0.05 ? "我在听..." : "你好！我是博雅。关于博物馆或中国文化，请尽管问我。")
                            : "点击下方按钮，让我们开始交流吧。"}
                    </p>
                 </div>
             </div>
        </div>

        {/* Controls Section - Pinned to bottom */}
        <div className="w-full flex flex-col items-center pb-2 shrink-0 z-20">
            
            {/* Visualizer Area */}
            <div className="h-16 w-full flex items-center justify-center">
                {isConnected && (
                    <div className="animate-fade-in">
                        <AudioVisualizer isActive={isConnected} volume={volume} />
                    </div>
                )}
            </div>

            {/* Main Action Button */}
            <div className="relative mb-4 group">
                {isConnected && (
                    <span className="absolute inset-0 rounded-full bg-uibe-red opacity-20 animate-ping duration-1000"></span>
                )}
                {/* Hover ring effect */}
                <div className="absolute inset-0 rounded-full border border-uibe-red opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"></div>
                
                <button
                    onClick={toggleConnection}
                    className={`relative z-10 flex items-center justify-center w-20 h-20 rounded-full shadow-xl transition-all duration-300 transform active:scale-95 border-4 ${
                        isConnected 
                        ? 'bg-white border-uibe-red text-uibe-red' 
                        : 'bg-gradient-to-br from-uibe-red to-red-900 border-white text-white hover:shadow-2xl'
                    }`}
                >
                    {isConnected ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                            <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
                            <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                            <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Hint Text */}
            <p className="text-xs text-stone-400 font-medium mb-4">
                {isConnected ? '点击中止对话' : '点击麦克风开始交谈'}
            </p>

            {/* Quick Links Suggestions - Only show when disconnected for cleaner look */}
            {!isConnected && (
                <div className="flex flex-wrap justify-center gap-2 w-full px-4 animate-fade-in-up">
                    <button onClick={() => onNavigate(ViewState.CULTURE)} className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-600 shadow-sm hover:border-uibe-gold hover:text-uibe-red transition-colors text-left flex items-center gap-2">
                        <span className="text-lg">🍵</span> 介绍一下中国茶文化
                    </button>
                    <button onClick={() => onNavigate(ViewState.HOME)} className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-600 shadow-sm hover:border-uibe-gold hover:text-uibe-red transition-colors text-left flex items-center gap-2">
                        <span className="text-lg">🏛️</span> 博物馆有哪些展区？
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LiveGuide;