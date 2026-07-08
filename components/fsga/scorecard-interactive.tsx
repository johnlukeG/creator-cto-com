"use client";

// FSGA workshop — interactive Skill Opportunity Scorecard. Two surfaces,
// one component: `variant="stage"` renders in deck stage pixels (JL scores
// a volunteer's task live on the projected slide), `variant="page"` renders
// at web scale on the attendee's pack page (they score their own task on a
// phone). Pure client state — no DB, no network — so the deck's offline
// guarantee holds and the pack page ships it as a static island.
//
// The verdict is a carnival high-striker: a vertical skill-o-meter whose
// fill rises live as scores come in, with threshold lines for each tier
// and a bell that rings when the task lands in "Build this Skill".

import { useState } from "react";
import { Btn } from "@/components/atoms";
import { BellGlyph } from "@/components/fsga/deck/diagram-glyphs";
import {
  SCORECARD_DIMENSIONS,
  SCORECARD_HINT,
  SCORE_MAX_PER_DIMENSION,
  SCORE_TIERS,
  SCORE_TOTAL_MAX,
  scoreTotal,
  scoreVerdict,
  type ScoreVerdict,
} from "@/lib/fsga/scorecard";

const SCORE_VALUES = Array.from({ length: SCORE_MAX_PER_DIMENSION }, (_, i) => i + 1);

// Stage sizes are 1920×1080 stage pixels (the deck scales the whole box);
// page sizes are real CSS pixels on the attendee's phone.
const STYLES = {
  stage: {
    layout: "flex items-stretch gap-16",
    rows: "flex-1 flex flex-col justify-center gap-6",
    row: "grid grid-cols-[360px_1fr_auto] items-center gap-8",
    label: "text-[29px] font-bold text-ink",
    question: "text-[24px] text-ink-muted leading-[1.3]",
    circles: "flex gap-3",
    circle: "w-[44px] h-[44px] border-2 text-[18px]",
    verdict: "mt-8 rounded-[20px] border p-6 flex items-center gap-7 min-h-[130px]",
    verdictLabel: "text-[32px] font-bold tracking-[-0.02em]",
    verdictDetail: "text-[23px] text-ink-muted leading-[1.35] mt-1",
    hint: "text-[24px] text-ink-muted leading-[1.4]",
    reset: "text-[20px]",
    meter: "w-[300px]",
    meterTitle: "text-[20px] font-bold tracking-[0.16em]",
    bell: "w-[44px] h-[44px]",
    ding: "text-[24px]",
    track: "w-[110px] rounded-[26px]",
    tickLabel: "text-[17px]",
    readout: "text-[46px]",
    readoutSub: "text-[19px]",
  },
  page: {
    layout: "flex flex-col gap-5",
    rows: "flex flex-col gap-4",
    row: "flex flex-col gap-2",
    label: "text-[14px] font-bold text-ink",
    question: "text-[12px] text-ink-muted leading-[1.5]",
    circles: "flex gap-2 mt-1",
    circle: "w-[38px] h-[38px] border text-[13px]",
    verdict: "rounded-[14px] border p-4 flex-1 flex flex-wrap items-center gap-x-5 gap-y-3",
    verdictLabel: "text-[16px] font-bold tracking-[-0.01px]",
    verdictDetail: "text-[12px] text-ink-muted leading-[1.5] mt-0.5",
    hint: "text-[12px] text-ink-muted leading-[1.5]",
    reset: "text-[11px]",
    meter: "w-[150px] shrink-0",
    meterTitle: "text-[10px] font-bold tracking-[0.14em]",
    bell: "w-[20px] h-[20px]",
    ding: "text-[12px]",
    track: "w-[52px] rounded-[14px]",
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
    <div className={`${s.meter} flex flex-col items-center gap-3`} aria-hidden>
      <div className={`${s.meterTitle} uppercase text-ink-muted`}>Skill‑o‑meter</div>
      <div
        className={`flex items-center gap-2 transition-opacity duration-300 ${
          rang ? "opacity-100 animate-bounce" : "opacity-35"
        }`}
      >
        <BellGlyph className={`${s.bell} ${rang ? "text-accent" : "text-ink-muted"}`} />
        {rang && <span className={`${s.ding} font-bold text-accent tracking-[0.1em]`}>DING!</span>}
      </div>
      <div className="flex-1 min-h-0 self-stretch flex justify-center">
        <div className={`${s.track} relative h-full bg-bg-card border border-line overflow-hidden`}>
          <div
            className="absolute inset-x-0 bottom-0 bg-accent transition-[height] duration-700 ease-out"
            style={{ height: `${fillPct}%` }}
          />
          {/* puck riding the top of the fill */}
          {total > 0 && (
            <div
              className="absolute inset-x-[6px] h-[8px] rounded-full bg-bg mix-blend-normal opacity-90 transition-[bottom] duration-700 ease-out"
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
        <div className="relative w-0">
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
      <div className={`${s.readout} font-bold tracking-[-0.02em] ${rang ? "text-accent" : "text-ink"}`}>
        {total}
        <span className={`${s.readoutSub} text-ink-muted font-normal`}> /{SCORE_TOTAL_MAX}</span>
      </div>
    </div>
  );
}

export function ScorecardInteractive({ variant }: { variant: "stage" | "page" }) {
  const s = STYLES[variant];
  const [scores, setScores] = useState<Record<string, number>>({});

  const scoredCount = SCORECARD_DIMENSIONS.filter((d) => scores[d.key]).length;
  const complete = scoredCount === SCORECARD_DIMENSIONS.length;
  const total = scoreTotal(scores);
  const verdict = complete ? scoreVerdict(scores) : null;
  const emphasized = verdict !== null && verdict.tier <= 1;

  const verdictPanel = (
    <div
      className={`${s.verdict} ${emphasized ? "border-accent/60 bg-accent/10" : "border-line bg-bg-card"}`}
      aria-live="polite"
    >
      {verdict ? (
        <>
          <div className="flex-1 min-w-[200px]">
            <div className={`${s.verdictLabel} ${emphasized ? "text-accent" : "text-ink"}`}>
              {verdict.label}
            </div>
            <div className={s.verdictDetail}>{verdict.detail}</div>
          </div>
          {variant === "page" && verdict.tier <= 1 && (
            <Btn href="/fsga/build-your-own" variant="primary">
              Name it
            </Btn>
          )}
          <button
            type="button"
            className={`${s.reset} text-ink-muted underline underline-offset-4 hover:text-ink cursor-pointer shrink-0`}
            onClick={(event) => {
              setScores({});
              event.currentTarget.blur();
            }}
          >
            reset
          </button>
        </>
      ) : (
        <p className={s.hint}>
          {SCORECARD_HINT}
          {scoredCount > 0 && ` · ${scoredCount} of ${SCORECARD_DIMENSIONS.length} scored`}
        </p>
      )}
    </div>
  );

  const rows = (
    <div className={s.rows}>
      {SCORECARD_DIMENSIONS.map((dim) => (
        <div key={dim.key} className={s.row}>
          {variant === "stage" ? (
            <>
              <span className={s.label}>{dim.label}</span>
              <span className={s.question}>{dim.question}</span>
            </>
          ) : (
            <div>
              <div className={s.label}>{dim.label}</div>
              <div className={s.question}>{dim.question}</div>
            </div>
          )}
          <div className={s.circles} role="radiogroup" aria-label={dim.label}>
            {SCORE_VALUES.map((value) => {
              const selected = scores[dim.key] === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`${dim.label}: ${value} of ${SCORE_MAX_PER_DIMENSION}`}
                  className={`${s.circle} rounded-full flex items-center justify-center font-bold transition-colors cursor-pointer ${
                    selected
                      ? "bg-accent border-accent text-accent-ink"
                      : "border-line text-ink-muted hover:border-accent/60 hover:text-ink"
                  }`}
                  onClick={(event) => {
                    setScores((prev) => ({ ...prev, [dim.key]: value }));
                    // Drop focus so the deck's Space/arrow keys keep
                    // navigating slides instead of re-firing this button.
                    event.currentTarget.blur();
                  }}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  if (variant === "stage") {
    return (
      <div className={s.layout}>
        <div className="flex-1 flex flex-col justify-center">
          {rows}
          {verdictPanel}
        </div>
        <ScoreMeter variant="stage" total={total} verdict={verdict} />
      </div>
    );
  }

  return (
    <div className={s.layout}>
      {rows}
      <div className="flex items-stretch gap-4 min-h-[240px]">
        <ScoreMeter variant="page" total={total} verdict={verdict} />
        {verdictPanel}
      </div>
    </div>
  );
}
