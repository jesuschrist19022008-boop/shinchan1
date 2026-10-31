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
app.use(express.json({ limit: "4mb" }));

// Helper to get GoogleGenAI client with active server-side key
function getAIClient(): GoogleGenAI | null {
  const key = (process.env.GEMINI_API_KEY || "").trim();
  if (!key || key === "TODO" || key === "your_api_key_here" || key === "undefined" || key.length < 8) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export type VerificationStatusLabel =
  | "Supported by available sources"
  | "Conflicting evidence found"
  | "Insufficient evidence"
  | "Potentially outdated"
  | "Not independently verified";

export interface ResearchSourceInput {
  id: string;
  title: string;
  url?: string;
  publicationDate?: string;
  content: string;
  authorOrOrg?: string;
}

export interface AnalyzeRequestBody {
  topic: string;
  question?: string;
  questions?: string[];
  sources: ResearchSourceInput[];
  strictEvidenceMode?: boolean;
}

export interface KeyFinding {
  id: string;
  category: "Eligibility" | "Dates & Deadlines" | "Financial & Numbers" | "Procedure & Process" | "General";
  claim: string;
  extractedQuote: string;
  sourceId: string;
  sourceTitle: string;
  sourceUrl?: string;
  type: "direct_fact" | "ai_synthesis";
  confidence: "High" | "Medium" | "Low";
  verificationStatus: VerificationStatusLabel;
}

export interface InformationGap {
  id: string;
  category: "Missing Procedure" | "Unanswered Question" | "Missing Eligibility" | "Omitted Date" | "Conditions Not Specified" | "Scope Limitation";
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  unansweredQuestion: string;
  recommendedInquiry: string;
  affectedSources: string[];
}

export interface Contradiction {
  id: string;
  category: "Conflicting Requirements" | "Discrepant Dates" | "Inconsistent Numbers" | "Contradictory Instructions" | "Differing Criteria";
  topic: string;
  claimA: {
    claim: string;
    sourceId: string;
    sourceTitle: string;
    quote: string;
  };
  claimB: {
    claim: string;
    sourceId: string;
    sourceTitle: string;
    quote: string;
  };
  analysisOfDiscrepancy: string;
  verificationGuidance: string;
}

export interface OutdatedInformation {
  id: string;
  sourceId: string;
  sourceTitle: string;
  detectedDate: string;
  status: "Potentially Expired" | "Previous Cycle" | "Date unavailable – verification recommended" | "Current";
  riskLevel: "High" | "Medium" | "Low";
  details: string;
  recommendedAction: string;
}

export interface UnverifiedClaim {
  id: string;
  claim: string;
  sourceId: string;
  sourceTitle: string;
  reason: string;
  recommendedVerification: string;
}

export interface VerificationItem {
  id: string;
  priority: "High" | "Medium" | "Low";
  actionItem: string;
  rationale: string;
  linkedSourceIds: string[];
  status: "pending" | "verified";
}

export interface DetectiveNotes {
  shinchanChiefVerdict: string;
  kazamaAnalysis: string;
  neneActionPlan: string;
  bochanHiddenClue: string;
  masaoCaution: string;
}

export interface AnalysisReport {
  id: string;
  topic: string;
  question: string;
  analyzedAt: string;
  engine: string;
  isAiPowered: boolean;
  sourceCount: number;
  sources: ResearchSourceInput[];
  executiveSummary: {
    directFactsOverview: string;
    aiSynthesis: string;
    evidenceSufficiency: "Sufficient" | "Partial" | "Insufficient evidence";
    overallTrustNote: string;
  };
  detectiveNotes: DetectiveNotes;
  keyFindings: KeyFinding[];
  informationGaps: InformationGap[];
  contradictions: Contradiction[];
  outdatedInformation: OutdatedInformation[];
  unverifiedClaims: UnverifiedClaim[];
  verificationChecklist: VerificationItem[];
  statistics: {
    sourcesAnalyzed: number;
    directFactsCount: number;
    informationGapsCount: number;
    contradictionsCount: number;
    outdatedWarningsCount: number;
    unverifiedClaimsCount: number;
    verificationItemsCount: number;
  };
}

// -------------------------------------------------------------
// Pre-Loaded Hackathon Test Scenarios
// -------------------------------------------------------------
export const SAMPLE_CASES = [
  {
    id: "case-ev-tax-credit-2026",
    title: "Clean Vehicle Tax Credit 2026 & State Rebate Conflict",
    topic: "2026 Clean Vehicle Federal Tax Credit & State Clean Energy Rebate Eligibility",
    question: "What are the exact income thresholds, battery sourcing limits, and whether state rebates stack with federal credits without reducing basis?",
    sources: [
      {
        id: "source-1",
        title: "Federal Energy Revenue Bulletin (Revised Jan 2026)",
        url: "https://example.gov/clean-energy/tax-credit-2026",
        publicationDate: "2026-01-14",
        authorOrOrg: "Federal Revenue Office",
        content: `Under the Clean Vehicle Incentive Program for tax year 2026, buyers of qualified new clean electric vehicles may receive up to $7,500 in nonrefundable credits at the point of sale.
Modified Adjusted Gross Income (MAGI) caps are strictly enforced: $150,000 for single filers, $225,000 for heads of household, and $300,000 for married filing jointly.
To qualify for the full $7,500 credit, 70% of critical battery minerals must be extracted or processed in North America or a free trade agreement partner country.
The maximum manufacturer suggested retail price (MSRP) is capped at $55,000 for passenger cars and $80,000 for vans, SUVs, and pickup trucks.
Delivery must occur within the 2026 calendar year. Buyers must provide their Social Security Number or ITIN to the dealer at the time of purchase.
The bulletin does not address state rebate coordination or how local clean air vouchers interact with the federal basis calculation.`
      },
      {
        id: "source-2",
        title: "Regional Clean Transportation Coalition Guide 2025/2026",
        url: "https://example.org/regional-clean-transportation/ev-incentive-guide",
        publicationDate: "2024-11-20",
        authorOrOrg: "Regional Transportation Board",
        content: `Drivers upgrading to zero-emission passenger cars in 2025-2026 can claim up to $5,000 in regional rebates and stack them with federal incentives.
According to regional guidelines, the single filer income ceiling is set at $135,000 to prioritize low-to-moderate-income families.
IMPORTANT: State clean vehicle rebates must be deducted from the vehicle purchase price before calculating any federal credit allowances, preventing double dipping.
All applications must be submitted by December 15, 2025. Vehicle must be registered in the home district for at least 36 consecutive months.
Notice: Application filing requires submitting form RT-404 alongside the dealer sales receipt within 30 days of vehicle delivery.`
      },
      {
        id: "source-3",
        title: "Consumer Automotive Advisory Newsletter",
        url: "https://example.com/auto-insights/ev-credit-myths",
        publicationDate: "", // Deliberately undated
        authorOrOrg: "Automotive Consumer Watch",
        content: `Many prospective EV drivers believe federal tax credits can be rolled over to future tax years if their tax liability is less than $7,500. This is incorrect—credits transferred to registered dealers at point-of-sale are treated as immediate discounts, even if total federal income tax liability is zero.
Battery component manufacturing rules require 60% North American assembly in current regulations.
Beware that certain commercial lease loopholes allow non-compliant imported vehicles to qualify through dealer lease pass-throughs.`
      }
    ]
  },
  {
    id: "case-kasukabe-smart-grant-2026",
    title: "Kasukabe Urban Tech Innovation Grant 2026",
    topic: "Kasukabe Municipal SME Technology Adoption Subsidy 2026",
    question: "What is the deadline, co-funding percentage, and required employee headcount for the 2026 Smart City Grant?",
    sources: [
      {
        id: "source-1",
        title: "Kasukabe City Commerce & Industry Department Circular #41",
        url: "https://kasukabe-city.example.jp/sme/grants-2026",
        publicationDate: "2026-02-01",
        authorOrOrg: "Kasukabe Municipal Commerce Bureau",
        content: `The 2026 Kasukabe Small Business Digitalization Support Subsidy covers up to 66.6% (two-thirds) of eligible equipment and cloud software expenses up to 3,000,000 JPY.
Eligible applicants must be registered corporate entities or sole proprietors operating primarily within Kasukabe City with 50 or fewer regular employees.
Application round 1 deadline is Friday, May 15, 2026 at 17:00 JST.
All claims require submitting tax compliance certificates for fiscal years 2024 and 2025.
The circular does not state whether cloud subscriptions renewing after December 2026 can be pre-paid using grant funds.`
      },
      {
        id: "source-2",
        title: "Saitama Prefectural Business Federation Bulletin",
        url: "https://saitama-sme.example.jp/bulletin/2025-overview",
        publicationDate: "2025-03-10",
        authorOrOrg: "Prefectural SME Alliance",
        content: `Municipal tech grants across the Kasukabe and Koshigaya regions provide 50% co-funding for digital transformation.
Businesses with up to 100 employees are qualified to participate.
Applications close annually on April 30. Retroactive expenses incurred prior to formal grant approval are non-reimbursable under any circumstances.`
      }
    ]
  },
  {
    id: "case-graduate-admissions-2026",
    title: "Autonomous Systems MS Admissions & Funding 2026/27",
    topic: "University Graduate Admissions Requirements, Deadlines, & GRE Waiver Criteria",
    question: "Is the GRE test strictly required for 2026 applicants, what is the minimum GPA, and when is the departmental fellowship priority deadline?",
    sources: [
      {
        id: "source-1",
        title: "Department of Robotics & Autonomous Systems 2026 Handbook",
        url: "https://university.example.edu/robotics/admissions-2026",
        publicationDate: "2025-10-15",
        authorOrOrg: "Graduate Admissions Committee",
        content: `For Fall 2026 matriculation, all MS applicants must possess a minimum undergraduate cumulative GPA of 3.3/4.0 in engineering, computer science, or applied mathematics.
The Graduate Record Examination (GRE) general test is permanently waived for all domestic and international applicants. GRE scores submitted voluntarily will not be reviewed by the admissions committee.
The priority deadline for departmental research assistantships and merit fellowships is December 1, 2025.
Final international application deadline is February 15, 2026.
English language proficiency requirement: TOEFL iBT minimum score 100 or IELTS 7.5.
No details are provided regarding whether three-year European Bologna bachelor's degrees meet undergraduate prerequisite equivalency.`
      },
      {
        id: "source-2",
        title: "Central Graduate School Prospectus & General Catalog",
        url: "https://university.example.edu/gradschool/admissions-catalog",
        publicationDate: "2024-08-01",
        authorOrOrg: "Central University Graduate Studies",
        content: `All applicants seeking graduate admission to the College of Science and Engineering must submit official GRE General Test scores taken within the last 5 years. Quantitative scores below the 70th percentile require departmental petition.
The minimum university-wide GPA threshold for consideration is 3.0.
Applications received after January 15 will be reviewed on a space-available basis without fellowship consideration.`
      }
    ]
  }
];

// -------------------------------------------------------------
// Safe Web Page Content Extractor
// -------------------------------------------------------------
export async function extractUrlContent(url: string): Promise<{
  success: boolean;
  title?: string;
  publicationDate?: string;
  content?: string;
  error?: string;
  advice?: string;
}> {
  if (!url || typeof url !== "string") {
    return { success: false, error: "Invalid URL string provided.", advice: "Please enter a valid HTTP/HTTPS URL or paste source text directly." };
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { success: false, error: "Unsupported URL protocol. Only HTTP and HTTPS are permitted.", advice: "Please verify the web address." };
    }
  } catch {
    return { success: false, error: "Malformed URL syntax.", advice: "Check for typos or copy and paste the article text manually." };
  }

  // Guard against private/internal IP access (SSRF protection)
  const hostname = parsed.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    return {
      success: false,
      error: "Access to private or local loopback addresses is prohibited for security.",
      advice: "Please test with public web URLs or paste text directly.",
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(parsed.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 ShinchanInfoDetective/1.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        success: false,
        error: `Target server returned HTTP ${response.status} (${response.statusText || "Request failed"})`,
        advice: "This webpage may be behind a paywall, require authentication, or block automated readers. Please copy and paste the article text directly into the Source Content box.",
      };
    }

    const rawText = await response.text();

    if (!rawText || rawText.trim().length === 0) {
      return {
        success: false,
        error: "Webpage returned empty response body.",
        advice: "The page may require client-side JavaScript rendering (SPA). Please copy the visible text from your browser and paste it directly.",
      };
    }

    // Extract Title
    let title = "";
    const titleMatch = rawText.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/\s+/g, " ").trim();
    }
    if (!title) {
      const ogTitleMatch = rawText.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
      if (ogTitleMatch && ogTitleMatch[1]) title = ogTitleMatch[1].trim();
    }
    if (!title) {
      title = parsed.hostname;
    }

    // Attempt to extract publication date from meta tags
    let publicationDate = "";
    const dateMetaRegexes = [
      /<meta\s+property=["']article:published_time["']\s+content=["']([^"']+)["']/i,
      /<meta\s+name=["']pubdate["']\s+content=["']([^"']+)["']/i,
      /<meta\s+name=["']date["']\s+content=["']([^"']+)["']/i,
      /<time[^>]*datetime=["']([^"']+)["']/i,
    ];
    for (const rx of dateMetaRegexes) {
      const match = rawText.match(rx);
      if (match && match[1]) {
        const candidate = match[1].slice(0, 10);
        if (/^\d{4}-\d{2}-\d{2}$/.test(candidate)) {
          publicationDate = candidate;
          break;
        }
      }
    }

    // Strip HTML scripts, styles, comments, SVG, nav, footer, headers
    let clean = rawText
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ")
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, " ")
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, " ")
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\s+/g, " ")
      .trim();

    if (clean.length < 60) {
      return {
        success: false,
        error: "Extracted content is too short or blocked by dynamic client-side rendering.",
        advice: "Modern SPAs often require user interaction or JavaScript execution to display text. Please copy the text from the browser tab and paste it directly.",
      };
    }

    if (clean.length > 12000) {
      clean = clean.slice(0, 12000) + "... [Content truncated for analysis]";
    }

    return {
      success: true,
      title,
      publicationDate,
      content: clean,
    };
  } catch (err: any) {
    const isTimeout = err?.name === "AbortError" || err?.code === "ETIMEDOUT";
    return {
      success: false,
      error: isTimeout ? "Connection timed out after 7 seconds." : (err?.message || "Network error fetching webpage."),
      advice: "The target website may block automated crawlers, require a VPN, or be temporarily unresponsive. Please copy and paste the article text manually.",
    };
  }
}

// -------------------------------------------------------------
// Heuristic Deterministic Evidence Analyzer (Zero-Hallucination Fallback)
// -------------------------------------------------------------
export function runHeuristicEvidenceAnalysis(
  topic: string,
  question: string,
  sources: ResearchSourceInput[]
): AnalysisReport {
  const now = new Date().toISOString();
  const keyFindings: KeyFinding[] = [];
  const informationGaps: InformationGap[] = [];
  const contradictions: Contradiction[] = [];
  const outdatedInformation: OutdatedInformation[] = [];
  const unverifiedClaims: UnverifiedClaim[] = [];
  const verificationChecklist: VerificationItem[] = [];

  let kfCount = 1;
  let gapCount = 1;
  let conCount = 1;
  let outCount = 1;
  let verCount = 1;
  let unvCount = 1;

  // 1. Audit Publication Dates & Freshness
  const currentYear = 2026;
  sources.forEach((s) => {
    const rawDate = (s.publicationDate || "").trim();
    if (!rawDate) {
      outdatedInformation.push({
        id: `out-${outCount++}`,
        sourceId: s.id,
        sourceTitle: s.title,
        detectedDate: "None provided",
        status: "Date unavailable – verification recommended",
        riskLevel: "Medium",
        details: `Source "${s.title}" does not specify a publication or revision date. Regulatory conditions or eligibility rules may have changed.`,
        recommendedAction: `Verify publication date with the issuing author or official source (${s.authorOrOrg || "publisher"}).`,
      });

      verificationChecklist.push({
        id: `vc-${verCount++}`,
        priority: "Medium",
        actionItem: `Confirm effective publication and update date for "${s.title}"`,
        rationale: "Undated source cannot be verified for current 2026 applicability without temporal metadata.",
        linkedSourceIds: [s.id],
        status: "pending",
      });
    } else {
      const yearMatch = rawDate.match(/\b(19\d\d|20\d\d)\b/);
      if (yearMatch) {
        const year = parseInt(yearMatch[1], 10);
        if (year < currentYear - 1) {
          outdatedInformation.push({
            id: `out-${outCount++}`,
            sourceId: s.id,
            sourceTitle: s.title,
            detectedDate: rawDate,
            status: year < currentYear - 2 ? "Potentially Expired" : "Previous Cycle",
            riskLevel: "High",
            details: `Source was published in ${year}, prior to the 2026 regulatory period. Guidelines, thresholds, or deadlines may be obsolete.`,
            recommendedAction: `Check if an updated 2026 bulletin or addendum has been released to supersede this guidance.`,
          });

          verificationChecklist.push({
            id: `vc-${verCount++}`,
            priority: "High",
            actionItem: `Cross-check ${year} rules in "${s.title}" against official 2026 amendments`,
            rationale: `Outdated guidelines from ${year} may mislead applicants regarding deadlines and eligibility caps.`,
            linkedSourceIds: [s.id],
            status: "pending",
          });
        }
      }
    }
  });

  // 2. Extract Key Direct Facts from each source
  sources.forEach((s) => {
    const sentences = s.content
      .split(/(?<=[.?!])\s+/)
      .map((st) => st.trim())
      .filter((st) => st.length > 25);

    const informativeSentences = sentences.filter((st) =>
      /\$|\b\d{1,3}(,\d{3})*|\b(eligible|maximum|minimum|deadline|must|cap|threshold|waiver|require|fee|reimburse|credit|benefit)\b/i.test(st)
    );

    const candidates = informativeSentences.length > 0 ? informativeSentences.slice(0, 3) : sentences.slice(0, 2);

    candidates.forEach((sentence, idx) => {
      let category: KeyFinding["category"] = "General";
      if (/deadline|date|month|year|until|by\s+[A-Z]/i.test(sentence)) category = "Dates & Deadlines";
      else if (/\$|\b\d+%\b|\b(cap|amount|cost|credit|rebate|subsidy|jpy|yen|usd)\b/i.test(sentence)) category = "Financial & Numbers";
      else if (/eligible|qualif|requirement|income|employee|citizen|resident/i.test(sentence)) category = "Eligibility";
      else if (/submit|form|apply|application|procedure|process|certificate|portal/i.test(sentence)) category = "Procedure & Process";

      const hasDateWarning = outdatedInformation.some((o) => o.sourceId === s.id);
      let verificationStatus: VerificationStatusLabel = "Supported by available sources";
      if (hasDateWarning) verificationStatus = "Potentially outdated";
      else if (sources.length === 1 || idx > 1) verificationStatus = "Not independently verified";

      keyFindings.push({
        id: `kf-${kfCount++}`,
        category,
        claim: sentence.length > 180 ? sentence.slice(0, 177) + "..." : sentence,
        extractedQuote: sentence,
        sourceId: s.id,
        sourceTitle: s.title,
        sourceUrl: s.url,
        type: "direct_fact",
        confidence: "High",
        verificationStatus,
      });

      // Single source claims become unverified claims
      if (verificationStatus === "Not independently verified") {
        unverifiedClaims.push({
          id: `unv-${unvCount++}`,
          claim: sentence.slice(0, 150),
          sourceId: s.id,
          sourceTitle: s.title,
          reason: "Claim is only attested in this single source and has not been corroborated by an independent second authority.",
          recommendedVerification: "Cross-examine with official primary records or regulatory circulars.",
        });
      }
    });
  });

  // 3. Detect Cross-Source Contradictions (Numeric, Currency, Percentage, Dates, or Policy discrepancies)
  if (sources.length >= 2) {
    const moneyRegex = /(?:Rs\.?|₹|\$|€|£)\s?[\d,]+(?:\.\d+)?/gi;
    const percentRegex = /\b\d{1,3}(?:\.\d+)?%/g;
    const dateRegex = /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember))\s+\d{1,2}(?:,\s+\d{4})?/gi;

    // Currency discrepancies
    const sourceMonies: Array<{ sourceId: string; title: string; amounts: string[]; rawText: string }> = [];
    // Percentage discrepancies
    const sourcePercents: Array<{ sourceId: string; title: string; percents: string[]; rawText: string }> = [];
    // Date discrepancies
    const sourceDates: Array<{ sourceId: string; title: string; dates: string[]; rawText: string }> = [];

    sources.forEach((s) => {
      const moneyMatches = s.content.match(moneyRegex);
      if (moneyMatches && moneyMatches.length > 0) {
        sourceMonies.push({
          sourceId: s.id,
          title: s.title,
          amounts: Array.from(new Set(moneyMatches)),
          rawText: s.content,
        });
      }

      const percentMatches = s.content.match(percentRegex);
      if (percentMatches && percentMatches.length > 0) {
        sourcePercents.push({
          sourceId: s.id,
          title: s.title,
          percents: Array.from(new Set(percentMatches)),
          rawText: s.content,
        });
      }

      const dateMatches = s.content.match(dateRegex);
      if (dateMatches && dateMatches.length > 0) {
        sourceDates.push({
          sourceId: s.id,
          title: s.title,
          dates: Array.from(new Set(dateMatches)),
          rawText: s.content,
        });
      }
    });

    if (sourceMonies.length >= 2) {
      const diffA = sourceMonies[0].amounts;
      const diffB = sourceMonies[1].amounts;
      const uniqueToA = diffA.filter((a) => !diffB.includes(a));
      const uniqueToB = diffB.filter((b) => !diffA.includes(b));

      if (uniqueToA.length > 0 && uniqueToB.length > 0) {
        const sentA = sourceMonies[0].rawText.split(/(?<=[.?!])\s+/).find((st) => st.includes(uniqueToA[0])) || `Specified: ${uniqueToA.join(", ")}`;
        const sentB = sourceMonies[1].rawText.split(/(?<=[.?!])\s+/).find((st) => st.includes(uniqueToB[0])) || `Specified: ${uniqueToB.join(", ")}`;

        contradictions.push({
          id: `con-${conCount++}`,
          category: "Inconsistent Numbers",
          topic: "Financial threshold or incentive cap discrepancy",
          claimA: {
            claim: sentA.trim(),
            sourceId: sourceMonies[0].sourceId,
            sourceTitle: sourceMonies[0].title,
            quote: sentA.trim(),
          },
          claimB: {
            claim: sentB.trim(),
            sourceId: sourceMonies[1].sourceId,
            sourceTitle: sourceMonies[1].title,
            quote: sentB.trim(),
          },
          analysisOfDiscrepancy: `Source 1 cites ${uniqueToA[0]} whereas Source 2 cites ${uniqueToB[0]}. This discrepancy may reflect differing jurisdictional levels (e.g. government state quota vs college circular) or outdated program revisions.`,
          verificationGuidance: `Consult the most recent statutory circular or official program portal to confirm which cap governs the exact scenario.`,
        });

        // Mark related key findings as conflicting
        keyFindings.forEach((kf) => {
          if (kf.claim.includes(uniqueToA[0]) || kf.claim.includes(uniqueToB[0])) {
            kf.verificationStatus = "Conflicting evidence found";
          }
        });

        verificationChecklist.push({
          id: `vc-${verCount++}`,
          priority: "High",
          actionItem: `Resolve monetary conflict between ${uniqueToA[0]} ("${sourceMonies[0].title}") and ${uniqueToB[0]} ("${sourceMonies[1].title}")`,
          rationale: "Conflicting numbers directly impact budgeting, tax compliance, or application eligibility.",
          linkedSourceIds: [sourceMonies[0].sourceId, sourceMonies[1].sourceId],
          status: "pending",
        });
      }
    }

    // Percentage discrepancies (e.g., 75% vs 80% attendance)
    if (sourcePercents.length >= 2) {
      const pDiffA = sourcePercents[0].percents;
      const pDiffB = sourcePercents[1].percents;
      const pUniqueToA = pDiffA.filter((p) => !pDiffB.includes(p));
      const pUniqueToB = pDiffB.filter((p) => !pDiffA.includes(p));

      if (pUniqueToA.length > 0 && pUniqueToB.length > 0) {
        const sentA = sourcePercents[0].rawText.split(/(?<=[.?!])\s+/).find((st) => st.includes(pUniqueToA[0])) || `Requires: ${pUniqueToA.join(", ")}`;
        const sentB = sourcePercents[1].rawText.split(/(?<=[.?!])\s+/).find((st) => st.includes(pUniqueToB[0])) || `Requires: ${pUniqueToB.join(", ")}`;

        contradictions.push({
          id: `con-${conCount++}`,
          category: "Conflicting Requirements",
          topic: "Threshold & Minimum Percentage Requirement Conflict",
          claimA: {
            claim: sentA.trim(),
            sourceId: sourcePercents[0].sourceId,
            sourceTitle: sourcePercents[0].title,
            quote: sentA.trim(),
          },
          claimB: {
            claim: sentB.trim(),
            sourceId: sourcePercents[1].sourceId,
            sourceTitle: sourcePercents[1].title,
            quote: sentB.trim(),
          },
          analysisOfDiscrepancy: `Source 1 mandates ${pUniqueToA[0]} whereas Source 2 specifies ${pUniqueToB[0]}. Applicants relying on the lower percentage risk administrative rejection or withheld benefits.`,
          verificationGuidance: `Check the governing state statute or regulatory department notice to verify which minimum threshold is binding.`,
        });

        keyFindings.forEach((kf) => {
          if (kf.claim.includes(pUniqueToA[0]) || kf.claim.includes(pUniqueToB[0])) {
            kf.verificationStatus = "Conflicting evidence found";
          }
        });

        verificationChecklist.push({
          id: `vc-${verCount++}`,
          priority: "High",
          actionItem: `Reconcile percentage difference between ${pUniqueToA[0]} ("${sourcePercents[0].title}") and ${pUniqueToB[0]} ("${sourcePercents[1].title}")`,
          rationale: "Discrepancy in minimum attendance or score thresholds can lead to disqualification.",
          linkedSourceIds: [sourcePercents[0].sourceId, sourcePercents[1].sourceId],
          status: "pending",
        });
      }
    }

    // Date / Deadline discrepancies (e.g., March 31 vs March 15)
    if (sourceDates.length >= 2) {
      const dDiffA = sourceDates[0].dates;
      const dDiffB = sourceDates[1].dates;
      const dUniqueToA = dDiffA.filter((d) => !dDiffB.includes(d));
      const dUniqueToB = dDiffB.filter((d) => !dDiffA.includes(d));

      if (dUniqueToA.length > 0 && dUniqueToB.length > 0) {
        const sentA = sourceDates[0].rawText.split(/(?<=[.?!])\s+/).find((st) => st.includes(dUniqueToA[0])) || `Cites date: ${dUniqueToA.join(", ")}`;
        const sentB = sourceDates[1].rawText.split(/(?<=[.?!])\s+/).find((st) => st.includes(dUniqueToB[0])) || `Cites date: ${dUniqueToB.join(", ")}`;

        contradictions.push({
          id: `con-${conCount++}`,
          category: "Discrepant Dates",
          topic: "Submission Deadline or Effective Date Inconsistency",
          claimA: {
            claim: sentA.trim(),
            sourceId: sourceDates[0].sourceId,
            sourceTitle: sourceDates[0].title,
            quote: sentA.trim(),
          },
          claimB: {
            claim: sentB.trim(),
            sourceId: sourceDates[1].sourceId,
            sourceTitle: sourceDates[1].title,
            quote: sentB.trim(),
          },
          analysisOfDiscrepancy: `Source 1 cites ${dUniqueToA[0]} while Source 2 states ${dUniqueToB[0]}. One may be an internal institutional cut-off prior to the central portal deadline, or a superseded schedule.`,
          verificationGuidance: `Verify whether the earlier deadline is an institutional routing cutoff and ensure timely submission before both dates.`,
        });

        keyFindings.forEach((kf) => {
          if (kf.claim.includes(dUniqueToA[0]) || kf.claim.includes(dUniqueToB[0])) {
            kf.verificationStatus = "Conflicting evidence found";
          }
        });

        verificationChecklist.push({
          id: `vc-${verCount++}`,
          priority: "High",
          actionItem: `Confirm effective deadline: ${dUniqueToA[0]} vs ${dUniqueToB[0]}`,
          rationale: "Missing the earlier date may result in rejection by intermediary processing offices.",
          linkedSourceIds: [sourceDates[0].sourceId, sourceDates[1].sourceId],
          status: "pending",
        });
      }
    }

    // Check for Waiver vs Mandatory Testing conflict
    const mentionsWaiver = sources.some((s) => /waiv(ed|er)|not reviewed|optional/i.test(s.content));
    const mentionsMandatory = sources.some((s) => /mandatory|must submit|required general/i.test(s.content));
    if (mentionsWaiver && mentionsMandatory) {
      const sWaiver = sources.find((s) => /waiv(ed|er)|not reviewed|optional/i.test(s.content))!;
      const sMandatory = sources.find((s) => /mandatory|must submit|required general/i.test(s.content))!;
      if (sWaiver.id !== sMandatory.id) {
        const sentW = sWaiver.content.split(/(?<=[.?!])\s+/).find((st) => /waiv|optional|not reviewed/i.test(st)) || "Waiver granted.";
        const sentM = sMandatory.content.split(/(?<=[.?!])\s+/).find((st) => /mandatory|must submit|required/i.test(st)) || "Mandatory requirement.";

        contradictions.push({
          id: `con-${conCount++}`,
          category: "Conflicting Requirements",
          topic: "Mandatory requirement vs complete policy waiver",
          claimA: {
            claim: sentW.trim(),
            sourceId: sWaiver.id,
            sourceTitle: sWaiver.title,
            quote: sentW.trim(),
          },
          claimB: {
            claim: sentM.trim(),
            sourceId: sMandatory.id,
            sourceTitle: sMandatory.title,
            quote: sentM.trim(),
          },
          analysisOfDiscrepancy: `One source declares the requirement waived while another lists it as compulsory. Typically caused by departmental updates lagging behind general catalog revisions.`,
          verificationGuidance: `Contact the graduate/program coordinator directly in writing to confirm if departmental waiver supersedes central catalog text.`,
        });

        verificationChecklist.push({
          id: `vc-${verCount++}`,
          priority: "High",
          actionItem: `Verify whether test/licensing waiver in "${sWaiver.title}" supersedes requirement in "${sMandatory.title}"`,
          rationale: "Unconfirmed testing requirements can cause applicants to waste examination fees or forfeit admission.",
          linkedSourceIds: [sWaiver.id, sMandatory.id],
          status: "pending",
        });
      }
    }
  }

  // 4. Identify Information Gaps (Digital Dark Spots)
  const combinedContent = sources.map((s) => s.content.toLowerCase()).join(" ");
  const questionText = (question || topic).toLowerCase();

  const standardCheckGaps = [
    {
      keyword: "stack|combin|deduct|coordinat",
      gapTitle: "Interaction & Stacking Between Multiple Programs",
      question: "How do these grants/credits interact with other local or federal benefits?",
      description: "Sources provide isolated rules but omit explicit guidance on whether benefits stack additively or reduce the qualifying tax/funding basis.",
      impact: "High" as const,
      recommendation: "Request an official written interpretation from program administrators regarding program stacking.",
    },
    {
      keyword: "appeal|dispute|reject|audit",
      gapTitle: "Dispute, Rejection, and Appeal Protocols",
      question: "What recourse or administrative review process exists if a claim or application is rejected?",
      description: "None of the provided sources outline dispute mechanisms, grace periods, or appeal filing windows.",
      impact: "Medium" as const,
      recommendation: "Consult administrative procedure acts or request procedural guidelines from the issuing agency.",
    },
    {
      keyword: "foreign|international|non-citizen|visa|bologna",
      gapTitle: "International or Non-Resident Eligibility Criteria",
      question: "Are non-citizens, international graduates, or out-of-district entities eligible?",
      description: "Eligibility provisions are framed generically without clarifying prerequisite equivalency or residency restrictions.",
      impact: "Medium" as const,
      recommendation: "Check secondary institutional bulletins for specialized non-resident eligibility schedules.",
    },
  ];

  standardCheckGaps.forEach((g) => {
    const rx = new RegExp(g.keyword, "i");
    if (!rx.test(combinedContent) || (rx.test(questionText) && !rx.test(combinedContent))) {
      informationGaps.push({
        id: `gap-${gapCount++}`,
        category: "Missing Procedure",
        title: g.gapTitle,
        description: g.description,
        impact: g.impact,
        unansweredQuestion: g.question,
        recommendedInquiry: g.recommendation,
        affectedSources: sources.map((s) => s.id),
      });

      verificationChecklist.push({
        id: `vc-${verCount++}`,
        priority: g.impact,
        actionItem: `Investigate missing information regarding: ${g.gapTitle}`,
        rationale: g.description,
        linkedSourceIds: sources.map((s) => s.id),
        status: "pending",
      });
    }
  });

  if (unverifiedClaims.length > 0 && verificationChecklist.length === 0) {
    unverifiedClaims.slice(0, 3).forEach((u) => {
      verificationChecklist.push({
        id: `vc-${verCount++}`,
        priority: "Medium",
        actionItem: `Corroborate single-source statement: "${u.claim.slice(0, 80)}"`,
        rationale: u.reason || "Statement appears in only one document without independent corroboration.",
        linkedSourceIds: [u.sourceId],
        status: "pending",
      });
    });
  }

  const totalWordCount = combinedContent.split(/\s+/).length;
  let evidenceSufficiency: "Sufficient" | "Partial" | "Insufficient evidence" = "Sufficient";
  if (totalWordCount < 60) {
    evidenceSufficiency = "Insufficient evidence";
  } else if (totalWordCount < 200 || informationGaps.length >= 3) {
    evidenceSufficiency = "Partial";
  }

  const directFactsOverview = `Extracted ${keyFindings.length} directly cited factual claims across ${sources.length} submitted sources regarding "${topic}". Primary covered areas include ${Array.from(new Set(keyFindings.map((f) => f.category))).join(", ") || "program parameters"}.`;

  const aiSynthesis = `Cross-examination identified ${contradictions.length} potential contradiction(s) and ${informationGaps.length} critical information gap(s) (Digital Dark Spots). Notable missing details relate to procedural escalation and inter-program coordination. Evidence completeness is rated as ${evidenceSufficiency}.`;

  const detectiveNotes: DetectiveNotes = {
    shinchanChiefVerdict: `Oho! Chief Detective Shinchan's Verdict: We found some juicy clues, but someone left big blanks in the mystery! Watch out for conflicting numbers and make sure to double-check the rules before taking Action Kamen leaps!`,
    kazamaAnalysis: `Evidence Analyst Kazama's Assessment: Sources exhibit critical variance in regulatory thresholds and dates. Notice that without cross-referencing primary amendments, applicants risk fatal non-compliance.`,
    neneActionPlan: `Investigation Manager Nene's Plan: We have identified ${verificationChecklist.length} action items. Treat the high-priority verification checklist as your required next steps!`,
    bochanHiddenClue: `Clue Finder Bo-chan's Observation: The stones beneath the surface are silent. Key details like appeal deadlines and inter-program stacking are completely omitted from the text.`,
    masaoCaution: `Research Assistant Masao's Warning: W-We shouldn't assume undated claims are safe! Always verify claims that only appear in a single source!`,
  };

  return {
    id: `report-${Date.now()}`,
    topic,
    question: question || "Comprehensive cross-source gap and contradiction audit.",
    analyzedAt: now,
    engine: "heuristic-evidence-engine",
    isAiPowered: false,
    sourceCount: sources.length,
    sources: sources.map((s) => ({ ...s })),
    executiveSummary: {
      directFactsOverview,
      aiSynthesis,
      evidenceSufficiency,
      overallTrustNote:
        sources.length < 2
          ? "Single source analyzed. Cross-source contradiction detection requires at least 2 distinct sources for comparative synthesis."
          : "Comparative synthesis performed directly on verbatim source texts. All cited quotes link to corresponding records.",
    },
    detectiveNotes,
    keyFindings,
    informationGaps,
    contradictions,
    outdatedInformation,
    unverifiedClaims,
    verificationChecklist,
    statistics: {
      sourcesAnalyzed: sources.length,
      directFactsCount: keyFindings.length,
      informationGapsCount: informationGaps.length,
      contradictionsCount: contradictions.length,
      outdatedWarningsCount: outdatedInformation.length,
      unverifiedClaimsCount: unverifiedClaims.length,
      verificationItemsCount: verificationChecklist.length,
    },
  };
}

// -------------------------------------------------------------
// AI-Powered Deep Gemini Research Analysis
// -------------------------------------------------------------
export async function runGeminiResearchAnalysis(
  topic: string,
  question: string,
  sources: ResearchSourceInput[]
): Promise<AnalysisReport> {
  const ai = getAIClient();
  if (!ai) {
    console.log("[Info Detective] No GEMINI_API_KEY detected. Running deterministic heuristic evidence analyzer.");
    return runHeuristicEvidenceAnalysis(topic, question, sources);
  }

  const sourcesSummary = sources
    .map(
      (s, idx) => `
========================================
SOURCE ${idx + 1} ID: [${s.id}]
TITLE: "${s.title}"
URL: ${s.url || "N/A"}
PUBLICATION DATE: ${s.publicationDate || "NOT PROVIDED"}
AUTHOR/ORGANIZATION: ${s.authorOrOrg || "N/A"}
CONTENT:
${s.content}
========================================
`
    )
    .join("\n");

  const systemInstruction = `You are "Shinchan's Info Detective", the core AI reasoning engine for the Digital Dark Spot – AI-Assisted Information Gap Detection Platform for the SHINCHAN ONLINE HACKATHON 2026.

YOUR MISSION:
Analyze source documents submitted by researchers to detect what is MISSING (Information Gaps / Digital Dark Spots), what is IN CONFLICT (Cross-Source Contradictions), what is POTENTIALLY EXPIRED (Outdated Information), and compile a high-utility Verification Checklist with detective character insights.

CRITICAL ETHICAL & TRANSPARENCY CONSTRAINTS (HIGHEST PRIORITY):
1. ZERO HALLUCINATION OF EVIDENCE: Never invent facts, URLs, dates, numbers, or quotes. Every finding must directly cite an actual Source ID and include verbatim extracted quotes from the provided text.
2. VERIFICATION LABELS: Assign each finding one of these exact verification status labels:
   - "Supported by available sources" (when corroborated by clear evidence)
   - "Conflicting evidence found" (when another source contradicts it)
   - "Insufficient evidence" (when evidence is too weak or missing)
   - "Potentially outdated" (when publication date is old or expired)
   - "Not independently verified" (when only asserted by one source without corroboration)
3. INSUFFICIENT EVIDENCE VISIBILITY: If a question is unanswered by the sources, DO NOT make up an answer. Explicitly categorize it as an "Information Gap" and state "Insufficient evidence in provided sources".
4. CONTRADICTIONS: Only flag contradictions that genuinely exist between provided sources. For each conflict, show Claim A with quote and Claim B with quote.
5. OUTDATED AUDIT: Any source without a publication date MUST be categorized with status "Date unavailable – verification recommended", NOT assumed to be from today. Current year context is 2026.
6. DETECTIVE AGENCY CHARACTERS: Include witty, sharp detective notes from:
   - Shinchan (Chief Detective)
   - Kazama (Evidence Analyst)
   - Nene (Investigation Manager)
   - Bo-chan (Clue Finder)
   - Masao (Research Assistant)

OUTPUT FORMAT:
You MUST respond with valid JSON adhering EXACTLY to the following schema:
{
  "executiveSummary": {
    "directFactsOverview": "string",
    "aiSynthesis": "string",
    "evidenceSufficiency": "Sufficient" | "Partial" | "Insufficient evidence",
    "overallTrustNote": "string"
  },
  "detectiveNotes": {
    "shinchanChiefVerdict": "string",
    "kazamaAnalysis": "string",
    "neneActionPlan": "string",
    "bochanHiddenClue": "string",
    "masaoCaution": "string"
  },
  "keyFindings": [
    {
      "id": "kf-1",
      "category": "Eligibility" | "Dates & Deadlines" | "Financial & Numbers" | "Procedure & Process" | "General",
      "claim": "string",
      "extractedQuote": "string (verbatim quote from source)",
      "sourceId": "string (matching source ID like source-1)",
      "type": "direct_fact" | "ai_synthesis",
      "confidence": "High" | "Medium" | "Low",
      "verificationStatus": "Supported by available sources" | "Conflicting evidence found" | "Insufficient evidence" | "Potentially outdated" | "Not independently verified"
    }
  ],
  "informationGaps": [
    {
      "id": "gap-1",
      "category": "Missing Procedure" | "Unanswered Question" | "Missing Eligibility" | "Omitted Date" | "Conditions Not Specified" | "Scope Limitation",
      "title": "string (short dark spot headline)",
      "description": "string (what is missing and why it creates ambiguity)",
      "impact": "High" | "Medium" | "Low",
      "unansweredQuestion": "string (the exact question that remains unanswered)",
      "recommendedInquiry": "string (how the researcher should follow up)",
      "affectedSources": ["string (source IDs)"]
    }
  ],
  "contradictions": [
    {
      "id": "con-1",
      "category": "Conflicting Requirements" | "Discrepant Dates" | "Inconsistent Numbers" | "Contradictory Instructions" | "Differing Criteria",
      "topic": "string (what the conflict is about)",
      "claimA": {
        "claim": "string",
        "sourceId": "string",
        "quote": "string (verbatim quote)"
      },
      "claimB": {
        "claim": "string",
        "sourceId": "string",
        "quote": "string (verbatim quote)"
      },
      "analysisOfDiscrepancy": "string",
      "verificationGuidance": "string"
    }
  ],
  "outdatedInformation": [
    {
      "id": "out-1",
      "sourceId": "string",
      "detectedDate": "string",
      "status": "Potentially Expired" | "Previous Cycle" | "Date unavailable – verification recommended" | "Current",
      "riskLevel": "High" | "Medium" | "Low",
      "details": "string",
      "recommendedAction": "string"
    }
  ],
  "unverifiedClaims": [
    {
      "id": "unv-1",
      "claim": "string",
      "sourceId": "string",
      "reason": "string",
      "recommendedVerification": "string"
    }
  ],
  "verificationChecklist": [
    {
      "id": "vc-1",
      "priority": "High" | "Medium" | "Low",
      "actionItem": "string",
      "rationale": "string",
      "linkedSourceIds": ["string"],
      "status": "pending"
    }
  ]
}
`;

  const userPrompt = `
RESEARCH TOPIC: ${topic}
PRIMARY RESEARCH QUESTION(S): ${question || "Analyze all sources for information gaps, cross-source contradictions, outdated information, and verification steps."}

SUBMITTED SOURCES (${sources.length} total):
${sourcesSummary}

Please conduct a thorough Digital Dark Spot comparative analysis and return ONLY the JSON object.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text ? response.text.trim() : "";
    if (!rawText) throw new Error("Empty response from Gemini.");

    const parsed = JSON.parse(rawText);
    const sourceMap = new Map(sources.map((s) => [s.id, s]));

    const keyFindings: KeyFinding[] = (parsed.keyFindings || []).map((kf: any, i: number) => {
      const src = sourceMap.get(kf.sourceId);
      return {
        id: kf.id || `kf-${i + 1}`,
        category: kf.category || "General",
        claim: kf.claim || "Fact claim",
        extractedQuote: kf.extractedQuote || "",
        sourceId: kf.sourceId || (sources[0]?.id ?? "source-1"),
        sourceTitle: src ? src.title : "Source",
        sourceUrl: src?.url,
        type: kf.type || "direct_fact",
        confidence: kf.confidence || "High",
        verificationStatus: kf.verificationStatus || "Supported by available sources",
      };
    });

    const informationGaps: InformationGap[] = (parsed.informationGaps || []).map((gap: any, i: number) => ({
      id: gap.id || `gap-${i + 1}`,
      category: gap.category || "Missing Procedure",
      title: gap.title || "Unspecified Gap",
      description: gap.description || "",
      impact: gap.impact || "Medium",
      unansweredQuestion: gap.unansweredQuestion || "",
      recommendedInquiry: gap.recommendedInquiry || "",
      affectedSources: Array.isArray(gap.affectedSources) && gap.affectedSources.length > 0 ? gap.affectedSources : sources.map((s) => s.id),
    }));

    const contradictions: Contradiction[] = (parsed.contradictions || []).map((con: any, i: number) => {
      const srcA = sourceMap.get(con.claimA?.sourceId);
      const srcB = sourceMap.get(con.claimB?.sourceId);
      return {
        id: con.id || `con-${i + 1}`,
        category: con.category || "Conflicting Requirements",
        topic: con.topic || "Cross-Source Discrepancy",
        claimA: {
          claim: con.claimA?.claim || "",
          sourceId: con.claimA?.sourceId || "source-1",
          sourceTitle: srcA ? srcA.title : "Source A",
          quote: con.claimA?.quote || "",
        },
        claimB: {
          claim: con.claimB?.claim || "",
          sourceId: con.claimB?.sourceId || "source-2",
          sourceTitle: srcB ? srcB.title : "Source B",
          quote: con.claimB?.quote || "",
        },
        analysisOfDiscrepancy: con.analysisOfDiscrepancy || "",
        verificationGuidance: con.verificationGuidance || "",
      };
    });

    const outdatedInformation: OutdatedInformation[] = (parsed.outdatedInformation || []).map((out: any, i: number) => {
      const src = sourceMap.get(out.sourceId);
      return {
        id: out.id || `out-${i + 1}`,
        sourceId: out.sourceId || "source-1",
        sourceTitle: src ? src.title : "Source",
        detectedDate: out.detectedDate || src?.publicationDate || "None provided",
        status: out.status || (src?.publicationDate ? "Current" : "Date unavailable – verification recommended"),
        riskLevel: out.riskLevel || "Medium",
        details: out.details || "",
        recommendedAction: out.recommendedAction || "Verify currency with publisher.",
      };
    });

    const unverifiedClaims: UnverifiedClaim[] = (parsed.unverifiedClaims || []).map((unv: any, i: number) => {
      const src = sourceMap.get(unv.sourceId);
      return {
        id: unv.id || `unv-${i + 1}`,
        claim: unv.claim || "",
        sourceId: unv.sourceId || "source-1",
        sourceTitle: src ? src.title : "Source",
        reason: unv.reason || "Single source uncorroborated claim.",
        recommendedVerification: unv.recommendedVerification || "Cross-reference with second source.",
      };
    });

    const verificationChecklist: VerificationItem[] = (parsed.verificationChecklist || []).map((vc: any, i: number) => ({
      id: vc.id || `vc-${i + 1}`,
      priority: vc.priority || "Medium",
      actionItem: vc.actionItem || "Verify requirement",
      rationale: vc.rationale || "",
      linkedSourceIds: Array.isArray(vc.linkedSourceIds) ? vc.linkedSourceIds : sources.map((s) => s.id),
      status: "pending" as const,
    }));

    const detectiveNotes: DetectiveNotes = {
      shinchanChiefVerdict: parsed.detectiveNotes?.shinchanChiefVerdict || "Chief Detective Shinchan found multiple clues and dark spots in the evidence!",
      kazamaAnalysis: parsed.detectiveNotes?.kazamaAnalysis || "Evidence Analyst Kazama recommends auditing conflicting requirements before drawing conclusions.",
      neneActionPlan: parsed.detectiveNotes?.neneActionPlan || "Investigation Manager Nene has cataloged key verification missions.",
      bochanHiddenClue: parsed.detectiveNotes?.bochanHiddenClue || "Clue Finder Bo-chan spotted subtle unstated conditions in the documentation.",
      masaoCaution: parsed.detectiveNotes?.masaoCaution || "Research Assistant Masao urges careful cross-checking of single-source statements.",
    };

    const report: AnalysisReport = {
      id: `report-${Date.now()}`,
      topic,
      question: question || "Comprehensive cross-source gap and contradiction audit.",
      analyzedAt: new Date().toISOString(),
      engine: "gemini-3.8-flash",
      isAiPowered: true,
      sourceCount: sources.length,
      sources: sources.map((s) => ({ ...s })),
      executiveSummary: {
        directFactsOverview: parsed.executiveSummary?.directFactsOverview || "Direct facts extracted from source materials.",
        aiSynthesis: parsed.executiveSummary?.aiSynthesis || "Comparative cross-source analysis performed.",
        evidenceSufficiency: parsed.executiveSummary?.evidenceSufficiency || "Sufficient",
        overallTrustNote: parsed.executiveSummary?.overallTrustNote || "Analyzed with Gemini 3.8 Flash model.",
      },
      detectiveNotes,
      keyFindings,
      informationGaps,
      contradictions,
      outdatedInformation,
      unverifiedClaims,
      verificationChecklist,
      statistics: {
        sourcesAnalyzed: sources.length,
        directFactsCount: keyFindings.length,
        informationGapsCount: informationGaps.length,
        contradictionsCount: contradictions.length,
        outdatedWarningsCount: outdatedInformation.length,
        unverifiedClaimsCount: unverifiedClaims.length,
        verificationItemsCount: verificationChecklist.length,
      },
    };

    return report;
  } catch (err: any) {
    console.warn("[Gemini Analysis Warning]: Gemini API call failed or schema parsing error. Reverting to deterministic heuristic engine. Error:", err?.message);
    const fallbackReport = runHeuristicEvidenceAnalysis(topic, question, sources);
    fallbackReport.executiveSummary.overallTrustNote = `Notice: Gemini API service temporarily unavailable (${err?.message ? String(err.message).slice(0, 80) : "fallback active"}). Analysis conducted via server-side deterministic evidence cross-examiner.`;
    return fallbackReport;
  }
}

// -------------------------------------------------------------
// API Route Handlers
// -------------------------------------------------------------

export const analyzeHandler = async (req: express.Request, res: express.Response) => {
  try {
    const { topic, question = "", questions = [], sources = [] }: AnalyzeRequestBody = req.body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({ error: "Missing required 'topic' field." });
    }

    if (!Array.isArray(sources) || sources.length === 0) {
      return res.status(400).json({ error: "At least one source must be provided for research analysis." });
    }

    const validSources: ResearchSourceInput[] = sources
      .map((s, idx) => ({
        id: s.id || `source-${idx + 1}`,
        title: (s.title || `Source ${idx + 1}`).trim(),
        url: (s.url || "").trim(),
        publicationDate: (s.publicationDate || "").trim(),
        authorOrOrg: (s.authorOrOrg || "").trim(),
        content: (s.content || "").trim(),
      }))
      .filter((s) => s.content.length > 0);

    if (validSources.length === 0) {
      return res.status(400).json({
        error: "All submitted sources contained empty content. Please paste or fetch text content before analyzing.",
      });
    }

    const compiledQuestion = question || (Array.isArray(questions) && questions.length > 0 ? questions.join("; ") : "");
    const report = await runGeminiResearchAnalysis(topic.trim(), compiledQuestion.trim(), validSources);
    return res.json(report);
  } catch (error: any) {
    console.error("[Analyze Handler Error]:", error);
    return res.status(500).json({
      error: "Internal server error analyzing research sources.",
      details: error?.message || "Unknown error",
    });
  }
};

export const extractUrlHandler = async (req: express.Request, res: express.Response) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: "Missing 'url' parameter in request body." });
    }
    const result = await extractUrlContent(url);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: "Unexpected server error during URL extraction.",
      advice: "Please copy and paste the text manually.",
    });
  }
};

export const sampleCasesHandler = (_req: express.Request, res: express.Response) => {
  return res.json({
    cases: SAMPLE_CASES,
    count: SAMPLE_CASES.length,
  });
};

export const healthHandler = (_req: express.Request, res: express.Response) => {
  res.json({
    status: "ok",
    service: "Shinchan's Info Detective Backend",
    hackathon: "SHINCHAN ONLINE HACKATHON 2026",
    problemStatement: "DIGITAL DARK SPOT – AI-Assisted Information Gap Detection Platform",
    tagline: "Every mystery has a clue. Every information gap has a detective!",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
};

export const chatHandler = async (req: express.Request, res: express.Response) => {
  return res.json({
    reply: `Welcome to Shinchan's Info Detective! We have upgraded from casual chat to an AI-powered Information Gap & Contradiction Detection platform for the SHINCHAN ONLINE HACKATHON 2026. Please enter your research topic and add your sources in the dashboard to begin an investigation.`,
    service: "Shinchan's Info Detective",
    isInfoDetective: true,
  });
};

// Mount API routes
app.post(["/api/analyze", "/analyze"], analyzeHandler);
app.post(["/api/extract-url", "/extract-url"], extractUrlHandler);
app.get(["/api/sample-cases", "/sample-cases"], sampleCasesHandler);
app.get(["/api/health", "/health"], healthHandler);
app.post(["/api/chat", "/chat"], chatHandler);

// Favicon and robots.txt handlers
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

// Route handlers for SPA navigation fallback
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }
  const publicIndex = path.join(__dirname, "public", "index.html");
  const rootIndex = path.join(__dirname, "index.html");
  if (fs.existsSync(publicIndex)) return res.sendFile(publicIndex);
  if (fs.existsSync(rootIndex)) return res.sendFile(rootIndex);
  return res.status(200).type("text/html").send("<!DOCTYPE html><html><head><title>Shinchan's Info Detective</title></head><body><h1>Shinchan's Info Detective</h1></body></html>");
});

export default app;
