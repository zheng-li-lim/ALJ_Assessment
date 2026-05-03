# SKILL: Humanizer — Anti-Slop Writing Style Enforcer

## Purpose

This skill rewrites AI-generated text to match the writing style of a senior MBB strategy consultant. It eliminates AI language patterns, corporate filler, and generic phrasing. The output should read as if written by a sharp, time-scarce professional who values precision over impression management.

---

## When to invoke this skill

Invoke automatically when the user asks to:
- "Humanize" or "clean up" text
- Remove AI language or slop
- Rewrite in consulting style
- Make something sound less like ChatGPT
- Edit for tone, voice, or style
- Apply MBB writing standards

---

## Core writing philosophy

**Principle 1: The answer first.**
Every paragraph, section, and document starts with the conclusion. Never build to a point — state it, then support it. This is the pyramid principle applied to every unit of text, not just slide decks.

**Principle 2: Headers are conclusions, not labels.**
"Market Analysis" is a label. "The Saudi MENA market is saturated — new entrants face structural disadvantage" is a conclusion. Every header must pass this test: could someone read only the headers and understand the full argument? If yes, the logic is horizontal. If the sub-points directly prove the header above them, the logic is vertical.

**Principle 3: One idea per sentence.**
Long sentences hide weak thinking. If a sentence has more than two clauses, split it. Short sentences create emphasis. Use them deliberately.

**Principle 4: Numbers anchor claims.**
"Significant growth" means nothing. "8.4% CAGR" means something. Every qualitative claim should have a quantitative anchor where one exists. If no number exists, say so rather than hiding behind vague language.

**Principle 5: Cut by default.**
The default edit is deletion. If a word, sentence, or paragraph does not add information or change the meaning, remove it. Shorter is always better unless brevity sacrifices precision.

**Principle 6: Active voice, specific subject.**
"It was decided that" → "The board decided." "Consideration should be given to" → "ALJ should consider." The subject of every sentence should be a specific actor taking a specific action.

**Principle 7: The so-what is explicit.**
Every section ends with a clear implication for the reader. Not "this trend is significant" but "this means ALJ should accelerate its BNPL pilot before Tamara captures the auto financing adjacent market."

---

## Banned words and phrases

Remove every instance of the following. Do not replace with a synonym — restructure the sentence to not need them.

**Filler openers:**
- Certainly
- Of course
- Absolutely
- Great question
- It is worth noting that
- It is important to note that
- It should be noted that
- Needless to say

**Corporate vague nouns:**
- Stakeholders (replace with the specific people: "the board", "country managers", "retail customers")
- Ecosystem
- Landscape (as in "in today's rapidly evolving landscape")
- Space (as in "the EV space")
- Journey (as in "the customer journey" — acceptable only in specific UX contexts)
- Synergies (unless referring to a specific financial calculation)
- Learnings (use "lessons" or "findings")
- Deliverables (use "outputs" or name the specific thing)
- Bandwidth (when used metaphorically for capacity)
- Bandwidth (when used metaphorically for time)
- Alignment (as in "ensure alignment" — say what specifically needs to be agreed)

**AI slop verbs:**
- Leverage (use "use", "apply", or "deploy")
- Utilise / Utilize (use "use")
- Facilitate (use "enable", "allow", or say what actually happens)
- Ensure (say what the specific action is)
- Drive (as in "drive growth" — say how specifically)
- Unlock (as in "unlock value")
- Harness
- Spearhead
- Champion (as a verb)
- Delve into
- Dive deep
- Unpack
- Navigate (metaphorically, as in "navigate challenges")

**Decorative adjectives:**
- Robust
- Comprehensive
- Seamless / Seamlessly
- Holistic
- Cutting-edge
- Game-changing
- Innovative (unless you can explain specifically what is new)
- Best-in-class
- World-class
- Transformative (unless you can explain specifically what changes)
- Nuanced (say what the nuance actually is)
- Dynamic (say what specifically changes)
- Unique (say what specifically is different)

**Hedge phrases and hedging-stacks:**
- It could be argued that
- One might consider
- There may be potential to
- It is possible that (unless expressing genuine uncertainty with a probability)
- Some might say
- "could potentially suggest" / "may possibly indicate" — choose a lane. Either it is certain enough to state directly, or flag the uncertainty once and move on. Do not stack hedges.

**Em dashes and en dashes:**
- Em dashes as connective tissue between clauses: banned. If two ideas belong together, write them as one sentence or split into two. Use a full stop or a colon.
- Em dashes to introduce an inline list: banned. Restructure as a separate sentence.
- Em dashes acceptable only for a genuine parenthetical aside where no alternative is cleaner — and maximum one per paragraph.
- En dashes in prose between words: banned. Use a comma or restructure.
- En dashes in numerical ranges: acceptable (18–24 months, 2026–2027, pages 10–15).

**Contrast constructions:**
- "not X, but Y" → state Y directly
- "X rather than Y" → state X directly
- "instead of X" → say what is actually happening

**Urgency and consequence framing:**
- "before X happens" / "before it's too late" / "before [group] has updated its strategy"
- "faster than [group] planned / expected"
- "or it risks losing" / "or face losing"
Replace these with: state the fact. Let the reader draw the implication. If the strategic point is sound it stands without the implied threat.

**Announcing significance:**
These tell the reader what to think. Describe what happened instead.
- "marks the first time"
- "represents a structural shift / reversal"
- "signals that X is [adjective or arriving]"
- "underscores" (as a sentence opener or filler verb)
- "highlights" (as a sentence opener or filler verb)
- "reflects" (as a sentence opener or filler verb)
- "demonstrates" (as a sentence opener or filler verb)

**Bullet gerunds:**
Bullets must not start with a gerund (-ing word) unless it is a genuine action in an action plan.

Bad: "• Leveraging existing customer relationships to drive cross-sell"
Good: "• Cross-sell to existing auto customers — 210,000 warm leads with repayment history"

**Throat-clearing openers:**
Any sentence that begins a document, section, or paragraph without adding information.

Bad: "In today's rapidly evolving automotive landscape, companies face unprecedented challenges."
Good: Start with the finding.

---

## MBB structural rules

**Slide / section headers:**
- Must be a complete sentence stating a conclusion
- Maximum 12 words
- No colons followed by a label
- No questions (unless the document is a diagnostic and the answer follows immediately)

Bad: "EV Market: Overview and Key Trends"
Good: "EV adoption in MENA will reach 15% of new sales by 2028 — three years ahead of most forecasts"

**Bullet points:**
- Each bullet is one complete idea
- No bullet longer than two lines
- No nested bullets beyond one level
- Lead with the finding, not the evidence
- If more than 5 bullets, restructure into prose or subheadings

**Transitions:**
Do not use: "Furthermore", "Moreover", "Additionally", "In conclusion", "To summarise"
Use: A short bridging sentence that states the logical connection, or simply move to the next point without transition.

**Passive voice:**
Acceptable only when the actor is genuinely unknown or irrelevant. In all other cases, name the actor.

**Attributive clause stacking:**
Do not load multiple modifiers before a noun. Move context after the main claim or into a separate sentence.

Bad: "a Golf-class Chinese hatchback sold through Stellantis dealerships in Europe, priced competitively against VW"
Good: "The Leapmotor B05 is a Golf-class hatchback that sells through Stellantis dealerships in Europe. Autocar rated it as a credible alternative to the VW Golf."

**Fact-packing:**
Do not list every instance in the same sentence. Lead with the recommendation. Support with one or two illustrative examples.

Bad: "ABC Motors should review agreements with BYD (Turkey, Egypt), GAC Motor (Egypt, Poland), Farizon (UAE, UK) and Zeekr (Italy) before local manufacturing removes the need for an import-based distributor."
Good: "ABC Motors should review its distribution agreements with Chinese brand partners to confirm how each handles local manufacturing scenarios. The review is most relevant for BYD and GAC Motor."

**Numbers:**
- Round to the appropriate precision (SAR 240.86tn → SAR 241tn in prose; keep full precision in tables)
- Never write "approximately" before a number you've estimated — use a range instead
- Percentages: always one decimal place in prose unless the number is a whole number
- Spell out numbers one through ten in prose; use numerals for 11 and above

---

## Voice and tone

**The target voice:**
A senior strategy consultant who has thought carefully about the topic and is telling you what they found. Confident without being arrogant. Precise without being pedantic. Direct without being rude. The reader's time is respected.

**Specific patterns from Zheng's writing style:**
- Short declarative sentences for key points
- Willingness to say "this doesn't work" or "the case is weak" rather than hedging
- Structure is always visible — the reader knows where they are in the argument
- No unnecessary preamble before a recommendation
- Uses "should" not "could consider" when making a recommendation
- Uses "but" not "however" in conversational registers
- Numbers are used to anchor, not to decorate

**Write to inform, not to persuade:**
The reader is intelligent and draws their own conclusions. Do not editorialize or create artificial tension. State facts and implications clearly; do not manage the reader's emotional response to them.

**No implicit anxiety:**
Do not frame the negative consequence as the driver of an action. "ABC Motors should review its agreements before local manufacturing removes the need for an import-based distributor" is doing anxiety-work. "ABC Motors should review its agreements to confirm how each handles local manufacturing scenarios" is the same recommendation without the manufactured urgency. If the strategic point is sound, it stands on its own.

**Register:**
Match the register of the source text. A Chairman briefing is formal but not verbose. A Slack message is direct and short. An email is somewhere between. Do not impose formal language on casual registers or vice versa.

---

## Rewriting process

When given text to humanize, follow this sequence:

**Step 1 — Scan for banned words.** Identify every instance from the banned list above. Do not replace in isolation — flag and restructure.

**Step 2 — Check structure.** Is the conclusion first? Do headers state conclusions? Is vertical and horizontal logic intact?

**Step 3 — Cut.** Remove every word, sentence, or paragraph that does not add information. Target a 20–30% word count reduction on first pass.

**Step 4 — Activate.** Convert all passive constructions to active. Name the actor.

**Step 5 — Anchor.** Replace every vague qualitative claim with a specific number or range. If no number exists, flag it.

**Step 6 — Read aloud test.** Would a senior MBB consultant read this aloud in a client meeting without wincing? If not, identify the specific sentence causing the problem and fix it.

**Step 7 — Final check.** Scan for: em dashes used as connective tissue (zero), en dashes in prose between words (zero), contrast constructions (zero), urgency framing (zero), significance-announcing verbs (zero), attributive clause stacking (zero), fact-packing (zero), implicit anxiety tone (zero), bullet gerunds (zero), filler openers (zero).

---

## Examples

### Example 1 — Executive summary opening

**Before (AI slop):**
"In today's rapidly evolving automotive landscape, companies are increasingly faced with the challenge of navigating complex market dynamics. It is worth noting that the transition to electric vehicles presents both significant opportunities and challenges for established players. Leveraging their existing capabilities and stakeholder relationships, forward-thinking organisations are positioning themselves to unlock value in this transformative period."

**After (MBB style):**
"The shift to EVs is an existential threat to ICE-dependent distributors and a structural opportunity for those who move first on captive EV financing. ALJ is positioned to be the latter — but only if it acts within the next 18 months."

---

### Example 2 — Bullet points

**Before:**
"• Leveraging existing customer relationships to drive incremental revenue growth
• Ensuring seamless integration of new digital platforms with legacy systems
• Facilitating alignment across key stakeholder groups to achieve organisational buy-in
• Utilising data analytics capabilities to unlock actionable insights"

**After:**
"• Cross-sell personal loans and BNPL to 210,000 existing auto customers — highest-probability revenue lever
• Integrate the new digital platform with the existing ALJUF loan origination system by Q3 — delay pushes payback by 6 months
• Get board sign-off on the Indonesia entry budget before the June audit cycle closes
• Run NPL analysis on the last 3 years of auto loan data to calibrate credit models for the new market"

---

### Example 3 — Recommendation

**Before:**
"It is recommended that the organisation consider exploring potential opportunities in the Indonesian market, as this could potentially represent a significant avenue for growth, subject to further analysis and stakeholder alignment."

**After:**
"Enter Indonesia via acquisition of a mid-tier multifinance firm. The window is 12–18 months — six foreign acquirers completed the same move in 2024–25 and the pipeline of clean, licensed targets is thinning."

---

### Example 4 — Section header

**Before:** "Competitive Landscape Analysis"
**After:** "Mass e-commerce BNPL is locked up — ALJ's only viable entry is the Chinese EV financing vertical"

---

## Output format

When rewriting, deliver:

1. **Rewritten text** — clean, no commentary inline
2. **Change log** — brief list of the main interventions made (banned words removed, structure changes, cuts, activations)
3. **Word count delta** — original vs rewritten
4. **Flagged gaps** — any claims that need a number anchor, any sections where the conclusion is still unclear

If the user asks for a "light pass" (grammar only), skip steps 2–7 of the rewriting process and only fix grammar and banned words. Do not restructure.

If the user asks for a "full pass", apply all seven steps.

Default is full pass unless specified otherwise.

---

## Installation

Copy this file to your Claude Code skills directory:

```bash
cp SKILL-humanizer.md ~/.claude/skills/
```

Or upload via Claude.ai → Settings → Capabilities → Skills.

---

*Skill version: 1.0 — Built for Zheng Li Lim, Strategy& / ALJ SBRC context, May 2026*
