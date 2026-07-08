// FSGA workshop — the Skill Opportunity Scorecard: shared dimensions and
// verdict logic for the two interactive surfaces (the act-4 deck slide and
// the attendee pack page). Data + pure functions only — no React, no DB —
// so the deck stays DB-free and both surfaces can't drift apart.

export interface ScorecardOption {
  label: string;
  /** Score contributed toward the total (1–5 scale under the hood). */
  value: number;
}

export interface ScorecardDimension {
  key: string;
  label: string;
  question: string;
  /** The three dimensions the verdict weights hardest (per the outline:
   * "high on frequency, context reload, and reusable judgment"). */
  core: boolean;
  /** Concrete plain-language answers, strongest first. Values quantize to
   * 5/3/1 so the 1–5 engine, tiers, and meter stay unchanged. */
  options: ScorecardOption[];
}

export const SCORECARD_DIMENSIONS: ScorecardDimension[] = [
  {
    key: "frequency",
    label: "Frequency",
    question: "How often does this task come back?",
    core: true,
    options: [
      { label: "Weekly or more", value: 5 },
      { label: "Monthly-ish", value: 3 },
      { label: "A few times a year", value: 1 },
    ],
  },
  {
    key: "context-reload",
    label: "Context reload",
    question: "How much re-explaining before the real work starts?",
    core: true,
    options: [
      { label: "A whole briefing", value: 5 },
      { label: "A few reminders", value: 3 },
      { label: "Almost none", value: 1 },
    ],
  },
  {
    key: "clear-input",
    label: "Clear input",
    question: "Can you name the raw material that starts it?",
    core: false,
    options: [
      { label: "Yes — notes, files, a list", value: 5 },
      { label: "Sort of", value: 3 },
      { label: "It's fuzzy", value: 1 },
    ],
  },
  {
    key: "clear-output",
    label: "Clear output",
    question: "Would you recognize a useful finished version?",
    core: false,
    options: [
      { label: "Instantly", value: 5 },
      { label: "Roughly", value: 3 },
      { label: "Hard to say", value: 1 },
    ],
  },
  {
    key: "reusable-judgment",
    label: "Reusable judgment",
    question: "Do you apply the same standards or rules each time?",
    core: true,
    options: [
      { label: "Same rules every time", value: 5 },
      { label: "Some patterns", value: 3 },
      { label: "Every time is different", value: 1 },
    ],
  },
  {
    key: "low-risk",
    label: "Low-risk first draft",
    question: "Is a better first draft useful even with human review?",
    core: false,
    options: [
      { label: "Very useful", value: 5 },
      { label: "Somewhat", value: 3 },
      { label: "Too risky", value: 1 },
    ],
  },
];

export const SCORE_MAX_PER_DIMENSION = 5;
export const SCORE_TOTAL_MAX = SCORECARD_DIMENSIONS.length * SCORE_MAX_PER_DIMENSION;

/** Shown before all six dimensions are scored. */
export const SCORECARD_HINT = "High on frequency, context reload, and reusable judgment? Good Skill candidate.";

export interface ScoreTier {
  /** 0 = strongest. Drives emphasis styling on both surfaces. */
  tier: 0 | 1 | 2 | 3;
  /** Minimum total (out of SCORE_TOTAL_MAX) to land in this tier. */
  minTotal: number;
  /** Minimum core-dimension total additionally required, if any. */
  minCoreTotal?: number;
  label: string;
  detail: string;
}

/** Ordered strongest-first. Also drives the meter's threshold lines. */
export const SCORE_TIERS: ScoreTier[] = [
  {
    tier: 0,
    minTotal: 20,
    minCoreTotal: 12,
    label: "Build this Skill",
    detail: "This is your first Skill. Name it and spec it before you leave.",
  },
  {
    tier: 1,
    minTotal: 18,
    label: "Strong candidate",
    detail: "Sharpen the input and the output, then build it.",
  },
  {
    tier: 2,
    minTotal: 12,
    label: "Not yet",
    detail: "Run it as a one-off prompt a few times first.",
  },
  {
    tier: 3,
    minTotal: 0,
    label: "Skip for now",
    detail: "Pick a task that comes back more often.",
  },
];

export interface ScoreVerdict extends ScoreTier {
  total: number;
  max: number;
}

/** Running total over a (possibly partial) set of scores keyed by dimension key. */
export function scoreTotal(scores: Record<string, number>): number {
  return SCORECARD_DIMENSIONS.reduce((sum, dim) => sum + (scores[dim.key] ?? 0), 0);
}

/**
 * Verdict over a complete set of scores, keyed by dimension key, each 1–5.
 * Core dimensions gate the top tier: a flashy-but-rare task can't score its
 * way into "build this" on volume alone.
 */
export function scoreVerdict(scores: Record<string, number>): ScoreVerdict {
  const total = scoreTotal(scores);
  const coreTotal = SCORECARD_DIMENSIONS.filter((d) => d.core).reduce(
    (sum, dim) => sum + (scores[dim.key] ?? 0),
    0,
  );

  const tier =
    SCORE_TIERS.find(
      (t) => total >= t.minTotal && (t.minCoreTotal === undefined || coreTotal >= t.minCoreTotal),
    ) ?? SCORE_TIERS[SCORE_TIERS.length - 1];

  return { ...tier, total, max: SCORE_TOTAL_MAX };
}
