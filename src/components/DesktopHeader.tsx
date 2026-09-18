import React from 'react';
import { Home, Compass, Swords, Settings, Star, Lightbulb, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { NavigationTab, LanguageCode, UserProgress, UserSettings } from '../types';
import { soundManager } from '../services/sound';
import { getTranslation } from '../services/localization';

interface Props {
  activeTab: NavigationTab;
  language?: LanguageCode;
  progress: UserProgress;
  settings: UserSettings;
  isFullscreen: boolean;
  onSelectTab: (tab: NavigationTab) => void;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
}

const TABS: { id: NavigationTab; translationKey: string; defaultLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'HOME', translationKey: 'home', defaultLabel: 'Home', icon: Home },
  { id: 'COLLECTION', translationKey: 'collection', defaultLabel: 'Collection', icon: Compass },
  { id: 'CHALLENGE', translationKey: 'challenge', defaultLabel: 'Challenge', icon: Swords },
  { id: 'SETTINGS', translationKey: 'settings', defaultLabel: 'Settings', icon: Settings },
];

export const DesktopHeader: React.FC<Props> = ({
  activeTab,
  language = 'en',
  progress,
  settings,
  isFullscreen,
  onSelectTab,
  onToggleSound,
  onToggleFullscreen,
}) => {
  const bonusHints = (progress.purchasedHints || 0) + (progress.hintsRevealLetter || 0);

  return (
    <header className="hidden md:flex w-full items-center justify-between px-6 py-3 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-40 shadow-xs select-none">
      {/* 1. Left: Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <img
            src="/app-icon.png"
            alt="Word Hunt Logo"
            className="w-9 h-9 rounded-xl shadow-md border border-slate-200/80 object-cover"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" title="Online and Ready" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-slate-900 tracking-wider leading-none">
              WORD HUNT
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-200/80 uppercase">
              Windows PC
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 leading-tight">
            Word Search Adventure
          </p>
        </div>
      </div>

      {/* 2. Center: Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70 shadow-inner">
        {TABS.map(tab => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;
          const label = getTranslation(language, tab.translationKey) || tab.defaultLabel;

          return (
            <button
              key={`desktop-tab-${tab.id}`}
              onClick={() => {
                if (activeTab !== tab.id) {
                  soundManager.playTap();
                  onSelectTab(tab.id);
                }
              }}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer select-none ${
                isSelected
                  ? 'text-blue-600 shadow-sm bg-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. Right: Stats HUD & Quick Toggles */}
      <div className="flex items-center gap-2.5">
        {/* Stars Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-700 shadow-2xs">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span className="text-xs font-black">{progress.totalStars}</span>
        </div>

        {/* Hints Badge: 1 Free Hint Per Level */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-700 shadow-2xs" title="1 Free Hint available in every level!">
          <Lightbulb className="w-4 h-4 fill-blue-500 text-blue-600" />
          <span className="text-xs font-black">1 Hint / Level{bonusHints > 0 ? ` (+${bonusHints})` : ''}</span>
        </div>

        {/* Level Tag */}
        <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-black shadow-2xs">
          Level {progress.currentLevel}
        </div>

        <div className="h-5 w-px bg-slate-200 mx-1" />

        {/* Sound Toggle Button */}
        <button
          onClick={onToggleSound}
          className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
          title={settings.soundEnabled ? 'Mute Sound [M]' : 'Unmute Sound [M]'}
        >
          {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Fullscreen Toggle Button */}
        <button
          onClick={onToggleFullscreen}
          className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
          title={isFullscreen ? 'Exit Fullscreen [F11]' : 'Enter Fullscreen [F11]'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-blue-600" /> : <Maximize2 className="w-4 h-4 text-slate-700" />}
        </button>
      </div>
    </header>
  );
};
