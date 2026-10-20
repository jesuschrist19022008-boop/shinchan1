export interface Character {
  id: string;
  name: string;
  emoji: string;
  role: string;
  bio: string;
  tags: string[];
  greeting: string;
}

export interface EmotionTag {
  id: string;
  label: string;
}

export interface SupportStyle {
  id: string;
  label: string;
  desc: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "model";
  content: string;
  source?: string;
}

export interface GardenFlower {
  type: string;
  title: string;
  date: string;
}

export interface ComplimentItem {
  icon: string;
  title: string;
  text: string;
}

export interface JokeItem {
  title: string;
  body: string;
}

export interface FortuneItem {
  emoji: string;
  title: string;
  body: string;
}

export interface MemePreset {
  top: string;
  bottom: string;
}
