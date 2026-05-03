# CLAUDE.md — ABC Mobility Intelligence App

## Project Context

This is a fortnightly automotive sector intelligence briefing built for **ABC** (internal codename for Abdul Latif Jameel / Jameel Motors — use "ABC" in all app output, never the real name). The audience is the Chief Strategy Officer and Chairman. Every decision — design, content, code — must reflect that: executive, data-driven, precise.

**This is a static app. There are no API calls of any kind.** No Anthropic API, no external data fetching at runtime. All content is hardcoded in `data.js` and `sales-data.js`. Fact check and CSO review are deterministic rule-based scripts, not AI calls.

**Geographic scope — strict:** Middle East and Europe only. Either directly from these regions, or global news with a clear and explicit indirect impact on ABC's markets. Do not include news relevant only to the US domestic market, Asia-Pacific, or Latin America unless a MENA/Europe implication is explicitly stated.

**Read `context/abc-context.txt` before writing any content.** This file contains confirmed brand-market pairings, business units, and strategic priorities. Every actionText and soWhat must be grounded in this file. Never reference a brand in a market where ABC does not operate.

---

## Always Do First

- Read `context/abc-context.txt` before any content generation
- Invoke SKILL-Frontend-Modified before writing any frontend code, every session, no exceptions
- Serve on `localhost:3000` via `node serve.mjs` before any screenshot. Never screenshot a `file:///` URL
- Minimum 2 screenshot comparison rounds before declaring any UI complete

---

## Brand-Market Matrix

**Source of truth: `context/abc-context.txt`** — always read this file before writing any content. Do not rely on any hardcoded list from memory or from this file. The context file is updated by the refresh prompts whenever official sources change.

Content and code may only reference a brand in a market if that pairing is confirmed in `context/abc-context.txt`. If a brand is listed as "no specific market confirmed", treat it as a portfolio brand only — never as an active distribution relationship.

---

## Skills

Three skills are active. Each has a specific trigger. Do not invoke outside their trigger conditions.

### SKILL: Frontend-Modified
**File:** `Skills/SKILL-Frontend-Modified.md`
**Trigger:** Any frontend code — HTML, CSS, JavaScript UI. Every session, no exceptions.

For this project:
- **Purpose:** Executive intelligence briefing for a Chairman and CSO at a global automotive conglomerate
- **Tone:** Luxury/refined editorial — Financial Times meets The Economist. Authoritative, precise, unhurried.
- **Differentiation:** This must look like a real intelligence product, not a dashboard built by a developer.

### SKILL: Humanizer
**File:** `Skills/SKILL-humanizer.md`
**Trigger:** Any time written content is being created — news summaries, executive summaries, actionText, soWhat fields. Apply to all manually written content.

**Banned words:** Leverage, Utilise, Facilitate, Ensure, Drive (growth), Unlock, Harness, Delve, Synergies, Stakeholders, Ecosystem, Landscape (metaphorical), Alignment, Learnings, Robust, Comprehensive, Seamless, Holistic, Cutting-edge, Game-changing, Transformative, Nuanced, Dynamic.

**Structural rules:** Conclusion first. One idea per sentence. Active voice. Numbers anchor claims. soWhat must name the specific ABC business unit (ABC Motors, Automotive Aftermarket, or ABC Finance) and state a concrete implication.

### SKILL: email-html-mjml
**File:** `Skills/email-html-mjml.md`
**Trigger:** Only when the "Share as Email" button is clicked and email export is being generated.

---

## Brand Identity

### Colours

| Name | Hex | Use |
|---|---|---|
| Prussian Blue | `#002B5C` | Backgrounds, headers, nav |
| ABC Steel | `#4A6F8A` | Accents, active states, tags |
| White | `#ffffff` | Card backgrounds, body text on dark |
| Off-white | `#f7f4ef` | Page background |
| Shuttle Grey | `#5b6770` | Secondary text, metadata |
| Robin Egg | `#2dccd3` | "Other Interesting News" tag |
| ABC Gold | `#c9a84c` | High-relevance scores, accents |
| Motorsport Red | `#C8102E` | "Act & Escalate" badge, alerts |
| Acid Pear | `#e0e721` | Accent only, never background |

Never use default Tailwind blue/indigo. Never invent colours outside this palette.

### Typography

**Brand font:** Karbon (licensed — do not embed without approval).
**Web substitute:** Playfair Display (display headings) + refined body font from Frontend skill.

---

## File Structure

```
project/
├── context/
│   └── abc-context.txt          ← confirmed brand-market matrix, business units
├── Skills/
│   ├── SKILL-Frontend-Modified.md
│   ├── SKILL-humanizer.md
│   └── email-html-mjml.md
├── index.html
├── style.css
├── app.js                       ← main application, no API calls
├── data.js                      ← seed editions + SEED_VERSION for cache invalidation
├── sales-data.js                ← European car sales data (hardcoded, no fetch)
├── agent-factcheck.js           ← rule-based fact check (no API)
├── agent-cso.js                 ← rule-based CSO review (no API)
├── serve.mjs                    ← local dev server
├── CLAUDE.md
├── BUILD_PROMPT.md
├── NEWS_REFRESH_PROMPT.md
├── SALESDATA_REFRESH_PROMPT.md
└── .gitignore
```

---

## Areas of Interest — Exact Strings

| String | Hex |
|---|---|
| `"Regulations"` | `#002B5C` |
| `"Product Innovation"` | `#4A6F8A` |
| `"Competition"` | `#C8102E` |
| `"Retail Innovation"` | `#c9a84c` |
| `"Supply Chain"` | `#5b6770` |
| `"Other Interesting News"` | `#2dccd3` |

## Action Types — Exact Strings

| String | Hex |
|---|---|
| `"FYI"` | `#5b6770` |
| `"Assess"` | `#c9a84c` |
| `"Act & Escalate"` | `#C8102E` |

---

## Content Rules

### soWhat and actionText validation checklist (apply to every item before writing)
1. Does the soWhat name a specific ABC business unit? (ABC Motors, Automotive Aftermarket, or ABC Finance)
2. Is the brand-market pairing confirmed in `context/abc-context.txt`? If the brand is not confirmed in that market, remove the specific brand name and write generically ("brands ABC distributes in that market")
3. Is the geographic reference correct? e.g., "ABC Motors Turkey" only if ABC distributes a relevant brand in Turkey
4. Is the action concrete and time-bound where possible?
5. Does it pass the Humanizer banned-word check?

### SEED_VERSION
Every time edition content in `data.js` is changed, increment `SEED_VERSION`. This forces the browser's localStorage to clear and reload the updated seed data.

---

## Hard Rules

- Invoke SKILL-Frontend-Modified before any frontend code — every session, no exceptions
- Never make any API calls — no Anthropic API, no external fetch at runtime
- Never reference a brand in a market without first confirming the pairing in `context/abc-context.txt`
- Never reference portfolio brands listed as "no specific market confirmed" as active distribution relationships
- Do not use `transition-all` — ever
- Do not use default Tailwind blue/indigo as any primary colour
- Always include footer disclaimer: "AI-generated briefing for strategic orientation only. All recommendations are indicative and require detailed fact-checking and analysis before any action is taken."
- Increment SEED_VERSION in data.js whenever seed content changes
- Do not reference Netlify anywhere

---

## Deployment

GitHub repository auto-deployed to Vercel. No build step required. The app is a static file server — `serve.mjs` is for local development only.

*ABC internal briefing tool · May 2026 · Confidential*
