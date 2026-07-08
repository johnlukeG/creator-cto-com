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
import { QrBlock } from "@/components/fsga/deck/qr-block";
import { TASK_ICONS } from "@/components/fsga/deck/task-icons";
import { TeardownCard } from "@/components/fsga/deck/teardown-card";
import { getSkillBySlug } from "../skills/library";
import { DECK_SLIDES, TEARDOWN_SKILL_SLUG, type SlideContent } from "./deck-content";
import type { SlideDef } from "./types";

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

/**
 * Fills the 1920×1080 stage box DeckShell provides (absolute inset-0).
 * The dot-grid background is applied on every slide so the deck matches the
 * rest of the /fsga shell (app/fsga/layout.tsx) — one consistent surface.
 */
function SlideFrame({
  eyebrow,
  center = false,
  children,
}: {
  eyebrow?: string;
  center?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute inset-0 flex flex-col px-[140px] py-[110px] bg-bg dot-grid ${
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

// ── Copy helpers ─────────────────────────────────────────────────────────

// Which single phrase to highlight per slide id — a presentation choice not
// encoded in deck-content.ts's copy. Optional: slides not listed render plain.
const ACCENT_PHRASES: Record<string, string> = {
  "coming-back": "keeps coming back",
  "context-reload": "reloading the context",
  "skill-definition": "reusable know-how",
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

/** Render `[slot]` tokens in a sentence as accent-underlined fill-ins. */
function withSlots(text: string): ReactNode {
  const parts = text.split(/(\[[^\]]+\])/);
  return parts.map((part, i) =>
    part.startsWith("[") && part.endsWith("]") ? (
      <span key={i} className="text-accent border-b-[6px] border-accent/60 pb-1">
        {part.slice(1, -1)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/** Shared `"key: text"` bullet parse (grid icons, playbook model, scorecard rows). */
function splitBullet(bullet: string): { key: string; text: string } {
  const idx = bullet.indexOf(":");
  return idx === -1
    ? { key: "", text: bullet }
    : { key: bullet.slice(0, idx).trim(), text: bullet.slice(idx + 1).trim() };
}

// ── Kind renderers ───────────────────────────────────────────────────────

function TitleSlide({ content }: { content: SlideContent }) {
  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-[118px] font-bold tracking-[-0.03em] leading-[1.02] text-ink text-balance">
          {content.title}
        </h1>
        {content.body && (
          <p className="text-[34px] text-ink-muted leading-[1.5] mt-10 max-w-[1300px]">{content.body}</p>
        )}
      </div>
      <div className="absolute right-[140px] bottom-[110px]">
        <QrBlock size={190} />
      </div>
    </SlideFrame>
  );
}

// Hand-tuned orbit positions (percent of the visual area) for up to eight
// labels — deterministic so SSR and client render identically.
const ORBIT_POSITIONS: { x: number; y: number }[] = [
  { x: 10, y: 16 },
  { x: 36, y: 5 },
  { x: 64, y: 12 },
  { x: 89, y: 22 },
  { x: 9, y: 74 },
  { x: 34, y: 88 },
  { x: 63, y: 84 },
  { x: 88, y: 68 },
];

function OrbitSlide({ content }: { content: SlideContent }) {
  const labels = content.bullets ?? [];
  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[54px] font-bold tracking-[-0.03em] leading-[1.12] text-ink text-balance max-w-[1400px] shrink-0">
        {withAccent(content.big ?? content.title, ACCENT_PHRASES[content.id])}
      </h2>
      <div className="flex-1 min-h-0 relative my-6">
        {content.visual && (
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[58px] font-bold tracking-[-0.02em] text-accent whitespace-nowrap">
            {content.visual}
          </p>
        )}
        {labels.map((label, i) => {
          const pos = ORBIT_POSITIONS[i % ORBIT_POSITIONS.length];
          return (
            <span
              key={label}
              className="absolute -translate-x-1/2 -translate-y-1/2 px-7 py-3.5 rounded-full border border-line bg-bg-card text-[26px] text-ink-muted whitespace-nowrap"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {label}
            </span>
          );
        })}
      </div>
      {content.body && (
        <p className="text-[30px] text-ink-muted leading-[1.5] max-w-[1400px] shrink-0">{content.body}</p>
      )}
    </SlideFrame>
  );
}

// "Mental loading screen": one row per thing you re-load before the real
// work starts. Fill widths are decorative, fixed for SSR determinism.
const LOADING_FILLS = [0.86, 0.62, 0.91, 0.54, 0.73];

function LoadingSlide({ content }: { content: SlideContent }) {
  const rows = content.bullets ?? [];
  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[58px] font-bold tracking-[-0.03em] leading-[1.1] text-ink text-balance max-w-[1500px] shrink-0">
        {withAccent(content.big ?? content.title, ACCENT_PHRASES[content.id])}
      </h2>
      <div className="flex-1 min-h-0 flex items-center">
        <div className="w-[1150px] bg-bg-card border border-line rounded-[24px] p-12 flex flex-col gap-7">
          {rows.map((row, i) => {
            const fill = LOADING_FILLS[i % LOADING_FILLS.length];
            return (
              <div key={row} className="grid grid-cols-[330px_1fr_110px] items-center gap-8">
                <span className="text-[28px] text-ink">loading {row.toLowerCase()}…</span>
                <div className="h-[16px] rounded-full bg-bg border border-line overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${fill * 100}%` }} />
                </div>
                <span className="text-[24px] text-accent text-right">{Math.round(fill * 100)}%</span>
              </div>
            );
          })}
        </div>
      </div>
      {content.body && (
        <p className="text-[30px] text-ink-muted leading-[1.5] max-w-[1400px] shrink-0">{content.body}</p>
      )}
    </SlideFrame>
  );
}

// Recognition grid: icon tiles, one operator task each. Bullets are
// "iconKey: label"; an unknown or missing icon key degrades to a label-only
// tile — never crashes live. 3×2 up to six tiles, 4×2 beyond.
function GridSlide({ content }: { content: SlideContent }) {
  const tiles = (content.bullets ?? []).map(splitBullet);
  const fourCol = tiles.length > 6;

  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[62px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance max-w-[1400px] shrink-0">
        {content.title}
      </h2>
      <div
        className={`flex-1 min-h-0 grid grid-rows-2 gap-6 mt-12 ${fourCol ? "grid-cols-4" : "grid-cols-3"}`}
      >
        {tiles.map(({ key, text }) => {
          const Icon = TASK_ICONS[key];
          return (
            <div
              key={text}
              className={`bg-bg-card border border-line rounded-[24px] flex flex-col justify-between ${
                fourCol ? "p-8" : "p-10"
              }`}
            >
              {Icon && (
                <Icon className={`text-accent shrink-0 ${fourCol ? "w-[58px] h-[58px]" : "w-[84px] h-[84px]"}`} />
              )}
              <p
                className={`font-semibold leading-[1.3] text-ink text-balance ${
                  fourCol ? "text-[26px]" : "text-[34px]"
                }`}
              >
                {text}
              </p>
            </div>
          );
        })}
      </div>
    </SlideFrame>
  );
}

// Stylized digital-rain backdrop for the Matrix metaphor — hand-rolled
// (no film still, no rights question), deterministic glyphs so SSR and
// client markup match on the prerendered static route.
const RAIN_GLYPHS = "01<>+#*/";
const RAIN_COLUMNS = Array.from({ length: 16 }, (_, i) => ({
  left: (i + 0.5) * 6.25,
  top: (i * 13) % 18,
  opacity: 0.1 + ((i * 5) % 3) * 0.04,
  chars: Array.from(
    { length: 9 + ((i * 3) % 6) },
    (_, j) => RAIN_GLYPHS[(i * 7 + j * 5) % RAIN_GLYPHS.length],
  ),
}));

function MatrixSlide({ content }: { content: SlideContent }) {
  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0" aria-hidden>
          {RAIN_COLUMNS.map((col, i) => (
            <div
              key={i}
              className="absolute flex flex-col text-accent text-[26px] leading-[1.4] select-none"
              style={{ left: `${col.left}%`, top: `${col.top}%`, opacity: col.opacity }}
            >
              {col.chars.map((char, j) => (
                <span key={j}>{char}</span>
              ))}
            </div>
          ))}
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
          <h2 className="text-[104px] font-bold tracking-[-0.03em] leading-[1.05] text-ink text-balance">
            {content.title}
          </h2>
          {content.body && (
            <p className="text-[32px] text-ink-muted leading-[1.5] mt-10 max-w-[1150px]">{content.body}</p>
          )}
        </div>
      </div>
    </SlideFrame>
  );
}

// Definition slide: the Skill rendered as a labeled folder of what it packages.
function FolderSlide({ content }: { content: SlideContent }) {
  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[64px] font-bold tracking-[-0.03em] leading-[1.1] text-ink text-balance max-w-[1500px] shrink-0">
        {withAccent(content.big ?? content.title, ACCENT_PHRASES[content.id])}
      </h2>
      <div className="flex-1 min-h-0 flex flex-col justify-center">
        <div className="w-[1150px]">
          <div className="relative z-10 -mb-px w-fit h-[58px] px-10 bg-bg-card border border-line border-b-0 rounded-t-[16px] flex items-center">
            <span className="text-[24px] font-bold tracking-[0.14em] text-accent">SKILL</span>
          </div>
          <div className="bg-bg-card border border-line rounded-[24px] rounded-tl-none p-12 flex flex-wrap gap-5">
            {(content.bullets ?? []).map((chip) => (
              <span
                key={chip}
                className="px-8 py-4 rounded-full border border-line bg-bg text-[29px] text-ink"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
      {content.body && (
        <p className="text-[30px] text-ink-muted leading-[1.5] max-w-[1400px] shrink-0">{content.body}</p>
      )}
    </SlideFrame>
  );
}

// Two-column contrast. Bullets are "Prompt: …" / "Skill: …"; body is the
// bottom line under both columns.
function CompareSlide({ content }: { content: SlideContent }) {
  const items = (content.bullets ?? []).map(splitBullet);
  const columns = [
    { name: "Prompt", marker: "–", headerClass: "text-ink-muted", markerClass: "text-ink-muted" },
    { name: "Skill", marker: "✓", headerClass: "text-accent", markerClass: "text-accent" },
  ];

  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[58px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance max-w-[1500px] shrink-0">
        {content.title}
      </h2>
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-8 mt-10">
        {columns.map((col) => (
          <div key={col.name} className="bg-bg-card border border-line rounded-[24px] p-12 flex flex-col gap-8">
            <div className={`text-[40px] font-bold tracking-[-0.02em] ${col.headerClass}`}>{col.name}</div>
            <div className="flex flex-col gap-6">
              {items
                .filter((item) => item.key === col.name)
                .map((item) => (
                  <div key={item.text} className="flex items-start gap-5">
                    <span className={`text-[28px] font-bold shrink-0 ${col.markerClass}`} aria-hidden>
                      {col.marker}
                    </span>
                    <span className="text-[28px] leading-[1.35] text-ink">{item.text}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {content.body && (
        <p className="text-[31px] font-semibold text-ink leading-[1.4] mt-10 shrink-0">{content.body}</p>
      )}
    </SlideFrame>
  );
}

// The analogy row is presentation chrome, fixed here; the Skill row is the
// real model and comes from the slide's bullets ("Label: description").
const FOOTBALL_ROW = [
  { label: "Situation", description: "New down, distance, defense" },
  { label: "Play call", description: "Same playbook picks the play" },
  { label: "Result", description: "Different every time" },
];

function PlaybookRow({
  name,
  nameClass,
  cells,
}: {
  name: string;
  nameClass: string;
  cells: { label: string; description: string }[];
}) {
  return (
    <div className="flex items-center gap-8">
      <div className={`w-[230px] shrink-0 text-[23px] font-bold uppercase tracking-[0.08em] ${nameClass}`}>
        {name}
      </div>
      <div className="flex-1 flex items-center gap-6">
        {cells.map((cell, i) => (
          <div key={cell.label} className="contents">
            <div className="flex-1 bg-bg-card border border-line rounded-[20px] px-8 py-7">
              <div className="text-[30px] font-bold text-ink">{cell.label}</div>
              {cell.description && (
                <div className="text-[23px] text-ink-muted leading-[1.3] mt-2">{cell.description}</div>
              )}
            </div>
            {i < cells.length - 1 && (
              <div className="text-[44px] text-accent font-bold shrink-0" aria-hidden>
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PlaybookSlide({ content }: { content: SlideContent }) {
  const skillCells = (content.bullets ?? []).map(splitBullet).map(({ key, text }) => ({
    label: key,
    description: text,
  }));

  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[58px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance shrink-0">
        {content.title}
      </h2>
      {content.body && (
        <p className="text-[30px] text-ink-muted leading-[1.5] mt-4 max-w-[1400px] shrink-0">{content.body}</p>
      )}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-12">
        <PlaybookRow name="The playbook" nameClass="text-ink-muted" cells={FOOTBALL_ROW} />
        <PlaybookRow name="The Skill" nameClass="text-accent" cells={skillCells} />
      </div>
    </SlideFrame>
  );
}

// Slide-native teardown: renders the Skill object as projection-scale chrome
// (TeardownCard) instead of embedding the web-scale SkillCard — the embedded
// card's 10-19px type projected at ~8-16px after fit-scaling, unreadable
// from a ballroom.
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

function QrSlide({ content }: { content: SlideContent }) {
  const steps = content.bullets ?? [];
  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <div className="flex-1 flex items-center gap-20">
        <div className="flex-1 max-w-[820px]">
          <h2 className="text-[64px] font-bold tracking-[-0.03em] leading-[1.1] text-ink text-balance">
            {content.title}
          </h2>
          {content.body && <p className="text-[32px] text-ink-muted leading-[1.5] mt-8">{content.body}</p>}
          {steps.length > 0 && (
            <div className="flex flex-col gap-6 mt-14">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center gap-7">
                  <span className="w-[56px] h-[56px] rounded-full border-2 border-accent text-accent flex items-center justify-center text-[27px] font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-[31px] text-ink">{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="shrink-0">
          <QrBlock size={520} />
        </div>
      </div>
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

// Six-dimension 1–5 scorecard. Bullets are "Dimension: question".
function ScorecardSlide({ content }: { content: SlideContent }) {
  const rows = (content.bullets ?? []).map(splitBullet);
  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[58px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance shrink-0">
        {content.title}
      </h2>
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-6 mt-8">
        {rows.map(({ key, text }) => (
          <div key={key} className="grid grid-cols-[400px_1fr_auto] items-center gap-8">
            <span className="text-[29px] font-bold text-ink">{key}</span>
            <span className="text-[25px] text-ink-muted leading-[1.3]">{text}</span>
            <div className="flex gap-3" aria-hidden>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className="w-[36px] h-[36px] rounded-full border-2 border-line flex items-center justify-center text-[16px] text-ink-muted"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {content.body && (
        <p className="text-[30px] font-semibold text-ink leading-[1.4] mt-8 shrink-0">{content.body}</p>
      )}
    </SlideFrame>
  );
}

function SentenceSlide({ content }: { content: SlideContent }) {
  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[44px] font-bold tracking-[-0.02em] text-ink-muted shrink-0">{content.title}</h2>
      <p className="text-[56px] font-bold tracking-[-0.02em] leading-[1.45] text-ink text-balance max-w-[1500px] mt-10 shrink-0">
        {withSlots(content.big ?? "")}
      </p>
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-6 max-w-[1250px]">
        {(content.bullets ?? []).map((example) => (
          <div key={example} className="flex items-start gap-5">
            <span className="text-[26px] text-accent font-bold shrink-0" aria-hidden>
              →
            </span>
            <span className="text-[26px] leading-[1.4] text-ink-muted">{example}</span>
          </div>
        ))}
      </div>
      <div className="absolute right-[140px] bottom-[110px]">
        <QrBlock size={170} />
      </div>
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
      <div className="mt-12">
        <QrBlock size={240} />
      </div>
      {content.visual && <p className="text-[24px] text-ink-muted mt-14">{content.visual}</p>}
    </SlideFrame>
  );
}

// ── Dispatch ─────────────────────────────────────────────────────────────

function renderSlideContent(content: SlideContent): ReactNode {
  switch (content.kind) {
    case "title":
      return <TitleSlide content={content} />;
    case "orbit":
      return <OrbitSlide content={content} />;
    case "loading":
      return <LoadingSlide content={content} />;
    case "grid":
      return <GridSlide content={content} />;
    case "matrix":
      return <MatrixSlide content={content} />;
    case "folder":
      return <FolderSlide content={content} />;
    case "compare":
      return <CompareSlide content={content} />;
    case "playbook":
      return <PlaybookSlide content={content} />;
    case "teardown":
      return <TeardownSlide content={content} />;
    case "qr":
      return <QrSlide content={content} />;
    case "framework":
      return <FrameworkSlide content={content} />;
    case "scorecard":
      return <ScorecardSlide content={content} />;
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
    render: () => renderSlideContent(content),
  }),
);
