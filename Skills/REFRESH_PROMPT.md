# REFRESH_PROMPT.md — ALJ Mobility Intelligence App
## Fortnightly Content Refresh

Paste this into Claude Code every two weeks to refresh the intelligence edition.
Do not use this to modify the app structure, design, or code. Content updates only.

Before running:
1. Confirm the app is running correctly at `localhost:3000`
2. Have your Anthropic API key active in `api.js`
3. Note the date range for this edition (e.g., "19 May – 1 June 2026")

---

## What This Refresh Does

1. Archives the current live edition to localStorage with today's date stamp
2. Fetches latest articles from all RSS sources
3. Classifies and scores each article using the scraper agent
4. Selects the 12 most relevant items across all areas of interest
5. Generates a fresh executive summary
6. Fetches latest vehicle sales data from ACEA and Middle East press sources
7. Regenerates the ALJ relevance interpretation on the Sales Data tab
8. Publishes the new edition as the live view

It does not touch any code, styling, agent prompts, or configuration files.

---

## Step 1 — Archive Current Edition

Run in the browser console or trigger via the Editorial Panel:

```javascript
// Archives current live edition before overwriting
const currentEdition = localStorage.getItem('alj_live_edition');
if (currentEdition) {
  const edition = JSON.parse(currentEdition);
  const archiveKey = `alj_archive_${edition.dateRange.replace(/\s/g, '_')}`;
  localStorage.setItem(archiveKey, currentEdition);

  // Maintain only last 6 archives
  const archiveKeys = Object.keys(localStorage)
    .filter(k => k.startsWith('alj_archive_'))
    .sort();
  if (archiveKeys.length > 6) {
    localStorage.removeItem(archiveKeys[0]);
  }
  console.log(`Archived: ${archiveKey}`);
}
```

Confirm in the sidebar that the previous edition now appears as an archived entry before proceeding.

---

## Step 2 — Fetch Latest News

Trigger the Scraper agent via the "Fetch Latest News" button in the Editorial Panel.

The scraper reads all RSS sources in parallel. Wait for the fetch status to confirm how many sources returned successfully. A result of 8 or more out of 11 is acceptable. If fewer than 6 return, check your internet connection before proceeding.

Expected fetch time: 30-60 seconds.

---

## Step 3 — Build New Edition

Set the edition date range in the Editorial Panel input field:
**Format:** "DD Mon – DD Mon YYYY" (e.g., "19 May – 1 Jun 2026")

Trigger the Builder agent via the "Build Edition" button.

The builder will:
- Select the 12 most relevant items from the draft pool
- Generate a fresh executive summary
- Publish the new edition as the live view

---

## Step 4 — Run Quality Checks (Optional but Recommended)

**Fact Check:** Click "Run Fact Check" in the Editorial Panel. Review any flagged items. Dismiss or remove as appropriate.

**CSO Review:** Click "Run CSO Review". Review Robin Loh's verdicts. Action any "Revise" or "Remove" items before sharing.

These steps take 2-3 minutes each. Skip if you are under time pressure — the scraper and builder alone produce a publishable edition.

---

## Step 5 — Refresh Sales Data

Navigate to the **Sales Data** tab. Click "Refresh Data" to fetch the latest ACEA figures and Middle East press-reported sales data.

The ALJ Relevance Panel will regenerate automatically after the data refreshes. If it does not, click "Regenerate Interpretation".

Check that the ACEA data date shown is the most recent available month. ACEA typically publishes registration data 2-3 weeks after month end.

---

## Step 6 — Verify Before Sharing

Before clicking "Share as Email Newsletter", check:

- [ ] Edition date range is correct in the header
- [ ] Executive summary reads cleanly — no banned words, conclusion first
- [ ] All 12 cards are visible with correct area of interest tags and geography tags
- [ ] At least one item per area of interest is present
- [ ] Sales data shows the correct month and source citations
- [ ] No fact-check flags remain unresolved
- [ ] Sidebar shows the previous edition correctly archived

---

## Step 7 — Share

Click "Share as Email Newsletter" to generate the MJML email export.

The email opens in a new tab. Copy the compiled HTML and paste into your email client or ESP.

---

## Troubleshooting

**RSS feeds returning empty:** Some feeds (Gulf News, Arab News) occasionally return empty or malformed XML. If fewer than 8 sources return successfully, wait 10 minutes and retry. The scraper skips failed sources and logs them — check the fetch status panel for details.

**Builder selects fewer than 12 items:** This happens when the scraper pool has fewer than 12 items passing the MENA/Europe relevance filter. Either retry the scraper after a few hours when feeds have updated, or reduce the minimum threshold temporarily by clicking "Build with available items" if that option is shown.

**ACEA data not updating:** ACEA updates monthly, typically on the 3rd-4th week of the following month. If the data shown is from the previous month, it is likely correct — ACEA has not yet published the latest figures. Check `https://www.acea.auto/car-registrations/` directly to confirm.

**Archived edition not appearing in sidebar:** Check localStorage in browser dev tools (Application → Local Storage) for keys starting with `alj_archive_`. If present, trigger a page reload — the sidebar reads localStorage on mount.

---

*Run every two weeks. Do not use to modify app code or configuration.*
*ALJ SBRC · May 2026*
