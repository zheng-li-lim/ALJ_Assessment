# BUILD_PROMPT.md — ABC Mobility Intelligence App


Before writing a single line of code:
1. Read `CLAUDE.md` — brand rules, skill triggers, hard rules, brand-market matrix
2. Read `context/abc-context.txt` — confirmed ABC brand-market pairings and business units
3. Invoke SKILL-Frontend-Modified (`Skills/SKILL-Frontend-Modified.md`) — commit to aesthetic direction before touching HTML or CSS

**Important:** This app makes NO API calls at runtime. No Anthropic API, no external data fetching. All content is hardcoded. Fact check and CSO review are deterministic JavaScript rules, not AI prompts.

---

## What to Build

A fortnightly automotive intelligence briefing web app for ABC (internal codename — never use the real company name in any output). Two-tab layout: Intelligence + Sales Data.

---

## Step 1 — File Structure

Create these files:

```
index.html
style.css
app.js
data.js
sales-data.js
agent-factcheck.js
agent-cso.js
serve.mjs
.gitignore
```

### serve.mjs
Simple Node.js static file server on port 3000. Serves the project directory with correct MIME types for `.js` modules.

### .gitignore
```
.DS_Store
node_modules/
```

---

## Step 2 — Build the UI

Invoke SKILL-Frontend-Modified now. Design direction:
- Luxury/refined editorial — Financial Times meets The Economist
- Prussian Blue (`#002B5C`) dominant, Gold (`#c9a84c`) accents
- Playfair Display for display headings
- Off-white (`#f7f4ef`) page background
- Every design decision must feel intentional for a Chairman-level audience

### index.html structure
- `<header>` — brand mark "ABC" + "Mobility Intelligence", "Share as Email" button on right
- `<nav>` — two tabs: Intelligence | Sales Data
- Intelligence tab:
  - Filter bar (sticky): Geography checklist dropdown (Middle East group + Europe group) | Area of Interest pills | Action type pills | Clear filters
  - Two-column layout: main content (left) + narrow sidebar (right)
  - Main: edition summary section (executive summary as gold bullet points + Act & Escalate actions as red bullet points) → highlights (by region) → full article cards
  - Sidebar: all editions listed newest to oldest with quality check status dot (✓/◑/○)
- Sales Data tab: left sidebar filters + main chart area
- No editorial panel. No API key input. No agent buttons.

### Geography filter — two-level checklist dropdown
**Middle East:** Saudi Arabia, UAE, GCC, Turkey, Egypt
**Europe:** United Kingdom, Germany, France, Italy, Spain, Poland, Pan-Europe
No "Global" or "MENA" options.

### Areas of Interest pills (exact strings required)
Regulations | Product Innovation | Competition | Retail Innovation | Supply Chain | Other Interesting News

### Action type pills
FYI | Assess | Act & Escalate

### News card structure (per card)
- Area of interest tag(s) — colour-coded pill
- Geography tag(s) — grey outlined pill
- Headline
- Source + publication date
- 2–3 sentence summary
- Relevance dots (1–5, gold for 4–5)
- Action badge (FYI / Assess / Act & Escalate — colour-coded)
- "So What for ABC" panel (teal left border, distinct background) — actionText is not shown on the card; it appears only in the edition's key actions summary
- Fact check flag if `factCheck.flag === true` (amber warning)
- CSO review note if `csoReview.verdict === 'Revise'` (amber) or `'Remove'` (red strikethrough)

### Sidebar
Single "Editions" section. Each entry shows:
- Quality status dot: ✓ green (both checks done), ◑ gold (partial), ○ grey (none)
- Edition date range
- Item count
Clicking loads that edition as current view.

---

## Step 3 — Build agent-factcheck.js (rule-based, no API)

Create `agent-factcheck.js` as a pure JavaScript module with no API calls. Its purpose is **authenticity checking only** — verifying that each news item points to a real article from a real publication. Content quality (house style, ABC business unit naming, banned words) is handled separately by `agent-cso.js`.

It exports two functions: `factCheckItem(item)` and `runFactCheck(items)`.

`factCheckItem` takes a single news item and returns an object with three fields: `confidence` (the string "High", "Medium", or "Low"), `flag` (a boolean), and `note` (a string describing the first issue found, or "Passes all automated checks." if there are none). It runs four checks in order, collecting any issues:

1. **Source URL** — must be present, must begin with `http://` or `https://`, and the domain must be in a hardcoded trusted-publications list. The list must include: autocar.co.uk, insideevs.com, theguardian.com, reuters.com, smmt.co.uk, arabnews.com, thenationalnews.com, gulfnews.com, theicct.org, best-selling-cars.com, autonews.com, ft.com, bloomberg.com, bbc.co.uk, just-auto.com. Strip any `www.` prefix before matching. If the URL is missing, malformed, or the domain is not on the list, add a descriptive issue string.

2. **Publish date** — must be present, must parse as a valid date, and must not be in the future. Add an issue string if any of these fail.

3. **Headline** — must be present and non-empty.

4. **Summary** — must be present and at least 40 characters long. A shorter string is likely placeholder text, not a real article summary.

After collecting issues: if zero, set confidence to "High" and flag to false; if one, set confidence to "Medium" and flag to true; if two or more, set confidence to "Low" and flag to true.

`runFactCheck` maps over an array of items and returns an array of objects, each with the item's `id` and its `factCheck` result.

---

## Step 4 — Build agent-cso.js (rule-based, no API)

Create `agent-cso.js` as a pure JavaScript module with no API calls. Its purpose is **content quality checking** — verifying that the `soWhat` field meets editorial standards. It exports two functions: `csoReviewItem(item)` and `runCSOReview(items)`.

`csoReviewItem` takes a single news item and returns an object with two fields: `verdict` (the string "Keep" or "Revise") and `reason` (a string explaining the outcome). It runs three checks against the item's `soWhat` field:

1. **ABC business unit** — soWhat must contain at least one of: "ABC Motors", "Automotive Aftermarket", or "ABC Finance". If none are found, flag as a failure.

2. **Banned language** — soWhat must contain none of the banned words: leverage, utilise, facilitate, synergies, stakeholders, ecosystem, holistic, robust, seamless, cutting-edge, game-changing, transformative, unlock, harness, delve. If any are found, flag as a failure.

3. **Minimum length** — soWhat must be at least 60 characters long. If too short, flag as a failure.

If any check fails, return verdict "Revise" with a reason describing the first issue found. If all checks pass, return verdict "Keep" with reason "Names a specific ABC business unit with a concrete, actionable implication."

`runCSOReview` maps over an array of items and returns an array of objects, each with the item's `id` and its `csoReview` result.

---

## Step 5 — Build data.js

Create `data.js` as an ES module. It is the single source of truth for all intelligence content and configuration. It has no runtime logic — it only exports constants.

**Configuration exports:**

- `SEED_VERSION` — a plain integer starting at 1. Increment this whenever any edition content changes. `app.js` uses it to detect stale localStorage and force a re-seed.
- `AREA_COLORS` — an object mapping each area-of-interest string to its brand hex colour. Use the values from CLAUDE.md.
- `ACTION_COLORS` — an object mapping each action type string to its brand hex colour. Use the values from CLAUDE.md.
- `ACTION_DEFINITIONS` — an object mapping each action type to a short human-readable description. Use: FYI → "For your information. No action needed at this stage." / Assess → "Worth examining before the next planning decision." / Act & Escalate → "May warrant escalation to senior leadership for further consideration."
- `ACTION_TYPES` — the ordered array of three valid action type strings: FYI, Assess, Act & Escalate.
- `AREAS_OF_INTEREST` — the ordered array of six valid area strings: Regulations, Product Innovation, Competition, Retail Innovation, Supply Chain, Other Interesting News.
- `GEOGRAPHIES` — the array of valid geography values: All, Saudi Arabia, UAE, GCC, Turkey, Egypt, United Kingdom, Germany, France, Italy, Spain, Poland, Pan-Europe.

**Edition exports:**

- `EDITION_LATEST` — the most recent fortnightly edition object (see shape below).
- `EDITION_PREV` — the previous fortnightly edition object.
- `SEED_EDITION` — set equal to `EDITION_LATEST`. Used by `app.js` as the default view on first load.

**Edition object shape:** Each edition has: an `id` string formatted as `edition-YYYY-MM-DD` using the period end date; a `dateRange` string in the format `DD Mon – DD Mon YYYY`; a `publishedAt` ISO timestamp; an `executiveSummary` string of 3–4 sentences covering news developments only — no action sentences (actions are rendered separately from Act & Escalate items' actionText fields); a `sourcesTotal` integer; a `sourcesFetched` integer; and an `items` array of news item objects.

**News item shape:** Each item has the following fields:
- `id` — string with prefix `l-` for latest edition items, `p-` for previous edition items, followed by a zero-padded number (e.g. `l-001`)
- `headline` — the article headline
- `source` — the publication name
- `sourceUrl` — full HTTPS URL to the article
- `publishedAt` — date string in YYYY-MM-DD format
- `geographies` — array of one or more strings from the GEOGRAPHIES list
- `areasOfInterest` — array of one or more strings from the AREAS_OF_INTEREST list
- `summary` — 2–3 sentences, with the MENA or Europe angle made explicit
- `relevance` — integer from 1 to 5
- `actionType` — one string from ACTION_TYPES
- `actionText` — one concrete sentence on what ABC should do
- `soWhat` — one sentence naming a specific ABC business unit and stating a concrete implication
- `factCheck` — object with `confidence`, `flag`, and `note` fields, baked in from the agent-factcheck.js logic
- `csoReview` — object with `verdict` and `reason` fields, baked in from the agent-cso.js logic

**Content rules for every item:** Read `context/abc-context.txt` before writing any item. That file is the single source of truth for which brands ABC distributes in which markets. Do not use any hardcoded list from memory — the matrix in the context file may have been updated since this prompt was written.

- soWhat must name ABC Motors, Automotive Aftermarket, or ABC Finance
- Only reference a brand in a market where it is confirmed in `context/abc-context.txt`
- Portfolio brands listed as "no specific market confirmed" must never be written as active distribution relationships
- If no confirmed brand fits, write generically: "brands ABC distributes in [market]"
- Apply Humanizer banned-word check to all text fields. Key rules: no em-dashes as connective tissue (full stop or colon instead); no contrast constructions ("not X but Y", "rather than Y"); no urgency framing ("before X happens", "faster than planned"); no significance-announcing verbs ("marks the first time", "signals that", "represents a structural shift", "underscores", "highlights"); no attributive clause stacking (move context after the main claim); no fact-packing (lead with the recommendation, support with one or two examples); no implicit anxiety tone (state what needs to be done — do not frame the negative consequence as the driver).

---

## Step 6 — Source 2–3 real editions

Use web search to find real published automotive news articles for the two most recent completed fortnightly periods and the current period. Target date ranges aligned to fortnights ending on Sundays.

Target publications:
- Autocar, InsideEVs, The Guardian Business, Reuters, SMMT
- Arab News, The National, Gulf News Auto
- ICCT, best-selling-cars.com, Automotive News Europe

For each period, find 8–12 real articles relevant to ABC's markets (Middle East + Europe). For each article:
- Verify the URL is real and the article exists before including it
- Confirm the publication date falls within the target period

**Before writing any content, apply the selection criteria:**

Use the three dimensions below as a guide, then assign a 1–5 relevance score using editorial judgement. The score is not calculated from a formula.

| Score | When to use |
|---|---|
| 5 | Story directly involves an ABC brand partner in a primary ABC market, immediate action needed |
| 4 | Story involves an ABC brand or primary market with a clear near-term implication |
| 3 | Relevant to ABC's competitive context or markets, indirect or longer-term |
| 2 | Informational, weak connection to ABC |
| 1 | Peripheral — only include to fill a coverage gap |

*Brand proximity:* ABC brand partner directly named (Toyota, Lexus, BYD, MG, GAC, Zeekr, Farizon — verify in `context/abc-context.txt`)? Competing brand? Or market-wide?
*Geographic proximity:* Primary ABC market (Saudi Arabia, Turkey, Egypt, Morocco)? Secondary (UAE, Italy, Poland, UK)? Or broader?
*Time horizon → Action type:* 4 weeks = **Act & Escalate** · 1–2 quarters = **Assess** · informational = **FYI**

Sort by score descending. Coverage constraints: at least 1 item per area of interest, at least 4 items with a primary MENA geography tag OR a MENA market named in their soWhat, at least 4 Europe-primary items, at least 1 Act & Escalate per edition. Fill 12 items per edition.

Order the final items: Act & Escalate first (by score), then Assess (by score), then FYI (by score). Ties: MENA before Europe.

Then for each selected item:
- Write a 2–3 sentence summary
- Write actionText and soWhat strictly against the brand-market matrix in `context/abc-context.txt`
- Apply rule-based fact check and CSO review and bake the results into the item

At minimum: one EDITION_LATEST and one EDITION_PREV. Target 12 items per edition.

---

## Step 7 — Build sales-data.js

Create `sales-data.js` as an ES module with no logic — only hardcoded data exports. All figures are passenger vehicles only, EU + EFTA + UK combined, sourced from best-selling-cars.com (ACEA-based). Do not estimate any figure — if a data point is not confirmed from the source, do not include it.

**`SALES_YEARS`** — an array of the confirmed data years in ascending order.

**`MARKET_TOTAL`** — an object mapping each year to the grand total passenger vehicle registrations across the entire EU + EFTA + UK geography for that year.

**`BRAND_SALES`** — an object mapping manufacturer group name to a sub-object of year → unit figures. Include the top 13 manufacturer groups by volume. Note that BYD was below the reporting threshold in 2023 — store as 0. An "Others" category is not stored here; it is computed dynamically in `app.js` as MARKET_TOTAL minus the sum of all named brands for that year.

**`COUNTRY_SALES`** — an object mapping country name to a sub-object of year → unit figures. Include all 31 countries: the 27 EU member states plus Norway, Switzerland, Iceland, and the United Kingdom.

**`BEV_2025`** — an object mapping country name to an object with two fields: `units` (BEV registrations in 2025) and `sharePct` (BEV percentage share of total registrations in 2025). Include all 31 countries. BEV data is only confirmed for 2025 — do not create equivalent exports for prior years unless the source page is available and verified.

For all numerical figures: fetch the actual values from best-selling-cars.com for confirmed years, or copy verbatim from the working `sales-data.js` in this repository. Never estimate.

### Sales tab features
- Three views: By Brand (stacked bar, year × manufacturer) | By Country (stacked bar, year × country) | EV Penetration (bar, country × BEV%)
- Filters: View toggle | Metric (Units/% Share) | Year checkboxes | Country checklist
- "Others" in By Brand = MARKET_TOTAL minus named brands, computed in app.js
- Values rounded to nearest 100,000 for display; values below 50,000 show as "n/a"
- Tooltip footer shows column total or BEV% depending on view
- Data table below chart mirrors chart data with a Total row
- Europe only — clearly labelled. Passenger vehicles only.
- Source: best-selling-cars.com · confirmed years · BEV data most recent confirmed year only

---

## Step 8 — Build app.js

Import from `data.js`, `agent-factcheck.js`, `agent-cso.js`, `sales-data.js`. No other imports.

Key behaviours:
- `loadFromStorage()`: read `localStorage.getItem('abc_seed_v')` and compare it to `SEED_VERSION`. If they differ, clear the `abc_editions` key in localStorage and re-seed from `data.js`. This prevents stale cached editions from persisting after content updates.
- `autoQualityChecks()`: on init, synchronously call `factCheckItem` and `csoReviewItem` on any item whose `factCheck` or `csoReview` field is null. Save the updated editions back to localStorage. No async needed — the scripts are pure functions.
- Geography filter: two-level checklist dropdown with a Middle East group and a Europe group, each with a select-all checkbox. Clicking a group header toggles all its children; partial selection shows indeterminate state on the group checkbox.
- Email export: `shareAsEmail()` builds a styled HTML email page and opens it via a blob URL in a new tab. Includes a sticky "Select All" toolbar. No html2canvas, no API calls. Invoke the `email-html-mjml` skill (`Skills/email-html-mjml.md`) before implementing this function.
- Always increment `SEED_VERSION` in `data.js` after any content change.

---

## Step 9 — Test

1. Serve via `node serve.mjs` and open `localhost:3000`
2. Confirm both editions load with quality check dots showing ✓
3. Test all filters — geography, area, action type, combinations
4. Confirm "Act & Escalate" items show red text in the executive summary
5. Switch editions in sidebar — confirm content updates correctly
6. Test Sales tab: all three views, unit/share toggle, year filter, country filter
7. Test Share as Email — confirm blob URL opens with styled content
8. Confirm no console errors

---

*ABC internal briefing tool · Confidential*
