import { EmotionTag, SupportStyle } from '../types';

export const emotionTags: EmotionTag[] = [
  { id: "heavy-tired", label: "🌧️ Heavy & Tired" },
  { id: "needing-hug", label: "✨ Needing A Hug" },
  { id: "overwhelmed", label: "⚡ Overwhelmed" },
  { id: "quiet-numb", label: "🧸 Quiet / Numb" },
  { id: "want-treat", label: "🍪 Want a treat" },
  { id: "heartbroken", label: "💔 Heartbroken / Hurt" },
  { id: "anxious-worried", label: "🌪️ Anxious / Worried" },
  { id: "angry-frustrated", label: "🔥 Angry / Frustrated" },
  { id: "lonely-isolated", label: "🌙 Lonely / Isolated" },
  { id: "happy-celebrating", label: "🎈 Happy / Celebrating" },
  { id: "confused-in-head", label: "🌀 Confused / In My Head" }
];

export const supportStyles: SupportStyle[] = [
  { id: "comfort-hugs", label: "Gentle Comfort & Hugs", desc: "Warm validation, safety, and affectionate listening." },
  { id: "playful-banter", label: "Playful Banter & Smiles", desc: "Wholesome teasing, silliness, and comic distraction." },
  { id: "comfort-scold", label: "Comfort + Tiny Scolding", desc: "Big hug first, then a scold to stop beating yourself up!" },
  { id: "quiet-listening", label: "Deep Quiet Listening", desc: "Patient space to let you talk without rushing advice." },
  { id: "realistic-encouragement", label: "Realistic Encouragement", desc: "Grounded life wisdom: tomorrow is a fresh page." }
];
