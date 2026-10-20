import { ComplimentItem, FortuneItem, JokeItem, MemePreset } from '../types';

export const homeCompliments: ComplimentItem[] = [
  {
    icon: "sentiment_very_satisfied",
    title: "Shinchan's Secret Star",
    text: "“You woke up and kept trying today. In Kasukabe, that automatically earns you 10 gold stars and an honorary Defense Force badge!”"
  },
  {
    icon: "pets",
    title: "Shiro's Fluffy Nuzzle",
    text: "Shiro quietly rests his chin on your knee. He doesn't need explanations. He just wants you to know you are safe and loved."
  },
  {
    icon: "cookie",
    title: "Crispy Chocobi Blessing",
    text: "“Here! Take the last star cookie in the box. I only share this with my favorite people!” — Shinnosuke"
  },
  {
    icon: "spa",
    title: "Bo-chan's Calm Pebble",
    text: "Bo-chan offers you a smooth, warm river rock. “Hold this when your head feels too loud. It stays still with you.”"
  },
  {
    icon: "favorite",
    title: "Misae's Quiet Hug",
    text: "“Take a deep breath. The world can wait. You are doing so much better than you give yourself credit for.”"
  }
];

export const smileJokes: JokeItem[] = [
  {
    title: "“Look, look! An Action Kamen Pose!”",
    body: "Shinnosuke attempts an epic high kick, drops his snack, and Shiro smoothly catches it mid-air without blinking. Even the pigeon on the fence is clapping!"
  },
  {
    title: "“Kazama-kun's Secret Notebook!”",
    body: "Kazama tries to pretend he's studying serious English grammar, but Shinchan sneaks up and whispers: “Are you secretly drawing magical girl Moe-P again?”"
  },
  {
    title: "“Shiro's Cotton Candy Spin!”",
    body: "Shiro curls himself into a perfect round ball of fluff and does three tiny wiggles. Congratulations, your stress just melted by 40%."
  },
  {
    title: "“Hiroshi's Sock Warning!”",
    body: "Hiroshi takes off his work shoes... and even the family goldfish tries to hide under a pebble. Hiroshi sighs: “Hard day's work, but seeing you smile makes it worth it!”"
  }
];

export const fortunes: FortuneItem[] = [
  {
    emoji: "🍪",
    title: "Crispy Chocobi Blessing",
    body: "“Take the last star cookie in the box. I only share this with my favorite people!” — Shinnosuke"
  },
  {
    emoji: "🐾",
    title: "Shiro's Fluffy Nuzzle",
    body: "Shiro quietly rests his chin on your knee. He doesn't need explanations. You are completely safe and loved."
  },
  {
    emoji: "🪨",
    title: "Bo-chan's Calm Pebble",
    body: "“Hold this smooth river stone when your thoughts get loud. It stays still with you.”"
  },
  {
    emoji: "🌸",
    title: "Misae's Quiet Hug",
    body: "“Take a deep breath. The laundry can wait. The world can wait. You are doing so much better than you give yourself credit for.”"
  },
  {
    emoji: "👔",
    title: "Hiroshi's Salaryman Truth",
    body: "“Bad days end. A warm bath, quiet slippers, and someone who believes in you is all it takes to restart tomorrow.”"
  }
];

export const memePresets: MemePreset[] = [
  { top: "ME PRETENDING TO BE AN ADULT", bottom: "WHILE EATING CHOCOBI IN BED" },
  { top: "OVERTHINKING AT 2 AM", bottom: "SHIRO SNORING PEACEFULLY NEXT TO ME" },
  { top: "MY TO-DO LIST TODAY", bottom: "ACTION KAMEN POSE & A LONG SNOOZE" },
  { top: "BOSS: HOW IS THE PROJECT?", bottom: "ME: OII, PRETTY LADY LOOK!" },
  { top: "HEARTACHE LEVEL: 100", bottom: "COMPANION HUG LEVEL: INFINITE" }
];
