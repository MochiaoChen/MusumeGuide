import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  volume: number; // 0 to 1 roughly
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, volume }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bars = Array(5).fill(10); // 5 bars

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const activeColor = '#D4AF37'; // Gold
      const inactiveColor = '#E5E7EB'; // Gray-200

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const barWidth = 10;
      const spacing = 6;

      bars = bars.map((h, i) => {
        if (!isActive) return 4;
        // Randomize height based on volume with some smoothing
        const targetHeight = Math.max(4, volume * 100 * (Math.random() * 0.5 + 0.8));
        return h + (targetHeight - h) * 0.2;
      });

      bars.forEach((h, i) => {
        const x = centerX + (i - 2) * (barWidth + spacing);
        
        ctx.fillStyle = isActive ? activeColor : inactiveColor;
        
        // Draw rounded pill
        ctx.beginPath();
        ctx.roundRect(x - barWidth / 2, centerY - h / 2, barWidth, h, 5);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, volume]);

  return (
    <canvas 
      ref={canvasRef} 
      width={120} 
      height={80} 
      className="block mx-auto"
    />
  );
};

export default AudioVisualizer;