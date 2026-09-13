import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Compass, Swords, Settings as SettingsIcon, Star, Volume2, VolumeX, Lightbulb, Maximize2, Minimize2 } from 'lucide-react';
import { 
  GameState, 
  NavigationTab, 
  PlacedWord, 
  PuzzleData, 
  UserProgress, 
  UserSettings,
  ChallengeInfo,
  LanguageCode 
} from './types';
import { generatePuzzle, generateDailyPuzzle, generateChallengePuzzle } from './services/puzzleGenerator';
import { StorageService, DEFAULT_PROGRESS, DEFAULT_SETTINGS } from './services/storage';
import { soundManager } from './services/sound';
import { getWorldForLevel } from './data/worlds';

import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { CollectionScreen } from './components/CollectionScreen';
import { ChallengeScreen } from './components/ChallengeScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { GameBackground } from './components/GameBackground';

import { TopHeader } from './components/TopHeader';
import { LetterGrid } from './components/LetterGrid';
import { WordList } from './components/WordList';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { WordDefinitionDrawer } from './components/WordDefinitionDrawer';
import { TutorialOverlay } from './components/TutorialOverlay';
import { WorldJourney } from './components/WorldJourney';
import { RateUsModal } from './components/RateUsModal';

export default function App() {
  // Navigation & Game State
  const [activeTab, setActiveTab] = useState<NavigationTab>('HOME');
  const [gameState, setGameState] = useState<GameState>('MAIN_MENU');
  
  // Persistent Progress & Settings
  const [progress, setProgress] = useState<UserProgress>(StorageService.loadProgress);
  const [settings, setSettings] = useState<UserSettings>(StorageService.loadSettings);

  // Active Puzzle Data
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleData | null>(null);
  const [puzzleWords, setPuzzleWords] = useState<PlacedWord[]>([]);
  const [levelStartTime, setLevelStartTime] = useState<number>(Date.now());
  const [hintsUsedInLevel, setHintsUsedInLevel] = useState<number>(0);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeInfo | null>(null);
  const [isLevelCompleting, setIsLevelCompleting] = useState<boolean>(false);

  // Modals & Drawers
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedWordForInfo, setSelectedWordForInfo] = useState<PlacedWord | null>(null);
  const [hintStartCell, setHintStartCell] = useState<{ row: number; col: number } | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWorldJourneyOpen, setIsWorldJourneyOpen] = useState(false);
  const [showRateUsModal, setShowRateUsModal] = useState(false);

  const toggleFullscreen = () => {
    soundManager.playTap();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initialize Sound Engine with user settings on start
  useEffect(() => {
    soundManager.updateSettings(
      settings.soundEnabled,
      settings.soundVolume,
      settings.musicEnabled,
      settings.musicVolume,
      settings.vibrationEnabled
    );
  }, [settings]);

  // Sync state changes to persistent storage
  useEffect(() => {
    StorageService.saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  // Check first-time onboarding tutorial
  useEffect(() => {
    if (progress.stats.puzzlesSolved === 0 && progress.currentLevel === 1) {
      setShowTutorial(true);
    }
  }, []);

  // Load standard level puzzle
  const startLevel = useCallback((levelNum: number, lang?: LanguageCode) => {
    setIsLevelCompleting(false);
    setHintStartCell(null);
    setHintsUsedInLevel(0);
    setLevelStartTime(Date.now());
    setActiveChallenge(null);

    const puzzle = generatePuzzle(levelNum, undefined, lang || settings.language);
    setCurrentPuzzle(puzzle);
    setPuzzleWords(puzzle.words.map(w => ({ ...w, found: false })));
    setGameState('PLAYING');
  }, [settings.language]);

  // Load special expedition challenge puzzle
  const startChallenge = useCallback((challenge: ChallengeInfo, lang?: LanguageCode) => {
    setIsLevelCompleting(false);
    setHintStartCell(null);
    setHintsUsedInLevel(0);
    setLevelStartTime(Date.now());
    setActiveChallenge(challenge);

    const puzzle = generateChallengePuzzle(challenge, lang || settings.language);
    setCurrentPuzzle(puzzle);
    setPuzzleWords(puzzle.words.map(w => ({ ...w, found: false })));
    setGameState('CHALLENGE_PLAYING');
  }, [settings.language]);

  // Handle discovered word
  const handleWordFound = useCallback((foundWord: PlacedWord) => {
    setPuzzleWords(prevWords => {
      const nextWords = prevWords.map(w => {
        if (w.word.toUpperCase() === foundWord.word.toUpperCase() && !w.found) {
          return { ...w, found: true };
        }
        return w;
      });

      // Update statistics
      setProgress(p => ({
        ...p,
        xp: p.xp + 25,
        stats: {
          ...p.stats,
          wordsFound: p.stats.wordsFound + 1
        }
      }));

      // Check if all words completed in this puzzle
      const allFound = nextWords.every(w => w.found);
      if (allFound) {
        // Step 1: Lock user input and trigger board victory bounce
        setIsLevelCompleting(true);

        // Step 2: Play victory fanfare and transition to clean win screen
        setTimeout(() => {
          soundManager.playLevelVictory();
          setGameState('LEVEL_COMPLETE');

          const solveTimeSecs = Math.max(5, Math.round((Date.now() - levelStartTime) / 1000));
          // Star calculation: 3 stars = <=1 hint, 2 stars = <=2 hints, 1 star = 3+ hints
          let stars = 3;
          if (hintsUsedInLevel >= 3) stars = 1;
          else if (hintsUsedInLevel >= 1) stars = 2;

          setProgress(prev => {
            const completedLvl = currentPuzzle?.levelNumber || 1;
            const isExpedition = !!activeChallenge;
            const nextLvl = Math.max(prev.highestLevelUnlocked, completedLvl + 1);

            const newCompletedLevels = { ...prev.completedLevels };
            if (!isExpedition) {
              newCompletedLevels[completedLvl] = {
                stars: Math.max(prev.completedLevels[completedLvl]?.stars || 0, stars),
                timeSeconds: solveTimeSecs,
                date: new Date().toISOString()
              };
            }

            const totalStarsCount = Object.values(newCompletedLevels).reduce(
              (acc: number, curr: any) => acc + (curr?.stars || 0),
              0
            );

            // Daily puzzle streak handling
            const todayKey = new Date().toISOString().split('T')[0];
            let newStreak = prev.stats.currentStreak;
            const newDailyHistory = { ...prev.dailyHistory };

            if (!newDailyHistory[todayKey]?.completed) {
              newDailyHistory[todayKey] = { completed: true, stars };
              newStreak = prev.stats.currentStreak + 1;
            }

            const updatedCompletedChallenges = [...prev.completedChallenges];
            if (activeChallenge && !updatedCompletedChallenges.includes(activeChallenge.id)) {
              updatedCompletedChallenges.push(activeChallenge.id);
            }

            const bestFastest = prev.stats.fastestSolveSeconds === 0 
              ? solveTimeSecs 
              : Math.min(prev.stats.fastestSolveSeconds, solveTimeSecs);

            return {
              ...prev,
              currentLevel: isExpedition ? prev.currentLevel : completedLvl + 1,
              highestLevelUnlocked: isExpedition ? prev.highestLevelUnlocked : nextLvl,
              completedLevels: newCompletedLevels,
              completedChallenges: updatedCompletedChallenges,
              totalStars: totalStarsCount,
              xp: prev.xp + 100,
              hintsRevealLetter: prev.hintsRevealLetter + (activeChallenge ? activeChallenge.rewardHints : 0),
              stats: {
                ...prev.stats,
                puzzlesSolved: prev.stats.puzzlesSolved + 1,
                currentStreak: newStreak,
                bestStreak: Math.max(prev.stats.bestStreak, newStreak),
                perfectLevels: prev.stats.perfectLevels + (stars === 3 ? 1 : 0),
                fastestSolveSeconds: bestFastest,
                challengeWins: prev.stats.challengeWins + (isExpedition ? 1 : 0)
              },
              dailyHistory: newDailyHistory
            };
          });
        }, 650);
      }

      return nextWords;
    });
  }, [currentPuzzle, activeChallenge, levelStartTime, hintsUsedInLevel]);

  // Helper: Highlight the starting letter of the first unfound word
  const applyLetterHintHighlight = useCallback(() => {
    const unfoundWords = puzzleWords.filter(w => !w.found);
    if (unfoundWords.length === 0) return false;

    const targetWord = unfoundWords[0];
    setHintStartCell(targetWord.start);
    soundManager.playHintSparkle();
    setHintsUsedInLevel(h => h + 1);
    setTimeout(() => setHintStartCell(null), 5000);
    return true;
  }, [puzzleWords]);

  // Main direct Hint Button handler (Exactly 1 Hint per level)
  const handleMainHintTap = useCallback(() => {
    const unfoundWords = puzzleWords.filter(w => !w.found);
    if (unfoundWords.length === 0) return;

    if (hintsUsedInLevel >= 1) {
      soundManager.playWordFail();
      showToast('Only 1 hint allowed per level!');
      return;
    }

    setProgress(p => ({
      ...p,
      stats: { ...p.stats, hintsUsed: p.stats.hintsUsed + 1 }
    }));
    applyLetterHintHighlight();
    showToast('Hint Revealed! (1/1 used)');
  }, [puzzleWords, hintsUsedInLevel, applyLetterHintHighlight]);

  const handleRateUsSubmit = useCallback((stars: number) => {
    setProgress(p => ({
      ...p,
      hasRated: true,
      hintsRevealLetter: p.hintsRevealLetter + 1,
    }));
    setShowRateUsModal(false);
    showToast(`Thank you for rating ${stars} stars! +1 Free Hint unlocked!`);
    try {
      window.open('ms-windows-store://review/?ProductId=9WZDNCRFJBMP', '_blank');
    } catch {}
    startLevel(progress.currentLevel);
  }, [progress.currentLevel, startLevel]);

  const handleNextLevel = useCallback(() => {
    // Check if Level 10 was just completed and user hasn't been prompted to rate yet
    if (currentPuzzle?.levelNumber === 10 && !progress.hasRated) {
      setShowRateUsModal(true);
      return;
    }

    if (activeChallenge) {
      setGameState('MAIN_MENU');
      setActiveTab('CHALLENGE');
    } else {
      startLevel(progress.currentLevel);
    }
  }, [activeChallenge, progress.currentLevel, progress.hasRated, currentPuzzle, startLevel]);

  // Global Keyboard Shortcuts (Laptop / Desktop Gamepad Experience)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when user interacts with form inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // 1. Fullscreen Toggle [F]
      if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      // 2. Sound Quick-Mute Toggle [M]
      if (e.code === 'KeyM') {
        e.preventDefault();
        setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }));
        soundManager.playTap();
        return;
      }

      // 3. Pause / Back Navigation [Escape]
      if (e.code === 'Escape') {
        e.preventDefault();
        if (selectedWordForInfo) {
          setSelectedWordForInfo(null);
          return;
        }
        if (isWorldJourneyOpen) {
          setIsWorldJourneyOpen(false);
          return;
        }
        if (gameState === 'PLAYING' || gameState === 'CHALLENGE_PLAYING') {
          soundManager.playTap();
          setGameState('PAUSED');
          return;
        }
        if (gameState === 'PAUSED') {
          soundManager.playTap();
          setGameState(activeChallenge ? 'CHALLENGE_PLAYING' : 'PLAYING');
          return;
        }
      }

      // 4. In-Game Hint [H]
      if (e.code === 'KeyH') {
        if (gameState === 'PLAYING' || gameState === 'CHALLENGE_PLAYING') {
          e.preventDefault();
          handleMainHintTap();
          return;
        }
      }

      // 5. Play / Next / Resume [Enter] or [Space]
      if (e.code === 'Enter' || e.code === 'Space') {
        if (gameState === 'LEVEL_COMPLETE') {
          e.preventDefault();
          soundManager.playTap();
          handleNextLevel();
          return;
        }
        if (gameState === 'PAUSED') {
          e.preventDefault();
          soundManager.playTap();
          setGameState(activeChallenge ? 'CHALLENGE_PLAYING' : 'PLAYING');
          return;
        }
        if (gameState === 'MAIN_MENU' && activeTab === 'HOME' && !isWorldJourneyOpen && !showTutorial) {
          e.preventDefault();
          soundManager.playTap();
          startLevel(progress.currentLevel);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameState,
    activeTab,
    isWorldJourneyOpen,
    showTutorial,
    selectedWordForInfo,
    activeChallenge,
    progress.currentLevel,
    handleMainHintTap,
    handleNextLevel,
    startLevel
  ]);

  const handleClaimAchievement = (achId: string, rewardHints: number) => {
    setProgress(p => ({
      ...p,
      claimedAchievements: [...p.claimedAchievements, achId],
      hintsRevealLetter: p.hintsRevealLetter + rewardHints,
      hintsRevealWord: p.hintsRevealWord + 1,
      xp: p.xp + 150
    }));
  };

  // Exactly 1 Hint per level rule:
  const hintsRemaining = Math.max(0, 1 - hintsUsedInLevel);
  const foundWordsCount = puzzleWords.filter(w => w.found).length;

  const currentWorld = getWorldForLevel(currentPuzzle?.levelNumber || progress.currentLevel);

  return (
    <div className="w-full min-h-screen h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/40 text-slate-900 flex flex-col items-center justify-start overflow-hidden font-sans select-none relative">
      {/* 🎮 GLOBAL FULL-SCREEN ANIMATED GAME BACKGROUND */}
      <GameBackground mode={gameState === 'PLAYING' || gameState === 'CHALLENGE_PLAYING' ? 'gameplay' : 'home'} />

      <div className="w-full h-full min-h-screen max-w-none bg-transparent flex flex-col relative overflow-hidden z-10">
        
        {/* Toast Feedback Notification Banner */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-3 z-50 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-slate-900/90 text-white text-xs font-bold shadow-xl backdrop-blur-xs flex items-center gap-2 pointer-events-none border border-slate-700/50"
            >
              <span>✨</span>
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Main Navigation Screens (When Game State is MAIN_MENU) */}
        {gameState === 'MAIN_MENU' && (
          <div className="w-full flex-1 flex flex-col overflow-y-auto">
            {/* Desktop Top Navigation Bar (Visible on laptop/desktop screens) */}
            <header className="hidden md:flex items-center justify-between px-8 py-3.5 border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/25 border border-blue-400/40">
                  WH
                </div>
                <div>
                  <span className="font-black text-base lg:text-lg text-slate-900 tracking-wider">WORD HUNT</span>
                  <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest -mt-0.5">Windows Edition</span>
                </div>
              </div>

              {/* Center Tab Navigation Pills */}
              <div className="flex items-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/60">
                {[
                  { id: 'HOME', label: 'Home', icon: Home },
                  { id: 'COLLECTION', label: 'Collection', icon: Compass },
                  { id: 'CHALLENGE', label: 'Challenge', icon: Swords },
                  { id: 'SETTINGS', label: 'Settings', icon: SettingsIcon }
                ].map(tab => {
                  const isSelected = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={`desktop-tab-${tab.id}`}
                      onClick={() => {
                        soundManager.playTap();
                        setActiveTab(tab.id as NavigationTab);
                      }}
                      className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Side Stats, Fullscreen & Sound Quick-Toggle */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    soundManager.playTap();
                    setIsWorldJourneyOpen(true);
                  }}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer border border-slate-200/60"
                  title="Open World Map & Level Selector"
                >
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>World Map</span>
                </button>

                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black shadow-2xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{progress.totalStars}</span>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                  title={isFullscreen ? 'Exit Full Screen [F]' : 'Full Screen [F]'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4 text-blue-600" /> : <Maximize2 className="w-4 h-4 text-slate-700" />}
                </button>

                <button
                  onClick={() => {
                    soundManager.playTap();
                    setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }));
                  }}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                  title={settings.soundEnabled ? 'Mute Sound [M]' : 'Enable Sound [M]'}
                >
                  {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
            </header>

            <AnimatePresence mode="wait">
              {/* Tab 1: HOME */}
              {activeTab === 'HOME' && (
                <motion.div
                  key="tab-home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col"
                >
                  <HomeScreen
                    currentLevel={progress.currentLevel}
                    totalStars={progress.totalStars}
                    language={settings.language}
                    onPlay={() => startLevel(progress.currentLevel)}
                    onNavigateTab={tab => {
                      if (tab === 'JOURNEY') {
                        setIsWorldJourneyOpen(true);
                      } else {
                        setActiveTab(tab);
                      }
                    }}
                    onOpenJourney={() => setIsWorldJourneyOpen(true)}
                  />
                </motion.div>
              )}

              {/* Tab 2: COLLECTION */}
              {activeTab === 'COLLECTION' && (
                <motion.div
                  key="tab-collection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col"
                >
                  <CollectionScreen
                    progress={progress}
                    language={settings.language}
                    onClaimAchievement={handleClaimAchievement}
                  />
                </motion.div>
              )}

              {/* Tab 3: CHALLENGE */}
              {activeTab === 'CHALLENGE' && (
                <motion.div
                  key="tab-challenge"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col"
                >
                  <ChallengeScreen
                    progress={progress}
                    language={settings.language}
                    onPlayChallenge={challenge => startChallenge(challenge)}
                  />
                </motion.div>
              )}

              {/* Tab 4: SETTINGS */}
              {activeTab === 'SETTINGS' && (
                <motion.div
                  key="tab-settings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col"
                >
                  <SettingsScreen
                    settings={settings}
                    progress={progress}
                    onUpdateSettings={s => {
                      const languageChanged = s.language !== settings.language;
                      setSettings(s);
                      if (languageChanged && currentPuzzle) {
                        if (activeChallenge) {
                          startChallenge(activeChallenge, s.language);
                        } else {
                          startLevel(currentPuzzle.levelNumber, s.language);
                        }
                      }
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Persistent 4-Tab Bottom Navigation Bar (Mobile only) */}
            <BottomNav
              activeTab={activeTab}
              language={settings.language}
              onSelectTab={tab => setActiveTab(tab)}
            />
          </div>
        )}

        {/* 2. Active Level / Challenge Gameplay Screen */}
        {(gameState === 'PLAYING' || gameState === 'CHALLENGE_PLAYING') && currentPuzzle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-screen min-h-screen flex flex-col justify-between relative overflow-hidden bg-transparent"
          >
            {/* Subtle Floating World Ambient Particles (Atmospheric video game polish) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              {currentWorld.bgDecorations.map((deco, idx) => (
                <motion.div
                  key={`bg-deco-${idx}`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.15, 0.4, 0.15],
                    y: [0, -18, 0],
                    rotate: [0, idx % 2 === 0 ? 12 : -12, 0]
                  }}
                  transition={{
                    duration: 5 + idx,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: idx * 0.4
                  }}
                  className="absolute select-none text-2xl lg:text-3xl filter blur-[0.4px]"
                  style={{
                    top: `${10 + idx * 17}%`,
                    left: idx % 2 === 0 ? `${3 + idx * 2.5}%` : undefined,
                    right: idx % 2 !== 0 ? `${3 + idx * 2.5}%` : undefined
                  }}
                >
                  {deco}
                </motion.div>
              ))}
            </div>

            {/* Top Header with direct Hint button, Sound toggle, and Fullscreen toggle */}
            <TopHeader
              levelNumber={currentPuzzle.levelNumber}
              themeName={activeChallenge ? activeChallenge.title : currentPuzzle.theme}
              worldName={currentWorld.name}
              starsCount={progress.totalStars}
              hintsRemaining={hintsRemaining}
              language={settings.language}
              isDaily={!!activeChallenge}
              isFullscreen={isFullscreen}
              soundEnabled={settings.soundEnabled}
              onBack={() => setGameState('MAIN_MENU')}
              onUseHint={handleMainHintTap}
              onPause={() => setGameState('PAUSED')}
              onToggleFullscreen={toggleFullscreen}
              onToggleSound={() => {
                soundManager.playTap();
                setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }));
              }}
              onOpenWorldMap={() => setIsWorldJourneyOpen(true)}
            />

            {/* Mobile Viewport Gameplay Layout (< md screens) */}
            <div className="flex md:hidden flex-col justify-between flex-1 my-auto p-2 pb-6 z-10">
              <main className="my-auto">
                <LetterGrid
                  key={`grid-m-${currentPuzzle.levelNumber}-${activeChallenge?.id || 'std'}`}
                  grid={currentPuzzle.grid}
                  words={puzzleWords}
                  onWordFound={handleWordFound}
                  hintStartCell={hintStartCell}
                  highContrast={settings.highContrast}
                  isCompleting={isLevelCompleting}
                />

                {/* Target Words List */}
                <WordList
                  key={`words-m-${currentPuzzle.levelNumber}-${activeChallenge?.id || 'std'}`}
                  words={puzzleWords}
                  onSelectWordForInfo={w => setSelectedWordForInfo(w)}
                  highContrast={settings.highContrast}
                />
              </main>

              {/* Bottom Educational Hint Tip */}
              <footer className="text-center pt-2">
                <p className="text-[11px] font-bold text-slate-500">
                  💡 Swipe letters to find words
                </p>
              </footer>
            </div>

            {/* Laptop / Desktop Full Screen Gameplay Layout (Side-by-Side: Grid + Dashboard) */}
            <div className="hidden md:flex flex-1 items-center justify-center gap-8 lg:gap-14 px-6 lg:px-12 py-3 overflow-hidden h-[calc(100vh-68px)] z-10">
              {/* Left Column: Letter Grid Board */}
              <div className="flex-1 flex items-center justify-center max-w-2xl h-full py-2">
                <LetterGrid
                  key={`grid-d-${currentPuzzle.levelNumber}-${activeChallenge?.id || 'std'}`}
                  grid={currentPuzzle.grid}
                  words={puzzleWords}
                  onWordFound={handleWordFound}
                  hintStartCell={hintStartCell}
                  highContrast={settings.highContrast}
                  isCompleting={isLevelCompleting}
                />
              </div>

              {/* Right Column: Executive Gameplay Sidebar Panel */}
              <div className="w-[360px] lg:w-[420px] shrink-0 h-full max-h-[calc(100vh-88px)] flex flex-col justify-between space-y-3.5 py-1">
                {/* Target Words Card */}
                <div className="p-5 lg:p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-xl flex-1 flex flex-col min-h-0 space-y-3.5">
                  <div className="flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Target Words
                      </span>
                    </div>
                    <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shadow-2xs">
                      {foundWordsCount} / {puzzleWords.length} Found
                    </span>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="space-y-1 shrink-0">
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 transition-all duration-400 rounded-full shadow-xs"
                        style={{ width: `${(foundWordsCount / Math.max(1, puzzleWords.length)) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 px-0.5">
                      <span>Progress</span>
                      <span>{Math.round((foundWordsCount / Math.max(1, puzzleWords.length)) * 100)}%</span>
                    </div>
                  </div>

                  {/* Word List rendered in sidebar card with full internal scroll */}
                  <div className="flex-1 overflow-y-auto pr-1 min-h-0">
                    <WordList
                      key={`words-d-${currentPuzzle.levelNumber}-${activeChallenge?.id || 'std'}`}
                      words={puzzleWords}
                      onSelectWordForInfo={w => setSelectedWordForInfo(w)}
                      highContrast={settings.highContrast}
                      layoutMode="sidebar"
                    />
                  </div>
                </div>

                {/* Dedicated Hint & Action Control Box */}
                <div className="p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-md flex flex-col gap-2.5 shrink-0">
                  <button
                    onClick={() => {
                      soundManager.playTap();
                      handleMainHintTap();
                    }}
                    disabled={hintsRemaining <= 0}
                    className={`w-full py-3 px-4 rounded-2xl text-xs font-black border transition-all flex items-center justify-between shadow-sm cursor-pointer ${
                      hintsRemaining > 0
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-blue-500/25 active:scale-[0.98]'
                        : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Lightbulb className={`w-4 h-4 ${hintsRemaining > 0 ? 'fill-white text-white' : 'text-slate-400'}`} />
                      <span>{hintsRemaining > 0 ? 'Reveal Word Hint (1 Available)' : 'Hint Used (1/1 Per Level)'}</span>
                    </div>
                    {hintsRemaining > 0 ? (
                      <kbd className="text-[10px] font-mono bg-white/20 text-white px-2 py-0.5 rounded-lg">H</kbd>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">Locked</span>
                    )}
                  </button>

                  {/* Helper Guide & Shortcut Keys */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                    <span className="flex items-center gap-1.5 text-xs">
                      <span>🖱️</span>
                      <span>Drag to connect</span>
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono">Esc</kbd>
                        <span>Pause</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono">F</kbd>
                        <span>Full</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. Pause Screen Overlay */}
        {gameState === 'PAUSED' && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm bg-white border border-slate-100 rounded-3xl p-6 text-center space-y-4 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-slate-900">GAME PAUSED</h2>
              <p className="text-xs text-slate-400">Take your time. Word Hunt saves your progress!</p>
              <div className="space-y-2 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    soundManager.playTap();
                    setGameState(activeChallenge ? 'CHALLENGE_PLAYING' : 'PLAYING');
                  }}
                  className="w-full py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md shadow-blue-500/20 transition-colors cursor-pointer"
                >
                  RESUME PLAYING (Space)
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    soundManager.playTap();
                    setGameState('MAIN_MENU');
                  }}
                  className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Quit to Menu
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 4. Simple Clean Level Complete Win Modal */}
        {gameState === 'LEVEL_COMPLETE' && currentPuzzle && (
          <LevelCompleteModal
            starsAwarded={hintsUsedInLevel === 0 ? 3 : 2}
            language={settings.language}
            onNextLevel={handleNextLevel}
          />
        )}

        {/* 5. Rate Us Modal (Prompts upon completing Level 10) */}
        <RateUsModal
          isOpen={showRateUsModal}
          onClose={() => {
            setShowRateUsModal(false);
            startLevel(progress.currentLevel);
          }}
          onRate={handleRateUsSubmit}
        />

        {/* 7. Word Learning Drawer */}
        <WordDefinitionDrawer
          word={selectedWordForInfo}
          onClose={() => setSelectedWordForInfo(null)}
        />

        {/* 8. Onboarding Tutorial Guide */}
        {showTutorial && (
          <TutorialOverlay
            onComplete={() => {
              setShowTutorial(false);
              startLevel(1);
            }}
          />
        )}

        {/* 9. World Journey Expeditions Level Browser Modal */}
        {isWorldJourneyOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto">
            <WorldJourney
              progress={progress}
              onSelectLevel={lvl => {
                setIsWorldJourneyOpen(false);
                startLevel(lvl);
              }}
              onBack={() => setIsWorldJourneyOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
