import React from 'react';
import { Character } from '../types';
import { characters } from '../data/characters';

interface ChooseCharacterViewProps {
  selectedCharacterId: string;
  onSelectCharacter: (charId: string) => void;
  onNavigate: (view: string) => void;
}

export const ChooseCharacterView: React.FC<ChooseCharacterViewProps> = ({
  selectedCharacterId,
  onSelectCharacter,
  onNavigate,
}) => {
  const handleSelect = (charId: string) => {
    onSelectCharacter(charId);
    onNavigate('feelings-check-in');
  };

  return (
    <section className="flex flex-col w-full">
      <div className="mb-space-lg text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm mb-2">
          <span className="material-symbols-outlined text-[16px]">diversity_1</span>
          Kasukabe Companions
        </div>
        <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
          Who would you like to sit with?
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Each friend listens differently. Choose whoever your heart feels most comfortable talking to right now.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg mb-space-xl">
        {characters.map((char) => {
          const isSelected = char.id === selectedCharacterId;
          return (
            <div
              key={char.id}
              className={`rounded-xl bg-surface-container-lowest p-space-lg shadow-md hover:shadow-xl transition-all border ${
                isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-surface-container'
              } flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                    {char.emoji}
                  </div>
                  {isSelected && (
                    <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                      Active Friend ★
                    </span>
                  )}
                </div>
                <h3 className="font-title-md text-title-md text-on-surface font-bold mb-1">
                  {char.name}
                </h3>
                <span className="font-label-sm text-primary font-semibold block mb-2">
                  {char.role}
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                  {char.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {char.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full bg-surface-container text-xs text-on-surface-variant font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelect(char.id)}
                className={`w-full py-2.5 rounded-full ${
                  isSelected
                    ? 'bg-primary text-on-primary font-bold shadow-md'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                } text-sm transition-all cursor-pointer`}
                type="button"
              >
                {isSelected ? 'Currently Selected' : `Chat with ${char.name.split(' ')[0]}`}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
