import React from 'react';
import { motion } from 'motion/react';
import { Check, Info } from 'lucide-react';
import { PlacedWord } from '../types';
import { soundManager } from '../services/sound';

interface Props {
  words: PlacedWord[];
  onSelectWordForInfo: (word: PlacedWord) => void;
  highContrast?: boolean;
  className?: string;
  layoutMode?: 'auto' | 'horizontal' | 'sidebar';
}

export const WordList: React.FC<Props> = ({ 
  words, 
  onSelectWordForInfo, 
  highContrast = false,
  className = '',
  layoutMode = 'auto'
}) => {
  const handleWordClick = (word: PlacedWord) => {
    if (word.found) {
      soundManager.playTap();
      onSelectWordForInfo(word);
    }
  };

  const isSidebar = layoutMode === 'sidebar';

  return (
    <div className={`w-full select-none ${className}`}>
      <div 
        className={
          isSidebar 
            ? "grid grid-cols-2 gap-2" 
            : "flex flex-wrap items-center justify-center gap-2"
        }
      >
        {words.map((w, idx) => {
          return (
            <motion.button
              key={`target-word-${w.id || idx}`}
              id={`target-word-pill-${w.word.toLowerCase()}`}
              onClick={() => handleWordClick(w)}
              initial={{ scale: 0.7, opacity: 0, y: -70 - (idx * 18) }}
              animate={
                w.found
                  ? { scale: [1, 1.25, 0.92, 1.06, 1], opacity: 1, y: 0 }
                  : { scale: 1, opacity: 1, y: 0 }
              }
              transition={
                w.found
                  ? { duration: 0.38, times: [0, 0.3, 0.6, 0.85, 1], ease: 'easeOut' }
                  : { type: 'spring', stiffness: 260, damping: 18, delay: 0.12 + idx * 0.05 }
              }
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`group relative px-3 py-2 sm:px-3.5 rounded-xl text-xs sm:text-sm font-black tracking-wider transition-all duration-200 flex items-center ${
                isSidebar ? 'justify-between w-full' : 'gap-1.5'
              } cursor-pointer shadow-xs ${
                w.found
                  ? 'bg-slate-100/90 text-slate-400 line-through border border-slate-200'
                  : highContrast
                  ? 'bg-white text-slate-900 border-2 border-slate-900 hover:border-blue-600'
                  : 'bg-white/95 text-slate-900 border border-slate-200/90 hover:border-blue-400 hover:shadow-sm backdrop-blur-xs'
              }`}
              title={w.found ? 'Click to view definition' : `${w.word.length} letters`}
            >
              {w.found ? (
                <>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 14, delay: 0.05 }}
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: w.color || '#2563EB' }}
                    />
                    <span className="truncate">{w.word}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 16, delay: 0.08 }}
                      className="flex items-center"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    </motion.div>
                    <Info className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </>
              ) : (
                <div className={`flex items-center ${isSidebar ? 'justify-between w-full' : ''}`}>
                  <span>{w.word}</span>
                  {isSidebar && (
                    <span className="text-[10px] font-bold text-slate-400 tracking-normal ml-2 bg-slate-100 px-1.5 py-0.5 rounded-md">
                      {w.word.length}
                    </span>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
