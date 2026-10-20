# 🖍️ Shinchan Comfort Corner

> *“Your worth doesn't decrease because someone fails to see it.”* — Kasukabe Law #1 🌸

**Shinchan Comfort Corner** is a wholesome, emotionally intelligent mental wellness sanctuary inspired by the heartwarming animated slice-of-life storytelling of *Crayon Shin-chan*. When life feels heavy, overwhelming, or lonely, step into Kasukabe for gentle listening, unconditional warmth, and playful reassurance.

---

## ✨ Features

- **9 Kasukabe Companions**: Talk with **Shinchan**, gentle **Shiro**, hardworking **Hiroshi (Dad)**, protective **Misae (Mom)**, thoughtful **Kazama**, passionate **Nene**, timid **Masao**, steady **Bo-chan**, or giggly **Himawari**.
- **11 Emotion Check-in Tags**: Express how you truly feel without pressure (`🌧️ Heavy & Tired`, `✨ Needing A Hug`, `⚡ Overwhelmed`, `💔 Heartbroken / Hurt`, `🌪️ Anxious`, etc.).
- **5 Tailored Support Styles**: Choose between *Gentle Comfort & Hugs*, *Playful Banter & Smiles*, *Comfort + Tiny Scolding* (stop beating yourself up!), *Deep Quiet Listening*, and *Realistic Encouragement*.
- **Emotionally Intelligent Gemini Chat**:
  - Context-aware conversations powered server-side by Google Gemini (`gemini-3.8-flash`).
  - Directly addresses the user's actual situation and pain points (e.g. relationship accusations, exam burnout, loneliness, celebrations) before offering comfort or humor.
  - Remembers conversational flow across multi-turn follow-ups (*"Yeahh"*, *"He doesn't believe me"*).
  - Spares repetitive tropes; focuses on genuine human validation.
- **Fun Zone**:
  - 🌻 **Little Wins Garden**: Plant flowers celebrating tiny everyday triumphs (drinking water, getting out of bed, surviving a hard conversation).
  - 🎨 **Mood Meme Maker**: Turn heavy thoughts into a warm laugh with custom Kasukabe comic panels.
  - 🍪 **Chocobi Fortunes**: Snap open star cookies for gentle daily reminders.
- **Soothing Utilities**:
  - 🌬️ **Mood Reset**: Guided 4-4-4 sinusoidal breathing circle for physical grounding.
  - 🎶 **Calm Vibes**: Ambient pentatonic lo-fi chords generated locally in the browser via Web Audio API (no external audio files needed).
- **Safety First**: Directory of free, 24/7 crisis helplines and mental wellness resources.

---

## 🔒 Security Architecture

- **Server-Side API Execution**: All calls to the Google Gemini API occur strictly on the backend. Private API keys are never exposed to the client bundle or browser DOM.
- **Zero Committed Secrets**: `.gitignore` strictly protects `.env`, `.env.*`, and temporary credential files from ever entering git history.
- **Offline / Demo Resilience**: If no API key is supplied or during offline usage, the app seamlessly falls back to a clearly labelled local scripted comfort engine without crashing.

---

## 🛠️ Required Environment Variables

Copy the provided `.env.example` to `.env` for local development:

```bash
cp .env.example .env
```

| Variable | Description | Default | Required |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Your Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey) | `""` | Yes (for live AI chat) |
| `PORT` | Local development port | `3000` | No |

> ⚠️ **Never commit `.env` containing real keys to GitHub or public repositories.**

---

## 💻 Local Development

### Prerequisites
- Node.js 20+ or 22+
- npm (or bun / pnpm)

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/shinchan-comfort-corner.git
   cd shinchan-comfort-corner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY` into `.env`.

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Typecheck & Linting**:
   ```bash
   npm run lint
   ```

---

## 🚀 Deployment to Vercel

This repository is pre-configured for instant zero-configuration deployment to [Vercel](https://vercel.com):

1. **Push to GitHub**:
   Ensure `.env` is **not** committed (`.gitignore` handles this automatically).
   ```bash
   git add .
   git commit -m "Prepare Shinchan Comfort Corner for deployment"
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
   - Select your GitHub repository.
   - Leave the Framework Preset as **Other** (Vercel automatically detects the static root and `/api` serverless functions).

3. **Set Environment Variables in Vercel**:
   - Under **Environment Variables**, add:
     - **Name**: `GEMINI_API_KEY`
     - **Value**: `Your_Actual_Gemini_API_Key`
   - Apply to Production, Preview, and Development.

4. **Deploy**:
   - Click **Deploy**. Vercel will build and launch your live URL.
   - The frontend will be served at the root, and the backend routes (`/api/chat`, `/api/health`) will run on Vercel Serverless Functions via `api/index.ts`.

---

## 📜 Disclaimer & Tribute

*Shinchan Comfort Corner* is an independent, non-commercial fan tribute created for emotional comfort, mindfulness, and wholesome smiles. It is not affiliated with or endorsed by Yoshito Usui, Futabasha, or Shin-ei Animation.

*This application does not provide medical or clinical therapy. If you or someone you know is in crisis, please reach out to local emergency services or free crisis helplines listed in the Safety section.*