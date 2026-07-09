# FSGA Packs — Signature Hero + Useful-Not-Generic Suggestions

**Date:** 2026-07-09
**Feature:** `/fsga/pack/[slug]` personalized packs
**Status:** Design — awaiting review

## Problem

Every attendee pack is derived purely from `roleCategory` (7 buckets). `companyType`
is captured per attendee but **never used** by `matchSkills()`. Consequences:

- All ~60 `executive-founder` attendees get the **identical** 6 skills, same order,
  same hand-written-but-role-generic reasons.
- Wrong skills reach the wrong people: Scott Fish (Fantasy Cares, a **charity**) is
  shown `board-investor-update-draft` ("dread of the monthly investor update") and
  `competitor-movement-summary`.
- `customReason` ("Why this one for you") names nothing about the person or company.
- `starterPrompt` ships literal `[ROLE] at [COMPANY]` placeholders → attendee must
  fill blanks → reads generic and isn't immediately runnable.

Net: the pack reads like a generic role handout, not a personalized, immediately
useful artifact.

## Goals

1. **Suggestion, not prescription.** Pack is a starting point; the real payoff is the
   attendee building their own Skill.
2. **Ubiquitous over niche.** Suggest skills nearly anyone actually uses; drop niche
   role skills that misfire.
3. **One signature hero** (curated) that feels bespoke to notable attendees.
4. **Immediately usable.** Every suggested skill is copy-to-any-AI-agent and
   download-as-`SKILL.md` ready — no blanks to fill.
5. **Frictionless on-ramp** to `/fsga/build-your-own`, pre-filled from any suggested
   skill.

## Non-goals / constraints

- **Event-safe, deterministic, static.** No AI in the pack path, no runtime compute,
  no DB, no schema change. Pack pages stay `force-static` SSG.
- **Frozen slugs** (`attendees.ts`) untouched — QR-printed.
- **No emails** anywhere (public repo). Unchanged.
- No AI batch generation now (possible later enhancement, explicitly out of scope).

## Architecture

Four deterministic units, each independently testable, plus two presentation changes.

### 1. `matchSkills()` — company-aware selection (`lib/fsga/matching.ts`)

Add `companyType` as a second selection axis and make the **ubiquitous set** the
backbone of every pack.

- **Ubiquitous core** (new constant): `inbox-triage-assistant`,
  `meeting-notes-to-action-items`, `daily-priority-planner`,
  `relationship-follow-up-reminder`, `reading-research-summarizer`. High hit-rate for
  any role.
- **Company accent map** (new): `Record<CompanyType, RuleEntry[]>` — 1–3 slugs that
  fit what that company *does* (e.g. `media-content` → content/audience skills,
  `agency-services` → proposal/client skills, `operator-platform` → product/retention,
  `data-technology` → research/tool-eval). Reasons hand-written, tied to the company
  type, never generated.
- **New composition order** (deduped, capped at `MAX_MATCHES`):
  1. Pain-matched (unchanged, still honored when a pain is supplied)
  2. Up to 2 company accents (drop niche misfires like investor/board decks)
  3. Ubiquitous core (fills the rest)
  4. Role rules only as a final backfill if still short

  Role rules stay as the safety net; they no longer dominate.
- `assertRuleSlugsExist()` extended to validate the new tables. Fail-fast preserved.

### 2. Hero skill synthesis — **curated only** (`lib/fsga/data/overrides.ts`)

The branded "`scott-fish-style`" hero is a **curation feature**, not a per-attendee
guess. It lives in `overrides.ts` (already the stand-in for the dormant admin UI).

- New optional `hero` field on `PackOverride`:
  ```ts
  hero?: {
    baseSkillSlug: string;   // a real library skill — reuse its guts
    name: string;            // "Scott-Fish-Style Follow-Up Engine"
    customReason: string;    // names the actual company/work
    starterPrompt?: string;  // pre-filled; overrides base's [ROLE]/[COMPANY]
  }
  ```
- A hero is a **library skill wearing a personalized name/reason/prompt** — reuses the
  base skill's `inputs / processSteps / outputs / description` so it is always rich and
  safe, never thin.
- `packs.ts` `buildPacks()`: when `override.hero` is present, prepend a resolved hero
  item at rank 1 (`recommendedFirst`, flagged `isSignature`) ahead of the matched list;
  dedupe the base slug out of the matched tail.
- **No hero override → no branded hero.** Default pack = unbranded ubiquitous skills
  from `matchSkills()`. Walk-ins / unknown slugs (already `notFound()` → SearchBox) are
  untouched. This is the graceful fallback the user asked for.
- Scott Fish gets the first hand-written hero; VIP/demo attendees added as needed.

### 3. Skill export helpers — pure, testable (`lib/fsga/skill-export.ts`, new)

Two pure functions, no React, unit-testable:

- `compileSkillPrompt(skill): string` — a self-contained, ready-to-paste prompt for any
  AI agent: one-line role setup + when-to-use + numbered process + the (pre-filled)
  starter prompt. No `[ROLE]/[COMPANY]` blanks when the skill carries a resolved prompt.
- `compileSkillFile(skill): string` — a real `SKILL.md`: YAML frontmatter
  (`name`, `description`) + `## When to use / ## Inputs / ## Process / ## Output /
  ## Starter prompt`. Mirrors the Anthropic Skill folder shape the deck teaches.

### 4. Card export UI (`components/fsga/skill-actions.tsx`, new client component)

Replaces the lone `CopyButton` in `SkillCard` with a small action row:

- **Copy as prompt** — copies `compileSkillPrompt(skill)` (reuses existing clipboard
  idiom from `copy-button.tsx`).
- **Download Skill** — client-side `Blob` + anchor download of `compileSkillFile(skill)`
  as `{slug}.md`. No server.
- **Make this your Skill →** — deep-links to `/fsga/build-your-own` pre-filled (see §6).

Server-rendered card, client-only actions — same boundary pattern as today.

### 5. `SkillCard` presentation (`components/fsga/skill-card.tsx`)

- Accept optional `isSignature` → render a `signature` accent pill and slightly
  elevated styling for the hero.
- Swap the starter-prompt footer's single copy button for the §4 action row.
- Keep everything else (workflow strip) intact.

### 6. Build-your-own multi-param prefill (`components/fsga/build-skill-form.tsx` + `pack-view.tsx`)

- `build-skill-form.tsx`: extend the existing `?task=` hydration to also read
  `input`, `output`, `goal` and prefill `inputType / outputType / successGoal`. Same
  "never clobber typing" guard. So **"Build your own like this"** lands with the whole
  turn-X-into-Y-so-that-Z sentence filled.
- `pack-view.tsx`: hero-first ordering; reframe header/CTA copy to "a starting point —
  your best Skill is the one you build"; the bottom build-your-own block becomes the
  prominent primary action, deep-linked & pre-filled from the hero (or the top match
  when there's no hero).
- Deep-link builder: a small helper mapping a `Skill` → query string
  (`task/input/output/goal` from `repeatedWork / inputs[0] / outputs[0] / bestFor`).

## Data flow

```
attendee (role, companyType)
  └─ matchSkills() ── ubiquitous core + company accents ── ranked items
overrides[slug].hero (optional)
  └─ resolve base library skill + brand name/reason/prompt ── rank-1 signature item
buildPacks() ── merge hero + matched (dedup) ── PublicPack (static, build time)
PackView ── SkillCard[] (hero flagged) ── per card:
   Copy-as-prompt · Download SKILL.md · Make-this-your-Skill→ (prefilled build form)
```

## Error handling

- Unknown `baseSkillSlug` in a hero → fail-fast at `buildPacks()` init (same as existing
  slug validation) — breaks the build, never renders a gap to a live attendee.
- Unknown skill slug in a card (existing) → skipped + logged, unchanged.
- Clipboard / download unsupported → button no-ops gracefully; the full prompt is also
  visible on the card to copy manually (unchanged fallback).
- All export is client-side & deterministic → nothing to 500 at the venue.

## Testing

- `matchSkills()`: company-aware selection per `companyType`; ubiquitous core always
  present; niche skills dropped; dedupe + cap; pain still honored; unchanged role
  backfill when short.
- `skill-export.ts`: `compileSkillPrompt` / `compileSkillFile` snapshot for a sample
  skill; assert no `[ROLE]`/`[COMPANY]` residue when prompt is resolved; valid frontmatter.
- `buildPacks()`: hero override prepends rank-1 signature, dedupes base from tail;
  no-hero attendee → pure ubiquitous pack; bad hero slug throws.
- Deep-link builder: `Skill` → correct prefilled query string.
- `npm run fsga:check` (attendee + email-leak tripwire) still green.

## Files touched

| File | Change |
|------|--------|
| `lib/fsga/matching.ts` | companyType axis, ubiquitous core, accent map, new order |
| `lib/fsga/data/overrides.ts` | `hero` field + Scott Fish (and VIP) heroes |
| `lib/fsga/data/packs.ts` | resolve + prepend hero, dedupe |
| `lib/fsga/skill-export.ts` | **new** — compileSkillPrompt / compileSkillFile |
| `components/fsga/skill-actions.tsx` | **new** — copy-prompt / download / build CTA |
| `components/fsga/skill-card.tsx` | `isSignature`, action row |
| `components/fsga/pack-view.tsx` | hero-first, reframed on-ramp copy |
| `components/fsga/build-skill-form.tsx` | multi-param prefill |

No DB, no schema, no runtime AI, no frozen-slug changes.
