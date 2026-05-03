# Product Specification — ABC Mobility Intelligence

**Version:** 1.0  
**Author:** Zheng Li Lim  
**Date:** May 2026  
**Status:** Assessment prototype

---

## 1. Problem Statement

ABC's leadership and strategy teams have no dedicated channel for automotive market intelligence. News relevant to ABC's vehicle distribution business — covering its brand partners, operating markets, and competitive position — is fragmented across general automotive publications, regional business press, and OEM announcements. There is no mechanism that filters this noise to what specifically matters to ABC, translates it into business implications, or assigns a required action.

The result is that strategic decisions are made either with incomplete market context or based on whatever individual team members happened to read that week.

ABC Mobility Intelligence addresses this by producing a structured, fortnightly brief that surfaces only the news relevant to ABC's markets and brand positions, classifies it by topic and urgency, and tells the reader what to do about it.

---

## 2. Users

**Primary readers:** ABC's Chief Strategy Officer and Chairman.  
**Secondary readers:** Country heads, commercial directors, brand leads within the strategy and business development functions.

The brief is designed for a 15-minute read. The executive summary is the primary entry point. Full cards are available for readers who want the detail on a specific item.

---

## 3. Scope

### In scope

- Automotive news with a direct or explicit indirect bearing on ABC's vehicle distribution business
- Geographies: Middle East (Saudi Arabia, UAE, Turkey, Egypt, Morocco, GCC) and Europe (UK, Germany, France, Italy, Spain, Poland, Pan-Europe)
- ABC's three operating business units: ABC Motors (vehicle distribution), Automotive Aftermarket, ABC Financial Services

### Out of scope

- News relevant only to markets where ABC has no confirmed presence
- General macroeconomic or geopolitical news without a stated automotive implication
- US, Asia-Pacific, or Latin America unless a specific MENA or Europe impact is stated
- Real-time data: this version is a static prototype. All content is hardcoded.

---

## 4. Features

### 4.1 Fortnightly Edition

Each edition covers a two-week period. It contains:

- An executive summary rendered as bullet points, one per key development, with the required action for ABC as the final bullet
- A highlights list (all items grouped by region, each linking to its full card)
- Up to 12 full intelligence cards
- A key actions callout rendered as red bullet points, one per Act & Escalate item, showing the actionText for each

The 12-item limit is deliberate. More than 12 items at card depth exceeds a 15-minute read and dilutes the signal-to-noise ratio for a Chairman-level audience. Items are selected for relevance score and coverage across the six topic areas.

**Past editions** are stored in the browser's local storage and accessible via the sidebar. This allows the reader to track developments across fortnights without requiring a backend or database.

---

### 4.2 Intelligence Card

The core unit of content. Each card contains the following fields:

| Field | Description |
|---|---|
| `headline` | Rewritten to be action-oriented. Maximum 15 words. Not a copy of the original article title. |
| `source` | Publication name, linked to the original article URL. |
| `publishedAt` | Publication date. |
| `geographies` | One or more regions or countries. Used for geographic filtering. |
| `areasOfInterest` | One or more of the six topic categories. Used for topic filtering. |
| `summary` | Two sentences. The MENA or Europe angle is stated explicitly, not implied. |
| `relevance` | Integer 1–5. Scored relative to ABC's confirmed brand and market positions. |
| `actionType` | One of: FYI, Assess, Act & Escalate. |
| `actionText` | One sentence. What ABC should specifically do. Active voice. |
| `soWhat` | One sentence. Names the ABC business unit. States a concrete implication. |
| `factCheck` | Object: confidence level (High / Medium / Low), flag (boolean), note (one sentence). |
| `csoReview` | Object: verdict (Keep / Revise / Remove), reason (one sentence). |

**Relevance scoring (1–5):** See section 4.10 for the full scoring criteria.

**Why the So What panel exists:** Most intelligence products stop at the summary. The gap is the translation step — what does this news mean for this specific organisation, for this specific business unit. The So What field forces that translation into every item, so the reader gets an actionable implication rather than a rephrased headline.

---

### 4.3 Action Classification

Every item is assigned one of three action levels:

| Level | Colour | Definition |
|---|---|---|
| FYI | Grey | For awareness only. No decision or action required now. |
| Assess | Gold | Warrants analysis before the next planning decision. May become Act & Escalate if the situation develops. |
| Act & Escalate | Red | Requires a response from senior leadership. Time-sensitive or high-impact. |

The three-level system maps to the cognitive model of a busy executive: items that need filing, items that need thinking, and items that need acting on. More granular classification (e.g., five levels) was considered and rejected — the distinction between adjacent levels becomes subjective and the value of the classification collapses.

---

### 4.4 Topic Categories (Areas of Interest)

Six fixed categories. Every item is assigned at least one.

| Category | Colour | Covers |
|---|---|---|
| Regulations | Prussian Blue | Emissions rules, government mandates, tariffs, import policy |
| Competition | Motorsport Red | Rival brand moves, new market entrants, market share shifts |
| Product Innovation | ABC Steel | New vehicle launches, technology developments, platform announcements |
| Retail Innovation | ABC Gold | Dealership models, digital sales channels, customer experience |
| Supply Chain | Shuttle Grey | Manufacturing, logistics, sourcing disruptions |
| Other Interesting News | Robin Egg | Broader developments with indirect ABC relevance |

Items can span multiple categories. The Hongqi-Stellantis story, for example, is classified under both Competition and Regulations because local manufacturing is both a competitive move and a tariff-avoidance strategy.

---

### 4.5 Geographic Filter

The filter supports selection by individual country or by region (Middle East / Europe). Multiple selections can be combined. The item count and executive summary update in response to active filters so the reader knows at a glance what they are seeing relative to the full edition.

---

### 4.6 Fact Check Layer

A rule-based check runs on each item before it appears in the edition. It assesses:

- Internal consistency: does the summary contradict the headline or the geography tag?
- Geography plausibility: is the stated geography consistent with the content?
- Brand-market plausibility: is the referenced brand active in the stated market?

Items that fail one or more checks are flagged with an amber border and a note. The editor can dismiss the flag or remove the item. Items are not automatically suppressed — the flag is a signal, not a veto.

**Design decision:** A fully automated suppression system was considered. It was rejected because the checks can produce false positives on nuanced items (e.g., a story about a brand expanding into a new market it does not yet operate in). Human review of flagged items is faster and more accurate than tuning suppression logic for edge cases.

---

### 4.7 CSO Review Layer

A rule-based simulation of the Chief Strategy Officer's editorial standard. It applies four tests to each item:

1. Is the so-what vague or does it name a specific ABC business unit?
2. Does the actionText state something specific, or is it generic?
3. Would this item matter in a 15-minute Chairman briefing?
4. Is the language direct, or does it hedge behind consulting phrases?

Items that fail return one of two verdicts:

- **Revise:** The item is retained but flagged with an amber banner and the specific reason for the flag. The editor should update the so-what or action text before publishing.
- **Remove:** The item is struck through and queued for removal. The editor confirms or restores.

**Why this layer exists:** The primary failure mode of intelligence briefings is vague so-whats — "this is relevant to ABC and should be monitored" rather than "ABC Motors Turkey should revise its H2 BEV order by June given the Q1 demand signal." The CSO review layer catches this pattern before it reaches the reader.

---

### 4.8 Sales Data Tab

European passenger car registration data, sourced from best-selling-cars.com (which compiles ACEA figures). Coverage: EU, EFTA, and UK. Years: 2023, 2024, 2025. Passenger vehicles only.

Brands tracked: Toyota, Lexus, BYD, MG, Volkswagen, Stellantis, Renault, Hyundai, and others relevant to ABC's competitive position.

**Two views:**
- Volume: total registrations by brand and year
- Market share: brand share of total registrations in the selected market

**Filters:** by country and by brand. When the By Brand view is active, the country filter is disabled — brand registration data is aggregated across Europe as a whole and is not broken down by individual country. A full data table sits below the chart for readers who want the underlying numbers.

**Why sales data sits in the same tool:** ABC's vehicle distribution business is exposed to OEM market share trends. A Toyota distributor in Turkey needs to understand whether Toyota's European share is growing or contracting — that is a forward indicator for the product allocation and pricing negotiations that shape ABC's own business economics. Separating sales intelligence from news intelligence forces a reconciliation step that the brief eliminates by holding both in one view.

---

### 4.9 Email Export

The Share as Email button generates a formatted HTML newsletter from the current view — including any active filters. The output includes:

- Header with the ABC brand mark and edition date
- Executive summary with teal left border
- Numbered highlights list
- Full article cards with all fields
- Disclaimer footer

The newsletter preserves the same visual hierarchy as the web brief, so it reads consistently whether the recipient uses the app or receives the email.

---

### 4.10 Item Selection and Ordering Criteria

The edition contains 12 items. The process for getting from the full universe of published articles to those 12 follows four stages. This process applies both when content is written manually (this prototype) and when it is generated by an AI classification agent (production).

---

**Stage 1: Hard filters**

An article is excluded if it fails any of the following. There is no scoring at this stage — it either qualifies or it does not.

| Filter | Rule |
|---|---|
| Geography | The story is set in, or has an explicitly stated implication for, the Middle East or Europe. Global stories with no named MENA or Europe angle are excluded. |
| Source | The publication is on the trusted sources list (see agent-factcheck.js). |
| Recency | The article was published within the target fortnightly period. |
| Connectivity | The story involves a brand, market, or regulatory body relevant to ABC's confirmed vehicle distribution operations. Stories about markets or brands where ABC has no presence are excluded unless they have a direct spill-over effect on a market where ABC does operate. |

---

**Stage 2: Relevance scoring (1–5)**

Each article that passes Stage 1 is scored on three dimensions. The scores are summed and rounded to the nearest integer on a 1–5 scale.

**Brand proximity**
- 3 pts: Story directly involves Toyota, Lexus, or a confirmed ABC Chinese brand partner (BYD, MG Motor, GAC Motor, Zeekr, Farizon). Verify against `context/abc-context.txt`.
- 2 pts: Story involves a brand competing directly against ABC-distributed brands in the same markets.
- 1 pt: Story is a market-wide or regulatory development with no specific named brand.

**Geographic proximity**
- 3 pts: Story is set in Saudi Arabia, Turkey, Egypt, or Morocco (ABC's primary distribution markets).
- 2 pts: Story is set in UAE, Italy, Poland, or the UK (ABC's secondary or emerging markets).
- 1 pt: Story is Pan-Europe, Pan-MENA, or a global development with a named MENA or Europe implication.

**Time horizon**
- 3 pts: A decision or response is needed within 4 weeks. Financial, competitive, or regulatory impact is material and immediate.
- 2 pts: Implication is clear but the decision point is 1–2 quarters away.
- 1 pt: Informational. The trend is relevant but no decision is required in the near term.

Items with a combined score below 3 are not included unless required to fill a topic coverage gap (Stage 3 below).

**Action type is derived from time horizon:**
- Time horizon 3 pts = Act & Escalate
- Time horizon 2 pts = Assess
- Time horizon 1 pt = FYI

---

**Stage 3: Shortlisting to 12 items**

Sort all passing items by relevance score descending. Then apply coverage constraints in order:

1. **Topic coverage:** At least 1 item from each of the 6 areas of interest must be included. If the top 12 by score leave a topic uncovered, replace the lowest-scoring item with the highest-scoring item from the missing topic.
2. **Geographic balance:** At least 4 items must have a primary MENA geography. At least 4 items must have a primary Europe geography.
3. **Action balance:** At least 1 Act & Escalate item must appear per edition. If none score high enough on time horizon, reassess the strongest item and justify the upgrade.
4. **Duplication:** If two items cover the same underlying story, keep the one with the stronger so-what and higher score. Remove the weaker item and replace it with the next highest-scoring item not yet included.

---

**Stage 4: Ordering within the edition**

Items appear in the following order in the brief:

1. Act & Escalate items, sorted by relevance score descending
2. Assess items, sorted by relevance score descending
3. FYI items, sorted by relevance score descending

Within a tied relevance score, MENA-primary items appear before Europe-primary items. ABC's primary revenue base is in the Middle East and this is reflected in the reading order.

The executive summary is written after ordering is complete. The opening sentence covers the highest-scoring Act & Escalate item. If no Act & Escalate item exists, the opening sentence covers the highest-scoring Assess item.

---

## 5. Brand and Market Validation

All So What statements and action texts are validated against a context file (`context/abc-context.txt`) that contains ABC's confirmed brand and market matrix, sourced from jameelmotors.com and alj.com and verified as of May 2026.

The rule is strict: no brand is referenced in a market without confirmation from that file. Where a brand's market presence is uncertain (e.g., Changan, Geely), items reference the brand at portfolio level only, without asserting an active distribution relationship.

This constraint exists because an intelligence brief that gets ABC's own business facts wrong destroys credibility immediately with the CSO and Chairman, who know the business better than any external tool.

---

## 6. Technical Architecture

This version is a static web application. It requires no server, no database, and no API credentials.

| Component | Approach | Rationale |
|---|---|---|
| Data storage | Browser localStorage | No backend required. Data persists across sessions. Adequate for a prototype. |
| Content | Hardcoded in `data.js` | All content was manually researched and classified for this assessment. |
| Sales data | Hardcoded in `sales-data.js` | ACEA-compiled figures sourced and verified at build time. |
| Fact check | Rule-based (`agent-factcheck.js`) | Deterministic. No API cost. Runs at page load. |
| CSO review | Rule-based (`agent-cso.js`) | Same rationale. Simulates editorial standards without an LLM call. |
| Charts | Chart.js (CDN) | Lightweight, no build step required. |
| Fonts | Google Fonts CDN | Playfair Display (headings) + Lora (body) + IBM Plex Sans (labels). |
| Deployment | Vercel (static) | No build step. Auto-deploys from GitHub main branch. |

**Cache invalidation:** The `SEED_VERSION` constant in `data.js` is incremented whenever edition content changes. On page load, the app compares the stored version against the current version and clears localStorage if they differ. This ensures users always see the latest edition content, not a cached version from a previous session.

---

## 7. Design Decisions

**Luxury editorial aesthetic:** The brief is built for a Chairman and CSO. The visual language — Prussian Blue, ABC Gold, Playfair Display serif headings — is calibrated to signal that this is a curated intelligence product, not a developer dashboard. The reference points were the Financial Times and The Economist: authoritative, unhurried, precise.

**No live API calls:** A version using the Anthropic API for real-time classification was prototyped. It was replaced by hardcoded content for this assessment for two reasons. First, runtime API calls introduce latency and credential management that are unnecessary for demonstrating the product concept. Second, static content allows the quality of the classification and writing to be reviewed and refined, which is not possible with live-generated output that varies on each run.

**Twelve cards per edition:** Tested against lower limits (eight) and higher limits (sixteen). Eight produced coverage gaps across topic areas. Sixteen exceeded the comfortable reading length for the target audience. Twelve provides coverage across all six topic areas with two items per area on average, at a depth that fits a 15-minute read.

**Three-level action classification:** A five-level system (Watch, Monitor, Assess, Act, Escalate) was considered. The distinction between Watch and Monitor, and between Act and Escalate, was not reliably separable in practice. The three-level system produces consistent classifications that do not require editorial judgement calls at the margins.

---

## 8. Known Limitations

1. **Content is static.** The edition does not update automatically. A production version would run scheduled API calls to refresh news and regenerate the edition on a fortnightly cycle.

2. **Sales data lags by one to two months.** ACEA publishes registration data with a lag. The most recent figures in this version are from early 2026. A production version would pull from primary sources (ACEA, SMMT, JATO) on a monthly cycle.

3. **Single edition per run.** The brief currently holds one live edition. Past editions are stored in localStorage but cannot be compared side by side. A production version would support edition archiving and trend tracking across fortnights.

4. **No reader feedback.** There is no mechanism to track which items generate follow-up or which topics the audience engages with most. A production version would close this loop and feed engagement data back into classification priorities.

5. **Mobile layout is limited.** The brief is designed for desktop. Mobile renders but some elements are constrained by screen width.

6. **Layout does not fully adapt to wide desktop screens.** The content area is capped at 1600px. On monitors wider than that, unused space accumulates at the margins. A fully fluid grid would redistribute content columns rather than leaving dead space.

7. **News sources are limited to open-access publications.** Premium data providers — JATO Dynamics, S&P Global Mobility, Automotive News, Bloomberg — are behind paywalls and not accessible in this version. Their data carries materially richer market intelligence than the free publications currently used.

8. **Brand and market matrix requires manual verification.** The context file is updated manually from public sources. A production version would automate verification against OEM announcements and official distributor websites.

---

## 9. Future State

Five additions would make this production-ready. See `README.md` for the full description of each.

1. Scheduled API calls for automated news refresh and quality checks
2. Live sales data from primary sources (ACEA, SMMT, JATO)
3. An orchestrating agent managing the full pipeline with a single author approval step
4. Specialist agents for Sales, Commercial, and Country Head functions generating parallel so-whats
5. Engagement tracking feeding reader behaviour back into classification priorities
6. A fully fluid layout with a dynamic grid that adapts to any window size, including ultra-wide displays
7. Subscriptions or API access to premium sources: JATO Dynamics, S&P Global Mobility, Automotive News, Bloomberg
8. Ongoing maintenance of this specification document. The SPEC should be updated whenever a significant change is made to the product — new features documented, design decisions revised, limitations closed out. Without active maintenance the spec becomes a historical record rather than a working reference.

---

*ABC internal briefing tool · May 2026 · Confidential*  
*Prepared by Zheng Li Lim as part of an assessment submission.*
