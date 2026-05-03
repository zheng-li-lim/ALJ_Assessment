# NEWS_REFRESH_PROMPT.md — Intelligence Content Refresh

Paste into Claude Code to refresh the intelligence editions. Touches content and context only — no code, no styling, no sales data.

Before starting, read these three files in order:
1. `CLAUDE.md` — content rules, banned words, hard rules
2. `context/abc-context.txt` — this is the live source of truth for brand-market pairings
3. `data.js` — current editions

---

## Step 0 — Update the context file

Before touching any edition content, check whether ABC's brand-market operations have changed since the context file was last updated.

Fetch and read these two pages:
- `https://www.jameelmotors.com/en/our-story/`
- `https://www.alj.com/en/news/` (scan recent news for new market or brand announcements)

Compare what you find against the current `context/abc-context.txt`. Look specifically for:
- New brand partnerships or distribution agreements announced
- New markets entered or exited
- Status changes (e.g., an "indicated" presence becoming a confirmed agreement)
- Any brands or markets that no longer appear on the official site

**Update `context/abc-context.txt` if anything has changed.** Use the same format as the existing file. Mark new additions clearly with their source and the date verified. Mark removals or status changes with a note.

If nothing has changed, state "Context verified — no changes" and proceed.

**This step runs every time this prompt is used.** The context file is the single source of truth for all brand-market decisions in the content below.

---

## Step 1 — Determine what to do

Read `data.js` and find the latest edition's `dateRange` and `publishedAt`. Parse the **end date** of the dateRange. Compare it to today's date.

```
If today <= end_date + 1 day:
  → Still within the current edition period
  → ACTION: Refresh the latest edition (same dateRange, new content)

If today > end_date + 1 day:
  → The latest period has closed
  → ACTION: Create a new edition
             New period: (end_date + 1 day) to (end_date + 14 days)
             Do NOT modify the existing editions
```

State which action you are taking before proceeding.

---

## Step 2 — Source real articles

Use web search to find real published articles for the target period. Target publications:
- Autocar, InsideEVs, The Guardian Business, Reuters, SMMT
- Arab News, The National, Gulf News Auto
- ICCT, best-selling-cars.com, Automotive News Europe

Topics relevant to ABC's markets (Middle East and Europe only):
- EV sales data and regulations in Europe
- Chinese brand expansion in Europe or MENA
- News about brands ABC distributes — use `context/abc-context.txt` to know which brands and which markets apply
- Automotive market news in the countries listed in `context/abc-context.txt`
- EV infrastructure, tariffs, supply chain with MENA or Europe implications

For each article:
- Verify the URL returns a real page before including it
- Confirm the publication date falls within the target period
- Skip any URL you cannot verify

Aim for 10 real articles covering at least 4 different areas of interest, including at least one "Act & Escalate" item.

---

## Step 2.5 — Apply selection and prioritisation criteria

Before writing any content, score and shortlist the articles from Step 2. Do not write soWhat, actionText, or summaries for articles that will not make the final 12.

**Stage 1: Hard filters — exclude if any apply**
- No clear MENA or Europe angle stated in the article
- Publication not on the trusted sources list
- Publication date outside the target period
- Story has no connection to a brand or market confirmed in `context/abc-context.txt`

**Stage 2: Score each passing article on three dimensions (1–3 each)**

*Brand proximity*
- 3: Toyota, Lexus, BYD, MG Motor, GAC Motor, Zeekr, or Farizon directly named. Verify in `context/abc-context.txt`.
- 2: A brand competing against ABC-distributed brands in the same markets.
- 1: Market-wide or regulatory development, no specific brand named.

*Geographic proximity*
- 3: Saudi Arabia, Turkey, Egypt, or Morocco (ABC's primary markets).
- 2: UAE, Italy, Poland, or UK (ABC's secondary or emerging markets).
- 1: Pan-Europe, Pan-MENA, or global with a named regional implication.

*Time horizon*
- 3: Decision needed within 4 weeks. → Assign **Act & Escalate**
- 2: Decision needed within 1–2 quarters. → Assign **Assess**
- 1: Informational, no near-term decision needed. → Assign **FYI**

Sum the three dimension scores. Round to nearest integer on a 1–5 scale for the `relevance` field.

**Stage 3: Shortlist to 12 items**
1. Sort by relevance score descending.
2. Ensure at least 1 item from each of the 6 areas of interest. Replace the lowest-scoring item with the best available from any uncovered topic.
3. Ensure at least 4 MENA-primary items and at least 4 Europe-primary items.
4. Ensure at least 1 Act & Escalate item. If none qualify, reassess the strongest item and justify the upgrade.
5. If two articles cover the same story, keep the higher-scoring one and replace the other.

**Stage 4: Order the 12 items**
- Act & Escalate first, sorted by score descending
- Then Assess, sorted by score descending
- Then FYI, sorted by score descending
- Ties: MENA-primary items before Europe-primary items

State the final 12 items with their scores and order before proceeding to Step 3.

---

## Step 3 — Write content for each item

**Brand-market validation — for every soWhat and actionText:**
Read `context/abc-context.txt`. Use the confirmed brand-market matrix there — do not use any hardcoded list from memory.

Rules:
- soWhat must name ABC Motors, Automotive Aftermarket, or ABC Finance
- Only reference a brand in a market where it is **confirmed** in `context/abc-context.txt`
- Never reference portfolio brands listed as "no specific market confirmed" as active distribution relationships
- If no confirmed brand fits the story, write generically: "brands ABC distributes in [market]" or "Chinese brands ABC distributes in Egypt" etc.
- Always check: is the brand confirmed in that specific country? Brands operate in some ABC markets but not others — never assume

**Humanizer rules (apply to every text field):**
- Conclusion first — never build to a point
- One idea per sentence — if a sentence carries more than two distinct pieces of information, split it
- Active voice — name the specific actor
- No banned words: Leverage, Utilise, Facilitate, Ensure, Harness, Unlock, Synergies, Stakeholders, Ecosystem, Robust, Seamless, Holistic, Transformative, Cutting-edge
- No em-dashes as connective tissue between clauses — use a full stop or colon. Numerical en-dashes (18–24 months) are fine.
- No contrast constructions: "not X but Y", "X rather than Y" — state the positive claim directly
- No urgency framing: "before X happens", "faster than planned", "before it's too late" — state the fact; let the reader draw the implication
- No announcing significance: "marks the first time", "represents a structural shift", "signals that", "underscores", "highlights", "reflects", "demonstrates" as sentence openers
- No attributive clause stacking — move context after the main claim or into a separate sentence
- No fact-packing — lead with the recommendation, support with one or two examples, not an exhaustive inline list
- No implicit anxiety tone — if the strategic point is sound, it stands without the implied threat

**Content quality:**
- summary: 2–3 sentences, MENA or Europe angle explicit
- actionText: one concrete sentence, what ABC should do — appears in the edition key actions summary (red bullets), not on the card
- soWhat: one sentence, names specific ABC business unit, concrete implication — displayed on the card

---

## Step 4 — Apply rule-based quality checks

Apply the logic from `agent-factcheck.js` and `agent-cso.js` to every item before baking in results.

**Fact check (authenticity) — flag if ANY of:**
- No sourceUrl, or sourceUrl does not begin with `http://` or `https://`
- sourceUrl domain is not in the trusted publication list (autocar.co.uk, insideevs.com, theguardian.com, reuters.com, smmt.co.uk, arabnews.com, thenationalnews.com, gulfnews.com, theicct.org, best-selling-cars.com, autonews.com, ft.com, bloomberg.com, bbc.co.uk, just-auto.com)
- No publishedAt, or publishedAt is not a valid date, or publishedAt is in the future
- No headline
- Summary missing or under 40 characters

**CSO review (content quality) — Revise if ANY of:**
- soWhat does not name an ABC business unit (ABC Motors, Automotive Aftermarket, or ABC Finance)
- soWhat contains banned language
- soWhat is under 60 characters

Fix all issues before writing results. Every item should reach `{confidence:'High', flag:false}` and `{verdict:'Keep'}`.

---

## Step 5 — Write the executive summary

3–4 sentences of news developments only. Open with the single most significant development. Name companies, geographies, and figures where available. Do not include action sentences — actions are pulled automatically from Act & Escalate items' `actionText` fields and rendered separately as red bullet points below the summary. Banned words apply.

---

## Step 6 — Update data.js

**If refreshing current edition:**
- Replace `EDITION_LATEST` items and executiveSummary
- Keep the same `id` and `dateRange`
- Increment `SEED_VERSION`

**If creating a new edition:**
- Shift `EDITION_LATEST` to `EDITION_PREV`
- Create new `EDITION_LATEST` with new `id` (edition-YYYY-MM-DD), `dateRange`, items
- Increment `SEED_VERSION`

In both cases: bake factCheck and csoReview into every item. Never leave as null.

---

## Step 7 — Verify

Start `node serve.mjs` and check `localhost:3000`:
- Correct edition and date range showing
- "Act & Escalate" items appear as red bullet points below the executive summary bullets, one bullet per actionText
- Sidebar quality dots show ✓ for updated edition
- Previous editions intact

---

*Touches: context/abc-context.txt and data.js only.*
*Never modify app.js, style.css, index.html, sales-data.js, or agent scripts.*
