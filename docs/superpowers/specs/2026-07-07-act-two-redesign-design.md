# Act Two Redesign — Universal Task Grid + Week-Cost Visual

**Date:** 2026-07-07
**Branch:** `skills-prezi`
**Status:** Approved (design confirmed in session)

## Problem

Act two ("he gets our work") is two role-gated `list` slides — "If you're in sales or partnerships" / "If you're in content or media" — 10 bullet cards total. Two failures:

1. **Self-selection splits the room.** Each slide speaks to a subset; the other half disengages while "their" slide isn't up.
2. **Text-heavy.** 10 sentence-length cards across 2 slides. Nobody reads projected paragraphs.

## Goal

Whole room recognizes their own repeat work within seconds, from visuals — role-specific detail moves to speaker notes (spoken, not projected). Preserve act two's pacing: two slides, two audience-interaction beats.

## Design

### Slide 1 — `your-work` (kind: `grid`, replaces `your-work-sales`)

- **Eyebrow:** `act two · your work`
- **Title:** "You do at least one of these"
- **Visual:** 3×2 grid of tiles. Each tile = line-work SVG icon (accent color) + short label (2–5 words). No sentences.

| Icon key | Label | Icon |
|---|---|---|
| `followup` | The follow-up pile | envelope |
| `recap` | The weekly recap | refresh loop |
| `research` | Research before every call | magnifier |
| `deck` | The deck rebuild | presentation screen |
| `formats` | One thing → five formats | share/branch nodes |
| `schedule` | The scheduling dance | calendar |

- **Data shape:** `bullets: ["followup: The follow-up pile", ...]` — icon key prefix parsed at render (same `label: description` parse pattern as `ModelSlide`). Unknown/missing key renders label-only tile (never crashes live).
- **Notes:** JL walks the grid and names role-specific examples aloud (sales: prospect research, deck-per-brand, event follow-ups; content: podcast→clips, newsletter rebuild). Hand-raise beat: "raise a hand when you spot yours."

### Slide 2 — `week-cost` (kind: `week`, replaces `your-work-content`)

- **Eyebrow:** `act two · what it costs`
- **Title:** "What it adds up to"
- **Visual:** five horizontal bars (Mon–Fri). Muted track = the week; accent fill = repeat-work share. Legend: accent swatch + "work you've already done once". Near-zero text.
- **Body:** "About a day and a half, every week, on work you've already done once."
- **Proportions:** hardcoded in the renderer (presentation choice, like `ACCENT_PHRASES`): Mon .35, Tue .20, Wed .45, Thu .25, Fri .35 → avg ≈ 0.32 ≈ a day and a half. Illustrative, not data — notes hedge with "if your week is anywhere near typical."
- **Notes:** callback to act-one "what's your number", keeps the "tax you pay to do your craft" line, second hand-raise beat, hands off to act three.

## Implementation

1. **`lib/fsga/deck/deck-content.ts`** — `SlideKind` gains `"grid" | "week"`; the two act-2 slide objects replaced as above.
2. **`components/fsga/deck/task-icons.tsx`** (new) — six stroke-based SVG icon components, `viewBox 0 0 24 24`, `stroke="currentColor"`, `fill="none"`, sized by parent (stage px, ~80px). Exported as `TASK_ICONS: Record<string, ComponentType>` keyed by icon key.
3. **`lib/fsga/deck/slides.tsx`** — `GridSlide` + `WeekSlide` renderers + dispatch cases (exhaustiveness guard forces both). Existing chrome: `SlideFrame`, card styling (`bg-bg-card border border-line`), accent color.

DB-free by construction, authored in 1920×1080 stage pixels, consistent with every other slide.

## Out of scope

- No changes to other acts, deck shell, static fallback structure (static deck renders from the same `DECK_SLIDES`).
- No icon library dependency — icons hand-rolled inline.

## Verification

- `npx tsc --noEmit` clean.
- Dev server: load deck route, screenshot both act-2 slides, check icon legibility + bar layout at stage scale.

## Revision — 2026-07-07 (same day)

The week-cost bar slide shipped and was cut the same day: "tasks repeat and
add up" is advice the room already knows, and illustrative bars aren't real
data. Slide 2 of act two is now `redo-thinking` (kind `statement`, no custom
renderer): **"You don't just redo the work. You redo the thinking."** — the
process lives only in the presenter's head, so every repeat runs through
them. This is the insight the room hasn't named, and act 3's Skill
definition becomes its direct payoff. The `week` kind, `WeekSlide`, and
`WEEK_LOAD` were removed. Act 3 got a light touch from the Claude-docs
Skills framing: skill-definition body/notes now call back to "the thinking
from act two, written down once — loads every run, never explain twice";
skill-model notes gained the composability beat (Skills stack —
output of one is input of the next). Task grid slide unchanged.
