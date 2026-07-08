"use client";

// FSGA workshop — interactive Skill Opportunity Scorecard. Two surfaces,
// one component: `variant="stage"` renders in deck stage pixels (JL scores
// a volunteer's task live on the projected slide), `variant="page"` renders
// at web scale on the attendee's pack page (they score their own task on a
// phone). Pure client state — no DB, no network — so the deck's offline
// guarantee holds and the pack page ships it as a static island.

import { useState } from "react";
import { Btn } from "@/components/atoms";
import {
  SCORECARD_DIMENSIONS,
  SCORECARD_HINT,
  SCORE_MAX_PER_DIMENSION,
  scoreVerdict,
} from "@/lib/fsga/scorecard";

const SCORE_VALUES = Array.from({ length: SCORE_MAX_PER_DIMENSION }, (_, i) => i + 1);

// Stage sizes are 1920×1080 stage pixels (the deck scales the whole box);
// page sizes are real CSS pixels on the attendee's phone.
const STYLES = {
  stage: {
    row: "grid grid-cols-[400px_1fr_auto] items-center gap-8",
    label: "text-[29px] font-bold text-ink",
    question: "text-[25px] text-ink-muted leading-[1.3]",
    circles: "flex gap-3",
    circle: "w-[44px] h-[44px] border-2 text-[18px]",
    verdict: "mt-8 rounded-[20px] border p-7 flex items-center gap-8",
    verdictTotal: "text-[44px] font-bold tracking-[-0.02em] shrink-0",
    verdictLabel: "text-[32px] font-bold tracking-[-0.02em]",
    verdictDetail: "text-[24px] text-ink-muted leading-[1.35] mt-1",
    hint: "text-[26px] text-ink-muted leading-[1.4]",
    reset: "text-[20px]",
  },
  page: {
    row: "flex flex-col gap-2",
    label: "text-[14px] font-bold text-ink",
    question: "text-[12px] text-ink-muted leading-[1.5]",
    circles: "flex gap-2 mt-1",
    circle: "w-[38px] h-[38px] border text-[13px]",
    verdict: "mt-5 rounded-[14px] border p-4 sm:p-5 flex flex-wrap items-center gap-x-5 gap-y-3",
    verdictTotal: "text-[22px] font-bold tracking-[-0.02em] shrink-0",
    verdictLabel: "text-[16px] font-bold tracking-[-0.01em]",
    verdictDetail: "text-[12px] text-ink-muted leading-[1.5] mt-0.5",
    hint: "text-[12px] text-ink-muted leading-[1.5]",
    reset: "text-[11px]",
  },
} as const;

export function ScorecardInteractive({ variant }: { variant: "stage" | "page" }) {
  const s = STYLES[variant];
  const [scores, setScores] = useState<Record<string, number>>({});

  const scoredCount = SCORECARD_DIMENSIONS.filter((d) => scores[d.key]).length;
  const complete = scoredCount === SCORECARD_DIMENSIONS.length;
  const verdict = complete ? scoreVerdict(scores) : null;
  const emphasized = verdict !== null && verdict.tier <= 1;

  return (
    <div className={variant === "stage" ? "flex flex-col gap-6" : "flex flex-col gap-4"}>
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

      <div
        className={`${s.verdict} ${
          emphasized ? "border-accent/60 bg-accent/10" : "border-line bg-bg-card"
        }`}
        aria-live="polite"
      >
        {verdict ? (
          <>
            <span className={`${s.verdictTotal} ${emphasized ? "text-accent" : "text-ink"}`}>
              {verdict.total}/{verdict.max}
            </span>
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
    </div>
  );
}
