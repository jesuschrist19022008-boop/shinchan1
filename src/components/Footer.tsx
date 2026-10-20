import React from 'react';

interface FooterProps {
  onNavigate: (view: string) => void;
  forceDemo: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, forceDemo }) => {
  return (
    <footer className="w-full bg-surface-container-low mt-space-xl border-t border-surface-container">
      <div className="max-w-[1200px] mx-auto px-margin py-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-lg mb-space-lg">
          <div className="md:col-span-2 flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container text-[18px]">
                  volunteer_activism
                </span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                Kasukabe Defense Sanctuary
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              A cozy, non-judgmental fan oasis crafted to lighten heavy days with the buoyant warmth of Shinnosuke, Shiro, and Kasukabe friends. Take a deep breath—you are safe here.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container w-fit mt-space-xs">
              <span className="material-symbols-outlined text-secondary text-[16px]">star</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Fan-Made Appreciation Space • Attuned with Gemini Intelligence
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-space-xs">
            <span className="font-label-lg text-label-lg text-on-surface mb-space-xs">
              Gentle Corners
            </span>
            <button
              onClick={() => onNavigate('welcome-home')}
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors text-left bg-transparent border-0 p-0 cursor-pointer"
            >
              Welcome Haven
            </button>
            <button
              onClick={() => onNavigate('choose-character')}
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors text-left bg-transparent border-0 p-0 cursor-pointer"
            >
              Kasukabe Companions
            </button>
            <button
              onClick={() => onNavigate('feelings-check-in')}
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors text-left bg-transparent border-0 p-0 cursor-pointer"
            >
              Daily Feelings Check
            </button>
            <button
              onClick={() => onNavigate('character-chat')}
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors text-left bg-transparent border-0 p-0 cursor-pointer"
            >
              Warm Listening Chat
            </button>
            <button
              onClick={() => onNavigate('fun-zone')}
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors text-left bg-transparent border-0 p-0 cursor-pointer"
            >
              Sunflower Garden
            </button>
          </div>

          <div className="flex flex-col gap-space-xs">
            <span className="font-label-lg text-label-lg text-on-surface mb-space-xs">
              Safety &amp; Care
            </span>
            <button
              onClick={() => onNavigate('safety-about')}
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors text-left bg-transparent border-0 p-0 cursor-pointer"
            >
              Crisis Resources &amp; Helplines
            </button>
            <button
              onClick={() => onNavigate('safety-about')}
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors text-left bg-transparent border-0 p-0 cursor-pointer"
            >
              Community Care Pledge
            </button>
            <div className="mt-space-sm p-3 rounded-DEFAULT bg-surface-container-high">
              <span className="font-label-sm text-label-sm text-primary font-bold block mb-0.5">
                Need urgent support?
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                Free helplines are available 24/7 in our Safety section.
              </span>
            </div>
          </div>
        </div>

        <div className="pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm border-t border-surface-container-high/60">
          <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
            Crafted with soft pinks, Chocobi stars, and pure comfort for Kasukabe friends everywhere.
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface px-3 py-1 rounded-full text-xs">
            {forceDemo ? 'Demo Mode (Scripted)' : 'Live Gemini 3.8 Flash Active'}
          </span>
        </div>
      </div>
    </footer>
  );
};
