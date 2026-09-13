import React, { memo } from 'react';

interface Props {
  mode?: 'home' | 'gameplay';
}

const ALL_TILES = [
  { letter: 'W', left: '6%', delay: '-1.5s', dur: '11s', bg: 'from-amber-400 to-amber-600', shadow: '#b45309', size: 'w-12 h-12 md:w-15 md:h-15' },
  { letter: 'O', left: '18%', delay: '-7.0s', dur: '13s', bg: 'from-rose-400 to-pink-600', shadow: '#be123c', size: 'w-11 h-11 md:w-13 md:h-13' },
  { letter: 'R', left: '30%', delay: '-3.5s', dur: '12s', bg: 'from-emerald-400 to-teal-600', shadow: '#047857', size: 'w-13 h-13 md:w-15 md:h-15' },
  { letter: 'D', left: '44%', delay: '-9.2s', dur: '10.5s', bg: 'from-sky-400 to-blue-600', shadow: '#1d4ed8', size: 'w-12 h-12 md:w-14 md:h-14' },
  { letter: '★', left: '55%', delay: '-4.8s', dur: '14s', bg: 'from-amber-300 to-yellow-500', shadow: '#b45309', size: 'w-10 h-10 md:w-13 md:h-13' },
  { letter: 'H', left: '66%', delay: '-2.2s', dur: '11.5s', bg: 'from-purple-400 to-indigo-600', shadow: '#6d28d9', size: 'w-13 h-13 md:w-15 md:h-15' },
  { letter: 'U', left: '78%', delay: '-8.5s', dur: '13.5s', bg: 'from-amber-400 to-orange-500', shadow: '#b45309', size: 'w-12 h-12 md:w-14 md:h-14' },
  { letter: 'N', left: '88%', delay: '-5.6s', dur: '12.2s', bg: 'from-cyan-400 to-blue-500', shadow: '#0e7490', size: 'w-12 h-12 md:w-14 md:h-14' },
  { letter: 'T', left: '95%', delay: '-10s', dur: '11s', bg: 'from-emerald-400 to-teal-500', shadow: '#047857', size: 'w-11 h-11 md:w-13 md:h-13' },
  { letter: '✨', left: '10%', delay: '-11s', dur: '15s', bg: 'from-yellow-300 to-amber-400', shadow: '#b45309', size: 'w-10 h-10 md:w-12 md:h-12' },
];

export const GameBackground: React.FC<Props> = memo(({ mode = 'home' }) => {
  // In gameplay mode, show fewer tiles with lower opacity to keep maximum FPS and focus on the letter grid
  const tiles = mode === 'gameplay' ? ALL_TILES.slice(0, 6) : ALL_TILES;
  const tileOpacity = mode === 'gameplay' ? 0.32 : 0.88;

  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Ultra-lightweight CSS Radial Gradients (0% CPU, 0% GPU overhead, no heavy blur filters) */}
      <div 
        className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 20%, rgba(59, 130, 246, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 85% 80%, rgba(245, 158, 11, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)
          `
        }}
      />

      {/* 2. 100% GPU-Accelerated Falling 3D Letter Tiles (Runs directly on GPU compositor thread) */}
      {tiles.map((item, i) => (
        <div
          key={`tile-fall-${i}`}
          className={`absolute ${item.size} rounded-2xl bg-gradient-to-br ${item.bg} border-2 border-white/80 flex items-center justify-center font-black text-white text-xl md:text-2xl select-none`}
          style={{
            left: item.left,
            top: 0,
            boxShadow: '0 5px 0 ' + item.shadow,
            animation: `tileFallDown ${item.dur} linear ${item.delay} infinite`,
            opacity: tileOpacity,
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          {/* Subtle top gloss sheen */}
          <div className="absolute top-1 inset-x-1.5 h-3 rounded-t-xl bg-white/40 pointer-events-none" />
          <span className="relative z-10 drop-shadow-xs">{item.letter}</span>
        </div>
      ))}

      {/* 3. Ambient Side Floating Tiles (Only on large desktop screens) */}
      {mode === 'home' && (
        <>
          <div 
            className="hidden xl:flex absolute left-8 top-1/4 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-white/80 items-center justify-center font-black text-white text-2xl shadow-[0_6px_0_#b45309]"
            style={{ 
              animation: 'gentleSway 4s ease-in-out infinite',
              opacity: 0.82,
              willChange: 'transform',
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            <div className="absolute top-1 inset-x-1.5 h-3.5 rounded-t-xl bg-white/40 pointer-events-none" />
            <span className="relative z-10">W</span>
          </div>

          <div 
            className="hidden xl:flex absolute right-8 top-1/3 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white/80 items-center justify-center font-black text-white text-2xl shadow-[0_6px_0_#1e3a8a]"
            style={{ 
              animation: 'gentleSway 4.5s ease-in-out infinite 1s',
              opacity: 0.82,
              willChange: 'transform',
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            <div className="absolute top-1 inset-x-1.5 h-3.5 rounded-t-xl bg-white/40 pointer-events-none" />
            <span className="relative z-10">H</span>
          </div>
        </>
      )}
    </div>
  );
});
