"use client";

// FSGA workshop — deck slide layouts: DECK_SLIDES (data) → SLIDES (SlideDef[]
// with render functions), switched by `kind`. DB-free by construction: only
// imports skills/library (data), config (constants), and presentational
// components. Everything here is authored against a fixed 1920×1080 stage —
// DeckShell scales the whole box to fit whatever screen it's projected on,
// so pixel sizes below are absolute *stage* coordinates, not real screen px.
//
// Hook-free: every slide is authored directly in stage pixels, no
// fit-scaling. The 'use client' directive is kept because this module is
// only ever reached through deck-shell.tsx's client boundary anyway, and
// render functions here are client-side JSX.

import type { ComponentType, ReactNode, SVGProps } from "react";
import { Pill } from "@/components/atoms";
import {
  ChatGlyph,
  CheckDocGlyph,
  DocGlyph,
  FolderGlyph,
  GearGlyph,
  InboxGlyph,
} from "@/components/fsga/deck/diagram-glyphs";
import { QrBlock } from "@/components/fsga/deck/qr-block";
import { TASK_ICONS } from "@/components/fsga/deck/task-icons";
import { ScorecardInteractive } from "@/components/fsga/scorecard-interactive";
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

// "Same shape, new details": four situations funnel through one shared
// pipeline into four outputs. Situation icons resolve by label — a
// presentation choice, like ACCENT_PHRASES.
const SITUATION_ICONS: Record<string, string> = {
  "Sponsor call": "call",
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
        <p className="text-[28px] text-ink-muted leading-[1.5] mt-4 shrink-0">{content.body}</p>
      )}
    </SlideFrame>
  );
}

// Iceberg layers: visible artifacts above a dashed waterline, the reusable
// judgment below it.
function LayersSlide({ content }: { content: SlideContent }) {
  const items = (content.bullets ?? []).map(splitBullet);
  const visible = items.filter((i) => i.key === "visible").map((i) => i.text);
  const hidden = items.filter((i) => i.key === "hidden").map((i) => i.text);

  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[56px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance shrink-0">
        {content.title}
      </h2>
      <div className="flex-1 min-h-0 flex flex-col justify-center">
        <div className="text-[16px] uppercase tracking-[0.12em] text-ink-muted mb-4">Visible</div>
        <div className="flex flex-wrap gap-4">
          {visible.map((label) => (
            <span
              key={label}
              className="px-8 py-4 rounded-full border border-line bg-bg-card text-[27px] text-ink"
            >
              {label}
            </span>
          ))}
        </div>
        <div className="border-t-2 border-dashed border-accent/60 my-9" aria-hidden />
        <div className="text-[16px] uppercase tracking-[0.12em] text-accent mb-4">The reusable part</div>
        <div className="flex flex-wrap gap-4 max-w-[1400px]">
          {hidden.map((label) => (
            <span
              key={label}
              className="px-8 py-4 rounded-full border border-accent/40 bg-accent/10 text-[27px] text-ink"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      {content.body && (
        <p className="text-[28px] text-ink-muted leading-[1.5] mt-4 shrink-0">{content.body}</p>
      )}
    </SlideFrame>
  );
}

// The Repeat Test: three checklist questions plus a worked example table.
// Bullets: "q: …" questions, "row: Task | Standards | First draft" rows.
const TEST_TABLE_HEADERS = ["Task", "Repeated standards", "Useful first draft"];

function TestSlide({ content }: { content: SlideContent }) {
  const items = (content.bullets ?? []).map(splitBullet);
  const questions = items.filter((i) => i.key === "q").map((i) => i.text);
  const rows = items
    .filter((i) => i.key === "row")
    .map((i) => i.text.split("|").map((cell) => cell.trim()));

  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[56px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance shrink-0">
        {content.title}
      </h2>
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-10">
        <div className="flex flex-col gap-5">
          {questions.map((question, i) => (
            <div key={question} className="flex items-center gap-6">
              <span className="text-[30px] font-bold text-accent shrink-0">{i + 1}.</span>
              <span className="text-[31px] font-semibold text-ink">{question}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[1.1fr_1.9fr_1fr] max-w-[1500px]">
          {TEST_TABLE_HEADERS.map((header) => (
            <div
              key={header}
              className="text-[17px] uppercase tracking-[0.1em] text-accent font-bold pb-3 border-b-2 border-line"
            >
              {header}
            </div>
          ))}
          {rows.flatMap((cells, r) =>
            cells.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={`py-4 pr-8 border-b border-line text-[23px] leading-[1.3] ${
                  c === 0 ? "font-semibold text-ink" : "text-ink-muted"
                }`}
              >
                {cell}
              </div>
            )),
          )}
        </div>
      </div>
      {content.body && (
        <p className="text-[28px] text-ink-muted leading-[1.5] mt-2 shrink-0">{content.body}</p>
      )}
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
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-8 mt-10">
        {columns.map((col) => (
          <div key={col.name} className="bg-bg-card border border-line rounded-[24px] p-12 flex flex-col gap-7">
            <div className={`text-[40px] font-bold tracking-[-0.02em] ${col.headerClass}`}>{col.name}</div>
            {col.strip}
            <div className="flex flex-col gap-5 pt-2 border-t border-line">
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

// Glyphs for the Skill row's Input → Process → Output cells, by position.
const SKILL_CELL_GLYPHS: ComponentType<SVGProps<SVGSVGElement>>[] = [InboxGlyph, GearGlyph, CheckDocGlyph];

function PlaybookRow({
  name,
  nameClass,
  cells,
}: {
  name: string;
  nameClass: string;
  cells: { label: string; description: string; glyph?: ComponentType<SVGProps<SVGSVGElement>> }[];
}) {
  return (
    <div className="flex items-center gap-8">
      <div className={`w-[230px] shrink-0 text-[23px] font-bold uppercase tracking-[0.08em] ${nameClass}`}>
        {name}
      </div>
      <div className="flex-1 flex items-center gap-6">
        {cells.map((cell, i) => (
          <div key={cell.label} className="contents">
            <div className="flex-1 bg-bg-card border border-line rounded-[20px] px-8 py-7 flex items-start gap-5">
              {cell.glyph && <cell.glyph className="w-[44px] h-[44px] text-accent shrink-0 mt-1" />}
              <div>
                <div className="text-[30px] font-bold text-ink">{cell.label}</div>
                {cell.description && (
                  <div className="text-[23px] text-ink-muted leading-[1.3] mt-2">{cell.description}</div>
                )}
              </div>
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
  const skillCells = (content.bullets ?? []).map(splitBullet).map(({ key, text }, i) => ({
    label: key,
    description: text,
    glyph: SKILL_CELL_GLYPHS[i],
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

// Slide-native teardown: the Skill object rendered as an Input → Skill →
// Output pipeline diagram (raw-material chips flow through the know-how
// folder into finished outputs), authored in stage pixels so it reads from
// a ballroom. Pulls inputs/processSteps/outputs straight off the library
// entry — no copy duplicated here.
function TeardownSlide({ content }: { content: SlideContent }) {
  const skill = getSkillBySlug(TEARDOWN_SKILL_SLUG);

  return (
    <SlideFrame eyebrow={content.eyebrow}>
      <h2 className="text-[58px] font-bold tracking-[-0.03em] leading-[1.08] text-ink text-balance shrink-0">
        {content.title}
      </h2>
      {content.body && <p className="text-[28px] text-ink-muted leading-[1.5] mt-4 shrink-0">{content.body}</p>}
      {skill ? (
        <div className="flex-1 min-h-0 flex items-center gap-7 mt-6">
          <div className="w-[430px] shrink-0 flex flex-col gap-4">
            <span className="text-[22px] font-bold tracking-[0.1em] uppercase text-ink-muted">Input</span>
            {skill.inputs.map((input) => (
              <div
                key={input}
                className="flex items-center gap-4 bg-bg-card border border-line rounded-[16px] p-5"
              >
                <DocGlyph className="w-[34px] h-[34px] text-ink-muted shrink-0" />
                <span className="text-[22px] leading-[1.3] text-ink">{input}</span>
              </div>
            ))}
          </div>
          <span className="text-[52px] text-accent font-bold shrink-0" aria-hidden>
            →
          </span>
          <div className="flex-1 min-w-0 self-stretch flex flex-col justify-center">
            <div className="relative z-10 -mb-px w-fit h-[48px] px-8 bg-bg-card border border-line border-b-0 rounded-t-[14px] flex items-center gap-3">
              <GearGlyph className="w-[26px] h-[26px] text-accent" />
              <span className="text-[20px] font-bold tracking-[0.14em] text-accent">SKILL</span>
            </div>
            <div className="bg-bg-card border border-line rounded-[20px] rounded-tl-none p-8">
              <div className="text-[30px] font-bold text-ink">{skill.name}</div>
              <div className="flex flex-col gap-3.5 mt-6">
                {skill.processSteps.map((step, i) => (
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
          <div className="w-[430px] shrink-0 flex flex-col gap-4">
            <span className="text-[22px] font-bold tracking-[0.1em] uppercase text-accent">Output</span>
            {skill.outputs.map((output) => (
              <div
                key={output}
                className="flex items-center gap-4 bg-bg-card border border-accent/40 rounded-[16px] p-5"
              >
                <CheckDocGlyph className="w-[34px] h-[34px] text-accent shrink-0" />
                <span className="text-[22px] leading-[1.3] text-ink">{output}</span>
              </div>
            ))}
            <span className="text-[20px] text-ink-muted leading-[1.35] mt-1">
              You review it. You make the final call.
            </span>
          </div>
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

// Six-dimension 1–5 scorecard — live-interactive. JL clicks scores on stage
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
    case "pattern":
      return <PatternSlide content={content} />;
    case "layers":
      return <LayersSlide content={content} />;
    case "test":
      return <TestSlide content={content} />;
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
