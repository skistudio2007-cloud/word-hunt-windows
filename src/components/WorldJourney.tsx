import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, Star, Play, Compass } from 'lucide-react';
import { UserProgress } from '../types';
import { WORLDS } from '../data/worlds';
import { soundManager } from '../services/sound';

interface Props {
  progress: UserProgress;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

export const WorldJourney: React.FC<Props> = ({ progress, onSelectLevel, onBack }) => {
  const currentLevelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smoothly scroll to current level
    if (currentLevelRef.current) {
      setTimeout(() => {
        currentLevelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-slate-900 flex flex-col max-w-5xl mx-auto p-2 md:p-6 select-none"
    >
      {/* Fixed Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-xs rounded-2xl md:rounded-3xl mb-4">
        <motion.button
          id="btn-journey-back"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundManager.playTap();
            onBack();
          }}
          className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>

        <div className="text-center">
          <h2 className="text-sm font-black text-slate-900 flex items-center justify-center gap-1.5 tracking-wider">
            <Compass className="w-4 h-4 text-blue-600" />
            <span>WORLD EXPEDITION</span>
          </h2>
          <div className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{progress.totalStars} Stars Earned</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundManager.playTap();
            currentLevelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
          title="Scroll to current level"
        >
          Level {progress.currentLevel}
        </motion.button>
      </header>

      {/* World Progression List */}
      <div className="flex-1 p-2 md:p-4 space-y-6 overflow-y-auto pb-20">
        {WORLDS.map((world) => {
          const isUnlocked = progress.highestLevelUnlocked >= world.startLevel;
          const isCurrentWorld =
            progress.currentLevel >= world.startLevel && progress.currentLevel <= world.endLevel;

          // Generate level node range for this world
          const levelCount = Math.min(world.endLevel - world.startLevel + 1, 20);
          const levelNumbers = Array.from({ length: levelCount }, (_, i) => world.startLevel + i);

          const completedInThisWorld = levelNumbers.filter(l => !!progress.completedLevels[l]).length;
          const progressPercent = Math.round((completedInThisWorld / levelNumbers.length) * 100);

          return (
            <div
              key={`world-${world.id}`}
              className={`rounded-3xl border transition-all relative overflow-hidden ${
                isUnlocked
                  ? 'bg-white border-slate-200/90 shadow-md hover:shadow-lg'
                  : 'bg-slate-100/60 border-slate-200 opacity-60'
              }`}
            >
              {/* World Header Banner */}
              <div className={`p-5 relative overflow-hidden ${isUnlocked ? 'bg-gradient-to-r ' + world.gradient + ' text-white' : 'bg-slate-200 text-slate-600'}`}>
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-black/20 text-white backdrop-blur-xs">
                        WORLD {world.id}
                      </span>
                      {isCurrentWorld && (
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white text-slate-900 shadow-xs">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black tracking-tight">
                      {world.name}
                    </h3>
                    <p className="text-xs opacity-90 font-medium mt-0.5">
                      {world.subtitle}
                    </p>
                  </div>

                  <div className="text-2xl p-3 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 shadow-xs">
                    {isUnlocked ? world.bgDecorations[0] || '✦' : <Lock className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {/* Progress Bar & Level Range */}
                <div className="mt-4 pt-3 border-t border-white/20 flex flex-col gap-2 relative z-10">
                  <div className="flex items-center justify-between text-[11px] font-bold opacity-90">
                    <span>Levels {world.startLevel} – {world.endLevel}</span>
                    <span>{completedInThisWorld} / {levelNumbers.length} Completed ({progressPercent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Level Nodes Grid */}
              <div className="p-5 bg-white/80 backdrop-blur-xs">
                {!isUnlocked ? (
                  <div className="py-8 text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      <Lock className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-500">
                      Reach Level {world.startLevel} to unlock {world.name}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3">
                    {levelNumbers.map(lvl => {
                      const isCompleted = !!progress.completedLevels[lvl];
                      const stars = progress.completedLevels[lvl]?.stars || 0;
                      const isCurrent = progress.currentLevel === lvl;
                      const isLvlUnlocked = lvl <= progress.highestLevelUnlocked;

                      return (
                        <div
                          key={`node-lvl-${lvl}`}
                          ref={isCurrent ? currentLevelRef : null}
                          className="flex flex-col items-center"
                        >
                          <motion.button
                            id={`btn-journey-lvl-${lvl}`}
                            disabled={!isLvlUnlocked}
                            whileHover={isLvlUnlocked ? { scale: 1.08 } : {}}
                            whileTap={isLvlUnlocked ? { scale: 0.92 } : {}}
                            onClick={() => {
                              soundManager.playTap();
                              onSelectLevel(lvl);
                            }}
                            className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black transition-all relative cursor-pointer shadow-xs ${
                              isCurrent
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 ring-4 ring-blue-400/30 scale-105 animate-pulse'
                                : isCompleted
                                ? 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
                                : isLvlUnlocked
                                ? 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700'
                                : 'bg-slate-100/70 border border-slate-200/50 text-slate-400 cursor-not-allowed shadow-none'
                            }`}
                          >
                            {isCurrent ? (
                              <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                            ) : isCompleted || isLvlUnlocked ? (
                              <span className="text-sm font-black">{lvl}</span>
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </motion.button>

                          {/* Star rating under node */}
                          {isCompleted ? (
                            <div className="flex gap-0.5 mt-1">
                              {[1, 2, 3].map(s => (
                                <Star
                                  key={`lvl-${lvl}-star-${s}`}
                                  className={`w-2.5 h-2.5 ${
                                    s <= stars ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                                  }`}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="h-3.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
