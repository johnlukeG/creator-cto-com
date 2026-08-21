# About Page — Design Spec

**Date:** 2026-07-12
**Route:** `/about`
**Status:** Approved, ready for implementation plan

## Purpose

Give a visitor a place to dig deeper into the context behind the site and the
brand — which is built around JL. The page explains *why* Creator CTO exists and
*who* is behind it. It is deliberately **not** exposition or self-aggrandizement:
substance over performance, in the brand's direct, no-hype voice.

## Non-Goals

- Not a résumé or credentials showcase.
- Not a repeat of the landing page — does **not** re-render the pillars grid or
  FAQ. About *adds* context; it does not duplicate.
- No invented facts. No specific numbers, company names, credentials, or dates
  are fabricated — any such claim ships as a marked placeholder for JL to fill.

## Architecture

Reuse the existing system exactly as the landing page does.

- New route: `app/about/page.tsx` — a server component, wrapped in `dot-grid`,
  reusing `<Nav />`, `<Cta />`, and `<Footer />`.
- All copy centralized in `lib/content.ts` under a new `about` export, matching
  how every other section sources its content. The page component stays thin —
  layout only, no inline prose.
- New presentational component(s) for the About-specific blocks (the context
  section and the bio section), styled to match the dark, terminal-styled system
  (`Section`, `Btn`, `Pill`, meta-strip aesthetic). Reuse `Section` where it fits.

### Component boundaries

- `app/about/page.tsx` — composes Nav → About blocks → Cta → Footer. No content.
- `components/about.tsx` — the About-specific blocks (context + bio + who-it's-for).
  Reads from `lib/content.ts`. Presentational only; no data fetching.
- `lib/content.ts` — add `about` object holding all strings. Single source of copy.

Rationale for a dedicated `components/about.tsx`: keeps the page file a thin
composition (like `app/page.tsx`), and keeps About copy-driven markup isolated and
independently readable.

## Page Structure (top to bottom)

1. **Meta strip** — reuse the landing hero's system-status-bar strip for
   continuity, relabeled for this page (e.g. `● / about · creatorcto.system`).
2. **The context** — headline + 2 short paragraphs. The brand's Core Idea:
   the internet used to reward creators for attention; the AI era rewards
   creators who turn that attention into owned systems and products. This channel
   documents that transition (creator → creator-founder → AI-enabled operator).
   Source: brand profile "Core Idea" + "One-Line Positioning".
3. **Built around a builder** — 2-3 short **first-person** paragraphs. JL as a
   working builder documenting the process in public — grounded in real projects,
   not theory. Honest and plain; no credential-flexing. Any specific fact
   (years building, named companies, audience size, prior roles) is a marked
   placeholder, NOT invented. Source: drafted from brand voice + git identity
   (JL Garofalo), corrected by JL after.
4. **Who this is for** — one tight block (a line or two, or a short two-column
   "for / not for"). Creators who already have an audience and want owned products;
   people who want a clear path, not motivation. Source: brand "Target Audience".
5. **CTA** — reuse the existing `<Cta />` component (Subscribe on YouTube).
6. **Footer** — reuse `<Footer />`.

## Voice & Content Rules

- Brand voice: builder-led, pragmatic, clear, direct, honest. Never guru/hype,
  never academic, never technical-for-ego. (From brand profile "Brand Voice".)
- **First person** ("I") for the bio section — it is built around JL, and first
  person reads honest rather than corporate. Brand-level mission copy may stay in
  the brand's "we" voice.
- Placeholder convention: any unverified personal fact is written inline as
  `[[TODO: confirm — …]]` so it is obvious in review and impossible to ship blind.

## Wiring

- Nav (`components/nav.tsx`): the desktop nav currently has `#pillars` and `#faq`.
  Add an "About" link pointing to `/about` (Next.js `<Link>`). The landing's
  hash links must still resolve — About links use a real route, hash links stay
  in-page. On `/about`, hash links (`#pillars`, `#faq`) point back to the home
  page, so they become `/#pillars` / `/#faq` where used from the About route.
- Footer (`components/footer.tsx`): the "About" item under the "Channel" column is
  currently `href="#"` — point it at `/about`. Convert that item from a bare `<a>`
  to a Next.js `<Link>` (or keep `<a href="/about">`), consistent with the
  codebase. "YouTube" stays external.

## Testing / Verification

- `next build` passes (typecheck + route compiles).
- Drive the page: `/about` renders, Nav + Cta + Footer present, no console errors.
- Nav "About" link routes to `/about`; footer "About" link routes to `/about`.
- No `[[TODO]]` placeholders slip in unreviewed — they are intentional and visible
  for JL to resolve before publish.
- Visual continuity: dark theme, dot-grid, meta strip match the landing.

## Open Items for JL (post-draft)

- Confirm / rewrite the first-person bio facts (all `[[TODO]]` markers).
- Confirm whether any personal links (LinkedIn / X / newsletter) should appear on
  the page or stay in the footer only.
