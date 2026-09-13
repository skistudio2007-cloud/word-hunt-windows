import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Star, Heart, X, Sparkles } from 'lucide-react';
import { soundManager } from '../services/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRate: (stars: number) => void;
}

export const RateUsModal: React.FC<Props> = ({ isOpen, onClose, onRate }) => {
  const [selectedStars, setSelectedStars] = useState(5);
  const [hoveredStars, setHoveredStars] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentStarCount = hoveredStars !== null ? hoveredStars : selectedStars;

  const handleStarClick = (num: number) => {
    soundManager.playTap();
    setSelectedStars(num);
  };

  const handleRateSubmit = () => {
    soundManager.playLevelVictory();
    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { x: 0.5, y: 0.55 },
        colors: ['#F59E0B', '#FBBF24', '#2563EB', '#10B981']
      });
    } catch {}

    onRate(selectedStars);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          className="relative w-full max-w-md rounded-3xl bg-white border border-slate-100 p-6 md:p-8 text-center shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Ambient Glow */}
          <div className="absolute -top-12 inset-x-0 h-32 bg-gradient-to-b from-amber-400/25 to-transparent blur-2xl pointer-events-none" />

          {/* Badge Icon */}
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 p-1 shadow-xl shadow-amber-500/25 border-2 border-white flex items-center justify-center mb-4">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white">
              <Heart className="w-10 h-10 fill-rose-500 text-rose-500 animate-pulse" />
            </div>
            <div className="absolute -top-1.5 -right-1.5 text-amber-400 text-base animate-bounce">
              ✨
            </div>
          </div>

          {/* Title & Milestone Text */}
          <div className="space-y-1.5 mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Level 10 Mastered!</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Enjoying Word Hunt?
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
              You've conquered 10 puzzle worlds! Please rate us on the Microsoft Store to support our creator.
            </p>
          </div>

          {/* 5 Interactive Golden Rating Stars */}
          <div className="flex items-center justify-center gap-2.5 py-3 mb-6 bg-slate-50 rounded-2xl border border-slate-100">
            {[1, 2, 3, 4, 5].map(starNum => {
              const isFilled = starNum <= currentStarCount;
              return (
                <button
                  key={`rate-star-${starNum}`}
                  onClick={() => handleStarClick(starNum)}
                  onMouseEnter={() => setHoveredStars(starNum)}
                  onMouseLeave={() => setHoveredStars(null)}
                  className="p-1 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                  title={`Rate ${starNum} Stars`}
                >
                  <Star
                    className={`w-9 h-9 md:w-10 md:h-10 transition-colors ${
                      isFilled
                        ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                        : 'fill-slate-200 text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleRateSubmit}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-amber-300/40"
            >
              <Star className="w-5 h-5 fill-white text-white" />
              <span>Rate {selectedStars} Stars on Store</span>
            </motion.button>

            <button
              onClick={() => {
                soundManager.playTap();
                onClose();
              }}
              className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
