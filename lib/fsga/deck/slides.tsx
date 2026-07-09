"use client";

// FSGA workshop — deck slide layouts: DECK_SLIDES (data) → SLIDES (SlideDef[]
// with render functions), switched by `kind`. DB-free by construction: only
// imports config (constants) and presentational components. Everything here
// is authored against a fixed 1920×1080 stage — DeckShell scales the whole
// box to fit whatever screen it's projected on, so pixel sizes below are
// absolute *stage* coordinates, not real screen px.
//
// Hook-free: every slide is authored directly in stage pixels, no
// fit-scaling. The 'use client' directive is kept because this module is
// only ever reached through deck-shell.tsx's client boundary anyway, and
// render functions here are client-side JSX.

import type { ReactNode } from "react";
import { Pill } from "@/components/atoms";
import {
  ChatGlyph,
  CheckDocGlyph,
  DocGlyph,
  FolderGlyph,
  GearGlyph,
} from "@/components/fsga/deck/diagram-glyphs";
import { QrBlock } from "@/components/fsga/deck/qr-block";
import { TASK_ICONS } from "@/components/fsga/deck/task-icons";
import { ScorecardInteractive } from "@/components/fsga/scorecard-interactive";
import { DECK_SLIDES, type SlideContent } from "./deck-content";
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
  "skill-definition": "reusable task expertise",
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

/** Shared `"key: text"` bullet parse (pattern groups, test cards, teardown pipeline). */
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

// The clip is committed at public/fsga/ so the offline/static deck serves it
// from the same origin — no venue-wifi dependency. No autoplay: JL clicks
// play (a user gesture, so audio is allowed); DeckShell's key handler
// ignores events while the <video> has focus so Space scrubs the clip
// instead of advancing the slide.
const MATRIX_CLIP_SRC = "/fsga/matrix-know-how.mp4";

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
          <h2 className="text-[64px] font-bold tracking-[-0.03em] leading-[1.05] text-ink text-balance">
            {content.title}
          </h2>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- JL narrates live; the clip is a stage prop */}
          <video
            src={MATRIX_CLIP_SRC}
            controls
            preload="auto"
            playsInline
            className="mt-8 w-[960px] aspect-[854/468] rounded-[20px] border border-line bg-black"
          />
          {content.body && (
            <p className="text-[26px] text-ink-muted leading-[1.5] mt-7 max-w-[1150px]">{content.body}</p>
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

// Flow strip atop the Prompt column: the same prompt→result trip, re-made
// every time — rows fade to suggest the endless repeat.
function PromptFlowStrip() {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      {[1, 0.55, 0.3].map((opacity) => (
        <div key={opacity} className="flex items-center gap-5 text-ink-muted" style={{ opacity }}>
          <ChatGlyph className="w-[38px] h-[38px]" />
          <span className="text-[26px] font-bold">→</span>
          <DocGlyph className="w-[38px] h-[38px]" />
        </div>
      ))}
      <span className="text-[20px] text-ink-muted mt-1">re-written every time</span>
    </div>
  );
}

// Flow strip atop the Skill column: one folder, fanned out to many runs.
function SkillFlowStrip() {
  return (
    <div className="flex items-center gap-6" aria-hidden>
      <FolderGlyph className="w-[54px] h-[54px] text-accent" />
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4 text-ink">
            <span className="text-[24px] font-bold text-accent">→</span>
            <CheckDocGlyph className="w-[34px] h-[34px]" />
          </div>
        ))}
      </div>
      <span className="text-[20px] text-ink-muted self-end pb-1">created once, reused every run</span>
    </div>
  );
}

// Two-column contrast. Bullets are "Prompt: …" / "Skill: …"; body is the
// bottom line under both columns.
function CompareSlide({ content }: { content: SlideContent }) {
  const items = (content.bullets ?? []).map(splitBullet);
  const columns = [
    {
      name: "Prompt",
      marker: "–",
      headerClass: "text-ink-muted",
      markerClass: "text-ink-muted",
      strip: <PromptFlowStrip />,
    },
    {
      name: "Skill",
      marker: "✓",
      headerClass: "text-accent",
      markerClass: "text-accent",
      strip: <SkillFlowStrip />,
    },
  ];

  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[58px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance max-w-[1500px] shrink-0">
        {content.title}
      </h2>
      {/* Cards must fit INSIDE the flex-1 box — overflowing content would
          spill under the grid and visually swallow the footnote's margin. */}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-8 mt-10">
        {columns.map((col) => (
          <div key={col.name} className="bg-bg-card border border-line rounded-[24px] p-10 flex flex-col gap-5">
            <div className={`text-[40px] font-bold tracking-[-0.02em] ${col.headerClass}`}>{col.name}</div>
            {col.strip}
            <div className="flex flex-col gap-4 pt-2 border-t border-line">
              {items
                .filter((item) => item.key === col.name)
                .map((item) => (
                  <div key={item.text} className="flex items-start gap-5">
                    <span className={`text-[26px] font-bold shrink-0 ${col.markerClass}`} aria-hidden>
                      {col.marker}
                    </span>
                    <span className="text-[26px] leading-[1.35] text-ink">{item.text}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {content.body && (
        <p className="text-[31px] font-semibold text-ink leading-[1.4] mt-14 shrink-0">{content.body}</p>
      )}
    </SlideFrame>
  );
}

// "Same shape, new details": four situations funnel through one shared
// pipeline into four outputs. Situation icons resolve by label — a
// presentation choice, like ACCENT_PHRASES.
const SITUATION_ICONS: Record<string, string> = {
  "Live show prep": "show",
  "New hire": "hire",
  "Investor update": "industry",
  "Customer recap": "recap",
};

function PatternSlide({ content }: { content: SlideContent }) {
  const items = (content.bullets ?? []).map(splitBullet);
  const situations = items.filter((i) => i.key === "situation").map((i) => i.text);
  const steps = items.filter((i) => i.key === "step").map((i) => i.text);
  const outputs = items.filter((i) => i.key === "output").map((i) => i.text);

  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[56px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance shrink-0">
        {content.title}
      </h2>
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-4 mt-4">
        <div className="grid grid-cols-4 gap-5">
          {situations.map((label) => {
            const Icon = TASK_ICONS[SITUATION_ICONS[label]];
            return (
              <div
                key={label}
                className="bg-bg-card border border-line rounded-[16px] px-6 py-5 flex items-center gap-4"
              >
                {Icon && <Icon className="w-[38px] h-[38px] text-accent shrink-0" />}
                <span className="text-[25px] font-semibold text-ink">{label}</span>
              </div>
            );
          })}
        </div>
        <div className="text-center text-[36px] text-accent font-bold leading-none" aria-hidden>
          ↓
        </div>
        <div className="border-2 border-accent/50 bg-accent/10 rounded-[18px] px-10 py-6 flex items-center justify-center gap-7">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-7">
              <span className="text-[28px] font-bold text-ink whitespace-nowrap">{step}</span>
              {i < steps.length - 1 && (
                <span className="text-[32px] text-accent font-bold" aria-hidden>
                  →
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-[36px] text-accent font-bold leading-none" aria-hidden>
          ↓
        </div>
        <div className="grid grid-cols-4 gap-5">
          {outputs.map((label) => (
            <div
              key={label}
              className="bg-bg-card border border-line rounded-[16px] px-6 py-4 flex items-center gap-4"
            >
              <CheckDocGlyph className="w-[30px] h-[30px] text-ink-muted shrink-0" />
              <span className="text-[23px] text-ink-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>
      {content.body && (
        <p className="text-[28px] font-semibold text-ink leading-[1.5] mt-4 shrink-0">{content.body}</p>
      )}
    </SlideFrame>
  );
}

// "Before the draft, there are decisions": the checklist of decisions feeds
// the draft — decisions on the left (the reusable part, accented), a skeleton
// draft document on the right (the output).
function DecisionsSlide({ content }: { content: SlideContent }) {
  const decisions = content.bullets ?? [];
  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[56px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance shrink-0">
        {content.title}
      </h2>
      <div className="flex-1 min-h-0 flex items-center gap-16 mt-4">
        <div className="flex-1 max-w-[780px] flex flex-col gap-4">
          <span className="text-[17px] uppercase tracking-[0.12em] text-accent font-bold">
            The decisions
          </span>
          {decisions.map((question) => (
            <div
              key={question}
              className="flex items-center gap-5 bg-accent/10 border border-accent/40 rounded-[16px] px-7 py-4"
            >
              <span className="text-[26px] font-bold text-accent shrink-0" aria-hidden>
                ✓
              </span>
              <span className="text-[27px] text-ink">{question}</span>
            </div>
          ))}
        </div>
        <div className="shrink-0 flex flex-col items-center gap-4" aria-hidden>
          <span className="text-[64px] text-accent font-bold leading-none">→</span>
          <span className="text-[19px] uppercase tracking-[0.12em] text-ink-muted whitespace-nowrap">
            Decisions → Draft
          </span>
        </div>
        <div className="w-[440px] shrink-0 flex flex-col gap-4">
          <span className="text-[17px] uppercase tracking-[0.12em] text-ink-muted">The output</span>
          <div className="bg-bg-card border border-line rounded-[20px] p-9">
            <div className="flex items-center gap-4 pb-6 border-b border-line">
              <DocGlyph className="w-[38px] h-[38px] text-ink-muted shrink-0" />
              <span className="text-[30px] font-bold text-ink">Draft</span>
            </div>
            <div className="flex flex-col gap-4 mt-7" aria-hidden>
              {[92, 100, 78, 96, 64].map((width, i) => (
                <div key={i} className="h-[14px] rounded-full bg-line" style={{ width: `${width}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {content.body && (
        <p className="text-[28px] font-semibold text-ink leading-[1.5] mt-4 shrink-0">{content.body}</p>
      )}
    </SlideFrame>
  );
}

// The Repeat Test: three big question cards, each with its answer-space
// chips. Bullets: "q: question | option · option · …".
function TestSlide({ content }: { content: SlideContent }) {
  const cards = (content.bullets ?? [])
    .map(splitBullet)
    .filter((i) => i.key === "q")
    .map(({ text }) => {
      const [question, options] = text.split("|").map((part) => part.trim());
      return {
        question,
        options: options ? options.split("·").map((option) => option.trim()) : [],
      };
    });

  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[56px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance shrink-0">
        {content.title}
      </h2>
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-7">
        {cards.map((card, i) => (
          <div key={card.question} className="bg-bg-card border border-line rounded-[20px] px-10 py-7">
            <div className="flex items-center gap-6">
              <span className="w-[52px] h-[52px] rounded-full border-2 border-accent text-accent flex items-center justify-center text-[26px] font-bold shrink-0">
                {i + 1}
              </span>
              <span className="text-[34px] font-bold text-ink">{card.question}</span>
            </div>
            <div className="flex flex-wrap gap-3 mt-5 ml-[76px]">
              {card.options.map((option) => (
                <span
                  key={option}
                  className="px-6 py-2.5 rounded-full border border-line bg-bg text-[22px] text-ink-muted"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {content.body && (
        <p className="text-[28px] font-semibold text-ink leading-[1.5] mt-4 shrink-0">{content.body}</p>
      )}
    </SlideFrame>
  );
}

// Real-example person card. Bullets: "name: …", "org: …", "role: …", and
// optionally "photo: /fsga/…" (served from public/ so the offline deck works;
// falls back to initials when absent). `visual` is the tagline under the card.
function PersonSlide({ content }: { content: SlideContent }) {
  const items = (content.bullets ?? []).map(splitBullet);
  const field = (key: string) => items.find((i) => i.key === key)?.text ?? "";
  const name = field("name");
  const photo = field("photo");
  const initials = name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[58px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance max-w-[1500px] shrink-0">
        {content.title}
      </h2>
      {content.body && (
        <p className="text-[30px] text-ink-muted leading-[1.5] mt-6 max-w-[1400px] shrink-0">{content.body}</p>
      )}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-9">
        <div className="bg-bg-card border border-line rounded-[28px] px-20 py-14 flex items-center gap-12">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element -- deck stays
            // DB/optimizer-free; a 400px local asset needs no next/image.
            <img
              src={photo}
              alt={name}
              className="w-[150px] h-[150px] rounded-full border-2 border-accent/60 object-cover shrink-0"
            />
          ) : (
            <span className="w-[150px] h-[150px] rounded-full border-2 border-accent/60 bg-accent/10 text-accent flex items-center justify-center text-[56px] font-bold shrink-0">
              {initials}
            </span>
          )}
          <div>
            <div className="text-[52px] font-bold tracking-[-0.02em] text-ink">{name}</div>
            <div className="text-[32px] font-semibold text-accent mt-2">{field("org")}</div>
            <div className="text-[27px] text-ink-muted mt-1">{field("role")}</div>
          </div>
        </div>
        {content.visual && (
          <p className="text-[32px] font-semibold text-ink tracking-[-0.01em]">{content.visual}</p>
        )}
      </div>
    </SlideFrame>
  );
}

// "Skill ingredients": five numbered buckets of what the Skill needs to
// know. Bullets: "Bucket: item · item · …".
function IngredientsSlide({ content }: { content: SlideContent }) {
  const buckets = (content.bullets ?? []).map(splitBullet).map(({ key, text }) => ({
    name: key,
    items: text.split("·").map((item) => item.trim()),
  }));

  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[56px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance shrink-0">
        {content.title}
      </h2>
      <div className="flex-1 min-h-0 grid grid-cols-5 gap-6 content-center mt-6">
        {buckets.map((bucket, i) => (
          <div key={bucket.name} className="bg-bg-card border border-line rounded-[20px] p-7 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <span className="w-[40px] h-[40px] rounded-full border-2 border-accent text-accent flex items-center justify-center text-[20px] font-bold shrink-0">
                {i + 1}
              </span>
              <span className="text-[26px] font-bold text-ink">{bucket.name}</span>
            </div>
            <div className="flex flex-col gap-3 pt-4 border-t border-line">
              {bucket.items.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-[19px] text-accent font-bold shrink-0" aria-hidden>
                    ·
                  </span>
                  <span className="text-[20px] leading-[1.3] text-ink-muted">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {content.body && (
        <p className="text-[28px] font-semibold text-ink leading-[1.5] mt-6 shrink-0">{content.body}</p>
      )}
    </SlideFrame>
  );
}

// Joe's Skill all the way through: an Input → Skill(Process) → Output
// pipeline diagram, authored in stage pixels so it reads from a ballroom.
// Bullets: "input: …", "process: …", "output: …"; `body` is the repeated-work
// statement; `visual` is the ownership footnote under the outputs.
function TeardownSlide({ content }: { content: SlideContent }) {
  const items = (content.bullets ?? []).map(splitBullet);
  const inputs = items.filter((i) => i.key === "input").map((i) => i.text);
  const steps = items.filter((i) => i.key === "process").map((i) => i.text);
  const outputs = items.filter((i) => i.key === "output").map((i) => i.text);

  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[58px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance shrink-0">
        {content.title}
      </h2>
      {content.body && <p className="text-[26px] text-ink-muted leading-[1.45] mt-4 shrink-0">{content.body}</p>}
      <div className="flex-1 min-h-0 flex items-center gap-7 mt-6">
        <div className="w-[400px] shrink-0 flex flex-col gap-3">
          <span className="text-[22px] font-bold tracking-[0.1em] uppercase text-ink-muted">Input</span>
          {inputs.map((input) => (
            <div
              key={input}
              className="flex items-center gap-4 bg-bg-card border border-line rounded-[14px] px-5 py-3.5"
            >
              <DocGlyph className="w-[30px] h-[30px] text-ink-muted shrink-0" />
              <span className="text-[21px] leading-[1.25] text-ink">{input}</span>
            </div>
          ))}
        </div>
        <span className="text-[52px] text-accent font-bold shrink-0" aria-hidden>
          →
        </span>
        <div className="flex-1 min-w-0 self-stretch flex flex-col justify-center">
          <div className="relative z-10 -mb-px w-fit h-[48px] px-8 bg-bg-card border-2 border-accent/50 border-b-0 rounded-t-[14px] flex items-center gap-3">
            <GearGlyph className="w-[26px] h-[26px] text-accent" />
            <span className="text-[20px] font-bold tracking-[0.14em] text-accent">SKILL · PROCESS</span>
          </div>
          <div className="bg-bg-card border-2 border-accent/50 rounded-[20px] rounded-tl-none p-8">
            <div className="flex flex-col gap-3.5">
              {steps.map((step, i) => (
                <div key={step} className="flex items-start gap-4">
                  <span className="text-[22px] font-bold text-accent shrink-0">{i + 1}.</span>
                  <span className="text-[22px] leading-[1.3] text-ink">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <span className="text-[52px] text-accent font-bold shrink-0" aria-hidden>
          →
        </span>
        <div className="w-[400px] shrink-0 flex flex-col gap-3">
          <span className="text-[22px] font-bold tracking-[0.1em] uppercase text-accent">Output</span>
          {outputs.map((output) => (
            <div
              key={output}
              className="flex items-center gap-4 bg-bg-card border border-accent/40 rounded-[14px] px-5 py-3.5"
            >
              <CheckDocGlyph className="w-[30px] h-[30px] text-accent shrink-0" />
              <span className="text-[21px] leading-[1.25] text-ink">{output}</span>
            </div>
          ))}
          {content.visual && (
            <span className="text-[20px] text-ink-muted leading-[1.35] mt-1">{content.visual}</span>
          )}
        </div>
      </div>
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

// Four-dimension 1–5 calculator — live-interactive. JL clicks scores on stage
// (e.g. a volunteer's task) and the verdict updates in real time. Dimensions
// and verdict logic live in lib/fsga/scorecard.ts, shared with the attendee
// pack page. State survives slide navigation because DeckShell keeps every
// slide mounted.
function ScorecardSlide({ content }: { content: SlideContent }) {
  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[58px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance shrink-0">
        {content.title}
      </h2>
      <div className="flex-1 min-h-0 flex flex-col justify-center mt-5">
        <ScorecardInteractive variant="stage" />
      </div>
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
    case "matrix":
      return <MatrixSlide content={content} />;
    case "folder":
      return <FolderSlide content={content} />;
    case "compare":
      return <CompareSlide content={content} />;
    case "pattern":
      return <PatternSlide content={content} />;
    case "decisions":
      return <DecisionsSlide content={content} />;
    case "test":
      return <TestSlide content={content} />;
    case "person":
      return <PersonSlide content={content} />;
    case "ingredients":
      return <IngredientsSlide content={content} />;
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
