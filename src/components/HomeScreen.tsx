import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Compass, MapPin, Trophy, Star } from 'lucide-react';
import { soundManager } from '../services/sound';
import { LanguageCode } from '../types';
import { getTranslation } from '../services/localization';
import { getWorldForLevel } from '../data/worlds';

interface Props {
  currentLevel: number;
  totalStars?: number;
  language?: LanguageCode;
  onPlay: () => void;
  onNavigateTab?: (tab: 'COLLECTION' | 'CHALLENGE' | 'JOURNEY') => void;
  onOpenJourney?: () => void;
}

export const HomeScreen: React.FC<Props> = ({ 
  currentLevel, 
  totalStars = 0,
  language = 'en', 
  onPlay,
  onNavigateTab,
  onOpenJourney 
}) => {
  const handlePlayClick = () => {
    soundManager.playTap();
    onPlay();
  };

  const playText = getTranslation(language, 'play') || 'PLAY';
  const levelText = getTranslation(language, 'level') || 'Level';
  const world = getWorldForLevel(currentLevel);

  return (
    <div className="w-full min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-75px)] relative overflow-hidden flex flex-col items-center justify-between bg-transparent select-none">
      {/* Foreground Content (Interactive, centered max-w-5xl) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex-1 flex flex-col items-center justify-between px-6 py-6 md:py-8">
        
        {/* 1. Upper-Center: Authentic Word Hunt Game Logo */}
        <div className="flex-1 flex flex-col items-center justify-center pt-2 md:pt-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center space-y-4 md:space-y-5"
          >
            {/* 3D Word Game Logo: Tactile Physical Letter Tiles + Golden Search Magnifier */}
            <div className="relative group cursor-pointer select-none" onClick={handlePlayClick}>
              {/* Tile Row: [W₄] [O₁] [R₁] [D₂] with Continuous Idle Wave Animation */}
              <div className="flex items-center justify-center gap-2.5 md:gap-3.5 relative z-10 py-2">
                {/* Tile 1: W */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [-6, -3, -6],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0,
                  }}
                  whileHover={{ y: -12, scale: 1.1, rotate: -2 }}
                  whileTap={{ scale: 0.94 }}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-2 border-amber-200/90 shadow-[0_8px_0_#b45309] md:shadow-[0_10px_0_#b45309] flex flex-col items-center justify-center relative transition-transform"
                >
                  <div className="absolute top-1 inset-x-2 h-4 rounded-t-xl bg-white/40 pointer-events-none" />
                  <span className="font-black text-2xl md:text-4xl text-amber-950 drop-shadow-xs">W</span>
                  <span className="absolute bottom-1 md:bottom-1.5 right-1.5 md:right-2 text-[9px] md:text-xs font-black text-amber-900/80">4</span>
                </motion.div>

                {/* Tile 2: O */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [3, 6, 3],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.35,
                  }}
                  whileHover={{ y: -12, scale: 1.1, rotate: 0 }}
                  whileTap={{ scale: 0.94 }}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-b from-rose-400 via-rose-500 to-pink-600 border-2 border-rose-200/90 shadow-[0_8px_0_#9f1239] md:shadow-[0_10px_0_#9f1239] flex flex-col items-center justify-center relative transition-transform"
                >
                  <div className="absolute top-1 inset-x-2 h-4 rounded-t-xl bg-white/40 pointer-events-none" />
                  <span className="font-black text-2xl md:text-4xl text-white drop-shadow-xs">O</span>
                  <span className="absolute bottom-1 md:bottom-1.5 right-1.5 md:right-2 text-[9px] md:text-xs font-black text-rose-100/90">1</span>
                </motion.div>

                {/* Tile 3: R */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [-3, 0, -3],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.7,
                  }}
                  whileHover={{ y: -12, scale: 1.1, rotate: 0 }}
                  whileTap={{ scale: 0.94 }}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-600 border-2 border-emerald-200/90 shadow-[0_8px_0_#065f46] md:shadow-[0_10px_0_#065f46] flex flex-col items-center justify-center relative transition-transform"
                >
                  <div className="absolute top-1 inset-x-2 h-4 rounded-t-xl bg-white/40 pointer-events-none" />
                  <span className="font-black text-2xl md:text-4xl text-white drop-shadow-xs">R</span>
                  <span className="absolute bottom-1 md:bottom-1.5 right-1.5 md:right-2 text-[9px] md:text-xs font-black text-emerald-100/90">1</span>
                </motion.div>

                {/* Tile 4: D */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [6, 9, 6],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1.05,
                  }}
                  whileHover={{ y: -12, scale: 1.1, rotate: 2 }}
                  whileTap={{ scale: 0.94 }}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600 border-2 border-sky-200/90 shadow-[0_8px_0_#1e3a8a] md:shadow-[0_10px_0_#1e3a8a] flex flex-col items-center justify-center relative transition-transform"
                >
                  <div className="absolute top-1 inset-x-2 h-4 rounded-t-xl bg-white/40 pointer-events-none" />
                  <span className="font-black text-2xl md:text-4xl text-white drop-shadow-xs">D</span>
                  <span className="absolute bottom-1 md:bottom-1.5 right-1.5 md:right-2 text-[9px] md:text-xs font-black text-sky-100/90">2</span>
                </motion.div>
              </div>

              {/* Floating Golden Magnifying Search Glass Overlaid */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [-18, -10, -18],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute -top-4 -right-5 md:-top-6 md:-right-8 z-20 pointer-events-none"
              >
                <div className="relative w-14 h-14 md:w-18 md:h-18 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 p-1.5 shadow-2xl border-2 border-white flex items-center justify-center">
                  {/* Cyan Glass Lens */}
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-sky-300/80 via-blue-500/70 to-indigo-600/90 border border-white/60 flex items-center justify-center relative overflow-hidden backdrop-blur-2xs">
                    <div className="absolute top-1 left-2 w-3 h-1.5 rounded-full bg-white/75 -rotate-45" />
                    <span className="text-sm md:text-lg select-none">🔍</span>
                  </div>
                  {/* Golden Handle */}
                  <div className="absolute -bottom-2 -right-2 w-5 h-2.5 rounded-full bg-amber-600 border border-amber-300 rotate-45 shadow-sm" />
                </div>
              </motion.div>

              {/* Dazzling Sparkle Badges */}
              <div className="absolute -top-3 -left-3 text-amber-400 text-lg md:text-2xl animate-pulse drop-shadow-sm">
                ✨
              </div>
              <div className="absolute -bottom-2 left-6 text-yellow-400 text-base md:text-xl animate-bounce drop-shadow-sm">
                ⭐
              </div>

              {/* Ambient Glow Aura */}
              <div className="absolute -inset-6 bg-gradient-to-r from-amber-400/20 via-blue-500/20 to-purple-500/20 rounded-full blur-2xl -z-10 group-hover:blur-3xl transition-all duration-300" />
            </div>

            {/* Word Hunt 3D Typography */}
            <div className="space-y-2 pt-1">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none drop-shadow-lg flex items-center justify-center gap-3 md:gap-4">
                <span className="bg-gradient-to-b from-amber-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(245,158,11,0.35)]">
                  WORD
                </span>
                <span className="bg-gradient-to-b from-blue-500 via-indigo-600 to-blue-700 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(37,99,235,0.35)]">
                  HUNT
                </span>
              </h1>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-amber-300/50 shadow-md backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs md:text-sm font-black tracking-widest text-slate-800 uppercase">
                  Word Search Adventure
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
            </div>

          {/* Current Level & Stars Badge (Green Valley and 10000 levels removed) */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenJourney || (() => onNavigateTab && onNavigateTab('JOURNEY'))}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/95 border border-slate-200 shadow-md text-slate-700 text-xs md:text-sm font-bold cursor-pointer backdrop-blur-md hover:border-blue-300 transition-all"
          >
            <span className="text-blue-600 font-black text-sm">{levelText} {currentLevel}</span>
            {totalStars > 0 && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-amber-500 font-black flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{totalStars} Stars</span>
                </span>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* 2. Main Action: Centered Play Button & Level Indicator */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm md:max-w-lg space-y-4 pb-6 md:pb-8">
        <motion.button
          id="btn-main-play"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={handlePlayClick}
          className="w-full py-5 md:py-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-xl md:text-2xl shadow-2xl shadow-blue-600/35 flex items-center justify-center gap-4 transition-all cursor-pointer border-2 border-blue-300/50 relative overflow-hidden group"
        >
          {/* Animated Continuous Shimmer Beam */}
          <motion.div
            animate={{ x: ['-120%', '240%'] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 0.8
            }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-20 pointer-events-none"
          />
          <Play className="w-8 h-8 fill-white text-white translate-x-0.5 shrink-0 drop-shadow-sm" />
          <span className="drop-shadow-sm">{playText} {levelText.toUpperCase()} {currentLevel}</span>
        </motion.button>

        {/* Keyboard hint for laptop users */}
        <p className="text-xs font-bold text-slate-400 tracking-wide flex items-center gap-2">
          <span>Press</span>
          <kbd className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-600 font-mono text-[10px] shadow-2xs">Enter</kbd>
          <span>or</span>
          <kbd className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-600 font-mono text-[10px] shadow-2xs">Space</kbd>
          <span>to play</span>
        </p>

        {/* Desktop 3-Card Quick Shortcuts Grid */}
        <div className="hidden md:grid grid-cols-3 gap-3.5 w-full pt-4">
          <button
            onClick={() => {
              soundManager.playTap();
              onNavigateTab && onNavigateTab('CHALLENGE');
            }}
            className="p-3.5 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/90 hover:border-blue-400 flex flex-col items-center justify-center gap-1.5 text-slate-800 transition-all cursor-pointer shadow-xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 fill-amber-400 text-amber-500" />
            </div>
            <span className="text-xs font-black">Daily Challenge</span>
            <span className="text-[10px] text-slate-400 font-semibold">Special Expeditions</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              if (onOpenJourney) onOpenJourney();
              else onNavigateTab && onNavigateTab('JOURNEY');
            }}
            className="p-3.5 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/90 hover:border-blue-400 flex flex-col items-center justify-center gap-1.5 text-slate-800 transition-all cursor-pointer shadow-xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-black">World Map</span>
            <span className="text-[10px] text-slate-400 font-semibold">Select Any Level</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              onNavigateTab && onNavigateTab('COLLECTION');
            }}
            className="p-3.5 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/90 hover:border-blue-400 flex flex-col items-center justify-center gap-1.5 text-slate-800 transition-all cursor-pointer shadow-xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-black">Achievements</span>
            <span className="text-[10px] text-slate-400 font-semibold">Trophies & Records</span>
          </button>
        </div>
      </div>

      {/* Optical Spacer */}
      <div className="h-2 md:h-6" />
    </div>
  </div>
  );
};
