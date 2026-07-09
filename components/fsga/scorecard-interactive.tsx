"use client";

// FSGA workshop — interactive Skill Opportunity Calculator. Two surfaces,
// one component: `variant="stage"` renders in deck stage pixels (JL scores
// a volunteer's task live on the projected slide), `variant="page"` renders
// at web scale on the attendee's pack page (they score their own task on a
// phone). Pure client state — no DB, no network — so the deck's offline
// guarantee holds and the pack page ships it as a static island.
//
// The verdict is a carnival high-striker: a vertical skill-o-meter whose
// fill rises live as scores come in, with threshold lines for each tier
// and a bell that rings when the task lands in "Build this Skill".

import { useEffect, useState } from "react";
import { Btn } from "@/components/atoms";
import { BellGlyph } from "@/components/fsga/deck/diagram-glyphs";
import {
  SCORECARD_DIMENSIONS,
  SCORECARD_HINT,
  SCORE_TIERS,
  SCORE_TOTAL_MAX,
  scoreCoaching,
  scoreTotal,
  scoreVerdict,
  type ScoreVerdict,
} from "@/lib/fsga/scorecard";

// Pack-page results survive reloads (attendees drift between the deck, their
// pack, and build-your-own during the session). Stage state stays ephemeral.
// v2: the four-dimension calculator (new keys + 1–5 answers) — v1's saved
// six-dimension scores don't map, so the loader's per-dimension validation
// would drop them anyway; the fresh key just keeps storage clean.
const STORAGE_KEY = "fsga-scorecard-v2";

// Stage sizes are 1920×1080 stage pixels (the deck scales the whole box);
// page sizes are real CSS pixels on the attendee's phone.
const STYLES = {
  stage: {
    layout: "flex items-stretch gap-16",
    task: "flex items-center gap-4 mb-4",
    taskLabel: "text-[20px] font-semibold text-ink shrink-0",
    taskInput:
      "flex-1 bg-bg-card border border-line rounded-[12px] px-4 py-2.5 text-[19px] text-ink placeholder:text-ink-muted/50 outline-none focus:border-accent/70",
    rows: "flex-1 flex flex-col justify-center gap-4",
    row: "grid grid-cols-[46px_360px_1fr] items-center gap-x-7",
    num: "w-[38px] h-[38px] border-2 text-[17px]",
    question: "text-[20px] font-semibold text-ink leading-[1.25]",
    label: "text-[13px] uppercase tracking-[0.1em] text-ink-muted mt-0.5",
    circles: "grid grid-cols-5 gap-2.5",
    circle: "w-full text-center px-2 py-2.5 border-2 text-[15px] rounded-full",
    verdict: "mt-5 rounded-[18px] border p-5 flex items-center gap-6 min-h-[92px]",
    verdictLabel: "text-[25px] font-bold tracking-[-0.02em]",
    verdictDetail: "text-[19px] text-ink-muted leading-[1.35] mt-0.5",
    hint: "text-[20px] text-ink-muted leading-[1.4]",
    coaching: "text-[17px] leading-[1.35]",
    reset: "text-[18px]",
    meter: "w-[290px]",
    meterTitle: "text-[19px] font-bold tracking-[0.16em]",
    bell: "w-[40px] h-[40px]",
    ding: "text-[22px]",
    track: "rounded-[24px]",
    trackCol: "w-[96px]",
    tickLabel: "text-[16px]",
    readout: "text-[42px]",
    readoutSub: "text-[18px]",
  },
  page: {
    layout: "flex flex-col gap-5",
    rows: "flex flex-col gap-4",
    task: "flex flex-col gap-1.5 mb-1",
    taskLabel: "text-[13px] font-semibold text-ink",
    taskInput:
      "bg-bg border border-line rounded-[10px] px-3 py-2 text-[13px] text-ink placeholder:text-ink-muted/50 outline-none focus:border-accent/70",
    row: "flex flex-col gap-2",
    num: "w-[22px] h-[22px] border text-[11px]",
    question: "text-[13px] font-semibold text-ink leading-[1.4]",
    label: "text-[9px] uppercase tracking-[0.1em] text-ink-muted mt-0.5",
    // 5 answers per dimension: content-sized chips that wrap, still reading
    // weakest→strongest left-to-right on a phone width.
    circles: "flex flex-wrap gap-2 mt-1.5",
    circle: "text-center px-3 py-2 border text-[11px] rounded-full",
    verdict: "rounded-[14px] border p-4 flex-1 flex flex-wrap items-center gap-x-5 gap-y-3",
    verdictLabel: "text-[16px] font-bold tracking-[-0.01px]",
    verdictDetail: "text-[12px] text-ink-muted leading-[1.5] mt-0.5",
    hint: "text-[12px] text-ink-muted leading-[1.5]",
    coaching: "text-[11px] leading-[1.5]",
    reset: "text-[11px]",
    meter: "w-[150px] shrink-0",
    meterTitle: "text-[10px] font-bold tracking-[0.14em]",
    bell: "w-[20px] h-[20px]",
    ding: "text-[12px]",
    track: "rounded-[14px]",
    trackCol: "w-[52px]",
    tickLabel: "text-[9px]",
    readout: "text-[22px]",
    readoutSub: "text-[10px]",
  },
} as const;

// Threshold lines on the meter, one per tier boundary (skip the 0 floor).
const METER_TICKS = SCORE_TIERS.filter((t) => t.minTotal > 0)
  .map((t) => ({ pct: (t.minTotal / SCORE_TOTAL_MAX) * 100, label: t.label }))
  .sort((a, b) => a.pct - b.pct);

function ScoreMeter({
  variant,
  total,
  verdict,
}: {
  variant: "stage" | "page";
  total: number;
  verdict: ScoreVerdict | null;
}) {
  const s = STYLES[variant];
  const rang = verdict?.tier === 0;

  // The fill tracks the running total — except when the finished verdict got
  // core-gated below a threshold the raw total crossed: then the fill parks
  // just under that tier's line so the meter never contradicts the verdict.
  const gatedCeiling =
    verdict && verdict.tier > 0 ? SCORE_TIERS.find((t) => t.tier === verdict.tier - 1)!.minTotal - 0.5 : null;
  const fillTotal = gatedCeiling === null ? total : Math.min(total, gatedCeiling);
  const fillPct = Math.min(fillTotal / SCORE_TOTAL_MAX, 1) * 100;

  return (
    <div className={`${s.meter} flex flex-col gap-2`} aria-hidden>
      <div className={`${s.meterTitle} uppercase text-ink-muted self-center`}>Skill‑o‑meter</div>
      {/* Bell, track, and readout all center on the track column; the tier
          labels live in a right-hand gutter aligned to the track's height. */}
      <div className={`${s.trackCol} flex justify-center`}>
        <div
          className={`flex items-center gap-2 transition-opacity duration-300 ${
            rang ? "opacity-100 animate-bounce" : "opacity-35"
          }`}
        >
          <BellGlyph className={`${s.bell} ${rang ? "text-accent" : "text-ink-muted"}`} />
          {rang && <span className={`${s.ding} font-bold text-accent tracking-[0.1em]`}>DING!</span>}
        </div>
      </div>
      <div className="flex-1 min-h-0 self-stretch flex">
        <div className={`${s.trackCol} ${s.track} shrink-0 relative h-full bg-bg-card border border-line overflow-hidden`}>
          <div
            className="absolute inset-x-0 bottom-0 bg-accent transition-[height] duration-700 ease-out"
            style={{ height: `${fillPct}%` }}
          />
          {/* puck riding the top of the fill */}
          {total > 0 && (
            <div
              className="absolute inset-x-[6px] h-[8px] rounded-full bg-bg opacity-90 transition-[bottom] duration-700 ease-out"
              style={{ bottom: `calc(${fillPct}% - 4px)` }}
            />
          )}
          {METER_TICKS.map((tick) => (
            <div
              key={tick.label}
              className="absolute inset-x-0 border-t-2 border-dashed border-ink/40"
              style={{ bottom: `${tick.pct}%` }}
            />
          ))}
        </div>
        <div className="relative flex-1 min-w-0">
          {METER_TICKS.map((tick) => (
            <span
              key={tick.label}
              className={`${s.tickLabel} absolute left-2 translate-y-1/2 whitespace-nowrap text-ink-muted`}
              style={{ bottom: `${tick.pct}%` }}
            >
              {tick.label}
            </span>
          ))}
        </div>
      </div>
      <div className={`${s.trackCol} flex justify-center`}>
        <div className={`${s.readout} font-bold tracking-[-0.02em] ${rang ? "text-accent" : "text-ink"}`}>
          {total}
          <span className={`${s.readoutSub} text-ink-muted font-normal`}> /{SCORE_TOTAL_MAX}</span>
        </div>
      </div>
    </div>
  );
}

export function ScorecardInteractive({ variant }: { variant: "stage" | "page" }) {
  const s = STYLES[variant];
  const [scores, setScores] = useState<Record<string, number>>({});
  const [task, setTask] = useState("");

  // Load a saved pack-page result after hydration (never during render —
  // the page is prerendered, so reading localStorage earlier would mismatch).
  useEffect(() => {
    if (variant !== "page") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { task?: unknown; scores?: unknown };
      if (typeof saved.task === "string") setTask(saved.task);
      if (saved.scores && typeof saved.scores === "object") {
        const clean: Record<string, number> = {};
        for (const dim of SCORECARD_DIMENSIONS) {
          const v = (saved.scores as Record<string, unknown>)[dim.key];
          if (typeof v === "number" && dim.options.some((o) => o.value === v)) clean[dim.key] = v;
        }
        setScores(clean);
      }
    } catch {
      // Corrupt/blocked storage must never break the scorecard.
    }
  }, [variant]);

  useEffect(() => {
    if (variant !== "page") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ task, scores }));
    } catch {
      // Private mode / quota — persistence is best-effort.
    }
  }, [variant, task, scores]);

  const scoredCount = SCORECARD_DIMENSIONS.filter((d) => scores[d.key]).length;
  const complete = scoredCount === SCORECARD_DIMENSIONS.length;
  const total = scoreTotal(scores);
  const verdict = complete ? scoreVerdict(scores) : null;
  const coaching = verdict ? scoreCoaching(scores) : [];
  const emphasized = verdict !== null && verdict.tier <= 1;
  const trimmedTask = task.trim();
  const buildHref = `/fsga/build-your-own${trimmedTask ? `?task=${encodeURIComponent(trimmedTask)}` : ""}`;

  const taskField = (
    <div className={s.task}>
      <label className={s.taskLabel} htmlFor={`scorecard-task-${variant}`}>
        The task:
      </label>
      <input
        id={`scorecard-task-${variant}`}
        type="text"
        value={task}
        maxLength={120}
        placeholder="e.g. the monthly sponsor recap"
        className={s.taskInput}
        onChange={(event) => setTask(event.target.value)}
      />
    </div>
  );

  const verdictPanel = (
    <div
      className={`${s.verdict} ${emphasized ? "border-accent/60 bg-accent/10" : "border-line bg-bg-card"}`}
      aria-live="polite"
    >
      {verdict ? (
        <>
          <div className="flex-1 min-w-[200px]">
            <div className={`${s.verdictLabel} ${emphasized ? "text-accent" : "text-ink"}`}>
              {trimmedTask ? `“${trimmedTask}” — ${verdict.label.toLowerCase()}` : verdict.label}
            </div>
            <div className={s.verdictDetail}>{verdict.detail}</div>
            {coaching.length > 0 && (
              <div className="mt-2 flex flex-col gap-1">
                {coaching.map(({ label, advice }) => (
                  <div key={label} className={`${s.coaching} text-ink-muted`}>
                    <span className="text-accent font-bold">→ </span>
                    <span className="text-ink font-semibold">{label}:</span> {advice}
                  </div>
                ))}
              </div>
            )}
          </div>
          {variant === "page" && verdict.tier <= 1 && (
            <Btn href={buildHref} variant="primary">
              Name it
            </Btn>
          )}
          <button
            type="button"
            className={`${s.reset} text-ink-muted underline underline-offset-4 hover:text-ink cursor-pointer shrink-0`}
            onClick={(event) => {
              setScores({});
              setTask("");
              event.currentTarget.blur();
            }}
          >
            reset
          </button>
        </>
      ) : (
        <p className={s.hint}>{SCORECARD_HINT}</p>
      )}
    </div>
  );

  const rows = (
    <div className={s.rows}>
      {SCORECARD_DIMENSIONS.map((dim, index) => {
        const answered = scores[dim.key] !== undefined;
        const numChip = (
          <span
            className={`${s.num} rounded-full flex items-center justify-center font-bold shrink-0 transition-colors ${
              answered ? "bg-accent border-accent text-accent-ink" : "border-line text-ink-muted"
            }`}
            aria-hidden
          >
            {index + 1}
          </span>
        );
        const stem = (
          <div>
            <div className={s.question}>{dim.question}</div>
            <div className={s.label}>{dim.label}</div>
          </div>
        );
        const chips = (
          <div className={s.circles} role="radiogroup" aria-label={dim.question}>
            {dim.options.map((option) => {
              const selected = scores[dim.key] === option.value;
              return (
                <button
                  key={option.label}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`${s.circle} font-semibold transition-colors cursor-pointer ${
                    selected
                      ? "bg-accent border-accent text-accent-ink"
                      : "border-line text-ink-muted hover:border-accent/60 hover:text-ink"
                  }`}
                  onClick={(event) => {
                    setScores((prev) => ({ ...prev, [dim.key]: option.value }));
                    // Drop focus so the deck's Space/arrow keys keep
                    // navigating slides instead of re-firing this button.
                    event.currentTarget.blur();
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        );

        return variant === "stage" ? (
          <div key={dim.key} className={s.row}>
            {numChip}
            {stem}
            {chips}
          </div>
        ) : (
          <div key={dim.key} className={s.row}>
            <div className="flex items-start gap-2.5">
              {numChip}
              {stem}
            </div>
            {chips}
          </div>
        );
      })}
    </div>
  );

  if (variant === "stage") {
    return (
      <div className={s.layout}>
        <div className="flex-1 flex flex-col justify-center">
          {taskField}
          {rows}
          {verdictPanel}
        </div>
        <ScoreMeter variant="stage" total={total} verdict={verdict} />
      </div>
    );
  }

  return (
    <div className={s.layout}>
      {taskField}
      {rows}
      <div className="flex items-stretch gap-4 min-h-[240px]">
        <ScoreMeter variant="page" total={total} verdict={verdict} />
        {verdictPanel}
      </div>
    </div>
  );
}
