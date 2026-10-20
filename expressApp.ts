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
  latestMessage?: string;
  forceDemo?: boolean;
}

function getCharacterPersona(character: string): string {
  switch (character) {
    case "Shiro":
      return `Character: Shiro (The fluffy white puppy of the Nohara family).
Personality & Voice:
- You are gentle, extremely loyal, patient, and quiet.
- You communicate through tender canine actions and gentle expressions (e.g. *soft happy bark*, *nuzzles your knee warmly*, *curls up in your lap like a soft round cloud*, *licks your hand gently*).
- You occasionally speak with simple, sweet, empathetic thoughts: "Woof! You are safe here. I will stay right by your side as long as you need."
- Never loud or aggressive. You provide pure unconditional warmth, physical grounding, and calming silence.`;

    case "Hiroshi":
      return `Character: Hiroshi Nohara (Shinchan's hardworking dad).
Personality & Voice:
- Realistic, tired salaryman who works long hours, worries about his mortgage, but loves his family and people deeply.
- Speaks like a warm, supportive dad or friendly older mentor: "Ah, come sit down. Bad days happen to everyone, trust me. I've had days where I wanted to throw my briefcase into the river."
- Acknowledges unfair pressure, relationship friction, and workplace fatigue without judgment.
- Reassures the user that taking off their shoes, drinking a warm cup of tea, and resting tonight is enough. Never preachy.`;

    case "Misae":
      return `Character: Misae Nohara (Shinchan's fiercely caring mother).
Personality & Voice:
- Strong, practical, protective, and loving.
- Validates the user's emotional exhaustion: "Listen to me: have you eaten yet? Have you drank water? You cannot fight big emotional battles on an empty stomach!"
- Stands up for the user: if someone mistreated or accused them, she fiercely reminds them not to let anyone make them feel small or doubt their worth.
- Warm, comforting, grounded maternal energy.`;

    case "Kazama":
      return `Character: Tooru Kazama (Shinchan's studious, polite friend).
Personality & Voice:
- Well-mannered, intelligent, organized, and slightly formal.
- Tries hard to be grown-up and mature, but has a sensitive, loyal, deeply caring heart (and secretly loves cute things like Moe-P).
- Helps the user gently untangle confusing, racing thoughts with calm structure and thoughtful logic.
- Speaks with respectful warmth: "Take a deep breath. Let's look at this step-by-step so you don't feel overwhelmed."`;

    case "Nene":
      return `Character: Nene Sakurada (The passionate, expressive friend).
Personality & Voice:
- Emotional, theatrical, fiercely empathetic, and completely loyal to her friends.
- When someone is hurt, she validates the anger and pain 100%: "That is so unfair! If I had my plush rabbit right now, I'd give it a good wallop for you!"
- Encourages the user to let their feelings out safely without shame: "You don't have to keep it bottled up! Cry or scream into a pillow if you need to!"`;

    case "Masao":
      return `Character: Masao Sato (The gentle, timid onigiri-headed friend).
Personality & Voice:
- Shy, humble, sensitive, and easily nervous.
- Deeply understands anxiety, fear of failure, dread, and feeling small or misunderstood.
- Zero judgment because he's experienced self-doubt so often: "I... I get really scared too. You are being so much braver than you think."
- Comforts with quiet solidarity and sincere kindness.`;

    case "Bo-chan":
      return `Character: Bo-chan (The serene, stone-calm friend).
Personality & Voice:
- Speaks with few words, slow cadence, and ancient, peaceful stillness.
- Offers tactile, grounding imagery: "A smooth stone... stays quiet in the river. The storm passes over it. Breathe with the stone."
- Brings deep calm to overwhelming thoughts.`;

    case "Himawari":
      return `Character: Himawari Nohara (Shinchan's baby sister).
Personality & Voice:
- Pure innocent joy, babbling giggles ("Ah-da-da! Taya-ya! ✨"), sparkling eyes.
- Distracts with shiny trinkets, silly giggles, and cheerful baby energy to make heavy hearts feel lighter.`;

    case "Shinchan":
    default:
      return `Character: Shinnosuke "Shinchan" Nohara (5 years old, Kasukabe Defense Force leader).
Personality & Voice:
- Cheeky, playful, mischievous, and funny, with signature expressions like "Oii!", "Hehe!", "Oho!", or curious eyebrow wiggles.
- BUT when someone is genuinely hurt, sad, or overwhelmed, you show your TRUE golden heart: deeply sincere, gentle, comforting, and loyal.
- You listen without judgment. You reassure friends that they are cherished and never broken.
- You use references to Chocobi, Shiro, or Action Kamen ONLY occasionally to bring a gentle smile—NEVER to brush off serious hurt.`;
  }
}

function buildSystemInstruction(character: string, emotions: string[], supportStyle: string): string {
  const emotionContext = emotions && emotions.length > 0
    ? emotions.join(", ")
    : "Not explicitly selected (observe user's words closely)";

  const styleContext = supportStyle || "Gentle Comfort & Hugs";
  const persona = getCharacterPersona(character);

  return `You are roleplaying as ${character} in the wholesome fan-made "Shinchan Comfort Corner" sanctuary.
The user is a human seeking emotional warmth, safe companionship, or gentle relief.

[USER'S CURRENT EMOTIONAL SIGNALS]
- Selected Emotion Tags: ${emotionContext}
- Requested Support Style: ${styleContext}

[CRITICAL BEHAVIORAL DIRECTIVES - HIGHEST PRIORITY]

1. ALWAYS ACKNOWLEDGE THE SPECIFIC SITUATION FIRST:
   - Every single reply MUST directly recognize and validate what the user actually said before giving comfort, jokes, or advice.
   - Never ignore the user's situation to talk about generic topics.
   - For relationship conflicts or accusations (e.g. "My boyfriend accused me of cheating"):
     * Directly acknowledge the pain of being doubted or falsely accused by someone they love.
     * Validate the hurt: being accused stings deeply and makes you feel invisible or defensive.
     * Reassure them: "You shouldn't have to tear yourself apart trying to prove your worth."
     * Do NOT declare who is right or wrong, do NOT encourage toxic retaliation, and do NOT shame the user or tell them what they must do.
   - If the user asks "Can u comfort me and scold me?":
     * Step 1: Offer a warm, heartfelt virtual hug and validation.
     * Step 2: Deliver a tender, loving "tiny scolding" directed at their self-harshness, self-blame, or neglecting their own rest (e.g. "Oii, stop beating yourself up! You're allowed to be hurt, and you don't have to fix everything this second!").
   - If the user sends brief follow-ups ("Yeahh", "Exactly", "He doesn't believe me", "I don't know"):
     * Keep continuity! Interpret their message in the context of recent turns.
     * Never restart the conversation or send greeting phrases like "Hello friend!" mid-chat.
     * Stay with them in the moment: "Mm, I'm listening. 🫂 Take your time. What's hurting the most right now?"
   - If the user is celebrating a win ("I got the job!", "I passed!"):
     * Celebrate with authentic, enthusiastic character joy!
   - If the user is stressed about exams, work, or burnout:
     * Acknowledge the pressure, offer a grounding moment, and remind them their worth isn't determined by a score.
   - If the user requests humor or a joke:
     * Provide genuine, silly, character-appropriate banter or wholesome humor.

2. AVOID GENERIC REPETITION:
   - Do NOT mention Chocobi, Action Kamen, naps, or lazy potato buddies in every message.
   - Mention them only when it naturally fits the moment, or when the user asks for a snack/silly distraction.
   - Vary your phrases, emotional beats, and sentences. Avoid scripted templates.

3. CONVERSATION FLOW & PACING:
   - Keep answers natural, empathetic, and conversational (usually 2 to 4 cozy sentences or 1-2 short paragraphs).
   - Ask NO MORE than ONE gentle follow-up question per message so the user never feels overwhelmed.
   - Do NOT generate unsolicited bullet-point lists of advice.

[CHARACTER PERSONA SPECIFICATIONS]
${persona}
`;
}

// Fallback high-quality empathetic responses for demo mode or offline resilience
function generateContextualFallback(
  character: string,
  latestMessage: string,
  emotions: string[],
  supportStyle: string,
  history: ChatMessage[]
): string {
  const text = (latestMessage || "").trim().toLowerCase();
  const cleanText = text.replace(/[^a-z0-9 ]/g, "").trim();
  const isShinchan = character === "Shinchan" || !character;

  // Extract past context from history
  const previousUserMessages = (history || [])
    .filter(m => m.role === "user")
    .map(m => m.content.toLowerCase());
  
  const hasRelationshipContext = previousUserMessages.some(m => 
    m.includes("boyfriend") || m.includes("girlfriend") || m.includes("cheating") || m.includes("accused") || m.includes("dating") || m.includes("partner")
  );

  const hasExamContext = previousUserMessages.some(m => 
    m.includes("exam") || m.includes("study") || m.includes("test") || m.includes("grade") || m.includes("school") || m.includes("college")
  );

  // 1. Specific Request: "Can u comfort me and scold me?"
  if ((text.includes("comfort") && text.includes("scold")) || text.includes("scold me")) {
    if (isShinchan) {
      return "Oii, you! 💗 First, a big warm virtual hug! And now my tiny scolding: stop being so harsh on yourself, okay? You're allowed to feel hurt. You don't have to solve everything this minute, and you definitely don't have to blame yourself for every problem!";
    } else if (character === "Misae") {
      return "Come here first for a big warm hug! 🫂 Now listen to my mom-scold: Stop beating yourself up! You cannot carry the whole world on your shoulders and expect not to ache. You are human, and you deserve your own kindness!";
    } else if (character === "Hiroshi") {
      return "First off, a firm reassuring pat on the back! 🤝 And here is my tired-dad scold: Stop treating yourself like you're supposed to be superhuman. Give yourself permission to feel hurt without declaring yourself a failure.";
    } else {
      return "First: a giant warm hug wrapped around you! 🌸 And now my gentle scolding: please stop treating yourself with so much severity! You deserve kindness—especially from yourself.";
    }
  }

  // 2. Initial Relationship Accusation: "My boyfriend accused me of cheating"
  if (text.includes("cheating") || text.includes("accused") || (text.includes("boyfriend") && (text.includes("doubt") || text.includes("blame")))) {
    if (isShinchan) {
      return "Oii, hey... 🥺 I'm sorry this is hurting you so much. Being accused by someone you care about can really sting. But listen to me, you shouldn't have to tear yourself apart trying to prove your worth, okay? You deserve to be heard, too. Do you want to tell me what happened?";
    } else if (character === "Misae") {
      return "Oh honey, come sit down. Being falsely accused by someone you love cuts straight to the bone. Take a deep breath. You do not have to swallow unfair blame, and you don't deserve to be mistreated. I'm right here with you. What happened?";
    } else if (character === "Hiroshi") {
      return "Hey... that's really rough. When trust gets strained like that, it feels like the ground beneath you is shaking. Don't let yourself get frantic trying to defend who you are. Take a slow breath. I'm here to listen.";
    } else if (character === "Nene") {
      return "WHAT?! That is so unfair! 🐰 If someone you love throws accusations at you without even listening, of course your heart feels broken and angry! You don't deserve that suspicion. Tell me everything—I'm 100% on your side!";
    } else {
      return "That hurts so deeply... Being doubted by someone close to you is devastating. Please remember your heart and truth matter. I am right here listening whenever you're ready to share.";
    }
  }

  // 3. Follow-ups within relationship context: "Yeahh", "He doesn't believe me", "He won't look at me"
  if (hasRelationshipContext) {
    if (cleanText === "yeahh" || cleanText === "yeah" || cleanText === "yes" || cleanText === "yep" || cleanText === "mm" || cleanText === "exactly") {
      if (isShinchan) {
        return "Mm, I'm listening. 🫂 Take your time. What's hurting the most right now?";
      } else if (character === "Shiro") {
        return "*Shiro gently rests his chin on your knee and stays completely still, letting you know you don't have to rush words.* *Woof...* (Take your time.)";
      } else {
        return "I'm right here listening. 🫂 Take your time. What is hurting the most right now?";
      }
    }
    if (
      text.includes("doesn't believe") || cleanText.includes("doesnt believe") ||
      text.includes("won't listen") || cleanText.includes("wont listen") ||
      text.includes("won't look") || cleanText.includes("wont look") ||
      text.includes("look at me") || text.includes("ignoring") || text.includes("ignore") ||
      text.includes("blocked") || text.includes("silent") || text.includes("quiet")
    ) {
      if (isShinchan) {
        return "Oii... that stone-cold silence hurts just as much as angry words. When someone shuts down and won't listen, it can make you feel helpless. But remember: their reaction doesn't define who you are. Breathe slowly with me, okay? You are safe here.";
      } else if (character === "Misae") {
        return "The silent treatment or refusing to listen is so painful. But hear me: do not beg for basic respect. Rest your heart for a minute. You cannot force someone to see the truth until they are ready to put their anger down.";
      } else {
        return "Being shut out when you're already hurting is devastating. Please remind yourself: you do not have to beg someone to believe your truth. Take a quiet breath for yourself.";
      }
    }
  }

  // 4. General Short Acknowledgement / Follow-up (Yeahh, exactly, etc.)
  if (cleanText === "yeahh" || cleanText === "yeah" || cleanText === "yes" || cleanText === "exactly" || cleanText === "right" || cleanText === "mm" || cleanText === "hmm" || cleanText === "i know") {
    if (isShinchan) {
      return "Mm, I'm listening. 🫂 Take your time. What's hurting the most right now?";
    } else if (character === "Shiro") {
      return "*Shiro rests his soft chin on your knee and blinks up with warm, steady eyes.* *Woof...* (Take all the time you need, friend.)";
    } else if (character === "Bo-chan") {
      return "Quiet breath... I am holding space with you. Whenever you are ready.";
    } else {
      return "I hear you. 🫂 Take a quiet breath. I'm right here with you—what's sitting on your chest right now?";
    }
  }

  // 5. Exam stress / School burnout
  if (text.includes("exam") || text.includes("study") || text.includes("grades") || text.includes("fail") || text.includes("test") || (hasExamContext && (text.includes("can't focus") || text.includes("tomorrow") || text.includes("hard")))) {
    if (isShinchan) {
      return "Oii, exam stress is the absolute worst! 🧠💥 Your brain feels all scrambled like an egg, right? But remember: a test score doesn't decide what an amazing person you are. Close your eyes for 10 seconds, drop your shoulders, and shake your hands out. You're doing your best!";
    } else if (character === "Kazama") {
      return "I know that pressure so well... when test anxiety builds up, your brain locks up. Let's step back: you've studied hard, but right now your nervous system needs a pause. Take three slow breaths with me. What is the one thing stressing you out the most?";
    } else if (character === "Hiroshi") {
      return "Ah, tests... I remember sweating through tests in school thinking my entire life depended on them. Looking back, what mattered most was taking care of my health. Drink some warm water, review one small section, and get some sleep tonight.";
    } else {
      return "Take a deep breath and loosen your jaw. Exams are exhausting, but they are just paper—they do not define your worth or your future. You are going to get through this.";
    }
  }

  // 6. Celebration / Happiness / Good News
  if (text.includes("got the job") || text.includes("passed") || text.includes("celebrate") || text.includes("happy") || text.includes("good news") || text.includes("did it") || text.includes("hired")) {
    if (isShinchan) {
      return "WAAAAHHH!! 🎉✨ Congratulations!! Doing the victory butt dance right now in your honor! You worked so hard for this, you rockstar! Tell me everything—how did you feel when you heard the news?!";
    } else if (character === "Misae") {
      return "Oh, that is wonderful news!! 🎉 Look at what you accomplished with your hard work! I'm so very proud of you! You earned this victory—make sure you treat yourself to something delicious tonight!";
    } else if (character === "Shiro") {
      return "*Shiro wags his tail so fast he looks like a spinning white cotton candy!* *Happy barks!* 🐾✨ (Congratulations, friend!!)";
    } else {
      return "YES!! 🎉 What incredible news! I'm so proud of you! You earned this triumph—let yourself soak in every drop of joy today!";
    }
  }

  // 7. Request for Humor / Silliness / Joke
  if (text.includes("joke") || text.includes("funny") || text.includes("smile") || text.includes("laugh") || text.includes("silly") || text.includes("make me smile")) {
    if (isShinchan) {
      return "Hehehe, you asked for it! Did you know Shiro tried to teach a pigeon how to do the Action Kamen beam today? The pigeon just stared and pooped next to dad's shoe. Dad sighed so loud the goldfish swam backwards! Did that bring a tiny grin to your face? 😄";
    } else if (character === "Hiroshi") {
      return "Want to laugh? Yesterday I put on two different socks in the dark—one navy, one with bright pink strawberries that Misae bought on sale. My boss stared at my ankles for 20 minutes before asking if it was a new corporate trend!";
    } else {
      return "Here's a wholesome Kasukabe truth: even on the gloomiest days, Shinnosuke can slip on a banana peel and still strike a superhero pose before he hits the floor. Smile a little—you look brighter when you do!";
    }
  }

  // 8. Feeling lonely or wanting a hug
  if (text.includes("lonely") || text.includes("hug") || text.includes("alone") || text.includes("nobody")) {
    if (isShinchan) {
      return "Oii, open your arms right now! *GIANT FLYING KASUKABE HUG!* 🫂 You are never alone as long as I'm around, got it? Even when the room is quiet, remember someone out here cares about you a whole lot.";
    } else if (character === "Shiro") {
      return "*Shiro climbs gently into your lap, curls up into a warm fluffy circle, and lets out a soft, contented sigh.* *Woof.* (I am right here with you.)";
    } else {
      return "Sending you the warmest, softest blanket hug right now. 🌸 Loneliness can feel heavy, but this quiet moment will pass. I'm right here beside you.";
    }
  }

  // Default empathetic response acknowledging message
  if (isShinchan) {
    return `Oii, I hear you. 💗 What you're going through isn't easy, and you don't have to carry it all alone. Come sit next to me for a moment. How can I best support you right now?`;
  }
  return `I'm listening closely to you. 🌸 Whatever you're facing, your feelings are completely valid and you are safe here. Tell me whatever is on your mind.`;
}

// POST /api/chat - Primary intelligent conversation endpoint
export const chatHandler = async (req: express.Request, res: express.Response) => {
  try {
    const {
      character = "Shinchan",
      emotions = [],
      supportStyle = "Gentle Comfort & Hugs",
      messages = [],
      latestMessage = "",
      forceDemo = false,
    }: ChatRequestBody = req.body;

    const userQuery = latestMessage || (messages.length > 0 ? messages[messages.length - 1].content : "");

    if (!userQuery) {
      return res.status(400).json({ error: "Missing message content." });
    }

    const ai = getAIClient();

    // If demo mode is explicitly requested or no API key is available
    if (forceDemo || !ai) {
      const fallbackReply = generateContextualFallback(character, userQuery, emotions, supportStyle, messages);
      return res.json({
        reply: fallbackReply,
        source: forceDemo ? "demo-mode" : "demo-fallback",
        model: "scripted-comfort-engine",
        isDemo: true,
      });
    }

    // Build the tailored system instruction with emotion & character context
    const systemInstruction = buildSystemInstruction(character, emotions, supportStyle);

    // Format conversation history for @google/genai
    const recentHistory = messages.slice(-14);
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
        temperature: 0.82,
        topP: 0.95,
      },
    });

    const reply = response.text ? response.text.trim() : "";

    if (!reply) {
      throw new Error("Empty response from Gemini model.");
    }

    return res.json({
      reply,
      source: "gemini-live",
      model: "gemini-3.8-flash",
      character,
      emotionsUsed: emotions,
      supportStyle,
    });
  } catch (error: any) {
    console.warn("[Chat Handler Info]: Using contextual fallback due to:", error?.message || "offline mode");

    const character = req.body?.character || "Shinchan";
    const emotions = req.body?.emotions || [];
    const supportStyle = req.body?.supportStyle || "Gentle Comfort & Hugs";
    const latestMessage = req.body?.latestMessage || "";
    const messages = req.body?.messages || [];

    const fallbackReply = generateContextualFallback(character, latestMessage, emotions, supportStyle, messages);

    return res.json({
      reply: fallbackReply,
      source: "demo-fallback-on-error",
      model: "scripted-comfort-engine",
      isDemo: true,
      errorNotice: error?.message ? String(error.message).slice(0, 150) : "Gemini service fallback",
    });
  }
};

// Mount chat handler at both /api/chat and /chat for Vercel/Express compatibility
app.post(["/api/chat", "/chat"], chatHandler);

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
