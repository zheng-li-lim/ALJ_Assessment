# ABC Mobility Intelligence

> Assessment submission by Zheng Li Lim. Questions: [limzl1804@gmail.com](mailto:limzl1804@gmail.com)

ABC is a hypothetical vehicle distribution company for this assessment, modelled on a real international automotive group with operations in the Middle East and Europe.

**Desktop recommended.** The brief is designed for desktop viewing. Mobile will render but some layout elements are limited.

---

## What it does

A fortnightly automotive intelligence brief for ABC's leadership and strategy teams. Each edition covers the Middle East and European markets. Items are classified by topic, scored for relevance to ABC, and assigned one of three action levels.

**Topics:** Regulations, Competition, Product Innovation, Retail Innovation, Supply Chain, Other Interesting News.

**Action levels:**
- **FYI**: worth knowing, no immediate action needed
- **Assess**: warrants analysis before a decision
- **Act & Escalate**: requires a leadership response

**The brief also includes:**
- An executive summary at the top of each edition
- Filters by geography, topic, and action type
- Past editions readily available for reference
- A fact-check layer and a CSO review layer on each item
- A European car sales data tab covering 2023 to 2025
- One-click email export

---

## How the news intelligence works

Items are sourced from 11 publications covering the Middle East and Europe. Anything without a clear MENA or Europe angle is excluded.

**Sources:** Autocar, Bloomberg, The Guardian, InsideEVs, SMMT, ICCT, Best Selling Cars Blog, TechCrunch, and others.

Each item is tagged with:
- Topic (one of six)
- Geography (country or region)
- Relevance score (1 to 5, relative to ABC's confirmed brand and market positions)
- Action type (FYI / Assess / Act & Escalate)
- Action text (what ABC should do)
- So-what (which ABC business unit is affected and how)

Items are shortlisted using a three-dimension scoring model. Each article is scored on brand proximity (does it name a brand ABC distributes?), geographic proximity (is it in a primary or secondary ABC market?), and time horizon (how soon does ABC need to act?). The scores determine both the relevance rating and the action type. Items are ranked by score and selected to fill 12 slots, with coverage constraints applied to ensure the edition spans all six topic areas, includes at least four MENA and four Europe items, and contains at least one Act & Escalate item. Within the edition, Act & Escalate items appear first, then Assess, then FYI, each group sorted by relevance score.

Two quality checks run before an item appears in the edition. Fact check reviews internal consistency and geography plausibility. CSO review removes items with weak or vague so-whats.

ABC's brand and market matrix is maintained in a context file sourced from jameelmotors.com and alj.com, verified May 2026. No brand is referenced in a market without confirmation from that file.

---

## How the sales data works

European passenger car registration figures are sourced from best-selling-cars.com, which compiles data from ACEA. Coverage spans the EU, EFTA, and the UK for 2023 through 2025, passenger vehicles only.

Brands tracked include Toyota, BYD, MG, Volkswagen, and Stellantis, among others relevant to ABC's competitive position.

The Sales Data tab supports filtering by brand and country. When viewing by brand, country filtering is disabled — brand data is aggregated across Europe as a whole, not broken down by country. A toggle between volume and market share is available for all views, with a full data table below the chart.

---

## How to read an edition

**Start with the executive summary.** Each bullet is one development from the fortnight. The last bullet is the required action for ABC.

**Scan the highlights list.** All 12 items grouped by region, each linking to its full card. Use it to prioritise before reading in full.

**Each card contains:**
1. Topic and geography tags
2. Headline, rewritten to be action-oriented rather than descriptive
3. Source and publication date
4. Two-sentence summary with the MENA or Europe angle stated explicitly
5. Relevance score (1 to 5 gold dots)
6. Action badge
7. So what for ABC: business unit named, implication stated

Use the filters to narrow by geography, topic, or action type. The summary updates to reflect how many items are showing.

Share as Email (top right) generates a formatted newsletter from the current view, active filters included.

---

## What a production version would add

The current app is static. Content was researched and hardcoded for this assessment. Five additions would make it production-ready:

1. Scheduled API calls to auto-refresh news, run quality checks, and deliver a draft edition to the author on a fortnightly cycle.
2. Live sales data pulled directly from ACEA, SMMT, and JATO instead of a secondary aggregator.
3. An orchestrating agent that runs the full pipeline end to end, with one author approval step before the newsletter goes out.
4. Specialist agents for Sales, Commercial, and Country Head functions, each generating a function-specific so-what for every item in parallel.
5. Engagement tracking that feeds reader behaviour back into how future editions are classified, so the brief improves over time without the author manually updating the criteria.
6. A fully fluid layout that adapts to any window size, including ultra-wide monitors, with a dynamic grid that redistributes content rather than leaving unused screen space.
7. Access to premium news sources currently behind paywalls — JATO Dynamics, S&P Global Mobility, Automotive News, and Bloomberg — which carry richer market data and forward forecasts than the open publications used in this version.
8. Active maintenance of the specification document as the product evolves. The SPEC records design decisions, known limitations, and future state. It should be updated whenever a significant change is made — otherwise it becomes a historical snapshot rather than a working reference.

---

*ABC internal briefing tool · May 2026 · Zheng Li Lim*
