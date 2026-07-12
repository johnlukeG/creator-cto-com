# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/about` page that gives visitors the context behind the site and brand (built around JL), in the brand's direct, no-hype voice.

**Architecture:** New Next.js App Router route `app/about/page.tsx` that composes the existing `<Nav />`, a new `<About />` block component, the existing `<Cta />`, and `<Footer />`. All copy lives in `lib/content.ts` under a new `about` export. Existing nav/footer "About" links get wired to `/about`.

**Tech Stack:** Next.js 16 (App Router, server components), React 19, Tailwind CSS v4, TypeScript.

## Global Constraints

- **No test runner exists** in this repo (no jest/vitest, zero existing tests). Verification per task = `npx tsc --noEmit` (typecheck). Final gate = `npm run build` + driving `/about` in the browser. Do NOT scaffold a test framework — it violates YAGNI and the repo's established pattern.
- All page copy MUST live in `lib/content.ts` — components read from it, never inline prose. (Matches every existing section.)
- No invented personal facts. Any unverified bio fact ships as a literal, visible `[[TODO: confirm — …]]` string in the copy. These are intentional, not plan placeholders.
- Match the dark, terminal-styled system: reuse `Section`, `Btn`, `Pill`, `Logo` from `components/atoms.tsx` and `components/section.tsx`. Wrap the page in `dot-grid` like `app/page.tsx`.
- Personal social links (LinkedIn/X/newsletter) stay footer-only for now — the page has no personal-links block (no real URLs known; avoids inventing). Flagged as an open item for JL.
- Bio section is **first person** ("I"); brand/mission copy may use the brand's "we".

---

### Task 1: Add `about` content to `lib/content.ts`

**Files:**
- Modify: `lib/content.ts` (append a new `about` export at end of file)

**Interfaces:**
- Consumes: nothing.
- Produces: `about` object imported by `components/about.tsx` (Task 2). Shape:
  ```ts
  about: {
    meta: { label: string; system: string; version: string };
    context: { eyebrow: string; title: string; paragraphs: string[] };
    bio: { eyebrow: string; title: string; paragraphs: string[] };
    audience: { eyebrow: string; title: string; for: string[]; notFor: string[] };
  }
  ```

- [ ] **Step 1: Append the `about` export**

Add to the end of `lib/content.ts`:

```ts
export const about = {
  meta: {
    label: "● / about",
    system: "creatorcto.system / built in public",
    version: "v0.1 — 2026",
  },
  context: {
    eyebrow: "/ about",
    title: "Why this channel exists.",
    paragraphs: [
      "The internet used to reward creators for attention. The AI era rewards something else — creators who turn that attention into systems and products they actually own.",
      "Creator CTO documents that shift: the move from content creator to AI-native builder and operator. Real builds, real tradeoffs, in public. No hype, no magic — just the process of turning an audience into durable assets.",
    ],
  },
  bio: {
    eyebrow: "/ who's behind it",
    title: "Built around a builder, not a brand.",
    paragraphs: [
      "I'm JL — I build products and document the process. Creator CTO isn't a media company with a content calendar; it's me, building real things and showing the work.",
      "Most “AI for creators” content stops at the demo. I care about the parts that don't fit in a highlight reel: the architecture decisions, the dead ends, the boring infrastructure that makes an owned product actually work. [[TODO: confirm — your background / what you build: e.g. years shipping software, notable projects, prior role]]",
      "If it helps one creator ship something they own, the channel is doing its job.",
    ],
  },
  audience: {
    eyebrow: "/ who this is for",
    title: "For creators who want to own the stack.",
    for: [
      "Creators with an audience who want owned products, not just brand deals",
      "Operators and developers building inside creator businesses",
      "Anyone who wants a clear path from creator → founder → operator",
    ],
    notFor: [
      "Anyone looking for motivation instead of mechanics",
      "Get-rich-quick or AI-magic narratives",
      "Pure theory with nothing shipped",
    ],
  },
} as const;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
git add lib/content.ts
git commit -m "feat(about): add /about page copy to content"
```

---

### Task 2: Build the `About` block component

**Files:**
- Create: `components/about.tsx`

**Interfaces:**
- Consumes: `about` from `@/lib/content` (Task 1); `Section` from `./section`; `Pill` from `./atoms`.
- Produces: `export function About(): JSX.Element` — imported by `app/about/page.tsx` (Task 3). No props.

- [ ] **Step 1: Create `components/about.tsx`**

```tsx
import { Section } from "./section";
import { about } from "@/lib/content";

export function About() {
  return (
    <>
      {/* Meta strip — mirrors the landing hero's status bar for continuity */}
      <div className="flex items-center gap-6 px-7 py-3 border-b border-line-soft text-[10.5px] tracking-[0.06em] uppercase text-ink-muted bg-bg">
        <span className="text-accent whitespace-nowrap">{about.meta.label}</span>
        <span className="whitespace-nowrap">{about.meta.system}</span>
        <span className="ml-auto whitespace-nowrap">{about.meta.version}</span>
      </div>

      {/* The context — why this exists */}
      <Section eyebrow={about.context.eyebrow} title={about.context.title}>
        <div className="max-w-[640px] mx-auto flex flex-col gap-4 text-[15px] leading-[1.65] text-ink-muted text-pretty">
          {about.context.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "text-ink" : undefined}>
              {p}
            </p>
          ))}
        </div>
      </Section>

      {/* Who's behind it — first-person bio */}
      <Section eyebrow={about.bio.eyebrow} title={about.bio.title} pad="tight">
        <div className="max-w-[640px] mx-auto flex flex-col gap-4 text-[15px] leading-[1.65] text-ink-muted text-pretty">
          {about.bio.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Section>

      {/* Who this is for / who it isn't */}
      <Section eyebrow={about.audience.eyebrow} title={about.audience.title} pad="tight">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-[760px] mx-auto">
          <div className="rounded-[14px] p-[22px] border border-line bg-bg-card">
            <div className="text-[10.5px] tracking-[0.06em] uppercase text-accent mb-3.5">For</div>
            <ul className="list-none p-0 m-0 grid gap-2.5">
              {about.audience.for.map((item) => (
                <li key={item} className="text-[13px] leading-[1.5] text-ink flex gap-2.5">
                  <span className="text-accent">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[14px] p-[22px] border border-line bg-bg-card">
            <div className="text-[10.5px] tracking-[0.06em] uppercase text-ink-faint mb-3.5">Not for</div>
            <ul className="list-none p-0 m-0 grid gap-2.5">
              {about.audience.notFor.map((item) => (
                <li key={item} className="text-[13px] leading-[1.5] text-ink-muted flex gap-2.5">
                  <span className="text-ink-faint">–</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/about.tsx
git commit -m "feat(about): add About block component"
```

---

### Task 3: Create the `/about` route

**Files:**
- Create: `app/about/page.tsx`

**Interfaces:**
- Consumes: `Nav` from `@/components/nav`, `About` from `@/components/about` (Task 2), `Cta` from `@/components/cta`, `Footer` from `@/components/footer`.
- Produces: the `/about` route + its page `metadata`.

- [ ] **Step 1: Create `app/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { About } from "@/components/about";
import { Cta } from "@/components/cta";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "About — Creator CTO",
  description:
    "Why Creator CTO exists and who's behind it. A working builder documenting the move from content creator to AI-native operator — in public.",
};

export default function AboutPage() {
  return (
    <div className="dot-grid">
      <Nav />
      <About />
      <Cta />
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat(about): add /about route"
```

---

### Task 4: Wire nav + footer "About" links to `/about`

**Files:**
- Modify: `components/nav.tsx` (navLinks array)
- Modify: `components/footer.tsx` (cols data + link rendering)

**Interfaces:**
- Consumes: nothing new.
- Produces: working `/about` links from nav and footer; landing hash links made root-relative so they resolve from any route.

- [ ] **Step 1: Update `components/nav.tsx` navLinks**

Replace the `navLinks` array (currently lines 5-8):

```tsx
const navLinks = [
  { label: "What we cover", href: "/#pillars" },
  { label: "FAQ", href: "/#faq" },
  { label: "About", href: "/about" },
];
```

(Hash links become root-relative `/#pillars` / `/#faq` so they scroll correctly when clicked from `/about`, not just the home page. The `<Link>` rendering below them is unchanged.)

- [ ] **Step 2: Update `components/footer.tsx` to give links real hrefs**

Replace the `cols` definition (currently lines 3-6) and the link `<a>` in the map. First, import `Link` and `LINKS`, and make cols items carry hrefs.

Top of file — add imports:

```tsx
import Link from "next/link";
import { Logo } from "./atoms";
import { LINKS } from "@/lib/content";
```

Replace `cols`:

```tsx
const cols = [
  {
    h: "Channel",
    items: [
      { label: "YouTube", href: LINKS.youtube },
      { label: "About", href: "/about" },
    ],
  },
  {
    h: "Connect",
    items: [
      { label: "X / Twitter", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
];
```

Replace the inner `<li>` map (currently renders `<a href="#">{i}</a>` over string items) with:

```tsx
{col.items.map((i) => (
  <li key={i.label}>
    <Link href={i.href} className="text-ink no-underline text-[12.5px] hover:text-accent">
      {i.label}
    </Link>
  </li>
))}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: PASS — `/about` appears in the route list, no type/compile errors.

- [ ] **Step 5: Drive the page**

Run `npm run dev`, open `http://localhost:3000/about`. Confirm:
- Meta strip + three sections + CTA + footer render, dark theme + dot-grid intact.
- Nav "About" → `/about`; footer "About" → `/about`; nav "What we cover" / "FAQ" from `/about` scroll to the home sections (`/#pillars`, `/#faq`).
- No console errors.
- The `[[TODO: confirm …]]` marker is visibly present in the bio (intentional — JL resolves before publish).

- [ ] **Step 6: Commit**

```bash
git add components/nav.tsx components/footer.tsx
git commit -m "feat(about): wire nav + footer About links to /about"
```

---

## Self-Review

**Spec coverage:**
- Purpose (context, not exposition) → Tasks 1-3 (context + bio + audience copy, no landing duplication). ✓
- Reuse Nav/Cta/Footer, dot-grid, centralized copy → Tasks 2-3. ✓
- No landing duplication (no pillars/FAQ re-render) → About component has only context/bio/audience. ✓
- First-person bio → Task 1 `about.bio` copy. ✓
- No invented facts / visible `[[TODO]]` → Task 1 bio paragraph 2. ✓
- Wire nav + footer About links → Task 4. ✓
- Personal links footer-only → honored (no page link block); open item noted. ✓
- Verification (build + drive) → Task 4 steps 4-5. ✓

**Placeholder scan:** No plan-level TBD/TODO. The `[[TODO: confirm …]]` string is intentional product copy, documented in Global Constraints. ✓

**Type consistency:** `about` shape defined in Task 1 matches field access in Task 2 (`about.context.paragraphs`, `about.bio.paragraphs`, `about.audience.for`/`.notFor`, `about.meta.label`/`.system`/`.version`). Footer `cols` items switch from `string` to `{label, href}` — both the data and the map (Task 4 step 2) are updated together. ✓
