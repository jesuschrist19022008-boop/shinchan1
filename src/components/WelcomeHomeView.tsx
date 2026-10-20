import React, { useState } from 'react';
import { Character } from '../types';
import { homeCompliments } from '../data/compliments';

interface WelcomeHomeViewProps {
  onNavigate: (view: string) => void;
  activeCharacter: Character;
  onOpenSmileModal: () => void;
  hugCount: number;
  onIncrementHug: () => void;
}

export const WelcomeHomeView: React.FC<WelcomeHomeViewProps> = ({
  onNavigate,
  activeCharacter,
  onOpenSmileModal,
  hugCount,
  onIncrementHug,
}) => {
  const [complimentIndex, setComplimentIndex] = useState(0);
  const currentCompliment = homeCompliments[complimentIndex];

  const handleNextCompliment = () => {
    setComplimentIndex((prev) => (prev + 1) % homeCompliments.length);
  };

  return (
    <section className="flex flex-col w-full">
      {/* Ambient decorative blobs */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-primary-container/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-64 -left-20 w-80 h-80 bg-secondary-container/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-80 -right-20 w-80 h-80 bg-tertiary-container/25 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Sanctuary status indicators */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container shadow-sm">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container text-[12px] font-bold">
              ★
            </span>
            <span className="font-label-md text-label-md text-on-surface">
              Kasukabe Cozy Shelter • Open 24/7 For You
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-ping" />
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              9 Companions Resting &amp; Ready
            </span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-xl bg-surface-container-lowest p-space-lg sm:p-space-xl shadow-xl overflow-hidden mb-space-xl border border-surface-container">
          <div className="absolute top-6 right-8 text-secondary-container animate-pulse pointer-events-none select-none">
            <svg fill="currentColor" height="34" viewBox="0 0 24 24" width="34">
              <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z" />
            </svg>
          </div>
          <div className="absolute bottom-8 right-1/4 text-primary-fixed-dim/60 pointer-events-none select-none">
            <svg fill="currentColor" height="22" viewBox="0 0 24 24" width="22">
              <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md">
                <span className="material-symbols-outlined text-[16px]">favorite</span>
                A Safe Space To Just Be
              </div>
              <div className="flex flex-col gap-space-xs">
                <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                  Hey, you! <span className="text-primary inline-block hover:scale-110 transition-transform">💗</span>
                </h1>
                <p className="font-headline-sm text-headline-sm text-primary font-semibold">
                  Had a rough day? Shinchan and the gang are here to brighten your day!
                </p>
              </div>
              <div className="p-space-md rounded-lg bg-surface-container-low shadow-sm flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">cloud_done</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-on-surface">Unconditional Acceptance</span>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    You don't have to pretend to be happy. Come exactly as you are. Messy hair, heavy thoughts, or quiet heart—you are totally welcome.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                <button
                  onClick={() => onNavigate('choose-character')}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all group"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[22px] group-hover:rotate-12 transition-transform">
                    chat_bubble
                  </span>
                  <span>Let's Talk!</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <button
                  onClick={onOpenSmileModal}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-secondary-container text-on-secondary-container font-label-lg text-label-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[22px] text-secondary">
                    sentiment_very_satisfied
                  </span>
                  <span>Make Me Smile</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-secondary font-label-sm text-label-sm">
                    Chocobi!
                  </span>
                </button>
              </div>
            </div>

            {/* Visual Bento Preview */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[380px] aspect-square rounded-xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-variant p-4 flex flex-col justify-between shadow-inner overflow-hidden border border-surface-container-highest">
                <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-primary-fixed/50 blur-xl" />
                <div className="absolute -left-8 -bottom-8 w-44 h-44 rounded-full bg-secondary-fixed/60 blur-xl" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-surface-container-lowest font-label-sm text-label-sm text-on-surface shadow-sm">
                    Today's Host: {activeCharacter.name}
                  </span>
                  <span className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-[13px] shadow-sm">
                    ★
                  </span>
                </div>
                <div className="relative z-10 w-full h-48 rounded-lg overflow-hidden shadow-md group bg-surface-container-high">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Shinchan and Shiro resting cozy"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOqhIgqGYZ96233cx7LVOkf2XeNOQJDSkPecuGjJ56baaef_FN9071S6nirCzuuYMGxSvP0qvoi9qRS93YWAtG5omhv4E26Z9lHiZ5isN888xt6JNQXTXcLhhKT5rtJzftFxRBbiaT9r4JJJqVjKEDzy1udC-8eHGOvhkqh0GbeJK_ZZQLRaeaFoCXMHH4ECtjgc2D-fh6eH0VRDpzmMFAKd_HV-GKjj5QjnV8quO-xBqzxiyVrEh-"
                  />
                  <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-between text-on-surface">
                    <span className="font-label-sm text-label-sm font-semibold">
                      Shinchan says: "Oho! You made it safely!"
                    </span>
                    <span className="material-symbols-outlined text-primary text-[18px]">favorite</span>
                  </div>
                </div>
                <div className="relative z-10 bg-surface-container-lowest/95 backdrop-blur-md p-3 rounded-lg shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <p className="font-body-sm text-body-sm text-on-surface-variant italic truncate">
                    "Take a warm sip of tea... you did your best today!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gentle Daily Truth Quote */}
        <div className="relative w-full rounded-xl bg-gradient-to-r from-primary-container via-surface-container-high to-secondary-container p-1 shadow-lg mb-space-xl">
          <div className="rounded-[2.8rem] bg-surface-container-lowest px-space-lg py-space-md sm:py-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[28px]">format_quote</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-secondary font-bold tracking-wider uppercase">
                  Gentle Daily Truth
                </span>
                <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  “Your worth doesn't decrease because someone fails to see it.”
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-surface-container-high font-label-sm text-label-sm text-primary font-bold">
                Kasukabe Law #1 🌸
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Section: Compliment Capsule & Hug Meter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-xl">
          {/* Daily Compliment Capsule */}
          <div className="lg:col-span-7 rounded-xl bg-surface-container-lowest p-space-lg shadow-xl flex flex-col justify-between border border-surface-container">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">cookie</span>
                </div>
                <div>
                  <h2 className="font-title-md text-title-md text-on-surface font-bold">
                    Daily Compliment Capsule
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Tap to crack open a warm Shinchan hug &amp; crispy Chocobi biscuit!
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                Instant Cheer
              </span>
            </div>
            <div
              onClick={handleNextCompliment}
              className="relative my-space-md p-space-lg rounded-xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high flex flex-col items-center text-center transition-all cursor-pointer hover:shadow-md group select-none"
            >
              <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-space-sm shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <span className="material-symbols-outlined text-[32px]">{currentCompliment.icon}</span>
              </div>
              <div>
                <p className="font-headline-sm text-headline-sm text-primary font-bold mb-1">
                  {currentCompliment.title}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mx-auto">
                  {currentCompliment.text}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[16px]">
                  arrow_back_ios_new
                </span>
                Updated fresh every time you click
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextCompliment();
                }}
                className="px-4 py-2 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high transition-all flex items-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">cached</span>
                <span>Pop Another One</span>
              </button>
            </div>
          </div>

          {/* Daily Hug Meter */}
          <div className="lg:col-span-5 rounded-xl bg-surface-container-lowest p-space-lg shadow-xl flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-bold">Daily Hug Meter</h3>
                </div>
                <span className="font-label-sm text-label-sm text-primary font-semibold">
                  Live Kasukabe Warmth
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                Our cozy sanctuary has passed out hugs, soft giggles, and calm sighs to weary visitors today.
              </p>
              {/* Custom Visual Progress Capsule with Shiro Head */}
              <div
                onClick={onIncrementHug}
                className="relative w-full h-8 rounded-full bg-surface-container p-1 flex items-center mb-space-xs cursor-pointer group"
                title="Click to add a hug!"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-container via-secondary-container to-secondary-fixed flex items-center justify-end pr-1 transition-all duration-700"
                  style={{ width: `${Math.min(96, 75 + ((hugCount % 100) / 4))}%` }}
                >
                  <div className="w-6 h-6 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center text-[11px] font-bold text-on-surface group-hover:scale-125 transition-transform">
                    🐾
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-label-sm font-label-sm text-on-surface-variant mb-space-md">
                <span>Morning yawn (0)</span>
                <span className="text-primary font-bold">
                  {hugCount.toLocaleString()} warm hugs given
                </span>
                <span>Infinite sky ★</span>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-container-low">
                  <span className="material-symbols-outlined text-primary text-[20px]">lock_reset</span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Zero judgments, zero expectations, 100% gentle ear
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-container-low">
                  <span className="material-symbols-outlined text-secondary text-[20px]">music_note</span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Gemini character intelligence attuned to your exact words
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('feelings-check-in')}
              className="mt-space-md w-full py-2.5 rounded-full bg-surface-container text-on-surface text-center font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5"
              type="button"
            >
              <span>Start with a 10-second Feelings Check</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights: 3 Pillars */}
        <div className="mb-space-xl">
          <div className="text-center max-w-xl mx-auto mb-space-lg">
            <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm inline-block mb-space-xs">
              Discover The Sanctuary
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Three Pillows To Rest Your Head
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Hand-crafted spaces designed to meet you wherever you are right now.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {/* Pillar 1 */}
            <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all border border-surface-container">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[24px]">group</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
                    9 Friends
                  </span>
                </div>
                <h3 className="font-title-md text-title-md text-on-surface font-bold mb-space-xs">
                  All 9 Kasukabe Friends
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                  Talk with Shinchan, gentle Shiro, Himawari, Misae, Hiroshi, studious Kazama, passionate Nene, timid Masao, or steady Bo-chan.
                </p>
                <div className="p-space-sm rounded-lg bg-surface-container-low mb-space-md">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mb-2 font-medium">
                    Ready to listen:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                    <span className="p-1 rounded bg-surface-container-lowest">🖍️ Shinchan</span>
                    <span className="p-1 rounded bg-surface-container-lowest">🐕 Shiro</span>
                    <span className="p-1 rounded bg-surface-container-lowest">🍼 Hima</span>
                    <span className="p-1 rounded bg-surface-container-lowest">👩 Misae</span>
                    <span className="p-1 rounded bg-surface-container-lowest">👔 Hiroshi</span>
                    <span className="p-1 rounded bg-surface-container-lowest">📘 Kazama</span>
                    <span className="p-1 rounded bg-surface-container-lowest">🐰 Nene</span>
                    <span className="p-1 rounded bg-surface-container-lowest">🍙 Masao</span>
                    <span className="p-1 rounded bg-surface-container-lowest">🪨 Bo-chan</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('choose-character')}
                className="w-full py-3 rounded-full bg-primary-container text-on-primary-container text-center font-label-md text-label-md shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2"
                type="button"
              >
                <span>Pick Your Companion</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all border border-surface-container">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[24px]">mood</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                    11 Emotion Tags
                  </span>
                </div>
                <h3 className="font-title-md text-title-md text-on-surface font-bold mb-space-xs">
                  Safe Feelings Check-In
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                  No pressure to define yourself in one word. Select any combination of our 11 custom emotion tags to tailor gentle support.
                </p>
                <div className="flex flex-wrap gap-1.5 p-space-sm rounded-lg bg-surface-container-low mb-space-md">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm">
                    🌧️ Heavy &amp; Tired
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                    ✨ Needing A Hug
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm">
                    ⚡ Overwhelmed
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm">
                    💔 Heartbroken
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                    🍪 Want a treat
                  </span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('feelings-check-in')}
                className="w-full py-3 rounded-full bg-surface-container-high text-on-surface text-center font-label-md text-label-md hover:bg-surface-variant transition-all flex items-center justify-center gap-2"
                type="button"
              >
                <span>Check My Feelings</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all border border-surface-container">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[24px]">attractions</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">
                    Pure Play
                  </span>
                </div>
                <h3 className="font-title-md text-title-md text-on-surface font-bold mb-space-xs">
                  Shinchan Fun Zone
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                  Instant wholesome distraction with Little Wins Garden, Mood Meme Maker, and Compliment Capsules to release tension.
                </p>
                <div className="space-y-2 p-space-sm rounded-lg bg-surface-container-low mb-space-md">
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-md bg-surface-container-lowest">
                    <span className="font-label-sm text-label-sm text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[16px]">local_florist</span>
                      Little Wins Garden
                    </span>
                    <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-md bg-surface-container-lowest">
                    <span className="font-label-sm text-label-sm text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[16px]">draw</span>
                      Mood Meme Maker
                    </span>
                    <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('fun-zone')}
                className="w-full py-3 rounded-full bg-secondary-container text-on-secondary-container text-center font-label-md text-label-md shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2"
                type="button"
              >
                <span>Explore Fun Zone</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Banner */}
        <div className="rounded-xl bg-surface-container-low p-space-lg mb-space-xl overflow-hidden shadow-md border border-surface-container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center">
            <div className="md:col-span-5 flex flex-col gap-space-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest w-fit text-primary font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px]">palette</span>
                Kasukabe Warmth Gallery
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                "Even when it rains, tea tastes sweet."
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                A visual snapshot from the quiet neighborhood of Kasukabe. When the world feels too fast, slow down to Shinchan's walking speed.
              </p>
              <div className="pt-space-xs">
                <button
                  onClick={() => onNavigate('character-chat')}
                  className="inline-flex items-center gap-2 text-primary font-label-md text-label-md hover:underline bg-transparent border-0 p-0 cursor-pointer"
                  type="button"
                >
                  <span>Sit down with Shinchan &amp; friends for tea</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
            <div className="md:col-span-7 grid grid-cols-2 gap-space-md">
              <div className="rounded-lg overflow-hidden h-44 shadow-sm group bg-surface-container">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Nohara garden with Shiro"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4tFWbDKOoc-qMJI6dP8xXc2npjThK6-ixCtaRObdeytcSUM1QrnPEIJUrlI8P1GgqVK74nSheZG59SnlDj_bHVG4CGn30q-wxYYdc57Z10U3rpglUa88TJbM_ypvjZrA_vFJjh9CR5TMExh9afgTFNvEnbQOetGP3hrsPTeB2-ziNvNmZcgXE0bOMYYO7qwrNMuP7EugzYQHAV4rTR0AVdf84ru2P__TrCN6n-Ph0MaZn1na7wP_h"
                />
              </div>
              <div className="rounded-lg overflow-hidden h-44 shadow-sm group bg-surface-container">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Chocobi biscuit box"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuArQifMRpa_sLfnPAtUBOo4hSTt03yfvGGPO7OlD1zrb77QbbmQYJc6OuOWEsHIlp202uUfKGUuRtGKVkjMWv61CPmk51OBVQNvGNpLllAc6XC3m_7471K9_VlOsRapBgToOerHPgJUOJsaRSX8LDI6j6mNjroqyV2_HkC4bf5Pw3Zn-Iyzawml62DNbIsd9UWbv9DlHG4B463k4ZfpDVD67g3SpWx-fH6ZUUhT5LfZvuDn0GoXFlKR"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
