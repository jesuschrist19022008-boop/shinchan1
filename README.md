# 🔍 Shinchan's Info Detective
### Digital Dark Spot – AI-Assisted Information Gap & Contradiction Detection Platform
**Official Submission for the SHINCHAN ONLINE HACKATHON 2026**

> *"Don't just find information. Discover what's missing."*

**Shinchan's Info Detective** is an AI-powered technical research and verification platform designed to solve the **Digital Dark Spot** problem. Standard search engines and generative chatbots synthesize what is readily available in texts, often ignoring omissions, conflicting figures, and expired conditions. Info Detective ingests multiple source documents, cross-examines factual claims, identifies critical information gaps, highlights direct cross-source contradictions, flags outdated or undated policies, and generates an actionable, prioritized verification checklist.

---

## 🏆 Hackathon Problem Statement: Digital Dark Spot

When citizens, researchers, and applicants navigate complex guidelines—such as tax credit regulations, municipal tech grants, academic admissions, or legal standards—they encounter:
1. **Omitted Conditions (Dark Spots)**: Documents state benefits or prerequisites, but fail to specify interaction rules, stacking limitations, appeal procedures, or foreign qualifications.
2. **Hidden Contradictions**: Separate agency circulars or overlapping guides publish conflicting income limits, deadlines, or test requirements without cross-referencing.
3. **Temporal Decay**: Guidance documents from previous cycles remain online without clear update dates, misleading readers.
4. **Synthetic Hallucination in AI**: Traditional chatbots guess or invent missing facts rather than highlighting the absence of evidence.

**Shinchan's Info Detective enforces a strict zero-hallucination, evidence-linked verification methodology.**

---

## ✨ Core Platform Features

### 1. Multi-Source Ingestion & Live Webpage Extraction
- Ingest multiple documents per research session with title, URL, publication date, and verbatim text.
- **Direct Webpage Ingestion (`/api/extract-url`)**: Safely fetch and parse live webpage text, stripping scripts, styles, and boilerplate markup. If an article is behind a paywall or blocks crawlers, clear user guidance is provided to paste the text manually—*never pretending an inaccessible URL was analyzed*.

### 2. Dual-Layer AI Research Engine (`gemini-3.8-flash` + Heuristic Fallback)
- **Primary AI Reasoning**: Server-side Google Gemini (`gemini-3.8-flash`) via the modern `@google/genai` TypeScript SDK with strict JSON schema constraints.
- **Deterministic Heuristic Cross-Examiner**: If API keys are unconfigured or rate limits occur, the platform automatically runs a deterministic rule-based NLP engine analyzing the exact submitted source texts. All extracted claims cite exact source IDs and verbatim quotes.

### 3. Information Summary with Evidence Attribution
- Distinguishes **Directly Sourced Facts** (`direct_fact`) from **AI Comparative Synthesis** (`ai_synthesis`).
- Categorizes findings into *Eligibility*, *Dates & Deadlines*, *Financial & Numbers*, and *Procedure & Process*.
- Every finding includes an interactive `[SOURCE-X]` button that opens the raw source text modal with character/word metrics.
- Displays an **Evidence Sufficiency Indicator** (*Sufficient*, *Partial*, or *Insufficient Evidence*).

### 4. Digital Dark Spot (Information Gap) Detection
- Surfaces what authors **failed to specify**: missing eligibility requirements, unaddressed conditions, missing procedures, and unanswered research inquiries.
- Assigns impact ratings (*High*, *Medium*, *Low*) and provides recommended inquiry strategies for human researchers.

### 5. Cross-Source Contradiction Matrix
- Detects mutually incompatible claims across sources (e.g. `$150,000` vs `$135,000` income caps, or mandatory testing vs complete policy waivers).
- Displays side-by-side comparative cards with exact quotes, discrepancy rationale, and concrete verification guidance.

### 6. Temporal Freshness & Outdated Information Audit
- Audits publication dates relative to the active regulatory year (2026).
- Flags past application cycles and expired deadlines.
- **Date Unavailable Rule**: Any source without a publication date is explicitly tagged as *"Date unavailable – verification recommended"*, never falsely assumed current.

### 7. Interactive Actionable Verification Checklist
- Auto-generates prioritized resolution tasks (*High*, *Medium*, *Low*).
- Allows researchers to check off verified items with live percentage progress tracking.
- Interactive priority filters and **One-Click Markdown Checklist Export**.

### 8. Pre-Loaded Hackathon Test Scenarios
Includes 3 pre-configured realistic research cases for instant testing and demonstration:
- **Case 1: Clean Vehicle Tax Credit 2026 & State Rebate Conflict** (discrepant income caps and missing basis deduction rules).
- **Case 2: Kasukabe Tech Subsidy 2026** (conflicting co-funding % and outdated deadlines).
- **Case 3: Autonomous Systems MS Admissions** (GRE permanent waiver vs mandatory test requirement).

---

## 🔒 Security Architecture

- **Server-Side API Key Isolation**: All Gemini API calls occur strictly within the Node.js / Express backend. Private keys are never exposed in browser DOM, scripts, or client bundles.
- **Zero Committed Secrets**: `.gitignore` protects `.env`, `.env.*`, and build artifacts from entering version control.
- **Private Loopback Protection**: URL extractor refuses loopback (`127.0.0.1`, `localhost`, private CIDRs) requests to prevent SSRF vulnerabilities.

---

## 🛠️ Required Environment Variables

Copy the provided `.env.example` to `.env` for local execution:

```bash
cp .env.example .env
```

| Variable | Description | Default | Required |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey) | `""` | Optional (falls back to heuristic evidence engine if missing) |
| `PORT` | Local server port | `3000` | No |

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 20+ or 22+
- npm

### Installation & Execution
```bash
# 1. Clone repository
git clone https://github.com/your-username/shinchan1.git
cd shinchan1

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and supply GEMINI_API_KEY if desired

# 4. Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Typecheck & Linting
```bash
npm run lint
```

---

## 🚀 Deployment to Vercel

This repository is pre-configured for seamless zero-config deployment on **Vercel**:

1. **Push to your GitHub repository**:
   ```bash
   git add .
   git commit -m "Transform to Shinchan's Info Detective Digital Dark Spot platform"
   git push origin main
   ```

2. **Import into Vercel**:
   - Navigate to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
   - Select your GitHub repository.
   - Leave the Framework Preset as **Other** (Vercel automatically handles static file serving and serverless endpoints in `/api`).

3. **Configure Environment Variables in Vercel**:
   - In the project settings, under **Environment Variables**, add:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: `Your_Google_AI_Studio_API_Key`
   - Select Production, Preview, and Development environments.

4. **Deploy**:
   - Click **Deploy**. Vercel will build and serve your applet.
   - API endpoints (`/api/analyze`, `/api/extract-url`, `/api/sample-cases`, `/api/health`) operate as Vercel Serverless Functions.

---

## 📡 API Reference

### `POST /api/analyze`
Executes deep evidence analysis across submitted sources.
- **Request Body**:
  ```json
  {
    "topic": "Clean Vehicle Tax Credit 2026",
    "question": "What are the income thresholds and state rebate rules?",
    "sources": [
      {
        "id": "source-1",
        "title": "Federal Bulletin",
        "url": "https://example.gov",
        "publicationDate": "2026-01-14",
        "content": "Single filer income cap is $150,000..."
      }
    ]
  }
  ```
- **Response**: Full `AnalysisReport` object with executive summary, key findings, information gaps, contradictions, outdated items, and verification checklist.

### `POST /api/extract-url`
Safely scrapes and parses text from a public web page.
- **Request Body**: `{ "url": "https://example.gov/bulletin" }`
- **Response**: `{ "success": true, "title": "...", "publicationDate": "2026-01-14", "content": "..." }`

### `GET /api/sample-cases`
Returns pre-packaged hackathon research scenarios for instant demonstration.

### `GET /api/health`
Health check endpoint reporting service status, active version, and Gemini API configuration state.

---

## 📜 License & Hackathon Notice

*Shinchan's Info Detective* is an original technical project built for the **Shinchan Online Hackathon 2026**. Character names and thematic references are utilized as an homage to the Kasukabe Defense Force for creative presentation purposes. All analysis algorithms, gap detection paradigms, and verification protocols are engineered independently.