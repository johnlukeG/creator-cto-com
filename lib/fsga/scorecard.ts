// FSGA workshop — the Skill Opportunity Scorecard: shared dimensions and
// verdict logic for the two interactive surfaces (the act-4 deck slide and
// the attendee pack page). Data + pure functions only — no React, no DB —
// so the deck stays DB-free and both surfaces can't drift apart.

export interface ScorecardDimension {
  key: string;
  label: string;
  question: string;
  /** The three dimensions the verdict weights hardest (per the outline:
   * "high on frequency, context reload, and reusable judgment"). */
  core: boolean;
}

export const SCORECARD_DIMENSIONS: ScorecardDimension[] = [
  { key: "frequency", label: "Frequency", question: "How often does this task come back?", core: true },
  {
    key: "context-reload",
    label: "Context reload",
    question: "How much do you have to remember or re-explain?",
    core: true,
  },
  { key: "clear-input", label: "Clear input", question: "Can you name the raw material that starts it?", core: false },
  {
    key: "clear-output",
    label: "Clear output",
    question: "Would you recognize a useful finished version?",
    core: false,
  },
  {
    key: "reusable-judgment",
    label: "Reusable judgment",
    question: "Are there standards, examples, or rules you apply each time?",
    core: true,
  },
  {
    key: "low-risk",
    label: "Low-risk first draft",
    question: "Is a better first draft useful even with human review?",
    core: false,
  },
];

export const SCORE_MAX_PER_DIMENSION = 5;
export const SCORE_TOTAL_MAX = SCORECARD_DIMENSIONS.length * SCORE_MAX_PER_DIMENSION;

/** Shown before all six dimensions are scored. */
export const SCORECARD_HINT = "High on frequency, context reload, and reusable judgment? Good Skill candidate.";

export interface ScoreVerdict {
  total: number;
  max: number;
  /** 0 = strongest tier. Drives emphasis styling on both surfaces. */
  tier: 0 | 1 | 2 | 3;
  label: string;
  detail: string;
}

/**
 * Verdict over a complete set of scores, keyed by dimension key, each 1–5.
 * Core dimensions gate the top tier: a flashy-but-rare task can't score its
 * way into "build this" on volume alone.
 */
export function scoreVerdict(scores: Record<string, number>): ScoreVerdict {
  const total = SCORECARD_DIMENSIONS.reduce((sum, dim) => sum + (scores[dim.key] ?? 0), 0);
  const coreTotal = SCORECARD_DIMENSIONS.filter((d) => d.core).reduce(
    (sum, dim) => sum + (scores[dim.key] ?? 0),
    0,
  );

  if (coreTotal >= 12 && total >= 20) {
    return {
      total,
      max: SCORE_TOTAL_MAX,
      tier: 0,
      label: "Build this Skill",
      detail: "This is your first Skill. Name it and spec it before you leave.",
    };
  }
  if (total >= 18) {
    return {
      total,
      max: SCORE_TOTAL_MAX,
      tier: 1,
      label: "Strong candidate",
      detail: "Sharpen the input and the output, then build it.",
    };
  }
  if (total >= 12) {
    return {
      total,
      max: SCORE_TOTAL_MAX,
      tier: 2,
      label: "Not yet",
      detail: "Run it as a one-off prompt a few times first.",
    };
  }
  return {
    total,
    max: SCORE_TOTAL_MAX,
    tier: 3,
    label: "Skip for now",
    detail: "Pick a task that comes back more often.",
  };
}
