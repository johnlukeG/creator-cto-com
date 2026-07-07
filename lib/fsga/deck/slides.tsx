"use client";

// FSGA workshop — deck slide layouts: DECK_SLIDES (data) → SLIDES (SlideDef[]
// with render functions), switched by `kind`. DB-free by construction: only
// imports skills/library (data), config (constants), and presentational
// components. Everything here is authored against a fixed 1920×1080 stage —
// DeckShell scales the whole box to fit whatever screen it's projected on,
// so pixel sizes below are absolute *stage* coordinates, not real screen px.
//
// Hook-free since the teardown slide went slide-native (TeardownCard is
// authored in stage pixels, no fit-scaling) — the 'use client' directive is
// kept because this module is only ever reached through deck-shell.tsx's
// client boundary anyway, and render functions here are client-side JSX.

import type { ReactNode } from "react";
import { Pill } from "@/components/atoms";
import { PackSlideCard } from "@/components/fsga/deck/pack-slide-card";
import { QrBlock } from "@/components/fsga/deck/qr-block";
import { TASK_ICONS } from "@/components/fsga/deck/task-icons";
import { TeardownCard } from "@/components/fsga/deck/teardown-card";
import { getSkillBySlug } from "../skills/library";
import { DECK_SLIDES, TEARDOWN_SKILL_SLUG, type SlideContent } from "./deck-content";
import type { SlideContext, SlideDef } from "./types";

// ── Shared chrome ────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: string }) {
  return (
    <Pill
      variant="outline"
      className="!text-[20px] !px-5 !py-2.5 !tracking-[0.08em] !gap-2 w-fit normal-case"
    >
      {children}
    </Pill>
  );
}

/** Fills the 1920×1080 stage box DeckShell provides (absolute inset-0). */
function SlideFrame({
  eyebrow,
  center = false,
  dotGrid = false,
  children,
}: {
  eyebrow?: string;
  center?: boolean;
  dotGrid?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute inset-0 flex flex-col px-[140px] py-[110px] bg-bg ${dotGrid ? "dot-grid" : ""} ${
        center ? "items-center justify-center text-center" : ""
      }`}
    >
      {eyebrow && (
        <div className="mb-10 shrink-0">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <div className={`flex-1 min-h-0 flex flex-col ${center ? "items-center justify-center" : ""}`}>
        {children}
      </div>
    </div>
  );
}

// ── Accent-word helper (statement/sentence slides) ──────────────────────

// Which single phrase to highlight per slide id — a presentation choice not
// encoded in deck-content.ts's copy. "optional" per the brief: slides not
// listed here just render plain.
const ACCENT_PHRASES: Record<string, string> = {
  "pain-week": "already done",
  "smart-people": "same manual work",
  "ai-vague": "vague",
  "skill-definition": "reusable workflow",
  "one-not-ten": "one workflow",
};

function withAccent(text: string, phrase?: string): ReactNode {
  if (!phrase) return text;
  const idx = text.indexOf(phrase);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-accent">{text.slice(idx, idx + phrase.length)}</span>
      {text.slice(idx + phrase.length)}
    </>
  );
}

function withBlanks(text: string): ReactNode {
  const parts = text.split(/_+/);
  const nodes: ReactNode[] = [];
  parts.forEach((part, i) => {
    if (part) nodes.push(<span key={`t${i}`}>{part}</span>);
    if (i < parts.length - 1) {
      nodes.push(
        <span
          key={`b${i}`}
          className="inline-block align-baseline border-b-[6px] border-accent w-[150px] mx-3"
        />,
      );
    }
  });
  return nodes;
}

// ── Kind renderers ───────────────────────────────────────────────────────

function TitleSlide({ content }: { content: SlideContent }) {
  return (
    <SlideFrame eyebrow={content.eyebrow} dotGrid>
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-[118px] font-bold tracking-[-0.03em] leading-[1.02] text-ink text-balance">
          {content.title}
        </h1>
        {content.body && (
          <p className="text-[34px] text-ink-muted leading-[1.5] mt-10 max-w-[1400px]">{content.body}</p>
        )}
      </div>
    </SlideFrame>
  );
}

function StatementSlide({ content }: { content: SlideContent }) {
  const text = content.big ?? content.title;
  const isBig = Boolean(content.big);
  return (
    <SlideFrame eyebrow={content.eyebrow} center>
      <p
        className={`font-bold tracking-[-0.03em] leading-[1.15] text-ink text-balance max-w-[1500px] ${
          isBig ? "text-[92px]" : "text-[104px]"
        }`}
      >
        {withAccent(text, ACCENT_PHRASES[content.id])}
      </p>
      {content.body && (
        <p className="text-[32px] text-ink-muted leading-[1.5] mt-12 max-w-[1200px]">{content.body}</p>
      )}
    </SlideFrame>
  );
}

function ListSlide({ content }: { content: SlideContent }) {
  const bullets = content.bullets ?? [];
  const twoCol = bullets.length > 4;
  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[62px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance max-w-[1400px] shrink-0">
        {content.title}
      </h2>
      <div className={`mt-12 grid gap-6 ${twoCol ? "grid-cols-2" : "grid-cols-1 max-w-[1300px]"}`}>
        {bullets.map((bullet) => (
          <div key={bullet} className="bg-bg-card border border-line rounded-[18px] p-8">
            <p className="text-[30px] leading-[1.4] text-ink">{bullet}</p>
          </div>
        ))}
      </div>
    </SlideFrame>
  );
}

// Act-2 recognition grid: 3×2 icon tiles, one universal repeat-task each.
// Bullets are "iconKey: label" (same prefix parse as ModelSlide); an unknown
// or missing icon key degrades to a label-only tile — never crashes live.
function GridSlide({ content }: { content: SlideContent }) {
  const tiles = (content.bullets ?? []).map((bullet) => {
    const idx = bullet.indexOf(":");
    return idx === -1
      ? { iconKey: "", label: bullet }
      : { iconKey: bullet.slice(0, idx).trim(), label: bullet.slice(idx + 1).trim() };
  });

  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[62px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance max-w-[1400px] shrink-0">
        {content.title}
      </h2>
      <div className="flex-1 min-h-0 grid grid-cols-3 grid-rows-2 gap-7 mt-12">
        {tiles.map(({ iconKey, label }) => {
          const Icon = TASK_ICONS[iconKey];
          return (
            <div
              key={label}
              className="bg-bg-card border border-line rounded-[24px] p-10 flex flex-col justify-between"
            >
              {Icon && <Icon className="w-[84px] h-[84px] text-accent shrink-0" />}
              <p className="text-[34px] font-semibold leading-[1.25] text-ink text-balance">{label}</p>
            </div>
          );
        })}
      </div>
    </SlideFrame>
  );
}

// Act-2 cost visual: Mon–Fri bars, accent fill = share of the day spent
// redoing work. Proportions are a presentation choice (illustrative, avg
// ≈0.32 ≈ "a day and a half"), hardcoded here like ACCENT_PHRASES — the
// speaker notes hedge with "if your week is anywhere near typical."
const WEEK_LOAD: { day: string; frac: number }[] = [
  { day: "Mon", frac: 0.35 },
  { day: "Tue", frac: 0.2 },
  { day: "Wed", frac: 0.45 },
  { day: "Thu", frac: 0.25 },
  { day: "Fri", frac: 0.35 },
];

function WeekSlide({ content }: { content: SlideContent }) {
  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[62px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance shrink-0">
        {content.title}
      </h2>
      <div className="flex-1 flex flex-col justify-center gap-8 mt-10 max-w-[1560px] w-full">
        {WEEK_LOAD.map(({ day, frac }) => (
          <div key={day} className="flex items-center gap-8">
            <span className="text-[30px] font-semibold text-ink-muted w-[110px] shrink-0">{day}</span>
            <div className="flex-1 h-[54px] bg-bg-card border border-line rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full"
                style={{ width: `${Math.round(frac * 100)}%` }}
              />
            </div>
          </div>
        ))}
        <div className="flex items-center gap-4 mt-2 ml-[142px]">
          <span className="w-[36px] h-[20px] rounded-full bg-accent shrink-0" aria-hidden />
          <span className="text-[26px] text-ink-muted">work you've already done once</span>
        </div>
      </div>
      {content.body && (
        <p className="text-[30px] text-ink-muted leading-[1.5] mt-8 max-w-[1400px] shrink-0">{content.body}</p>
      )}
    </SlideFrame>
  );
}

function ModelSlide({ content }: { content: SlideContent }) {
  const steps = (content.bullets ?? []).map((bullet) => {
    const idx = bullet.indexOf(":");
    return idx === -1
      ? { label: bullet, description: "" }
      : { label: bullet.slice(0, idx), description: bullet.slice(idx + 1).trim() };
  });

  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[58px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance shrink-0">
        {content.title}
      </h2>
      <div className="flex-1 flex items-center gap-8 mt-14">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-8 flex-1">
            <div className="flex-1 bg-bg-card border border-line rounded-[24px] p-10 flex flex-col gap-4 h-full justify-center">
              <div className="text-[24px] tracking-[0.06em] uppercase text-accent font-bold">{step.label}</div>
              <div className="text-[30px] leading-[1.35] text-ink">{step.description}</div>
            </div>
            {i < steps.length - 1 && (
              <div className="text-[64px] text-accent font-bold shrink-0" aria-hidden>
                →
              </div>
            )}
          </div>
        ))}
      </div>
      {content.body && <p className="text-[28px] text-ink-muted leading-[1.5] mt-12 max-w-[1400px]">{content.body}</p>}
    </SlideFrame>
  );
}

function FrameworkSlide({ content }: { content: SlideContent }) {
  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[58px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance shrink-0">
        {content.title}
      </h2>
      <div className="flex-1 flex flex-col justify-center gap-8 mt-6 max-w-[1500px]">
        {(content.bullets ?? []).map((bullet) => (
          <div key={bullet} className="flex items-center gap-6">
            <span className="text-[40px] text-accent font-bold shrink-0" aria-hidden>
              ✓
            </span>
            <span className="text-[32px] leading-[1.3] text-ink">{bullet}</span>
          </div>
        ))}
      </div>
    </SlideFrame>
  );
}

function QrSlide({ content }: { content: SlideContent }) {
  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <div className="flex-1 flex items-center gap-20">
        <div className="flex-1 max-w-[820px]">
          <h2 className="text-[64px] font-bold tracking-[-0.03em] leading-[1.1] text-ink text-balance">
            {content.title}
          </h2>
          {content.body && <p className="text-[32px] text-ink-muted leading-[1.5] mt-8">{content.body}</p>}
        </div>
        <div className="shrink-0">
          <QrBlock size={520} />
        </div>
      </div>
    </SlideFrame>
  );
}

// Three packs, one row. A 2×2 grid of 4 packs cannot fit at 1080p with the
// ≥28px skill-row / ≥32px name legibility floors: each 5-row card needs
// ~330px+ even with intro dropped and paddings crushed, but a 2-row grid
// only offers ~300px per row inside the frame's ~620px budget. One row of
// three gives every card the full budget — 3 legible > 4 clipped.
function PacksSlide({ content, ctx }: { content: SlideContent; ctx: SlideContext }) {
  const packs = ctx.featuredPacks.slice(0, 3);
  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[58px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance shrink-0">
        {content.title}
      </h2>
      {content.body && <p className="text-[28px] text-ink-muted leading-[1.5] mt-4 shrink-0">{content.body}</p>}
      {packs.length > 0 ? (
        <div className="flex-1 min-h-0 grid grid-cols-3 gap-6 mt-8 content-start">
          {packs.map((pack) => (
            <PackSlideCard key={pack.slug} pack={pack} />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center">
          <p className="text-[28px] text-ink-muted">No featured packs to show right now.</p>
        </div>
      )}
    </SlideFrame>
  );
}

// Slide-native teardown: renders the same Skill object as projection-scale
// chrome (TeardownCard) instead of embedding the web-scale SkillCard — the
// embedded card's 10-19px type projected at ~8-16px after fit-scaling,
// unreadable from a ballroom. The fit-scale hook this slide used to need is
// gone with it: TeardownCard is authored directly in stage pixels.
function TeardownSlide({ content }: { content: SlideContent }) {
  const skill = getSkillBySlug(TEARDOWN_SKILL_SLUG);

  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[58px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance shrink-0">
        {content.title}
      </h2>
      {content.body && <p className="text-[28px] text-ink-muted leading-[1.5] mt-4 shrink-0">{content.body}</p>}
      {skill ? (
        <div className="flex-1 min-h-0 mt-6">
          <TeardownCard skill={skill} />
        </div>
      ) : (
        // Defensive only: deck-content.ts already fails fast at import if
        // TEARDOWN_SKILL_SLUG doesn't resolve, so this branch is unreachable
        // in practice — but the slide must never crash live regardless.
        <div className="flex-1 flex items-center">
          <p className="text-[28px] text-ink-muted">Teardown skill unavailable.</p>
        </div>
      )}
    </SlideFrame>
  );
}

function ExerciseSlide({ content }: { content: SlideContent }) {
  return (
    <SlideFrame eyebrow={content.eyebrow} center>
      <h2 className="text-[76px] font-bold tracking-[-0.03em] leading-[1.12] text-ink text-balance max-w-[1500px]">
        {content.title}
      </h2>
      {content.body && <p className="text-[32px] text-ink-muted leading-[1.5] mt-10 max-w-[1200px]">{content.body}</p>}
      <div className="mt-12">
        <Pill variant="accent" className="!text-[24px] !px-7 !py-3.5">
          60 seconds
        </Pill>
      </div>
    </SlideFrame>
  );
}

function SentenceSlide({ content }: { content: SlideContent }) {
  return (
    <SlideFrame eyebrow={content.eyebrow} center>
      <h2 className="text-[48px] font-bold tracking-[-0.03em] leading-[1.1] text-ink-muted">{content.title}</h2>
      <p className="text-[58px] font-bold tracking-[-0.02em] leading-[1.5] text-ink text-balance max-w-[1600px] mt-10">
        {withBlanks(content.big ?? "")}
      </p>
      {content.body && <p className="text-[30px] text-ink-muted leading-[1.5] mt-12 max-w-[1200px]">{content.body}</p>}
    </SlideFrame>
  );
}

function CloseSlide({ content }: { content: SlideContent }) {
  return (
    <SlideFrame eyebrow={content.eyebrow} center>
      <h2 className="text-[68px] font-bold tracking-[-0.03em] leading-[1.1] text-ink text-balance max-w-[1500px]">
        {content.title}
      </h2>
      {content.body && <p className="text-[32px] text-ink-muted leading-[1.5] mt-8 max-w-[1200px]">{content.body}</p>}
      {content.id === "thanks" && (
        <div className="mt-12">
          <QrBlock size={240} />
        </div>
      )}
    </SlideFrame>
  );
}

// ── Dispatch ─────────────────────────────────────────────────────────────

function renderSlideContent(content: SlideContent, ctx: SlideContext): ReactNode {
  switch (content.kind) {
    case "title":
      return <TitleSlide content={content} />;
    case "statement":
      return <StatementSlide content={content} />;
    case "list":
      return <ListSlide content={content} />;
    case "grid":
      return <GridSlide content={content} />;
    case "week":
      return <WeekSlide content={content} />;
    case "model":
      return <ModelSlide content={content} />;
    case "framework":
      return <FrameworkSlide content={content} />;
    case "qr":
      return <QrSlide content={content} />;
    case "packs":
      return <PacksSlide content={content} ctx={ctx} />;
    case "teardown":
      return <TeardownSlide content={content} />;
    case "exercise":
      return <ExerciseSlide content={content} />;
    case "sentence":
      return <SentenceSlide content={content} />;
    case "close":
      return <CloseSlide content={content} />;
    default: {
      // Exhaustiveness guard: if SlideKind ever grows, this fails to typecheck.
      const _exhaustive: never = content.kind;
      return _exhaustive;
    }
  }
}

export const SLIDES: SlideDef[] = DECK_SLIDES.map(
  (content): SlideDef => ({
    id: content.id,
    act: content.act,
    title: content.title,
    notes: content.notes,
    render: (ctx: SlideContext) => renderSlideContent(content, ctx),
  }),
);
