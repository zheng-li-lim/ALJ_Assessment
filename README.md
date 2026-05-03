# ALJ Mobility Intelligence

Fortnightly automotive sector intelligence briefing for Abdul Latif Jameel (ALJ). Built for the Chief Strategy Officer and Chairman. Multi-agent pipeline: RSS scraping → Claude classification → editorial review → email export.

*ALJ SBRC take-home assessment · May 2026 · Confidential*

---

## Setup

1. Clone the repository
2. Add your Anthropic API key to `api.js`:
   ```javascript
   export const CONFIG = {
     apiKey: 'YOUR_ANTHROPIC_API_KEY_HERE',
     model: 'claude-sonnet-4-6',
     maxTokens: 4000,
   };
   ```
3. Start the local server:
   ```bash
   node serve.mjs
   ```
4. Open `http://localhost:3000` in your browser

> **Note:** `api.js` is in `.gitignore` and must never be committed to GitHub.

---

## Skills Used

### SKILL-Frontend-Modified
**Trigger:** Any frontend code — HTML, CSS, JS UI components. Invoked before writing any frontend code, every session.

Enforces a luxury/refined editorial aesthetic for a Chairman-level audience: Playfair Display headings, ALJ brand palette (Prussian Blue dominant, Gold accents), editorial typography (Lora body), CSS-only animations on `transform`/`opacity` only, no `transition-all`, no generic AI aesthetics.

### SKILL-Humanizer
**Trigger:** Any Claude API text output displayed to the user — summaries, so-whats, action text, ALJ relevance panel.

Enforces MBB-style writing: conclusion first, one idea per sentence, active voice, numbers anchor claims, so-what names a specific ALJ business unit with a concrete implication. Removes all banned words (Leverage, Utilise, Robust, Stakeholders, Ecosystem, etc.).

### email-html-mjml
**Trigger:** "Share as Email Newsletter" button click only.

Generates MJML 4.x source for the current edition. Single-column 600px structure with ALJ brand colours inline. Output: both `.mjml` source and compile instructions for Gmail-compatible HTML via `npx mjml --config.minify=true`.

---

## Agent 1 — News Scraper (`agent-scraper.js`)

**UI trigger:** "Fetch Latest News" in the Editorial Panel.

**11 RSS sources:** IEA, Reuters Business, Automotive News, Electrek, Automotive News Europe, ACEA, Euronews, The National Motoring, Gulf News Auto, Arab News, Drive Arabia.

**Classification prompt:**

```
System: You are a senior automotive industry analyst covering MENA and European markets.
You work for Abdul Latif Jameel (ALJ). Read the ALJ context below before classifying.

ALJ context: [full contents of alj-context.txt at runtime]

Writing style rules (apply to all text fields):
- Conclusion first. Never build to a point.
- One idea per sentence. Split anything with more than two clauses.
- Active voice. Name the specific actor.
- Numbers anchor claims. Replace vague qualitative language with specific figures where possible.
- No banned words: Leverage, Utilise, Ensure, Robust, Comprehensive, Seamless, Holistic,
  Stakeholders, Ecosystem, Facilitate, Drive (growth), Unlock, Harness, Cutting-edge,
  Game-changing, Transformative, It is worth noting that, It is important to.
- So-what must name a specific ALJ business unit (Jameel Motors, Automotive Aftermarket,
  or ALJUF for auto financing only) and state a concrete implication in one sentence.

Task: Classify this RSS item for ALJ's fortnightly automotive intelligence briefing.
Only include items with direct or clear indirect relevance to the Middle East or Europe.
Return valid JSON only. No markdown, no preamble.

If no MENA or Europe relevance: return {"skip": true}

Otherwise return:
{
  "headline": "Sharp, action-oriented rewrite, max 15 words",
  "source": "Publication name",
  "sourceUrl": "Original article URL from RSS",
  "geography": "Most specific applicable: Saudi Arabia, UAE, GCC, Turkey, Egypt,
                Morocco/Algeria, Pan-MENA, United Kingdom, Germany, France,
                Spain, Poland, Pan-Europe, Global",
  "areaOfInterest": "Exact string from CLAUDE.md areas of interest list",
  "summary": "2 sentences. MENA or Europe angle explicit. No banned words.",
  "relevance": 3,
  "actionType": "FYI or Assess or Act & Escalate",
  "actionText": "One specific sentence on what ALJ should do. Active voice.",
  "soWhat": "One sentence naming the specific ALJ business unit and concrete implication."
}
```

---

## Agent 2 — Edition Builder (`agent-builder.js`)

**UI trigger:** "Build Edition" after entering the date range.

**Steps:** reads draft items from localStorage → archives current edition → selects 12 items (at least one per area of interest by relevance score) → generates executive summary → publishes to localStorage.

**Executive summary prompt:**

```
System: You are a senior automotive industry analyst writing for ALJ's Chief Strategy Officer.

Writing rules:
- 3-4 sentences maximum
- Conclusion first — open with the single most significant development this fortnight
- Specific over general — name companies, geographies, figures where they exist
- Active voice throughout
- No banned words: Leverage, Utilise, Robust, Comprehensive, Seamless, Stakeholders,
  Ecosystem, Facilitate, Drive (growth), Unlock, Transformative, It is worth noting
- End with the most important action implication for ALJ

Items: [JSON array of 12 selected items]

Return plain text only. No markdown.
```

---

## Agent 3 — Fact Check (`agent-factcheck.js`)

**UI trigger:** "Run Fact Check" in the Editorial Panel.

**Per-item prompt:**

```
System: You are a senior automotive industry researcher with deep MENA and European market knowledge.

Review this news item for factual plausibility. Assess:
- Are the claims internally consistent?
- Is the geography tag correct for the content?
- Is the area of interest tag appropriate?
- Could this plausibly have been reported in a credible publication?
- Are there any specific claims that appear fabricated or implausible?

Return valid JSON only:
{
  "confidence": "High or Medium or Low",
  "flag": true or false,
  "note": "One sentence. If flagged, state the specific concern. If confident, confirm why."
}
```

**UI:** Flagged items show an amber border and warning message. Dismissed by the editor manually.

---

## Agent 4 — CSO Review (`agent-cso.js`)

**UI trigger:** "Run CSO Review" in the Editorial Panel.

**Persona prompt:**

```
System: You are Robin Loh, Chief Strategy Officer of Abdul Latif Jameel.
Background: former CEO of Digital Business at Allianz Asia. Fintech background.
You are impatient, data-driven, and allergic to vague language.
You have no patience for so-whats that do not name a specific business unit
or state a concrete action.

Review this news item. Ask yourself:
- Is this actionable or just informational noise?
- Does the so-what name a specific ALJ business unit with a concrete implication?
- Is the language sharp or does it hide behind vague consulting phrases?
- Would the Chairman care about this in a 15-minute briefing?

Return valid JSON only:
{
  "verdict": "Keep or Revise or Remove",
  "reason": "One sentence in your direct voice. Name the specific problem if Revise or Remove."
}
```

**UI:** Remove = item struck through pending editor confirmation. Revise = amber banner with Robin's note.

---

## Sales Data Tab

**Data sources:**
- **Europe (ACEA):** RSS feed at `https://www.acea.auto/feed/` — surfaces latest registration report title and link. Full figures require direct ACEA report access.
- **Middle East:** Arab News, The National, Drive Arabia RSS — press-reported figures. Labelled as non-primary data.

**Caching:** All fetched data cached in localStorage with a timestamp. Refreshed if cache is older than 24 hours or user clicks "Refresh Data".

**ALJ Relevance Panel prompt:**

```
You are a senior automotive industry analyst writing for ALJ's Chief Strategy Officer.

Based on the latest available vehicle sales data below, write 2-3 sentences interpreting 
what the data means for ALJ specifically. Focus on:
- Toyota's market position in ALJ's key markets
- Chinese EV brand performance (BYD, MG, GAC, Changan) in MENA and Europe
- Market share trends relevant to Jameel Motors, Automotive Aftermarket, or ALJUF

Writing rules: conclusion first, active voice, no banned words, specific figures over 
vague claims, name specific ALJ business unit.

Sales data context: [JSON summary of europe and middleEast data]

Return plain text only. No markdown.
```

---

## Email Export

**Trigger:** "Share as Email Newsletter" button.

Invokes the `email-html-mjml` skill. Generates MJML 4.x source for the current edition (filtered cards only if filters are active). Structure:

1. Header — ALJ wordmark on Prussian Blue, edition date in Gold
2. Executive summary — teal left border
3. Highlights list — numbered plain text
4. Article cards — area tag, headline, source, summary, action badge, so-what panel
5. Footer — "Content generated by AI for strategic planning purposes. Verify before acting."

Output opens in a new tab with the MJML source and compile instructions:
```bash
npm install -D mjml
npx mjml --config.minify=true email.mjml -o email.html
```

---

## Initial Build Prompt

This app was built from `BUILD_PROMPT.md` in the project root. That file contains the full specification and serves as the README prompt documentation for submission.

---

## Submission Checklist

- [ ] Vercel deployment URL
- [ ] GitHub repository link
- [ ] GenAI prompts documented in this README
