import React from 'react';
import { Character } from '../types';

interface HeaderProps {
  activeView: string;
  onNavigate: (view: string) => void;
  activeCharacter: Character;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onOpenBreathingModal: () => void;
  forceDemo: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  activeCharacter,
  isAudioPlaying,
  onToggleAudio,
  onOpenBreathingModal,
  forceDemo,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(33,23,47,0.03)] border-b border-surface-container-high/40">
      {/* Sanctuary Bar */}
      <div className="bg-surface-container-low px-margin py-1.5 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container text-[12px] font-bold">
            ★
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
            Fan-made comfort sanctuary • Featuring Shinnosuke &amp; Kasukabe friends
          </span>
        </div>
        <div className="flex items-center gap-space-md">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>{forceDemo ? 'Demo Engine Active' : 'Gemini AI Connected'}</span>
          </span>
          <span className="text-outline-variant">•</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Companion: {activeCharacter.name.split(' ')[0]} {activeCharacter.emoji}
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-20 max-w-[1200px] mx-auto px-margin flex items-center justify-between gap-space-md">
        {/* Logo */}
        <div className="flex items-center gap-space-md">
          <button
            onClick={() => onNavigate('welcome-home')}
            className="flex items-center gap-space-sm group cursor-pointer text-left bg-transparent border-0 p-0"
          >
            <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center shadow-[0_4px_12px_rgba(255,133,162,0.35)] transition-transform duration-200 group-hover:scale-105">
              <span className="material-symbols-outlined text-on-primary-container text-[24px]">
                sentiment_satisfied
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-title-md text-title-md text-primary font-bold tracking-tight">
                  Shinchan
                </span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  Comfort Corner
                </span>
                <span className="inline-block px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                  Chocobi ★
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline-block">
                Warm hugs &amp; playful calm
              </span>
            </div>
          </button>
        </div>

        {/* Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 bg-surface-container-low p-1.5 rounded-full">
          <button
            onClick={() => onNavigate('welcome-home')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all ${
              activeView === 'welcome-home'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Welcome
          </button>
          <button
            onClick={() => onNavigate('choose-character')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all ${
              activeView === 'choose-character'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Choose Friend
          </button>
          <button
            onClick={() => onNavigate('feelings-check-in')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all ${
              activeView === 'feelings-check-in'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Feelings Check-in
          </button>
          <button
            onClick={() => onNavigate('character-chat')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all relative ${
              activeView === 'character-chat'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span>Character Chat</span>
            <span className="w-2 h-2 rounded-full bg-primary absolute top-1 right-1.5 animate-ping" />
          </button>
          <button
            onClick={() => onNavigate('fun-zone')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all ${
              activeView === 'fun-zone'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Fun Zone
          </button>
          <button
            onClick={() => onNavigate('safety-about')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all ${
              activeView === 'safety-about'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Safety &amp; About
          </button>
        </nav>

        {/* Action Utilities */}
        <div className="flex items-center gap-space-sm">
          <button
            onClick={onToggleAudio}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors font-label-md text-label-md ${
              isAudioPlaying
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
            title="Toggle gentle lo-fi soundscapes"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isAudioPlaying ? 'volume_up' : 'music_note'}
            </span>
            <span className="hidden md:inline font-label-sm text-label-sm">
              {isAudioPlaying ? 'Playing Vibe 🎶' : 'Calm Vibes'}
            </span>
          </button>
          <button
            onClick={onOpenBreathingModal}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md shadow-[0_2px_8px_rgba(255,209,103,0.3)] hover:opacity-95 transition-all"
            title="Take a slow breath and reset"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">spa</span>
            <span className="hidden sm:inline font-label-sm text-label-sm">Mood Reset</span>
          </button>
          {/* Active Companion Avatar Pill */}
          <button
            onClick={() => onNavigate('choose-character')}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm hover:scale-105 transition-transform"
            title="Switch Companion"
            type="button"
          >
            <span className="text-[17px]">{activeCharacter.emoji}</span>
          </button>
        </div>
      </div>

      {/* Mobile Quick Navigation Bar */}
      <div className="lg:hidden flex items-center justify-between px-3 py-2 bg-surface-container-lowest border-t border-surface-container overflow-x-auto gap-2">
        <button
          onClick={() => onNavigate('welcome-home')}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
            activeView === 'welcome-home'
              ? 'bg-primary-container text-on-primary-container'
              : 'text-on-surface-variant'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onNavigate('choose-character')}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
            activeView === 'choose-character'
              ? 'bg-primary-container text-on-primary-container'
              : 'text-on-surface-variant'
          }`}
        >
          Friends
        </button>
        <button
          onClick={() => onNavigate('feelings-check-in')}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
            activeView === 'feelings-check-in'
              ? 'bg-primary-container text-on-primary-container'
              : 'text-on-surface-variant'
          }`}
        >
          Feelings
        </button>
        <button
          onClick={() => onNavigate('character-chat')}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
            activeView === 'character-chat'
              ? 'bg-primary-container text-on-primary-container'
              : 'text-on-surface-variant'
          }`}
        >
          Chat 💬
        </button>
        <button
          onClick={() => onNavigate('fun-zone')}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
            activeView === 'fun-zone'
              ? 'bg-primary-container text-on-primary-container'
              : 'text-on-surface-variant'
          }`}
        >
          Fun Zone
        </button>
        <button
          onClick={() => onNavigate('safety-about')}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
            activeView === 'safety-about'
              ? 'bg-primary-container text-on-primary-container'
              : 'text-on-surface-variant'
          }`}
        >
          Safety
        </button>
      </div>
    </header>
  );
};
