// FSGA workshop — the Skill Opportunity Calculator: shared dimensions and
// verdict logic for the two interactive surfaces (the act-4 deck slide and
// the attendee pack page). Data + pure functions only — no React, no DB —
// so the deck stays DB-free and both surfaces can't drift apart.
//
// Four dimensions × 1–5 each (per the outline's calculator): Repeat Rate,
// Judgment Reload, Output Clarity, First Draft Value. Totals band into
// 16–20 / 11–15 / 6–10 / 4–5 verdicts.

export interface ScorecardOption {
  label: string;
  /** Score contributed toward the total (1–5 scale). */
  value: number;
}

export interface ScorecardDimension {
  key: string;
  label: string;
  question: string;
  /** The dimensions the outline's bottom line weights hardest ("the best
   * first Skills usually score high on repeat rate, judgment reload, and
   * first draft value"). */
  core: boolean;
  /** Concrete plain-language answers in ASCENDING order (weakest first,
   * left→right on screen) — consistent Likert-style direction across every
   * question, rising toward the meter. Values map 1–5, one per answer.
   * Each option is a natural grammatical answer to the question stem. */
  options: ScorecardOption[];
  /** One actionable line shown when this dimension scores weak — what to
   * actually do about it, not a restatement of the score. */
  advice: string;
}

export const SCORECARD_DIMENSIONS: ScorecardDimension[] = [
  {
    key: "repeat-rate",
    label: "Repeat rate",
    question: "How often does this task come back?",
    core: true,
    options: [
      { label: "Rarely", value: 1 },
      { label: "Quarterly", value: 2 },
      { label: "Monthly", value: 3 },
      { label: "Weekly", value: 4 },
      { label: "Daily", value: 5 },
    ],
    advice: "Rare tasks make weak first Skills — pick something you face at least monthly.",
  },
  {
    key: "judgment-reload",
    label: "Judgment reload",
    question: "How much thinking do you reload each time?",
    core: true,
    options: [
      { label: "Almost none", value: 1 },
      { label: "Simple cleanup", value: 2 },
      { label: "Some judgment", value: 3 },
      { label: "Several standards", value: 4 },
      { label: "A whole briefing", value: 5 },
    ],
    advice: "If there's almost nothing to re-explain, a plain prompt may cover this one.",
  },
  {
    key: "output-clarity",
    label: "Output clarity",
    question: "How clear is the useful finished thing?",
    core: false,
    options: [
      { label: "Hard to describe", value: 1 },
      { label: "Fuzzy", value: 2 },
      { label: "Mostly clear", value: 3 },
      { label: "Clear", value: 4 },
      { label: "Clear + examples", value: 5 },
    ],
    advice: "Dig up one past good version and save it as your example output.",
  },
  {
    key: "first-draft-value",
    label: "First draft value",
    question: "Would a stronger first draft save meaningful time?",
    core: true,
    options: [
      { label: "Not worth it", value: 1 },
      { label: "Maybe sometimes", value: 2 },
      { label: "Needs revision", value: 3 },
      { label: "Light editing", value: 4 },
      { label: "Instantly useful", value: 5 },
    ],
    advice: "Start with an internal, human-reviewed version of this task for your first rep.",
  },
];

export const SCORE_MAX_PER_DIMENSION = 5;
export const SCORE_TOTAL_MAX = SCORECARD_DIMENSIONS.length * SCORE_MAX_PER_DIMENSION;

/** Shown before all four dimensions are scored. */
export const SCORECARD_HINT = "Answer all four for the verdict.";

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
    minTotal: 16,
    label: "Strong Skill candidate",
    detail: "This is your first Skill. Name it and spec it before you leave.",
  },
  {
    tier: 1,
    minTotal: 11,
    label: "Worth testing",
    detail: "Sharpen the input and the output, then run a first rep.",
  },
  {
    tier: 2,
    minTotal: 6,
    label: "Maybe later",
    detail: "Run it as a one-off prompt a few times first.",
  },
  {
    tier: 3,
    minTotal: 0,
    label: "Probably just prompt it",
    detail: "Pick a task that repeats more and reloads more judgment.",
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
 * Tiers may additionally gate on the core-dimension total (none currently
 * do — the outline's calculator bands on raw total alone).
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

/** A dimension only gets coached below this score — the advice lines are
 * written for genuinely weak answers, and a 4/5 doesn't need fixing. */
const COACHING_THRESHOLD = 4;

/**
 * The single weakest-scored dimension (if any scored genuinely weak) —
 * the one "what to do about it" line that accompanies the verdict. Empty
 * when every dimension scored strong.
 */
export function scoreCoaching(scores: Record<string, number>): ScoreCoaching[] {
  return SCORECARD_DIMENSIONS.filter((dim) => (scores[dim.key] ?? 0) < COACHING_THRESHOLD)
    .sort((a, b) => (scores[a.key] ?? 0) - (scores[b.key] ?? 0))
    .slice(0, 1)
    .map((dim) => ({ label: dim.label, advice: dim.advice }));
}
