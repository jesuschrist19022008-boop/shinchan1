import dns from "node:dns";
// Prioritize IPv4 resolution to prevent IPv6 timeouts in container/serverless environments
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // Ignored if not supported in runtime
}

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Helper to get GoogleGenAI client with active server-side key
function getAIClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY || "";
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": process.env.VERCEL ? "shinchan-comfort-corner/1.0" : "aistudio-build",
      },
    },
  });
}

interface ChatMessage {
  role: "user" | "model" | "assistant";
  content: string;
}

interface ChatRequestBody {
  character?: string;
  emotions?: string[];
  supportStyle?: string;
  messages?: ChatMessage[];
  chatHistory?: ChatMessage[];
  latestMessage?: string;
  message?: string;
  forceDemo?: boolean;
  isCallMode?: boolean;
}

function getCharacterPersona(character: string): string {
  switch (character) {
    case "Hiroshi":
      return `Character: Hiroshi Nohara (Shinchan & Himawari's dad, 35-year-old salaryman at Futaba Shoji).
Personality & Voice:
- A loving, realistic, down-to-earth, and responsible father with a warm sense of humor.
- Can talk about work, office deadlines, his boss Kawaguchi, subway commutes, family budgeting with Misae, drinking a cold beer after work, his notoriously smelly socks, playing golf on weekends, and real everyday life.
- Practical, grounded advice for life, jobs, school, and relationships.
- When the user asks about HIM (e.g. "What about you?", "How was your day?"): Answer directly about himself! (e.g. "Ah, thanks for asking! Just finished a long day at Futaba Shoji, kicked off my shoes, and enjoying a quiet moment. Misae has me on a tight snack budget this week, but I can't complain too much!").
- When the user shares good news: "Look at that! That is fantastic news! You worked hard for that, and you should be genuinely proud. That calls for a celebration tonight!"
- Never preachy or patronizing. Speaks like a warm, relaxed father or dependable older friend.`;

    case "Shinchan":
      return `Character: Shinnosuke "Shinchan" Nohara (5-year-old leader of the Kasukabe Defense Force).
Personality & Voice:
- Cheeky, mischievous, playful, energetic, with signature expressions like "Oii!", "Hehe!", "Oho!", or wiggly eyebrows.
- Loves Chocobi biscuits, Action Kamen cartoons, pretty big sisters, and silly humor.
- When the user asks about HIM (e.g. "What about you?"): Answers playfully about his day! (e.g. "Me? I was just trying to teach Shiro how to do the Action Kamen beam, but he just yawned and went back to sleep! Plus mom scolded me for leaving my toys in the hallway!").
- When the user is happy: Cheers loudly, does a funny victory dance, and high-fives enthusiastically!
- When someone is sad or hurt: Drops the clown act and shows his deeply loyal, tender golden heart.
- Chats like an energetic, affectionate kid friend, not a textbook counselor.`;

    case "Kazama":
      return `Character: Tooru Kazama (Shinchan's studious, polite, and articulate friend).
Personality & Voice:
- Well-mannered, intelligent, organized, slightly serious, but deeply thoughtful and caring.
- Goes to cram school, practices English vocabulary, and likes everything organized (and secretly adores Magical Girl Moe-P!).
- When asked about himself: Talks about his studies, cram school homework, or English practice with polite charm.
- Helps untangle messy thoughts step-by-step with calm clarity.
- When user succeeds: Expresses genuine, dignified pride in their accomplishment.`;

    case "Nene":
      return `Character: Nene Sakurada (The passionate, expressive, theatrical friend).
Personality & Voice:
- Confident, lively, energetic, dramatic, and fiercely loyal to her best friends.
- Loves directing 'Real House' pretend games and high-energy storytelling.
- When asked about herself: Talks enthusiastically about her scripts, games, or what happened at preschool today.
- When the user shares good news: Jumps up and down with genuine excitement and wants all the juicy details.
- When someone wrongs the user: Expresses fiery bestie solidarity and defends them completely.`;

    case "Masao":
      return `Character: Masao Sato (The gentle, timid onigiri-headed friend).
Personality & Voice:
- Sweet, humble, sensitive, shy, and easily nervous.
- Loves drawing manga, collecting insect cards, and eating onigiri rice balls.
- When asked about himself: Lovingly stutters a bit and shares what he's drawing or how he was a little nervous today.
- Zero judgment because he knows what it feels like to feel anxious, small, or afraid of failure.
- Pure kindness, relatable vulnerability, and gentle encouragement.`;

    case "Bo-chan":
      return `Character: Bo-chan (The serene, stone-calm friend with the runny nose).
Personality & Voice:
- Speaks with few words, slow steady cadence, and ancient, peaceful stillness.
- Loves rare river stones, fossils, and quiet observation of nature.
- When asked about himself: Shares a calm observation about a river stone he found or a quiet breeze.
- Brings deep tranquil grounding to busy or racing minds.`;

    case "Himawari":
      return `Character: Himawari Nohara (Shinchan's 1-year-old baby sister).
Personality & Voice:
- Pure bubbly joy, sweet baby giggles ("Ah-da-da! Taya-ya! ✨"), sparkling eyes.
- Loves shiny golden jewelry, sparkling gems, and handsome older guys.
- Brings spontaneous sunshine, giggles, and playful baby energy.`;

    case "Shiro":
      return `Character: Shiro (The fluffy white dog of the Nohara household).
Personality & Voice:
- Loyal, patient, gentle, and quiet.
- Communicates through tender canine actions (*gentle tail wags*, *soft head rests on your knee*, *happy barks*).
- Loves quiet companionship, walks by the riverbank, and resting peacefully with friends.`;

    case "Misae":
    default:
      return `Character: Misae Nohara (Shinchan's fiercely caring, energetic mother).
Personality & Voice:
- Strong, practical, energetic, protective, and loving.
- Manages the lively Nohara household, bargain sales at the supermarket, and makes warm home-cooked meals.
- When asked about herself: Mentions household antics, catching a grocery special, or enjoying a fresh cup of roasted tea.
- Always reminds friends to eat well, drink water, and stand tall with self-respect.`;
  }
}

function buildSystemInstruction(
  character: string,
  emotions: string[],
  supportStyle: string,
  isCallMode = false
): string {
  const emotionContext = emotions && emotions.length > 0
    ? emotions.join(", ")
    : "Neutral / Open";

  const styleContext = supportStyle || "Gentle Comfort & Hugs";
  const persona = getCharacterPersona(character);

  return `You are roleplaying as ${character} from the beloved anime Crayon Shin-chan.
You are talking in real-time with the user in the "Shinchan Comfort Corner" sanctuary.

[CONVERSATION CONTEXT]
- Active Character: ${character}
- Emotion Check-in: ${emotionContext}
- Preferred Style: ${styleContext}
- Interaction Mode: ${isCallMode ? "LIVE TWO-WAY VOICE CALL (Spoken audio conversation)" : "Text Chat"}

[CRITICAL BEHAVIORAL DIRECTIVES - HIGHEST PRIORITY]

1. DIRECT ANSWERS TO DIRECT QUESTIONS:
   - If the user asks a direct question (e.g. "What about you?", "How are you?", "What are you doing today?", "What is your favorite snack?", "Tell me a joke"):
     -> ANSWER THE QUESTION DIRECTLY about yourself or your topic first!
     -> Do NOT evade questions, do NOT deflect back into therapy mode, and do NOT give generic affirmations instead of answering.

2. LISTEN TO USER CORRECTIONS & TOPIC SHIFTS:
   - If the user corrects you (e.g. "I asked about you", "That's not what I meant", "You didn't answer my question"):
     -> Gracefully and warmly acknowledge the correction immediately, and answer their actual question! (e.g., if playing Hiroshi: "Ah, haha, you caught me! Sorry about that. Well, as for me...").
   - Follow topic changes smoothly without clinging to previous topics.

3. FORBIDDEN CANNED PHRASES:
   - NEVER use generic robotic script lines like:
     * "I'm listening closely to you"
     * "You are safe and welcome here"
     * "Whatever happened today, you're safe now"
     * "Tell me whatever is on your mind"
   - Instead, speak naturally, spontaneously, and in genuine character voice!

4. DYNAMIC EMOTION UNDERSTANDING:
   - NEVER assume the user is sad, lonely, or crying without clear evidence!
   - If the user is happy, celebrating, or shares good news: Celebrate enthusiastically with authentic character joy!
   - If the user is chatting casually about everyday life, food, hobbies, school, or work: Have a normal, fun, grounded conversation!
   - If the user jokes or banters: Joke back and enjoy the laugh!
   - If the user is genuinely sad, overwhelmed, or hurting: Offer heartfelt, loyal empathy and warm companionship without lecturing.

${isCallMode ? `
5. VOICE CALL MODE REQUIREMENTS:
   - You are speaking aloud on an active telephone call.
   - Keep each spoken response short, natural, and conversational (1 to 2 spoken sentences).
   - DO NOT use markdown asterisks (*action*), bolding, or emojis, because your response is spoken via Text-To-Speech software!
   - Speak with warm, colloquial sentence structures.
` : `
5. TEXT CHAT PACING:
   - Keep messages natural, friendly, and comfortable (usually 2 to 4 sentences).
   - Ask at most ONE natural follow-up question so the conversation flows easily.
`}

[CHARACTER PERSONA]
${persona}
`;
}

// Contextual fallback responses for offline resilience or missing keys
function generateContextualFallback(
  character: string,
  latestMessage: string,
  emotions: string[],
  supportStyle: string,
  history: ChatMessage[],
  isCallMode = false
): string {
  const text = (latestMessage || "").trim().toLowerCase();
  const cleanText = text.replace(/[^a-z0-9 ]/g, "").trim();
  const isShinchan = character === "Shinchan" || !character;

  // 1. CORRECTION: User says "I asked about you" or similar
  if (text.includes("asked about you") || text.includes("asking about you") || text.includes("about you?") || text.includes("what about you") || text.includes("how about you") || text.includes("and you")) {
    if (isCallMode) {
      if (character === "Hiroshi") return "Haha, thanks for asking! I just kicked off my work shoes, relaxing with a cold drink after a busy day at Futaba Shoji!";
      if (character === "Kazama") return "Thank you for asking! I was just organizing my study timetable and having a quick cup of barley tea.";
      if (character === "Nene") return "Aww, thanks for asking! I was just planning a brand new storyline for my Real House game!";
      if (character === "Masao") return "M-Me? Oh, thank you for asking! I was just sketching a new superhero page in my notebook!";
      if (character === "Bo-chan") return "Me... I found a smooth gray river stone this morning. It brings quiet peace.";
      if (isShinchan) return "Oii! Thanks for asking! I'm balancing Chocobi cookies on my forehead and waiting for Action Kamen!";
      return "Thanks for asking! I'm having a cozy, peaceful day right here in Kasukabe!";
    }

    if (character === "Hiroshi") {
      return "Haha, you caught me! Thanks for asking! Honestly, I just got back from Futaba Shoji, kicked off my work shoes, and cracked open a cold drink. It was a hectic day at the office, but chatting with you makes the evening so much more relaxing. How did your day treat you?";
    } else if (character === "Kazama") {
      return "Oh! Thank you for asking about me! I just finished my English grammar drills and organized my study desk. It's really refreshing to take a break and talk with you. What made your day so good?";
    } else if (character === "Nene") {
      return "Aww, that's so sweet of you to ask! I was actually just writing down dramatic plot twists for my Real House game. Mom made some sweet strawberry snacks earlier too! But tell me, what made you feel so great today?";
    } else if (character === "Masao") {
      return "W-Wait, you're asking about me? That's so kind of you! I was a little nervous earlier about a school project, but I'm feeling a lot calmer now sketching in my notebook. Seeing you in high spirits really brightens my day!";
    } else if (character === "Bo-chan") {
      return "Me... I found a cool oval stone by the Kasukabe riverbank today. It is cool to the touch. Your happy energy feels warm like sunlight.";
    } else if (isShinchan) {
      return "Oii, you're asking about ME?! Hehe, you're pretty nice! I was just practicing my Action Kamen flying kick on the sofa until Mom scolded me! Now I'm snacking on Chocobi. What awesome thing happened to make you feel so good?";
    }
  }

  // 2. HAPPY & CELEBRATIONS
  if (
    text.includes("happy") || text.includes("great") || text.includes("awesome") ||
    text.includes("good day") || text.includes("feeling good") || text.includes("got the job") ||
    text.includes("passed") || text.includes("celebrate") || text.includes("did it") ||
    text.includes("excited") || text.includes("yay") || text.includes("wonderful")
  ) {
    if (isCallMode) {
      if (character === "Hiroshi") return "That is fantastic news! That hard work paid off, and you deserve a celebration tonight!";
      if (character === "Kazama") return "Remarkable achievement! Hard work and persistence truly pay off. I am so proud of you!";
      if (character === "Nene") return "OMG YAY! That is incredible! Tell me every single detail right now!";
      if (character === "Shiro") return "Woof woof! Happy barks and joyful tail wags! You did it!";
      if (isShinchan) return "Yahoo! That is super awesome! Doing the victory butt dance right now in your honor!";
      return "That is wonderful news! Congratulations on your big win!";
    }

    if (character === "Hiroshi") {
      return "Look at that! That is genuinely fantastic news! 🎉 As someone who knows how tough the daily grind is, seeing you succeed like this puts a huge smile on my face. You earned this win. Tell me what made today turn out so great!";
    } else if (character === "Kazama") {
      return "That is genuinely outstanding news! 🎉 Dedication and careful preparation always show their value. I'm truly proud of your accomplishment! How are you planning to celebrate?";
    } else if (character === "Nene") {
      return "OMG YAAAY!! 🎉 I am so thrilled for you! You totally deserve this success! Tell me every single detail—I want to hear all about it!";
    } else if (character === "Shiro") {
      return "*Shiro does his signature cotton-candy spin dance and wags his fluffy tail like a windmill!* *Happy playful barks!* 🐾✨ (Congratulations! You did it!)";
    } else if (character === "Masao") {
      return "W-Wow!! 🎉 That's amazing! You're so talented and brave! Seeing you this happy makes me feel so joyful too!";
    } else if (isShinchan) {
      return "WAAAAHHH!! 🎉✨ That is awesome! Doing the victory butt dance right now in your honor! You rock, my friend! Tell me what made today so great!";
    } else {
      return "YES!! 🎉 What wonderful news! Let yourself soak in every drop of happiness today!";
    }
  }

  // 3. CASUAL EVERYDAY CHAT & DIRECT QUESTIONS ("What are you doing?", "How are you?")
  if (text.includes("what are you doing") || text.includes("what're you doing") || text.includes("how are you")) {
    if (isCallMode) {
      if (character === "Hiroshi") return "Hey there! Just kicked off my shoes, relaxing after a long day at the office. How are you doing?";
      if (character === "Kazama") return "Hello! I was reviewing some cram school notes. It is really great to talk with you!";
      if (isShinchan) return "Hey! I was just eating Chocobi and thinking about Action Kamen! How are you doing today?";
      return "Hello! I am doing well and very happy to chat with you today!";
    }

    if (character === "Hiroshi") {
      return "Hey there! Honestly, just kicking back after a long commute back from Futaba Shoji. My socks are pretty tired, but kicking off my work shoes and relaxing with a friendly chat is the best part of the evening. How's your day been going?";
    } else if (character === "Kazama") {
      return "Hello! I was just finishing up my daily vocabulary review and organizing my study notebooks. It's really nice taking a quick break to chat with you. How has everything been with you today?";
    } else if (character === "Shiro") {
      return "*Shiro blinks his soft brown eyes and gives a gentle tail thump against the tatami mat.* *Woof!* (Just resting peacefully by the veranda and very happy to see you!)";
    } else if (isShinchan) {
      return "Oii! Hehe, I was just balancing a Chocobi biscuit on Shiro's nose and pretending to be Action Kamen! How are you doing today, friend?";
    } else {
      return "Hello! Just taking a cozy breather here in Kasukabe. What's on your mind today?";
    }
  }

  // 4. JOKES & SILLINESS
  if (text.includes("joke") || text.includes("funny") || text.includes("laugh") || text.includes("silly")) {
    if (isCallMode) {
      if (character === "Hiroshi") return "Why do salarymen love weekends? Because office coffee doesn't taste like freedom, but Saturday morning does!";
      if (isShinchan) return "Did you know Shiro tried to teach a pigeon the Action Kamen beam today? The pigeon just blinked and walked away!";
      return "Here is a fun thought: even on bumpy days, smiling makes everything feel lighter!";
    }

    if (character === "Hiroshi") {
      return "Haha, alright, here's a true salaryman joke: Why did I stare at my spreadsheets for three hours yesterday? Because my boss Kawaguchi walked by, and looking deeply confused counts as hard work! Did that get a little grin out of you?";
    }
    if (isShinchan) {
      return "Hehehe, you asked for it! Did you know Shiro tried to teach a pigeon how to do the Action Kamen beam today? The pigeon just stared and pooped next to dad's shoe. Dad sighed so loud the goldfish swam backwards! Did that bring a tiny grin to your face? 😄";
    }
    return "Here's a wholesome Kasukabe truth: even on the gloomiest days, Shinnosuke can slip on a banana peel and still strike a superhero pose before he hits the floor. Keep smiling!";
  }

  // 5. COMFORT + SCOLD REQUEST
  if ((text.includes("comfort") && text.includes("scold")) || text.includes("scold me")) {
    if (isCallMode) {
      if (character === "Hiroshi") return "First, kick back and take a deep breath. And now my scold: stop taking on everyone else's burden and give yourself some credit!";
      if (isShinchan) return "First, a big hug! And now my tiny scold: stop beating yourself up so much, okay?";
      return "First a warm hug! And please, stop treating yourself with so much harshness!";
    }
    if (character === "Hiroshi") {
      return "Alright, listen to your old man for a minute. First: put your feet up and take a deep breath. You're doing fine. Now here's my gentle scold: stop carrying the weight of the entire universe on your shoulders! You don't have to be perfect every day. Give yourself permission to be a human being, okay?";
    }
    if (isShinchan) {
      return "Oii, you! 💗 First, a big warm virtual hug! And now my tiny scolding: stop being so harsh on yourself, okay? You're allowed to feel hurt. You don't have to solve everything this minute, and you definitely don't have to blame yourself for every problem!";
    }
    return "First: a giant warm hug wrapped around you! 🌸 And now my gentle scolding: please stop treating yourself with so much severity! You deserve kindness—especially from yourself.";
  }

  // 6. RELATIONSHIP ISSUES OR ACCUSATIONS
  if (text.includes("cheating") || text.includes("accused") || (text.includes("boyfriend") && text.includes("doubt"))) {
    if (isCallMode) {
      if (character === "Hiroshi") return "Being unfairly accused cuts deep. Take a steady breath. You know your integrity, and nobody can take that from you.";
      if (isShinchan) return "Hey, I hear you. Being falsely accused stings so much. You do not have to tear yourself apart to prove your worth.";
      return "Being doubted by someone you care about is heartbreaking. Please remember your truth and take a slow breath.";
    }
    if (character === "Hiroshi") {
      return "Hey, come sit down. Being falsely accused by someone you care about hurts in a really deep, frustrating way. But listen: you know your truth and your integrity. Don't let someone else's insecurity make you feel small or guilty for things you didn't do. I'm right here if you want to talk it through.";
    }
    if (isShinchan) {
      return "Oii, hey... 🥺 I'm sorry this is hurting you so much. Being accused by someone you care about can really sting. But listen to me, you shouldn't have to tear yourself apart trying to prove your worth, okay? You deserve to be heard, too. Do you want to tell me what happened?";
    }
    return "That hurts so deeply... Being doubted by someone close to you is devastating. Please remember your heart and truth matter. I am right here listening whenever you're ready to share.";
  }

  // 7. DEFAULT CASUAL & GROUNDED RESPONSES (NO CANNED ROBOTIC THERAPY)
  if (isCallMode) {
    if (character === "Hiroshi") return "I hear you loud and clear. What's on your mind this evening?";
    if (character === "Kazama") return "I am listening closely. Tell me more about what you're thinking.";
    if (isShinchan) return "Oii, I'm right here! Tell me what's on your mind, friend!";
    return "I am right here with you on the line. What's on your mind?";
  }

  if (character === "Hiroshi") {
    return "I'm right here with you. Whether it's about work, family, or just something you need to bounce off an older guy who's seen a few rough days himself, I'm glad to chat. What's on your mind?";
  }
  if (character === "Kazama") {
    return "I'm right here. Let's talk through whatever is on your mind calmly and clearly. What would you like to discuss?";
  }
  if (isShinchan) {
    return "Oii, I'm right here! Whether you want to talk about something fun, something silly, or something that's been bugging you, I've got your back. What's on your mind?";
  }
  return "Hey there! I'm glad you're here. Tell me what's happening in your world today.";
}

// POST /api/chat - Primary intelligent conversation endpoint
export const chatHandler = async (req: express.Request, res: express.Response) => {
  try {
    const {
      character = "Shinchan",
      emotions = [],
      supportStyle = "Gentle Comfort & Hugs",
      messages = [],
      chatHistory = [],
      latestMessage = "",
      message = "",
      forceDemo = false,
      isCallMode = false,
    }: ChatRequestBody = req.body;

    const conversationList = (messages && messages.length > 0) ? messages : (chatHistory || []);
    const userQuery = latestMessage || message || (conversationList.length > 0 ? conversationList[conversationList.length - 1].content : "");

    if (!userQuery) {
      return res.status(400).json({ error: "Missing message content." });
    }

    const ai = getAIClient();

    // If demo mode is explicitly requested or no API key is available
    if (forceDemo || !ai) {
      const fallbackReply = generateContextualFallback(character, userQuery, emotions, supportStyle, conversationList, isCallMode);
      return res.json({
        reply: fallbackReply,
        source: forceDemo ? "demo-mode" : "demo-fallback",
        model: "scripted-comfort-engine",
        isDemo: true,
        isCallMode: Boolean(isCallMode),
      });
    }

    // Build the tailored system instruction with emotion, character persona, and call mode
    const systemInstruction = buildSystemInstruction(character, emotions, supportStyle, isCallMode);

    // Format conversation history for @google/genai
    const recentHistory = conversationList.slice(-14);
    const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    for (const msg of recentHistory) {
      const role = msg.role === "assistant" || msg.role === "model" ? "model" : "user";
      if (msg.content && msg.content.trim()) {
        contents.push({
          role,
          parts: [{ text: msg.content.trim() }],
        });
      }
    }

    if (contents.length === 0 || contents[contents.length - 1].role !== "user" || contents[contents.length - 1].parts[0].text !== userQuery.trim()) {
      contents.push({
        role: "user",
        parts: [{ text: userQuery.trim() }],
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
      },
    });

    let reply = response.text ? response.text.trim() : "";

    if (!reply) {
      throw new Error("Empty response from Gemini model.");
    }

    // In call mode, clean up any lingering markdown asterisks or emojis for clean TTS
    if (isCallMode) {
      reply = reply.replace(/\*[^*]+\*/g, "").replace(/[\u{1F300}-\u{1F9FF}]/gu, "").trim();
    }

    return res.json({
      reply,
      source: "gemini-live",
      model: "gemini-3.8-flash",
      character,
      emotionsUsed: emotions,
      supportStyle,
      isCallMode: Boolean(isCallMode),
    });
  } catch (error: any) {
    console.warn("[Chat Handler Info]: Using contextual fallback due to:", error?.message || "offline mode");

    const character = req.body?.character || "Shinchan";
    const emotions = req.body?.emotions || [];
    const supportStyle = req.body?.supportStyle || "Gentle Comfort & Hugs";
    const conversationList = (req.body?.messages && req.body?.messages.length > 0) ? req.body.messages : (req.body?.chatHistory || []);
    const query = req.body?.latestMessage || req.body?.message || (conversationList.length > 0 ? conversationList[conversationList.length - 1].content : "");
    const isCallMode = Boolean(req.body?.isCallMode);

    const fallbackReply = generateContextualFallback(character, query, emotions, supportStyle, conversationList, isCallMode);

    return res.json({
      reply: fallbackReply,
      source: "demo-fallback-on-error",
      model: "scripted-comfort-engine",
      isDemo: true,
      isCallMode,
      errorNotice: error?.message ? String(error.message).slice(0, 150) : "Gemini service fallback",
    });
  }
};

// POST /api/chat/stream - Real-time Server-Sent Events streaming endpoint
export const streamHandler = async (req: express.Request, res: express.Response) => {
  const {
    character = "Shinchan",
    emotions = [],
    supportStyle = "Gentle Comfort & Hugs",
    messages = [],
    chatHistory = [],
    latestMessage = "",
    message = "",
    forceDemo = false,
    isCallMode = false,
  }: ChatRequestBody = req.body;

  const conversationList = (messages && messages.length > 0) ? messages : (chatHistory || []);
  const userQuery = latestMessage || message || (conversationList.length > 0 ? conversationList[conversationList.length - 1].content : "");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const ai = getAIClient();

  if (forceDemo || !ai || !userQuery) {
    const fallback = generateContextualFallback(character, userQuery, emotions, supportStyle, conversationList, isCallMode);
    res.write(`data: ${JSON.stringify({ chunk: fallback, isDone: true, source: "demo" })}\n\n`);
    res.write("data: [DONE]\n\n");
    return res.end();
  }

  try {
    const systemInstruction = buildSystemInstruction(character, emotions, supportStyle, isCallMode);
    const recentHistory = conversationList.slice(-14);
    const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    for (const msg of recentHistory) {
      const role = msg.role === "assistant" || msg.role === "model" ? "model" : "user";
      if (msg.content && msg.content.trim()) {
        contents.push({
          role,
          parts: [{ text: msg.content.trim() }],
        });
      }
    }

    if (contents.length === 0 || contents[contents.length - 1].role !== "user" || contents[contents.length - 1].parts[0].text !== userQuery.trim()) {
      contents.push({
        role: "user",
        parts: [{ text: userQuery.trim() }],
      });
    }

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
      },
    });

    for await (const chunk of responseStream) {
      const text = chunk.text || "";
      if (text) {
        res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    return res.end();
  } catch (err: any) {
    console.warn("[Stream Handler Error]:", err?.message);
    const fallback = generateContextualFallback(character, userQuery, emotions, supportStyle, messages, isCallMode);
    res.write(`data: ${JSON.stringify({ chunk: fallback, isDone: true, source: "demo-fallback-on-error" })}\n\n`);
    res.write("data: [DONE]\n\n");
    return res.end();
  }
};

// Mount chat handler at both /api/chat and /chat for Vercel/Express compatibility
app.post(["/api/chat", "/chat"], chatHandler);
app.post(["/api/chat/stream", "/chat/stream"], streamHandler);

// GET /api/health
export const healthHandler = (_req: express.Request, res: express.Response) => {
  res.json({
    status: "ok",
    service: "Shinchan Comfort Corner Backend",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
};

app.get(["/api/health", "/health"], healthHandler);

// Explicit favicon and robots.txt handlers to prevent 500 errors on serverless
app.get("/favicon.ico", (_req, res) => {
  const publicFav = path.join(__dirname, "public", "favicon.ico");
  const rootFav = path.join(__dirname, "favicon.ico");
  if (fs.existsSync(publicFav)) return res.sendFile(publicFav);
  if (fs.existsSync(rootFav)) return res.sendFile(rootFav);
  return res.status(204).end();
});

app.get("/robots.txt", (_req, res) => {
  const publicRobots = path.join(__dirname, "public", "robots.txt");
  const rootRobots = path.join(__dirname, "robots.txt");
  if (fs.existsSync(publicRobots)) return res.sendFile(publicRobots);
  if (fs.existsSync(rootRobots)) return res.sendFile(rootRobots);
  res.type("text/plain").send("User-agent: *\nAllow: /\n");
});

// Serve static frontend files from public/ or root
if (fs.existsSync(path.join(__dirname, "public"))) {
  app.use(express.static(path.join(__dirname, "public")));
}
app.use(express.static(__dirname));

// Route handlers for SPA navigation fallback (safe against missing files)
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }
  const publicIndex = path.join(__dirname, "public", "index.html");
  const rootIndex = path.join(__dirname, "index.html");
  if (fs.existsSync(publicIndex)) return res.sendFile(publicIndex);
  if (fs.existsSync(rootIndex)) return res.sendFile(rootIndex);
  return res.status(200).type("text/html").send("<!DOCTYPE html><html><head><title>Shinchan Comfort Corner</title></head><body><h1>Shinchan Comfort Corner</h1></body></html>");
});

export default app;
