import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lightbulb, Pause, Star, Maximize2, Minimize2, Volume2, VolumeX, Compass } from 'lucide-react';
import { soundManager } from '../services/sound';
import { LanguageCode } from '../types';
import { getTranslation } from '../services/localization';

interface Props {
  levelNumber: number;
  themeName: string;
  worldName?: string;
  starsCount: number;
  hintsRemaining: number;
  language?: LanguageCode;
  isDaily?: boolean;
  isFullscreen?: boolean;
  soundEnabled?: boolean;
  onBack: () => void;
  onUseHint: () => void;
  onPause?: () => void;
  onToggleFullscreen?: () => void;
  onToggleSound?: () => void;
  onOpenWorldMap?: () => void;
}

export const TopHeader: React.FC<Props> = ({
  levelNumber,
  themeName,
  worldName,
  starsCount,
  hintsRemaining,
  language = 'en',
  isDaily = false,
  isFullscreen = false,
  soundEnabled = true,
  onBack,
  onUseHint,
  onPause,
  onToggleFullscreen,
  onToggleSound,
  onOpenWorldMap
}) => {
  const levelText = getTranslation(language, 'level') || 'LEVEL';
  const hasHint = hintsRemaining > 0;

  return (
    <header className="w-full px-4 md:px-8 py-2.5 flex items-center justify-between text-slate-900 select-none border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-30 shadow-2xs">
      {/* Left Area: Back Button & World Map Quick Access */}
      <div className="flex items-center gap-2">
        <motion.button
          id="btn-header-back"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundManager.playTap();
            onBack();
          }}
          className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 shadow-xs border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer"
          title="Go back (Esc)"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>

        {onOpenWorldMap && !isDaily && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundManager.playTap();
              onOpenWorldMap();
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 shadow-xs border border-slate-200/80 text-xs font-bold transition-all cursor-pointer"
            title="Open World Map"
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>{worldName || 'Map'}</span>
          </motion.button>
        )}
      </div>

      {/* Center Area: Level HUD & Theme Pill */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm uppercase font-black tracking-wider text-slate-900">
            {isDaily ? 'EXPEDITION' : `${levelText.toUpperCase()} ${levelNumber}`}
          </span>
          {!isDaily && (
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full text-amber-600 font-black text-xs shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{starsCount}</span>
            </div>
          )}
        </div>
        <div className="mt-0.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-[10px] md:text-[11px] font-black uppercase tracking-wider shadow-2xs">
          {themeName}
        </div>
      </div>

      {/* Right Area: Controls (Hint, Sound, Fullscreen, Pause) */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Hint button visible on mobile (since mobile has no sidebar) and tablet */}
        <motion.button
          id="btn-header-hint"
          whileHover={hasHint ? { scale: 1.05 } : undefined}
          whileTap={hasHint ? { scale: 0.95 } : undefined}
          onClick={() => {
            soundManager.playTap();
            onUseHint();
          }}
          disabled={!hasHint}
          className={`md:hidden relative px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-sm transition-all ${
            hasHint
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer'
              : 'bg-slate-200 text-slate-400 border border-slate-300/60 cursor-not-allowed shadow-none'
          }`}
          title={hasHint ? 'Use 1 Hint for this level [H]' : 'Hint already used'}
        >
          <Lightbulb className={`w-3.5 h-3.5 ${hasHint ? 'fill-white text-white' : 'text-slate-400'}`} />
          <span>{hasHint ? 'Hint' : 'Used'}</span>
        </motion.button>

        {onToggleSound && (
          <motion.button
            id="btn-header-sound"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSound}
            className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 shadow-xs border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer"
            title={soundEnabled ? 'Mute Sound [M]' : 'Unmute Sound [M]'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </motion.button>
        )}

        {onToggleFullscreen && (
          <motion.button
            id="btn-header-fullscreen"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleFullscreen}
            className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 shadow-xs border border-slate-200/80 hidden sm:flex items-center justify-center transition-all cursor-pointer"
            title={isFullscreen ? 'Exit Full Screen [F]' : 'Enter Full Screen [F]'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-blue-600" /> : <Maximize2 className="w-4 h-4 text-slate-700" />}
          </motion.button>
        )}

        {onPause && (
          <motion.button
            id="btn-header-pause"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundManager.playTap();
              onPause();
            }}
            className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 shadow-xs border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer"
            title="Pause game [Esc]"
          >
            <Pause className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </header>
  );
};
