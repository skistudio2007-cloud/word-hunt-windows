import React, { memo } from 'react';
import { WorldInfo } from '../types';

interface Props {
  world?: WorldInfo;
  levelNumber?: number;
  variant?: 'home' | 'gameplay';
}

export const AnimatedThemeBackground: React.FC<Props> = memo(({ world, variant = 'home' }) => {
  const isGameplay = variant === 'gameplay';
  const decorations = world?.bgDecorations || ['✨', '🌿', '⭐', '🌸'];
  const accent = world?.accentColor || '#3b82f6';

  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Theme-specific ambient gradient */}
      <div 
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${isGameplay ? 'opacity-30' : 'opacity-60'}`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 20%, ${accent}22 0%, transparent 45%),
            radial-gradient(circle at 85% 80%, ${accent}18 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 55%)
          `
        }}
      />

      {/* 2. Floating theme particles */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {decorations.map((item, i) => {
          const leftPercent = 10 + i * 18;
          const dur = 10 + (i % 4) * 2;
          const delay = -(i * 2.5);
          return (
            <div
              key={i}
              className="absolute text-xl md:text-2xl select-none opacity-40 animate-pulse"
              style={{
                left: `${leftPercent}%`,
                top: `${15 + (i * 14) % 70}%`,
                animationDuration: `${dur}s`,
                animationDelay: `${delay}s`,
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
});
