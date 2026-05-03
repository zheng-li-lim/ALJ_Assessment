# ABC Mobility Intelligence

> Assessment submission — Zheng Li Lim · [limzl1804@gmail.com](mailto:limzl1804@gmail.com)

ABC is a hypothetical company built for this assessment. It is modelled on a real international automotive conglomerate: private, family-owned, with operations across the Middle East and Europe spanning vehicle distribution, aftermarket, and consumer auto financing. All brands, markets, and business units in the app reflect that profile, presented under the ABC name.

---

## A fortnightly brief that tells ABC what to do, not just what happened

Two people read this: the Chief Strategy Officer and the Chairman. Each edition covers the Middle East and European automotive markets. Every item is classified by topic, tagged to a geography, scored for relevance to ABC specifically, and assigned a required action. The output is a decision-ready brief, not a news digest.

**Six topics:**
- **Regulations** — emissions rules, government mandates, policy changes
- **Competition** — rival brand moves, new entrants, market share shifts
- **Product Innovation** — new vehicle launches, technology developments
- **Retail Innovation** — dealership models, digital sales, customer experience
- **Supply Chain** — logistics, manufacturing, sourcing disruptions
- **Other Interesting News** — broader developments with indirect ABC relevance

**Three action levels, every item gets one:**
- **FYI** — worth knowing, no action needed now
- **Assess** — needs further analysis before a decision
- **Act & Escalate** — requires a response from leadership

**Other features:**
- **Executive Summary** — 3–4 sentences, conclusion first, written for a 15-minute read
- **Filters** — by geography, topic, and action type, combinable
- **Fact check** — flags items with inconsistent claims or implausible geography tags
- **CSO review** — removes vague items, flags anything that doesn't name a specific ABC business unit
- **Sales Data tab** — European passenger car registrations by brand and market, 2023–2025
- **Email export** — one click, formatted newsletter, ready to send

---

## All content is static. It was researched and hardcoded manually for this assessment.

No live API calls. No data fetching at runtime. The pipeline below shows how the pieces fit together.

```
SOURCE DATA
  Company context    jameelmotors.com · alj.com
                     Confirmed brand × market matrix: which ABC brand in which country
                     Business units: ABC Motors · Automotive Aftermarket · ABC Finance

  News               11 sources: Autocar · Bloomberg · The Guardian · InsideEVs
                     SMMT · ICCT · Best Selling Cars Blog · TechCrunch · and others
                     Middle East and Europe only — no item included without a clear
                     MENA or Europe angle

  Sales data         best-selling-cars.com (ACEA-based)
                     EU + EFTA + UK · Passenger vehicles · 2023–2025

        ↓

CLASSIFICATION (applied to each news item)
  Topic              one of six areas of interest
  Geography          country or region
  Relevance          scored 1–3 against ABC's confirmed brand × market positions
  Action type        FYI / Assess / Act & Escalate
  Action text        one sentence on what ABC should do
  So-what            named ABC business unit + concrete implication

        ↓

QUALITY CHECKS
  Fact check         internal consistency, geography plausibility
  CSO review         vague so-whats flagged, weak items removed

        ↓

OUTPUT
  12 intelligence cards per edition
  Executive summary · highlights list · sales charts · email export
```

---

## Each part of the brief has a job — here is what to read and why

**Executive Summary.** Written conclusion-first. The most important development this fortnight is the opening sentence. Read this alone and you know the edition's verdict.

**Highlights list.** All 12 items grouped by region, each linking to its full card below. Use it to decide in 60 seconds what deserves your full attention.

**Each card has seven layers:**
1. Topic tag (coloured) and geography tag — what and where
2. Headline — action-oriented, not descriptive
3. Source and date — click the source name to read the original article
4. Summary — two sentences, Middle East or Europe angle stated explicitly
5. Relevance score — 1 to 3 gold dots, relative to ABC's business
6. Action badge — FYI / Assess / Act & Escalate
7. So what for ABC? — names the specific business unit, states the concrete implication

**Filters.** Combine geography, topic, and action type. The summary updates to show how many items are visible versus the full edition.

**Sales Data tab.** European registration figures for Toyota, BYD, MG, and others — brands that map directly to ABC's distribution and competitive position. Toggle between volume and market share. Use the table for the underlying numbers.

**Share as Email.** Top right. Generates a formatted newsletter from the current view, active filters included.

---

## This is a proof of concept. Five builds would make it production-ready.

**1. Automated refresh via live API calls**
The app currently holds one hardcoded edition. A production build would run scheduled API calls to classify new articles, update the edition, and complete fact-check and CSO review passes on a fortnightly cycle. The author only sees the output.

**2. Real-time sales data from primary sources**
Sales figures currently come from a secondary aggregator (best-selling-cars.com). A production build pulls directly from ACEA, SMMT, and JATO — the primary registration data providers for Europe and the Middle East — on a monthly cycle. This removes the aggregator lag and gives the CSO figures she can cite in board materials.

**3. A single orchestrating agent handles refresh, review, and distribution**
Today the author manually triggers each step. The next build adds one orchestrating agent: it runs the news fetch, classification, fact check, and CSO review on schedule, then sends the draft to the author for a single approval before the newsletter goes out. The author's only job is to read and send.

**4. Specialist agents review what the news means for each part of ABC**
The current CSO review applies one perspective to every item. A production build runs four agents in parallel: Sales (revenue and volume implications), Commercial (supplier and partner relationships), and a Country Head agent for each of ABC's key markets. Each reads the same item and returns a different so-what. The author sees all four views before signing off.

**5. Engagement tracking closes the loop on what gets read**
There is currently no feedback mechanism. A production build tracks which cards readers open, which action types prompt follow-up, and which topics generate the most response. That data feeds back into how future editions are classified and prioritised. The briefing gets sharper the more it is used, without the author updating the criteria each time.

---

*ABC internal briefing tool · May 2026 · Zheng Li Lim*
