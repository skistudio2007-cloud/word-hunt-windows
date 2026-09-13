import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import { ChallengeInfo, LanguageCode, UserProgress } from '../types';
import { EXPEDITION_CHALLENGES, getActiveChallenge } from '../data/challenges';
import { soundManager } from '../services/sound';
import { getTranslation } from '../services/localization';

interface Props {
  progress: UserProgress;
  language?: LanguageCode;
  onPlayChallenge: (challenge: ChallengeInfo) => void;
}

export const ChallengeScreen: React.FC<Props> = ({ progress, language = 'en', onPlayChallenge }) => {
  const activeChallenge = getActiveChallenge();
  const isCompleted = progress.completedChallenges.includes(activeChallenge.id);

  const t = (key: string) => getTranslation(language, key);

  const handleStart = (challenge: ChallengeInfo) => {
    soundManager.playTap();
    onPlayChallenge(challenge);
  };

  return (
    <div className="w-full min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-80px)] bg-white text-slate-900 flex flex-col p-4 md:p-8 pb-24 space-y-6 select-none max-w-5xl mx-auto">
      {/* Title */}
      <div className="pt-2 px-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">
          {t('challenges')}
        </h1>
        <p className="text-xs md:text-sm text-slate-400 font-medium mt-0.5">
          {t('challengeSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Hero Challenge Card (Left on Desktop) */}
        <div className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-slate-50 border border-slate-100/90 shadow-sm relative overflow-hidden space-y-5">
          {/* Badge & Expiration */}
          <div className="flex items-center justify-between">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('currentChallenge')}</span>
            </span>

            <span className="text-xs font-semibold text-slate-400">
              {activeChallenge.expiresIn || 'Active'}
            </span>
          </div>

          {/* Illustration & Title */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-3xl md:text-4xl shrink-0">
              {activeChallenge.icon}
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                {activeChallenge.title}
              </h2>
              <p className="text-xs md:text-sm font-medium text-slate-500 mt-1 leading-relaxed">
                {activeChallenge.subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs md:text-sm text-slate-600 bg-white p-4 rounded-2xl border border-slate-100 leading-relaxed font-medium">
            {activeChallenge.description}
          </p>

          {/* Specifications grid */}
          <div className="grid grid-cols-3 gap-2.5 text-center pt-1">
            <div className="p-3 rounded-2xl bg-white border border-slate-100">
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase block">{t('gridSize')}</span>
              <span className="text-sm md:text-base font-black text-slate-800">
                {activeChallenge.gridSize}x{activeChallenge.gridSize}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-100">
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase block">{t('difficulty')}</span>
              <span className="text-sm md:text-base font-black text-blue-600 capitalize">
                {activeChallenge.difficulty}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-100">
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase block">{t('reward')}</span>
              <span className="text-sm md:text-base font-black text-amber-600">
                +{activeChallenge.rewardHints} {t('hints')}
              </span>
            </div>
          </div>

          {/* Play Challenge Button */}
          <motion.button
            id="btn-play-challenge"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleStart(activeChallenge)}
            className={`w-full py-4 md:py-5 rounded-full font-black text-base md:text-lg flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer ${
              isCompleted
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{t('challengeCompleted')}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                <span>{t('playChallenge')}</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Other Special Expeditions Section (Right on Desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-blue-600" />
            <span>More Expeditions</span>
          </h3>

          <div className="space-y-3">
            {EXPEDITION_CHALLENGES.filter(c => c.id !== activeChallenge.id).map(challenge => {
              const isDone = progress.completedChallenges.includes(challenge.id);

              return (
                <div
                  key={`expedition-${challenge.id}`}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-2xl shadow-xs shrink-0">
                      {challenge.icon}
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
                        {challenge.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {challenge.gridSize}x{challenge.gridSize} • {challenge.difficulty}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleStart(challenge)}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-blue-600 border border-blue-200 text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    {isDone ? t('challengeCompleted') : t('play')}
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
