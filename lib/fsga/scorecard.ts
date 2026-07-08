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
  /** Concrete plain-language answers in ASCENDING order (weakest first,
   * left→right on screen) — consistent Likert-style direction across every
   * question, rising toward the meter. Values quantize to 1/3/5 so the
   * 1–5 engine, tiers, and meter stay unchanged. Each option is a natural
   * grammatical answer to the question stem. */
  options: ScorecardOption[];
  /** One actionable line shown when this dimension scores weak — what to
   * actually do about it, not a restatement of the score. */
  advice: string;
}

export const SCORECARD_DIMENSIONS: ScorecardDimension[] = [
  {
    key: "frequency",
    label: "Frequency",
    question: "How often does this task come back?",
    core: true,
    options: [
      { label: "A few times a year", value: 1 },
      { label: "About monthly", value: 3 },
      { label: "Weekly or more", value: 5 },
    ],
    advice: "Rare tasks make weak first Skills — pick something you face at least monthly.",
  },
  {
    key: "context-reload",
    label: "Context reload",
    question: "How much re-explaining happens before the real work starts?",
    core: true,
    options: [
      { label: "Almost none", value: 1 },
      { label: "A few reminders", value: 3 },
      { label: "A whole briefing", value: 5 },
    ],
    advice: "If there's almost nothing to re-explain, a plain prompt may cover this one.",
  },
  {
    key: "clear-input",
    label: "Clear input",
    question: "Could you point to the raw material that starts it?",
    core: false,
    options: [
      { label: "Not really", value: 1 },
      { label: "Roughly", value: 3 },
      { label: "Yes — notes, files, a list", value: 5 },
    ],
    advice: "List what you'd hand a new hire — notes, files, links. That list is the input.",
  },
  {
    key: "clear-output",
    label: "Clear output",
    question: "How quickly would you recognize a good finished version?",
    core: false,
    options: [
      { label: "Hard to say", value: 1 },
      { label: "After a look", value: 3 },
      { label: "Instantly", value: 5 },
    ],
    advice: "Dig up one past good version and save it as your example output.",
  },
  {
    key: "reusable-judgment",
    label: "Reusable judgment",
    question: "How similar are the rules you apply each time?",
    core: true,
    options: [
      { label: "Different every time", value: 1 },
      { label: "Some patterns", value: 3 },
      { label: "Same every time", value: 5 },
    ],
    advice: "Write down three rules you always apply — they become the Skill's standards.",
  },
  {
    key: "low-risk",
    label: "Low-risk first draft",
    question: "How useful would a good first draft be, with you reviewing it?",
    core: false,
    options: [
      { label: "Not much", value: 1 },
      { label: "Somewhat", value: 3 },
      { label: "Very", value: 5 },
    ],
    advice: "Start with an internal, human-reviewed version of this task for your first rep.",
  },
];

export const SCORE_MAX_PER_DIMENSION = 5;
export const SCORE_TOTAL_MAX = SCORECARD_DIMENSIONS.length * SCORE_MAX_PER_DIMENSION;

/** Shown before all six dimensions are scored. */
export const SCORECARD_HINT = "Answer all six for the verdict.";

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

export interface ScoreCoaching {
  label: string;
  advice: string;
}

/**
 * The single weakest-scored dimension (if any scored below a top answer) —
 * the one "what to do about it" line that accompanies the verdict. Empty
 * when every dimension got the top answer.
 */
export function scoreCoaching(scores: Record<string, number>): ScoreCoaching[] {
  return SCORECARD_DIMENSIONS.filter((dim) => (scores[dim.key] ?? 0) < SCORE_MAX_PER_DIMENSION)
    .sort((a, b) => (scores[a.key] ?? 0) - (scores[b.key] ?? 0))
    .slice(0, 1)
    .map((dim) => ({ label: dim.label, advice: dim.advice }));
}
