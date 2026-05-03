# SALESDATA_REFRESH_PROMPT.md — Sales Data Refresh

Paste into Claude Code to update the sales data. Touches `sales-data.js` and `context/abc-context.txt` only — no intelligence editions, no code, no styling.

Before starting, read:
1. `context/abc-context.txt` — source of truth for which markets ABC operates in (used to verify any market-specific commentary in the sales tab)
2. `sales-data.js` — current data state

---

## Step 0 — Update the context file

Before fetching sales data, check whether ABC's brand-market operations have changed.

Fetch and read:
- `https://www.jameelmotors.com/en/our-story/`
- `https://www.alj.com/en/news/` (recent news for new market or brand announcements)

Compare against `context/abc-context.txt`. Update the file if any confirmed changes are found — new market entries, new brand agreements, status changes, or removals. Use the same format as the existing file and note the source and date.

If nothing has changed, state "Context verified — no changes" and continue.

---

## Step 1 — Check what years are already in the file

Read `sales-data.js`. Note:
- The current `SALES_YEARS` array
- The most recent year already populated in `BRAND_SALES`, `COUNTRY_SALES`, and `BEV_2025`

---

## Step 2 — Fetch latest data from source

Go to: `https://www.best-selling-cars.com/european-new-car-sales-statistics-links/`

Check whether a full-year page exists for the year after the most recent year in `SALES_YEARS`.

**Brand/manufacturer data — fetch if available:**
`https://www.best-selling-cars.com/europe/[YEAR]-full-year-europe-best-selling-car-manufacturers-and-brands/`

Extract the complete table: manufacturer name, units that year, units prior year, % change. Copy numbers verbatim. Do not round or estimate.

**Country data — fetch if available:**
`https://www.best-selling-cars.com/europe/[YEAR]-full-year-europe-car-sales-per-eu-uk-and-efta-country/`

Extract the complete country table: country name, units, prior year units, % change. Copy verbatim.

**BEV data — fetch if available:**
`https://www.best-selling-cars.com/europe/[YEAR]-full-year-europe-bev-electric-car-sales-per-european-country/`

Extract: country, BEV units, BEV % of total. Copy verbatim. Note: this page has previously returned 404 for some years — if unavailable, do not estimate.

**If a page returns 404 or has no data table, note that and do not populate that section.**

---

## Step 3 — Cross-check for prior year consistency

The new year's page will show both the current year AND the prior year as a comparison column. Compare the prior-year figures shown on the new page against the figures already in `sales-data.js` for that year. If they differ (data revisions happen), note the discrepancy and use the more recently published figure.

---

## Step 4 — Compute "Others" for brand data

For each new year added:
`Others = MARKET_TOTAL[year] − sum of all named brands in BRAND_SALES for that year`

The `MARKET_TOTAL` comes from the grand total line on the country page (EU + EFTA + UK combined). Do not estimate this figure — if the grand total is not on the page, note it.

---

## Step 5 — Update sales-data.js

Add the new year to:
- `SALES_YEARS` array
- `MARKET_TOTAL` object
- Each brand's data object in `BRAND_SALES`
- Each country's data object in `COUNTRY_SALES`
- `BEV_2025` — only if the year is 2025 and BEV data is available; otherwise create `BEV_[YEAR]` as a new export following the same shape

If BEV data is not available for a new year, add a comment: `// BEV [YEAR] — source page unavailable`

Do not add `SALES_YEARS` values you do not have confirmed data for.

---

## Step 6 — Update the coverage note in app.js

In `buildSalesChart()`, find the `coverageMap` object and update the confirmed years string (e.g., `'2023–2025 confirmed'` → `'2023–2026 confirmed'`).

Also update the disclaimer text in `renderSalesData()` to reflect the new year range.

---

## Step 7 — Verify

Start `node serve.mjs` and open `localhost:3000`. Navigate to the Sales Data tab:
- New year appears in the Year checkboxes
- By Brand chart shows the new year's bars
- Totals row in the data table matches MARKET_TOTAL for the new year
- "Others" bar is present and non-zero
- Coverage note in the subtitle shows the updated year range

---

## Notes on data quality

- All figures are from best-selling-cars.com which sources from ACEA and national registration authorities
- Figures are for **passenger vehicles only** — EU + EFTA + UK combined
- BYD 2023 was below the reporting threshold on the source page — stored as 0
- Minor discrepancies between pages (e.g., 2024 figures differ slightly between the 2024 page and the 2025 page's prior-year column) are due to data revisions; use the most recently published figure
- Display values are rounded to nearest 100,000; values below 50,000 show as "n/a"

---

*Sales data refresh only. Never modify data.js, app.js (except the coverage note), style.css, or index.html.*
*ABC internal briefing tool · Confidential*
