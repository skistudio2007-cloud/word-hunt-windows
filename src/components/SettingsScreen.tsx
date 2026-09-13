import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Smartphone, 
  Globe, 
  Shield, 
  FileText, 
  Check, 
  Eye,
  Keyboard,
  Info
} from 'lucide-react';
import { LanguageCode, UserProgress, UserSettings } from '../types';
import { soundManager } from '../services/sound';
import { getTranslation } from '../services/localization';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { TermsModal } from './TermsModal';

interface Props {
  settings: UserSettings;
  progress: UserProgress;
  onUpdateSettings: (newSettings: UserSettings) => void;
}

const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'id', label: 'Bahasa', flag: '🇮🇩' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
];

export const SettingsScreen: React.FC<Props> = ({
  settings,
  progress,
  onUpdateSettings
}) => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const lang = settings.language;
  const t = (key: string) => getTranslation(lang, key);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleSound = () => {
    soundManager.playTap();
    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const toggleMusic = () => {
    soundManager.playTap();
    onUpdateSettings({ ...settings, musicEnabled: !settings.musicEnabled });
  };

  const toggleVibration = () => {
    soundManager.playTap();
    onUpdateSettings({ ...settings, vibrationEnabled: !settings.vibrationEnabled });
  };

  const toggleHighContrast = () => {
    soundManager.playTap();
    onUpdateSettings({ ...settings, highContrast: !settings.highContrast });
  };

  return (
    <div className="w-full min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-80px)] bg-slate-50/50 text-slate-900 flex flex-col p-4 md:p-8 pb-24 space-y-6 select-none max-w-5xl mx-auto">
      
      {/* Header Section */}
      <div className="pt-2 px-1 flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-slate-200/60 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2.5">
            <span>⚙️</span>
            <span>{t('settings')}</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium mt-0.5">
            {t('settingsSubtitle')}
          </p>
        </div>

        {/* Current Level & Stars Quick Tag */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            Level {progress.currentLevel}
          </span>
          <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 shadow-2xs">
            ⭐ {progress.totalStars} Stars
          </span>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold text-center shadow-xs">
          ✓ {toastMessage}
        </div>
      )}

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Audio & Accessibility */}
        <div className="space-y-6">
          
          {/* Card 1: Gameplay Audio & Haptics */}
          <div className="p-5 md:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>{t('gameplayAudio')}</span>
            </h3>

            {/* Sound Effects Toggle */}
            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">{t('sound')}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{t('soundDesc')}</div>
                </div>
              </div>
              <button
                onClick={toggleSound}
                className={`w-13 h-7 rounded-full transition-colors relative cursor-pointer ${
                  settings.soundEnabled ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-1 transition-transform ${
                    settings.soundEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Ambient Music Toggle */}
            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">{t('music')}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{t('musicDesc')}</div>
                </div>
              </div>
              <button
                onClick={toggleMusic}
                className={`w-13 h-7 rounded-full transition-colors relative cursor-pointer ${
                  settings.musicEnabled ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-1 transition-transform ${
                    settings.musicEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Vibration / Haptics Toggle */}
            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">{t('vibration')}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{t('vibrationDesc')}</div>
                </div>
              </div>
              <button
                onClick={toggleVibration}
                className={`w-13 h-7 rounded-full transition-colors relative cursor-pointer ${
                  settings.vibrationEnabled ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-1 transition-transform ${
                    settings.vibrationEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Card 2: Display & High Contrast */}
          <div className="p-5 md:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>{t('appearance')}</span>
            </h3>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">{t('highContrast')}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{t('highContrastDesc')}</div>
                </div>
              </div>
              <button
                onClick={toggleHighContrast}
                className={`w-13 h-7 rounded-full transition-colors relative cursor-pointer ${
                  settings.highContrast ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-1 transition-transform ${
                    settings.highContrast ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Card 3: Laptop & Keyboard Guide Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-blue-600" />
              <span>Desktop Keyboard Controls</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-600">Hint (1/lvl)</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-slate-300 font-mono text-slate-700 font-bold shadow-2xs">H</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-600">Pause / Esc</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-slate-300 font-mono text-slate-700 font-bold shadow-2xs">Esc</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-600">Full Screen</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-slate-300 font-mono text-slate-700 font-bold shadow-2xs">F</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-600">Play / Next</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-slate-300 font-mono text-slate-700 font-bold shadow-2xs">Enter</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Language Selection & Legal */}
        <div className="space-y-6">
          
          {/* Card 4: Language Selection Grid */}
          <div className="p-5 md:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>{t('language')}</span>
              </h3>
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase">
                {LANGUAGES.find(l => l.code === settings.language)?.label}
              </span>
            </div>
            
            <p className="text-xs text-slate-400 font-medium">
              {t('languageSubtitle')}
            </p>

            {/* 9 Languages Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {LANGUAGES.map(languageItem => {
                const isSelected = settings.language === languageItem.code;
                return (
                  <button
                    key={`lang-opt-${languageItem.code}`}
                    onClick={() => {
                      soundManager.playTap();
                      onUpdateSettings({ ...settings, language: languageItem.code });
                      showNotification(`Language: ${languageItem.label}`);
                    }}
                    className={`p-3 rounded-2xl border text-xs font-black flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/25'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="text-base">{languageItem.flag}</span>
                      <span className="truncate">{languageItem.label}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-1 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 5: About, Copyright & Policies */}
          <div className="p-5 md:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>{t('about')}</span>
            </h3>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-slate-800">Word Hunt Windows</div>
                <div className="text-[11px] text-slate-400">Desktop & Web Edition v1.2.0</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200">
                100% Free
              </span>
            </div>

            {/* Official Copyright & Ownership Notice */}
            <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-[11px] space-y-1">
              <div className="font-black text-blue-950 flex items-center gap-1.5">
                <span>© 2026 Word Hunt Windows</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-200/70 text-blue-900 font-bold uppercase">All Rights Reserved</span>
              </div>
              <p className="text-blue-900/80 leading-relaxed font-medium">
                Created & Owned by Developer. Proprietary software. Unauthorized copying, reverse engineering, inspection, or redistribution is strictly prohibited by law.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => {
                  soundManager.playTap();
                  setShowPrivacy(true);
                }}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
              >
                <Shield className="w-4 h-4 text-blue-600" />
                <span>{t('privacy')}</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playTap();
                  setShowTerms(true);
                }}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>{t('terms')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

  {/* Modals */}
  {showPrivacy && (
    <PrivacyPolicyModal onClose={() => setShowPrivacy(false)} />
  )}

  {showTerms && (
    <TermsModal onClose={() => setShowTerms(false)} />
  )}
</div>
  );
};
