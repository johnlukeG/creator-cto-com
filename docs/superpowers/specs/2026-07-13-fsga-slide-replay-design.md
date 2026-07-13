# FSGA Slide Replay — Design

**Date:** 2026-07-13
**Branch:** `fsga-slide-replay`
**Status:** Approved (design), pending implementation

## Goal

Give the FSGA landing page (`/fsga`) a visible entry point into the workshop
deck, so a returning attendee — most often on a phone, after the talk — can
walk back through the slides themselves.

Today the deck exists only at `/fsga/presenter` (live-talk mode) and
`/fsga/static` (offline fallback). Both render the same `DeckShell`, both are
keyboard-only (arrows / space / Home / End), and neither is linked from the
landing page. A phone viewer has no way in and no way to advance.

## Non-goals

- No change to the live presenter experience — it stays clean, keyboard-only.
- No change to slide content, the deck data, or the DB layer.
- Not making the deck public/indexable — it stays `noindex` (public repo,
  unlisted event artifact, consistent with the rest of `/fsga`).

## Approach

Add an opt-in on-screen navigation mode to `DeckShell`, and a dedicated
public viewer route that turns it on. Presenter and static routes pass
nothing and are byte-for-byte unchanged in behavior.

### 1. `components/fsga/deck/deck-shell.tsx` — opt-in nav prop

- New prop `navControls?: boolean`, default `false`.
- When `true`, render inside the fixed shell:
  - **Prev / next chevron buttons** — vertically centered against the left and
    right edges, subtle (theme tokens, matches existing chrome). Prev hidden on
    slide 0; next hidden on the last slide. Real `<button>`s with `aria-label`
    ("Previous slide" / "Next slide"). onClick → existing `navigate(index ∓ 1)`.
  - **Swipe** — `touchstart` / `touchend` on the shell root. If the horizontal
    delta `|dx| > 50px` and `|dx| > |dy|`, navigate (left → next, right → prev).
    **Guarded:** ignore the gesture when the touch target is interactive —
    reuse the existing `isTypingTarget` check (INPUT / TEXTAREA / VIDEO /
    contentEditable) extended to BUTTON / A — so the 4-dimension calculator
    inputs, the name-it slide, and the act-2 Matrix `<video>` are never
    hijacked by a swipe.
- Keyboard navigation is untouched and still works on every route.

### 2. `app/fsga/slides/page.tsx` — new public viewer route

Mirrors `/fsga/static` so it cannot fail to render at load:
- `export const dynamic = "force-static"`
- Renders `<DeckShell featuredPacks={STATIC_FEATURED_PACKS} staticMode={true} navControls />`
- `metadata`: `title: "Slides · FSGA"`, `robots: { index: false, follow: false }`

`staticMode={true}` (offline-safe, zero DB) is deliberate: the replay must open
reliably regardless of DB/wifi, exactly like the offline fallback.

### 3. `app/fsga/page.tsx` — landing entry point

Add a "Replay the slides" entry point **below** the two existing cards
(`starter`, `build-your-own`) as a slim, full-width secondary link — it is
passive review, a distinct category from the two interactive tools, so it
should read as secondary rather than compete as a third peer card.

- Links to `/fsga/slides`.
- Copy: heading "Replay the slides" + subtext "Missed the workshop? Walk back
  through the deck." (No slide-count number — the deck length has drifted
  15→18; hardcoding a count invites staleness.)
- Styling reuses existing tokens (`bg-bg-card` / `border-line` / hover accent)
  so it sits consistently with the cards above it.

## Why this shape

- **Opt-in per route** keeps the live talk clean; only the replay route gets
  touch affordances. No risk of accidental-advance at the podium.
- **Reuses `navigate()` / `clampIndex()`** — no navigation logic duplicated;
  chevrons, swipe, and keyboard all funnel through one code path.
- **`force-static` replay** can't fail on load — same guarantee as the offline
  route the event already depends on.

## Testing

Drive in Chrome:
- `/fsga` renders the "Replay the slides" link → navigates to `/fsga/slides`.
- `/fsga/slides` renders the deck; chevron buttons advance/retreat; chevrons
  hide at first/last slide.
- Swipe advances/retreats on touch; swiping on the calculator / name-it /
  Matrix-video slides does NOT hijack those interactions.
- `/fsga/presenter` and `/fsga/static` show NO chevrons (regression check).
- Keyboard nav still works on all deck routes.

Then: `tsc --noEmit`, `next build`, `npm run fsga:check` (attendee +
email-leak tripwire) all green.

## Files touched

| File | Change |
|------|--------|
| `components/fsga/deck/deck-shell.tsx` | add `navControls` prop: chevrons + guarded swipe |
| `app/fsga/slides/page.tsx` | **new** — force-static viewer, `navControls`, noindex |
| `app/fsga/page.tsx` | add "Replay the slides" secondary link |
