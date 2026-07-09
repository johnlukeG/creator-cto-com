# FSGA Signature Packs — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make each `/fsga/pack/[slug]` suggestion genuinely useful — a curated signature hero + ubiquitous backups, every card copy-to-any-AI-agent / download-as-`SKILL.md` ready, funneling into a pre-filled build-your-own.

**Architecture:** All deterministic, static, build-time. `matchSkills()` gains a `companyType` axis anchored on a ubiquitous core. A curated `hero` override (in `overrides.ts`) prepends one branded signature skill per notable attendee. Pure `skill-export.ts` helpers compile a paste-ready prompt, a `SKILL.md`, and a pre-filled build-your-own link; a `SkillActions` client component surfaces them on every card. No DB, no schema column, no runtime AI.

**Tech Stack:** Next.js App Router (React Server Components + `force-static` SSG), TypeScript, Tailwind. Verification via `tsx` check scripts (`npm run fsga:check`) + `npm run build` (renders all 152 packs). **This repo has no unit-test runner (no vitest/jest) — do not add one.** The check scripts ARE the test harness: write the failing assertion, run it, watch it fail, implement, run it green.

## Global Constraints

- **Event days away (event ~mid-July 2026, today 2026-07-09).** Every change must be event-safe: deterministic, static, no runtime compute, no network dependency at render.
- **No DB / no schema change.** Pack pages stay `export const dynamic = "force-static"`. The dormant DB path (`lib/fsga/db/queries.ts`) must keep mirroring — any new `PublicPackItem` field is **optional and additive** (undefined in the DB path).
- **Frozen slugs.** Never edit or regenerate slugs in `lib/fsga/data/attendees.ts` (QR-printed).
- **No emails** anywhere (public repo). Don't add any email field.
- **No AI in the pack path.** Batch AI generation is explicitly out of scope.
- **Fail-fast on bad data** at module init / check script — never render a gap to a live attendee.
- Skill library stays exactly 40 skills. Reuse existing library slugs; don't invent skills.
- Verification commands: `npm run fsga:check` (data/logic asserts), `npm run build` (SSG integration), `npm run lint`.

---

### Task 1: Company-aware matching anchored on a ubiquitous core

Rewrite `matchSkills()` so every pack is backed by 5 universally-useful skills, accented by 1–2 skills that fit what the company *does*. Niche role skills (investor/board decks) drop out of the default view.

**Files:**
- Modify: `lib/fsga/matching.ts` (add `UBIQUITOUS_CORE`, `COMPANY_ACCENTS`; rewrite `matchSkills`; extend `assertRuleSlugsExist`; keep `ROLE_RULES` as final backfill; set `MAX_MATCHES = 5`)
- Modify: `scripts/fsga/check-skill-library.ts` (add companyType assertions)

**Interfaces:**
- Consumes: `getSkillBySlug` (from `./skills/library`), `CompanyType`, `RoleCategory`, `WorkflowPain` (from `./skills/types`), existing `SkillMatch`, `RuleEntry`, `ROLE_RULES`, `PAIN_RULES`.
- Produces: `matchSkills(input: MatchSkillsInput): SkillMatch[]` — unchanged signature. New exported const `UBIQUITOUS_CORE: RuleEntry[]` (5 entries) and `COMPANY_ACCENTS: Record<CompanyType, RuleEntry[]>` for the check script.

- [ ] **Step 1: Write the failing assertions**

In `scripts/fsga/check-skill-library.ts`, add this block inside `main()` after the existing role-category loop (before the final `console.log`):

```ts
  // Every companyType yields >= 5 matches, all slugs valid, and includes at
  // least one company accent (proof companyType actually steers selection).
  const { COMPANY_ACCENTS, UBIQUITOUS_CORE } = await import("../../lib/fsga/matching");
  for (const [companyType, accents] of Object.entries(COMPANY_ACCENTS)) {
    for (const accent of accents) {
      if (!slugs.has(accent.slug)) fail(`COMPANY_ACCENTS["${companyType}"] references unknown slug: ${accent.slug}`);
    }
    const matches = matchSkills({ roleCategory: "other", companyType: companyType as never });
    if (matches.length < 5) fail(`companyType "${companyType}" yields only ${matches.length} matches (need >= 5)`);
    const accentSlugs = new Set(accents.map((a) => a.slug));
    if (!matches.some((m) => accentSlugs.has(m.slug))) {
      fail(`companyType "${companyType}" produced no accent skill — companyType not steering selection`);
    }
  }
  // Ubiquitous core anchors every pack: a no-companyType call surfaces it.
  for (const core of UBIQUITOUS_CORE) {
    if (!slugs.has(core.slug)) fail(`UBIQUITOUS_CORE references unknown slug: ${core.slug}`);
  }
  const bareMatches = matchSkills({ roleCategory: "other", companyType: null });
  const coreSlugs = new Set(UBIQUITOUS_CORE.map((c) => c.slug));
  if (!bareMatches.every((m) => coreSlugs.has(m.slug))) {
    fail("a no-companyType 'other' pack should be entirely ubiquitous-core skills");
  }
```

Change the check script's `function main(): void` to `async function main(): Promise<void>` and its call site `main();` to `main();` staying as-is is fine (top-level floating promise is acceptable in these scripts, but make it explicit): replace the final `main();` line with:

```ts
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run fsga:check`
Expected: FAIL — `COMPANY_ACCENTS` is not yet exported from `matching.ts` (import throws / undefined).

- [ ] **Step 3: Add the ubiquitous core + company accents + rewrite composition**

In `lib/fsga/matching.ts`, change the cap and add two tables. Replace `const MAX_MATCHES = 7;` with:

```ts
const MAX_MATCHES = 5;
const MAX_ACCENTS = 2;
```

Add, immediately after the `ROLE_RULES` object closes (before `PAIN_RULES`):

```ts
// ── Ubiquitous core ─────────────────────────────────────────────────────────
// The backbone of every pack: skills nearly anyone benefits from, regardless
// of role. These anchor the shortlist so the default pack is useful even when
// role/company signal is thin. Reasons are hand-written and role-neutral.
export const UBIQUITOUS_CORE: RuleEntry[] = [
  {
    slug: "meeting-notes-to-action-items",
    reason: "Turns any meeting you just left into a clean list of who owns what — the highest-hit-rate skill for anyone with a calendar.",
  },
  {
    slug: "inbox-triage-assistant",
    reason: "Sorts a backlog of messages into act-now, delegate, and quick-reply so nothing important gets buried.",
  },
  {
    slug: "daily-priority-planner",
    reason: "Cuts an overflowing task list down to the 3 things that actually move the needle today.",
  },
  {
    slug: "relationship-follow-up-reminder",
    reason: "Surfaces the people you owe a reply or a check-in before the thread goes cold.",
  },
  {
    slug: "reading-research-summarizer",
    reason: "Gets the value out of a long report, thread, or doc without reading the whole thing.",
  },
];

// ── Company accents ──────────────────────────────────────────────────────────
// 1–3 slugs that fit what a company of this type actually does. Up to
// MAX_ACCENTS are promoted ahead of the ubiquitous core so the pack still
// reads "matched" without drowning in niche role skills. Reasons tied to the
// company type, hand-written, never generated.
export const COMPANY_ACCENTS: Record<CompanyType, RuleEntry[]> = {
  "operator-platform": [
    { slug: "customer-feedback-synthesizer", reason: "For a live platform, turns a flood of tickets and reviews into the themes and quick wins your roadmap needs." },
    { slug: "product-launch-checklist-builder", reason: "Builds the phased launch checklist that catches easy-to-forget items before a release ships." },
  ],
  "media-content": [
    { slug: "episode-to-clips-planner", reason: "Finds the clip-worthy moments so repurposing long-form into short-form stops eating an afternoon." },
    { slug: "social-post-variant-generator", reason: "Adapts one announcement into platform-native posts instead of the same caption pasted everywhere." },
  ],
  "team-league": [
    { slug: "competitor-movement-summary", reason: "Turns a pile of league/market signals into the one-page read on what actually changed." },
    { slug: "strategic-memo-builder", reason: "Structures a hard call into a memo you can align stakeholders around." },
  ],
  "brand-sponsor": [
    { slug: "sponsorship-fit-scorer", reason: "Scores partnership fit against a consistent rubric instead of eyeballing every deal." },
    { slug: "campaign-brief-builder", reason: "Gets everyone aligned on one campaign brief instead of re-litigating the message at kickoff." },
  ],
  "agency-services": [
    { slug: "proposal-outline-builder", reason: "Turns a discovery call into a structured proposal outline you can send the same day." },
    { slug: "prospect-research-brief", reason: "Builds the one-page client brief you need before every first call, from a name and a few signals." },
  ],
  "data-technology": [
    { slug: "tool-evaluation-brief", reason: "Compares options against what actually matters to your team, not just popularity." },
    { slug: "reading-research-summarizer", reason: "Distills a long technical report into the takeaways that matter for your specific angle." },
  ],
  other: [
    { slug: "post-conference-follow-up-planner", reason: "Turns the contacts you just collected into follow-ups before the leads go cold." },
  ],
};
```

Rewrite `matchSkills` (replace the whole function body) so composition is: pain → company accents (≤ MAX_ACCENTS) → ubiquitous core → role rules backfill, deduped, capped:

```ts
export function matchSkills(input: MatchSkillsInput): SkillMatch[] {
  const painEntries = input.pain ? (PAIN_RULES[input.pain] ?? []) : [];
  const accentEntries = input.companyType ? (COMPANY_ACCENTS[input.companyType] ?? []).slice(0, MAX_ACCENTS) : [];
  const roleEntries = ROLE_RULES[input.roleCategory] ?? [];

  const seen = new Set<string>();
  const ordered: RuleEntry[] = [];
  const push = (entries: RuleEntry[]) => {
    for (const entry of entries) {
      if (seen.has(entry.slug)) continue;
      seen.add(entry.slug);
      ordered.push(entry);
    }
  };

  push(painEntries);       // self-reported pain wins the top slot(s)
  push(accentEntries);     // company-fit accents make it read "matched"
  push(UBIQUITOUS_CORE);   // the universally-useful backbone
  push(roleEntries);       // role rules only backfill if still short

  return ordered.slice(0, MAX_MATCHES).map((entry, index) => ({
    slug: entry.slug,
    reason: entry.reason,
    recommendedFirst: index === 0,
  }));
}
```

Extend `assertRuleSlugsExist()` to validate the new tables — add these two loops before the `if (missing.length > 0)` check:

```ts
  for (const entry of UBIQUITOUS_CORE) {
    if (!getSkillBySlug(entry.slug)) missing.push(entry.slug);
  }
  for (const entries of Object.values(COMPANY_ACCENTS)) {
    for (const entry of entries) {
      if (!getSkillBySlug(entry.slug)) missing.push(entry.slug);
    }
  }
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm run fsga:check`
Expected: PASS — prints the existing OK line; no failures. If a slug typo surfaces, fix it against the library list.

- [ ] **Step 5: Commit**

```bash
git add lib/fsga/matching.ts scripts/fsga/check-skill-library.ts
git commit -m "feat(fsga): company-aware matching anchored on a ubiquitous core"
```

---

### Task 2: Skill-export helpers (prompt, SKILL.md, build link, placeholder fill)

Pure functions that turn a resolved `Skill` into things an attendee takes with them. No React — importable by both server and client.

**Files:**
- Create: `lib/fsga/skill-export.ts`
- Modify: `scripts/fsga/check-skill-library.ts` (assert export invariants)

**Interfaces:**
- Consumes: `Skill` (from `./skills/types`).
- Produces:
  - `fillPlaceholders(text: string, ctx: { role: string; company: string }): string`
  - `compileSkillPrompt(skill: Skill): string`
  - `compileSkillFile(skill: Skill): string`
  - `buildYourOwnQuery(skill: Skill): string` (returns a leading-`?` query string)

- [ ] **Step 1: Write the failing assertions**

In `scripts/fsga/check-skill-library.ts`, add inside `main()` (after the Task 1 block, before final `console.log`):

```ts
  // skill-export helpers: placeholder fill leaves no [ROLE]/[COMPANY] residue
  // but preserves other [PASTE …] placeholders; SKILL.md is well-formed; the
  // build-your-own link carries the four prefill params.
  const exp = await import("../../lib/fsga/skill-export");
  const sample = SKILLS.find((s) => s.starterPrompt.includes("[ROLE]") && s.starterPrompt.includes("[COMPANY]"));
  if (!sample) fail("expected at least one library skill whose starterPrompt has [ROLE] and [COMPANY]");
  const filled = exp.fillPlaceholders(sample!.starterPrompt, { role: "Founder", company: "Fantasy Cares" });
  if (filled.includes("[ROLE]") || filled.includes("[COMPANY]")) fail("fillPlaceholders left [ROLE]/[COMPANY] residue");
  if (!filled.includes("Fantasy Cares") || !filled.includes("Founder")) fail("fillPlaceholders did not inject role/company");
  if (sample!.starterPrompt.includes("[PASTE") && !filled.includes("[PASTE")) fail("fillPlaceholders wrongly stripped a [PASTE …] placeholder");

  const md = exp.compileSkillFile(sample!);
  if (!md.startsWith("---\nname: ")) fail("compileSkillFile missing YAML frontmatter");
  if (!md.includes("\n## Process\n") || !md.includes("\n## Starter prompt\n")) fail("compileSkillFile missing required sections");

  const prompt = exp.compileSkillPrompt(sample!);
  if (!prompt.includes(sample!.name) || prompt.trim() === "") fail("compileSkillPrompt produced empty/nameless output");

  const q = exp.buildYourOwnQuery(sample!);
  if (!q.startsWith("?") || !q.includes("task=") || !q.includes("input=") || !q.includes("output=") || !q.includes("goal=")) {
    fail(`buildYourOwnQuery missing prefill params: ${q}`);
  }
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run fsga:check`
Expected: FAIL — `../../lib/fsga/skill-export` does not exist.

- [ ] **Step 3: Implement the helpers**

Create `lib/fsga/skill-export.ts`:

```ts
// FSGA workshop — turn a resolved Skill into take-home artifacts.
//
// Pure module: no React, no DB, no network. Imported by both the server pack
// view and the client SkillActions component. Every function is deterministic
// so the pack pages stay fully static.

import type { Skill } from "./skills/types";

/**
 * Replace the two identity placeholders the library starter prompts carry —
 * [ROLE] and [COMPANY] — with the attendee's real title/company. Other
 * bracketed placeholders (e.g. [PASTE UPDATES], [NEEDS DATA]) are intentionally
 * left intact — those are the attendee's own runtime inputs.
 */
export function fillPlaceholders(text: string, ctx: { role: string; company: string }): string {
  return text.replaceAll("[ROLE]", ctx.role).replaceAll("[COMPANY]", ctx.company);
}

/**
 * A self-contained prompt an attendee can paste into any AI agent (ChatGPT,
 * Claude, etc.) and run immediately. Built from an ALREADY-RESOLVED skill —
 * callers pass a skill whose starterPrompt has had fillPlaceholders applied.
 */
export function compileSkillPrompt(skill: Skill): string {
  const steps = skill.processSteps.map((s, i) => `${i + 1}. ${s}`).join("\n");
  return [
    `You are helping me with a recurring task: ${skill.name}.`,
    skill.description,
    ``,
    `When I ask, do this:`,
    steps,
    ``,
    `I will give you: ${skill.inputs.join("; ")}.`,
    `Deliver: ${skill.outputs.join("; ")}.`,
    ``,
    `---`,
    skill.starterPrompt,
  ].join("\n");
}

/**
 * A real SKILL.md — YAML frontmatter + body — mirroring the Anthropic Skill
 * folder shape the workshop teaches. The attendee downloads this and can drop
 * it straight into a Claude Code skills/ folder.
 */
export function compileSkillFile(skill: Skill): string {
  const bullets = (items: string[]) => items.map((i) => `- ${i}`).join("\n");
  const steps = skill.processSteps.map((s, i) => `${i + 1}. ${s}`).join("\n");
  return `---
name: ${skill.slug}
description: ${skill.description}
---

# ${skill.name}

**Best for:** ${skill.bestFor}

## When to use
${skill.repeatedWork}

## Inputs
${bullets(skill.inputs)}

## Process
${steps}

## Output
${bullets(skill.outputs)}

## Starter prompt
${skill.starterPrompt}
`;
}

/**
 * A leading-`?` query string that prefills the build-your-own form's whole
 * turn-X-into-Y-so-that-Z sentence from this skill. Values capped at the
 * form's 300-char maxLength.
 */
export function buildYourOwnQuery(skill: Skill): string {
  const cap = (s: string) => s.slice(0, 300);
  const params = new URLSearchParams({
    task: cap(skill.repeatedWork),
    input: cap(skill.inputs[0] ?? ""),
    output: cap(skill.outputs[0] ?? ""),
    goal: cap(skill.bestFor),
  });
  return `?${params.toString()}`;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm run fsga:check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/fsga/skill-export.ts scripts/fsga/check-skill-library.ts
git commit -m "feat(fsga): skill-export helpers (prompt, SKILL.md, build link)"
```

---

### Task 3: Curated signature hero override

A hand-written hero prepends one branded signature skill to a notable attendee's pack. Curated only — no override means a clean unbranded ubiquitous pack.

**Files:**
- Modify: `lib/fsga/db/queries.ts` (add optional additive `signature` field to `PublicPackItem`)
- Modify: `lib/fsga/data/overrides.ts` (add `hero` to `PackOverride`; write Scott Fish hero)
- Modify: `lib/fsga/data/packs.ts` (resolve + prepend hero, dedupe base from tail, fail-fast on bad base slug)
- Create: `scripts/fsga/check-packs.ts`
- Modify: `package.json` (append `check-packs.ts` to `fsga:check`)

**Interfaces:**
- Consumes: `matchSkills`, `getSkillBySlug`, `buildPackCopy`, `ATTENDEES`, `PACK_OVERRIDES`.
- Produces: `PublicPackItem` gains `signature?: { name: string; starterPrompt: string } | null`. `PackOverride` gains `hero?: { baseSkillSlug: string; name: string; customReason: string; starterPrompt?: string }`. `getPublicPackBySlug` / `getAllPackSlugs` unchanged signatures.

- [ ] **Step 1: Write the failing check script**

Create `scripts/fsga/check-packs.ts`:

```ts
// FSGA workshop — static integrity check for derived attendee packs.
//
// Usage: part of `npm run fsga:check`. NO DB. Importing packs.ts runs
// buildPacks() at module load, which already fail-fasts on bad data; this
// script surfaces those failures clearly and adds hero-specific asserts.

import { getAllPackSlugs, getPublicPackBySlug } from "../../lib/fsga/data/packs";

function fail(message: string): never {
  console.error(`fsga:check FAILED — ${message}`);
  process.exit(1);
}

async function main(): Promise<void> {
  const slugs = getAllPackSlugs();
  if (slugs.length < 150) fail(`expected ~152 packs, found ${slugs.length}`);

  // Scott Fish is the curated demo hero: rank-1 item must be a signature.
  const scott = await getPublicPackBySlug("scott-fish-23us");
  if (!scott) fail("scott-fish-23us pack missing");
  const hero = scott!.items[0];
  if (!hero.recommendedFirst) fail("scott-fish-23us: rank-1 item is not recommendedFirst");
  if (!hero.signature || !hero.signature.name) fail("scott-fish-23us: rank-1 item is not a signature hero");
  // The hero's base slug must not also appear in the tail (deduped).
  const tailSlugs = scott!.items.slice(1).map((i) => i.slug);
  if (tailSlugs.includes(hero.slug)) fail("scott-fish-23us: hero base skill duplicated in the tail");

  // A non-curated attendee has NO signature item — pure unbranded pack.
  const plain = await getPublicPackBySlug("carter-phillips-2fxn");
  if (!plain) fail("carter-phillips-2fxn pack missing");
  if (plain!.items.some((i) => i.signature)) fail("carter-phillips-2fxn: unexpected signature on a non-curated pack");

  console.log(`fsga:check OK — ${slugs.length} packs; curated hero present; non-curated packs clean.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

Append it to the `fsga:check` script in `package.json`:

```json
"fsga:check": "tsx scripts/fsga/check-skill-library.ts && tsx scripts/fsga/check-attendees.ts && tsx scripts/fsga/check-packs.ts",
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run fsga:check`
Expected: FAIL — `scott-fish-23us: rank-1 item is not a signature hero` (no hero wired yet).

- [ ] **Step 3: Add the optional `signature` field to `PublicPackItem`**

In `lib/fsga/db/queries.ts`, extend the `PublicPackItem` interface (the DB query below never sets it, so the mirror is preserved):

```ts
export interface PublicPackItem {
  slug: string;
  rank: number;
  customReason: string | null;
  customExample: string | null;
  recommendedFirst: boolean;
  /**
   * Present only on a curated signature hero (static-data mode). Overrides the
   * card's displayed name and starter prompt. The DB path never populates this.
   */
  signature?: { name: string; starterPrompt: string } | null;
}
```

- [ ] **Step 4: Add the `hero` field + Scott Fish override**

In `lib/fsga/data/overrides.ts`, extend `PackOverride` (add above the existing `items?` field):

```ts
export interface HeroOverride {
  /** A real library skill whose inputs/process/outputs the hero reuses. */
  baseSkillSlug: string;
  /** Branded display name, e.g. "Scott-Fish-Style Donor Follow-Up". */
  name: string;
  /** One sentence naming the attendee's actual company/work. */
  customReason: string;
  /** Optional fully pre-filled starter prompt (overrides the base's). */
  starterPrompt?: string;
}

export interface PackOverride {
  featuredForDemo?: boolean;
  title?: string;
  summary?: string;
  rationale?: string;
  customIntro?: string;
  hero?: HeroOverride;
  items?: PackItemOverride[];
}
```

Replace the empty `PACK_OVERRIDES` object with the Scott Fish hero:

```ts
export const PACK_OVERRIDES: Readonly<Record<string, PackOverride>> = {
  // Scott Fish — Fantasy Cares (charity built on the Scott Fish Bowl).
  "scott-fish-23us": {
    featuredForDemo: true,
    customIntro:
      "Welcome, Scott! Fantasy Cares runs on relationships and follow-through — so your pack leads with a Skill built around exactly that, then a few every-week staples.",
    hero: {
      baseSkillSlug: "relationship-follow-up-reminder",
      name: "Scott-Fish-Style Donor Follow-Up",
      customReason:
        "Fantasy Cares lives on donor and sponsor relationships — this keeps every commitment, thank-you, and check-in from slipping through the cracks after an event like SFB.",
      starterPrompt:
        "You are my relationship manager for Fantasy Cares. Here are my recent conversations, commitments, and contacts: [PASTE NOTES + PLEDGES + NAMES]. Produce: (1) Owe-a-reply — people waiting on me, most time-sensitive first; (2) Thank-yous — donors/sponsors to acknowledge, with a one-line personalized note each; (3) Check-ins — relationships worth warming before the next drive, with a reason and a suggested opener. Keep it warm and specific, never templated. Flag anyone I haven't touched in 30+ days.",
    },
  },
};
```

- [ ] **Step 5: Resolve + prepend the hero in `packs.ts`**

In `lib/fsga/data/packs.ts`, inside `buildPacks()`, after the `items` array is built (after the existing `matchSkills(...)`/override `items` block and the `items.length === 0` check) and before `const copy = buildPackCopy(...)`, insert hero resolution:

```ts
    // Curated signature hero: reuse a real library skill's guts, brand its
    // name + reason + (optional) prompt, and prepend it at rank 1. Dedupe its
    // base slug out of the matched tail so it never appears twice.
    if (override?.hero) {
      const base = getSkillBySlug(override.hero.baseSkillSlug);
      if (!base) {
        problems.push(`${a.slug}: hero references unknown base skill "${override.hero.baseSkillSlug}"`);
      } else {
        const tail = items
          .filter((it) => it.slug !== override.hero!.baseSkillSlug)
          .map((it, i) => ({ ...it, rank: i + 2, recommendedFirst: false }));
        items.length = 0;
        items.push(
          {
            slug: base.slug,
            rank: 1,
            customReason: override.hero.customReason,
            customExample: null,
            recommendedFirst: true,
            signature: {
              name: override.hero.name,
              starterPrompt: override.hero.starterPrompt ?? base.starterPrompt,
            },
          },
          ...tail,
        );
      }
    }
```

Note: this runs even when `override.items` was used, so a curated pack can define both an explicit item list and a hero on top of it.

- [ ] **Step 6: Run to verify it passes**

Run: `npm run fsga:check`
Expected: PASS — `fsga:check OK — 152 packs; curated hero present; non-curated packs clean.`

- [ ] **Step 7: Commit**

```bash
git add lib/fsga/db/queries.ts lib/fsga/data/overrides.ts lib/fsga/data/packs.ts scripts/fsga/check-packs.ts package.json
git commit -m "feat(fsga): curated signature hero override (Scott Fish)"
```

---

### Task 4: `SkillActions` client component (take-it-with-you row)

The per-card action row: copy a paste-ready prompt, download a `SKILL.md`, and jump to build-your-own pre-filled. No unit-test harness in this repo — verified by `npm run build` (typecheck) in Task 8 and a manual click check.

**Files:**
- Create: `components/fsga/skill-actions.tsx`

**Interfaces:**
- Consumes: `Skill` (from `@/lib/fsga/skills/types`); `compileSkillPrompt`, `compileSkillFile`, `buildYourOwnQuery` (from `@/lib/fsga/skill-export`). Receives an ALREADY-RESOLVED skill (placeholders/branding applied by the caller).
- Produces: `SkillActions({ skill }: { skill: Skill }): JSX.Element`.

- [ ] **Step 1: Implement the component**

Create `components/fsga/skill-actions.tsx`:

```tsx
"use client";

// FSGA workshop — per-card "take it with you" actions. Receives a resolved
// Skill (placeholders + any signature branding already applied by PackView).
// Copy/download are client-only and degrade to no-ops when the browser API is
// unavailable; the full prompt is also printed on the card as a manual fallback.

import { useState } from "react";
import { Btn } from "@/components/atoms";
import type { Skill } from "@/lib/fsga/skills/types";
import { buildYourOwnQuery, compileSkillFile, compileSkillPrompt } from "@/lib/fsga/skill-export";

const ACTION_CLASS =
  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] tracking-[0.02em] font-medium bg-chip text-chip-ink hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap";

export function SkillActions({ skill }: { skill: Skill }) {
  const [copied, setCopied] = useState(false);

  async function handleCopyPrompt() {
    try {
      if (!navigator?.clipboard?.writeText) return;
      await navigator.clipboard.writeText(compileSkillPrompt(skill));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable or denied — no-op.
    }
  }

  function handleDownload() {
    try {
      const blob = new Blob([compileSkillFile(skill)], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${skill.slug}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Download unsupported — no-op; the prompt is copyable above.
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button type="button" onClick={handleCopyPrompt} className={ACTION_CLASS}>
        {copied ? "copied ✓" : "copy as prompt"}
      </button>
      <button type="button" onClick={handleDownload} className={ACTION_CLASS}>
        download Skill (.md)
      </button>
      <Btn href={`/fsga/build-your-own${buildYourOwnQuery(skill)}`} variant="primary">
        Make this your Skill →
      </Btn>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck the new module**

Run: `npx tsc --noEmit`
Expected: PASS (no type errors). If `Btn`'s `variant` prop rejects `"primary"`, open `components/atoms.tsx`, read the `Btn` prop union, and use a valid variant (`"primary"` is used elsewhere in `pack-view.tsx`, so it should be valid).

- [ ] **Step 3: Commit**

```bash
git add components/fsga/skill-actions.tsx
git commit -m "feat(fsga): SkillActions take-it-with-you row"
```

---

### Task 5: `SkillCard` — signature pill + action row

**Files:**
- Modify: `components/fsga/skill-card.tsx`

**Interfaces:**
- Consumes: `SkillActions` (from `./skill-actions`), existing `Skill`, `CopyButton` (to be removed from this file).
- Produces: `SkillCard` gains an optional `isSignature?: boolean` prop; renders `SkillActions` instead of the lone `CopyButton`.

- [ ] **Step 1: Add `isSignature` + swap the action row**

In `components/fsga/skill-card.tsx`:

Replace the import line `import { CopyButton } from "./copy-button";` with:

```tsx
import { SkillActions } from "./skill-actions";
```

Add `isSignature` to the props destructure and type:

```tsx
export function SkillCard({
  skill,
  customReason,
  recommendedFirst = false,
  isSignature = false,
  rank,
}: {
  skill: Skill;
  customReason?: string | null;
  recommendedFirst?: boolean;
  isSignature?: boolean;
  rank?: number;
}) {
```

Add a signature accent to the outer card `div` — replace the opening card div line:

```tsx
    <div className={`bg-bg-card border rounded-[18px] p-5 sm:p-7 ${isSignature ? "border-accent" : "border-line"}`}>
```

Add a `signature` pill in the header row — immediately after the `{recommendedFirst && ...}` pill line:

```tsx
        {isSignature && <Pill variant="accent">your signature Skill</Pill>}
```

Replace the entire "Starter prompt" block (the `<div className="mt-5 bg-bg-muted …">…</div>`) with a starter-prompt block that keeps the prompt visible AND renders the action row:

```tsx
      {/* Starter prompt + take-it-with-you actions */}
      <div className="mt-5 bg-bg-muted border border-line-soft rounded-xl p-4">
        <div className="text-[10px] tracking-[0.08em] uppercase text-ink-faint mb-2.5">Starter prompt</div>
        <p className="font-mono text-[12px] text-ink-muted leading-[1.6] whitespace-pre-wrap">
          {skill.starterPrompt}
        </p>
        <div className="mt-4 pt-4 border-t border-line-soft">
          <SkillActions skill={skill} />
        </div>
      </div>
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS. `CopyButton` is now unused here; leave `copy-button.tsx` in place (it may be imported elsewhere — do not delete).

- [ ] **Step 3: Commit**

```bash
git add components/fsga/skill-card.tsx
git commit -m "feat(fsga): SkillCard signature styling + action row"
```

---

### Task 6: `PackView` — resolve prompts, hero-first, prominent on-ramp

Resolve `[ROLE]`/`[COMPANY]` per attendee and apply any signature branding before rendering, then reframe the page as a suggestion that funnels into build-your-own.

**Files:**
- Modify: `components/fsga/pack-view.tsx`

**Interfaces:**
- Consumes: `fillPlaceholders`, `buildYourOwnQuery` (from `@/lib/fsga/skill-export`); existing `getSkillBySlug`, `SkillCard`, `Btn`, `Pill`, `LINKS`.
- Produces: unchanged export `PackView({ pack, packSlug })`.

- [ ] **Step 1: Resolve each item into a display skill**

In `components/fsga/pack-view.tsx`, add imports:

```tsx
import { buildYourOwnQuery, fillPlaceholders } from "@/lib/fsga/skill-export";
```

Replace the `resolved` mapping so it applies placeholder fill + signature branding. Change the `.map(...)` callback body to build a display skill:

```tsx
  const role = pack.attendee.title?.trim() || "my role";
  const company = pack.attendee.company?.trim() || "my company";

  const resolved = pack.items
    .map((item) => {
      const base = getSkillBySlug(item.slug);
      if (!base) {
        console.error(`fsga pack-view: unknown skill slug "${item.slug}" — skipping`);
        return null;
      }
      const skill: Skill = {
        ...base,
        name: item.signature?.name ?? base.name,
        starterPrompt: fillPlaceholders(item.signature?.starterPrompt ?? base.starterPrompt, { role, company }),
      };
      return { item, skill };
    })
    .filter((x): x is { item: PublicPackItem; skill: Skill } => x !== null);
```

- [ ] **Step 2: Pass `isSignature` to each card**

Update the card render to forward the signature flag:

```tsx
        {resolved.map(({ item, skill }) => (
          <SkillCard
            key={skill.slug}
            skill={skill}
            customReason={item.customReason}
            recommendedFirst={item.recommendedFirst}
            isSignature={Boolean(item.signature)}
            rank={item.rank}
          />
        ))}
```

- [ ] **Step 3: Reframe header intro + make build-your-own the prominent CTA**

Under `<PackHeader … />`, add a one-line "this is a starting point" framing. Insert immediately after the `<PackHeader … />` element:

```tsx
      <p className="text-[13px] text-ink-muted leading-[1.6] mb-6 -mt-3">
        A starting point — not a prescription. Copy any of these into your own AI, or use the one below as the
        seed for the Skill only you could build.
      </p>
```

Replace the existing bottom "Keep going" card (the `<div className="bg-bg-card border border-line rounded-[18px] … Build your own first Skill …">` block) with a prominent, pre-filled on-ramp that seeds from the top item (hero if present):

```tsx
        <div className="bg-bg-card border border-accent rounded-[18px] p-6 sm:p-7 flex flex-col items-start gap-3">
          <div className="text-[10px] tracking-[0.08em] uppercase text-ink-faint">Your move</div>
          <p className="text-[15px] text-ink leading-[1.55] font-medium">
            The best Skill is the one built around your work. Start from your top pick — the sentence is already
            filled in.
          </p>
          <Btn
            href={`/fsga/build-your-own${resolved[0] ? buildYourOwnQuery(resolved[0].skill) : ""}`}
            variant="primary"
          >
            Build your own Skill →
          </Btn>
        </div>
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS. Ensure `Skill` and `PublicPackItem` are imported (they already are at the top of the file).

- [ ] **Step 5: Commit**

```bash
git add components/fsga/pack-view.tsx
git commit -m "feat(fsga): hero-first pack view with resolved prompts and prefilled on-ramp"
```

---

### Task 7: Build-your-own multi-param prefill

Make "Build your own like this" land with the whole X→Y→Z sentence filled, not just the task.

**Files:**
- Modify: `components/fsga/build-skill-form.tsx`

**Interfaces:**
- Consumes: existing `?task=` hydration effect.
- Produces: same, plus `input` / `output` / `goal` query params prefill `inputType` / `outputType` / `successGoal`.

- [ ] **Step 1: Extend the prefill effect**

In `components/fsga/build-skill-form.tsx`, replace the existing `useEffect` prefill block with one that reads all four params:

```tsx
  // Prefill from a deep link (?task=&input=&output=&goal=) — the scorecard's
  // "Name it" hand-off and the pack page's "Make this your Skill" CTA both use
  // this. After hydration only; never clobbers what the attendee has typed.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const task = params.get("task");
    const input = params.get("input");
    const output = params.get("output");
    const goal = params.get("goal");
    if (!task && !input && !output && !goal) return;
    setForm((f) => ({
      repeatedTask: f.repeatedTask || (task ?? "").slice(0, 300),
      inputType: f.inputType || (input ?? "").slice(0, 300),
      outputType: f.outputType || (output ?? "").slice(0, 300),
      successGoal: f.successGoal || (goal ?? "").slice(0, 300),
    }));
  }, []);
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/fsga/build-skill-form.tsx
git commit -m "feat(fsga): build-your-own prefills full X-into-Y-so-Z sentence from a skill"
```

---

### Task 8: Full-build integration verification

Prove all 152 packs render and the demo flow works end-to-end. This is the integration test the SSG build provides in lieu of a component test runner.

**Files:** none (verification only).

- [ ] **Step 1: Data + logic checks**

Run: `npm run fsga:check`
Expected: PASS on all three sub-checks (skill library, attendees, packs).

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 3: Production build (renders all 152 pack pages)**

Run: `npm run build`
Expected: build succeeds; output lists the `/fsga/pack/[slug]` route prerendered. A bad hero base slug or unknown skill slug would throw here — a clean build proves every pack resolved.

- [ ] **Step 4: Visual smoke check (manual, use the `run` skill or `npm run dev`)**

Load and eyeball:
- `/fsga/pack/scott-fish-23us` — rank-1 card is **"Scott-Fish-Style Donor Follow-Up"** with a `your signature Skill` pill and accent border; starter prompt reads naturally (no `[ROLE]`/`[COMPANY]`); "copy as prompt", "download Skill (.md)", "Make this your Skill →" all present; the tail is ubiquitous skills, no board/investor decks; the bottom on-ramp is prominent.
- `/fsga/pack/carter-phillips-2fxn` — no signature card; a clean unbranded ubiquitous pack; every card still has the three actions and a filled prompt.
- Click **"Make this your Skill →"** → `/fsga/build-your-own` opens with all four fields prefilled and the live sentence assembled.
- Click **download Skill (.md)** → a `{slug}.md` file downloads; open it → valid frontmatter + Process + Starter prompt.

- [ ] **Step 5: Final commit (if any doc/tweak changed)**

```bash
git add -A
git commit -m "chore(fsga): verify signature packs build + demo flow"
```

---

## Self-Review

**Spec coverage:**
- Company-aware selection + ubiquitous backbone → Task 1. ✓
- Drop niche misfires → Task 1 (role rules demoted to backfill; ubiquitous core fills the cap). ✓
- Curated-only branded hero; no-override → unbranded; walk-ins untouched → Task 3 (+ `notFound()` path unchanged). ✓
- Pre-filled prompts (no `[ROLE]`/`[COMPANY]`) → Task 2 `fillPlaceholders` + Task 6 resolution. ✓
- Copy-as-prompt + download `SKILL.md` on every card → Tasks 2, 4, 5. ✓
- Frictionless multi-param on-ramp → Tasks 2 (`buildYourOwnQuery`), 6, 7. ✓
- Event-safe/static/no-DB/no-runtime-AI/fail-fast → Global Constraints; enforced in Tasks 1–3 check scripts + Task 8 build. ✓
- Frozen slugs / no emails → untouched (no task edits `attendees.ts` slugs or adds email). ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete code; no "similar to Task N".

**Type consistency:** `signature?: { name; starterPrompt } | null` defined in Task 3 (`queries.ts`), produced by `packs.ts` (Task 3), consumed by `pack-view.tsx` (Task 6) and forwarded as `isSignature` boolean to `SkillCard` (Task 5). `HeroOverride.baseSkillSlug/name/customReason/starterPrompt?` defined + consumed in Task 3. Export helper names (`fillPlaceholders`, `compileSkillPrompt`, `compileSkillFile`, `buildYourOwnQuery`) defined in Task 2, consumed identically in Tasks 4 & 6. `matchSkills` signature unchanged. Consistent.

**Note on TDD:** This repo has no unit-test runner. Logic tasks (1–3) use fail-first `tsx` check-script assertions as their red/green cycle; presentation tasks (4–7) verify via `tsc --noEmit` then the Task 8 SSG build + manual smoke check. This matches the existing FSGA verification pattern (`fsga:check` + build) and does not introduce test infra days before the event.
