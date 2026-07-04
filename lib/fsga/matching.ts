// FSGA workshop — skill matching logic.
//
// Pure module: no DB imports. Maps an attendee's role (plus an optional
// self-reported workflow pain) onto a ranked shortlist of skills from the
// 40-skill library. Consumed by scripts/fsga/generate-packs.ts and (later)
// the AI generate-skill fallback path.

import { getSkillBySlug } from "./skills/library";
import type { CompanyType, RoleCategory, WorkflowPain } from "./skills/types";

export interface SkillMatch {
  slug: string;
  reason: string;
  recommendedFirst: boolean;
}

interface RuleEntry {
  slug: string;
  reason: string;
}

const MAX_MATCHES = 7;

// ── Base recommendations, keyed by RoleCategory ─────────────────────────────
// Ordered lists: the first entry is the top recommendation for that role.
// Reasons are hand-written, one sentence, tied to the role — never generated.
const ROLE_RULES: Record<RoleCategory, RuleEntry[]> = {
  "executive-founder": [
    {
      slug: "weekly-decision-brief",
      reason:
        "Turns your scattered weekly updates into the single decision-ready brief execs and founders need before the Monday sync.",
    },
    {
      slug: "meeting-prep-brief",
      reason: "Gets you sharp for every meeting on your calendar without the pre-call scramble.",
    },
    {
      slug: "competitor-movement-summary",
      reason: "Keeps you ahead of competitor moves without re-reading every press release yourself.",
    },
    {
      slug: "strategic-memo-builder",
      reason: "Structures the hard calls you're already making into a memo you can align the team around.",
    },
    {
      slug: "post-conference-follow-up-planner",
      reason: "Turns the stack of cards from your last event into follow-ups before the leads go cold.",
    },
    {
      slug: "board-investor-update-draft",
      reason: "Takes the dread out of writing the monthly investor update from raw metrics and notes.",
    },
  ],
  "sales-partnerships": [
    {
      slug: "prospect-research-brief",
      reason: "Builds the one-page prospect brief you need before every first call, from a name and a few signals.",
    },
    {
      slug: "sales-call-prep",
      reason: "Gives you a tight call plan — objective, questions, value points — so you stop improvising mid-deal.",
    },
    {
      slug: "partnership-follow-up-writer",
      reason: "Writes the specific, non-generic follow-up that keeps a partnership conversation warm.",
    },
    {
      slug: "sponsorship-fit-scorer",
      reason: "Scores sponsor fit against a consistent rubric instead of eyeballing every deal.",
    },
    {
      slug: "weekly-pipeline-summary",
      reason: "Turns your messy pipeline notes into the clean weekly summary leadership actually wants to read.",
    },
    {
      slug: "objection-prep-assistant",
      reason: "Preps you for the objections that would otherwise catch you flat-footed mid-call.",
    },
  ],
  "marketing-content": [
    {
      slug: "episode-to-clips-planner",
      reason: "Finds your most clip-worthy moments so repurposing long-form into short-form stops eating an afternoon.",
    },
    {
      slug: "newsletter-draft-assistant",
      reason: "Turns your links, notes, and takes into a full newsletter draft in your voice, on deadline.",
    },
    {
      slug: "social-post-variant-generator",
      reason: "Adapts one announcement into platform-native posts instead of the same caption pasted everywhere.",
    },
    {
      slug: "campaign-brief-builder",
      reason: "Gets the whole team aligned on one campaign brief instead of re-litigating the message at kickoff.",
    },
    {
      slug: "content-calendar-generator",
      reason: "Builds the multi-week calendar around your key dates so you're not planning from a blank page every month.",
    },
    {
      slug: "audience-feedback-synthesizer",
      reason: "Cuts through comments and DMs to show you what your audience actually wants more of.",
    },
  ],
  "product-ops": [
    {
      slug: "customer-feedback-synthesizer",
      reason: "Turns a flood of tickets and reviews into the themes and quick wins your roadmap actually needs.",
    },
    {
      slug: "feature-spec-builder",
      reason: "Hands engineering a clear, lightweight spec instead of a 20-page PRD nobody reads.",
    },
    {
      slug: "internal-sop-generator",
      reason: "Gets the process that only lives in your head onto paper as an SOP a new hire could follow.",
    },
    {
      slug: "process-improvement-finder",
      reason: "Finds the 3 highest-impact fixes in a workflow that just feels slow.",
    },
    {
      slug: "product-launch-checklist-builder",
      reason: "Builds the phased launch checklist that catches the easy-to-forget items before they sink a release.",
    },
    {
      slug: "tool-evaluation-brief",
      reason: "Compares your tool options against what actually matters to your team, not just popularity.",
    },
  ],
  "hiring-people": [
    {
      slug: "job-description-builder",
      reason: "Writes a JD that attracts the right candidates instead of another wall of buzzwords.",
    },
    {
      slug: "candidate-scorecard-builder",
      reason: "Gives every interviewer the same rubric so candidate scoring stops depending on who's in the room.",
    },
    {
      slug: "interview-question-pack",
      reason: "Builds a structured question set mapped to the competencies you actually need to assess.",
    },
    {
      slug: "resume-screen-summary",
      reason: "Screens a resume against the role fairly and fast, with gaps flagged instead of guessed at.",
    },
    {
      slug: "new-hire-onboarding-plan",
      reason: "Builds the 30-60-90 day plan that gets a new hire productive instead of winging week one.",
    },
    {
      slug: "performance-feedback-draft-assistant",
      reason: "Turns scattered observations into balanced, evidence-based feedback instead of a blank review form.",
    },
  ],
  "analyst-research": [
    {
      slug: "reading-research-summarizer",
      reason: "Distills a long report into the TL;DR and takeaways that matter for your specific angle.",
    },
    {
      slug: "competitor-movement-summary",
      reason: "Turns a pile of competitor signals into the one-page read your team needs on what changed.",
    },
    {
      slug: "customer-feedback-synthesizer",
      reason: "Surfaces the themes buried in tickets and reviews without reading every single one.",
    },
    {
      slug: "meeting-notes-to-action-items",
      reason: "Converts a messy transcript into a clean action list ready to hand off.",
    },
    {
      slug: "weekly-decision-brief",
      reason: "Compresses a week of findings into the decision-ready brief leadership is waiting on.",
    },
  ],
  other: [
    {
      slug: "meeting-notes-to-action-items",
      reason: "Turns whatever meeting you just left into a clean list of who owns what.",
    },
    {
      slug: "daily-priority-planner",
      reason: "Cuts an overflowing task list down to the 3 things that actually move the needle today.",
    },
    {
      slug: "post-conference-follow-up-planner",
      reason: "Turns the contacts you collected at the conference into follow-ups before they go cold.",
    },
    {
      slug: "inbox-triage-assistant",
      reason: "Sorts a backlog of messages into act-now, delegate, and quick-reply so nothing important gets buried.",
    },
    {
      slug: "reading-research-summarizer",
      reason: "Gets you the value out of a long read without reading the whole thing.",
    },
  ],
};

// ── Pain adjustment ──────────────────────────────────────────────────────────
// A small pain→slug map. When an attendee self-reports a workflow pain, its
// matching slugs are promoted into the recommendation list (ranked above the
// role default, deduped, capped at MAX_MATCHES total). Reasons are hand-written
// and tied to the pain point, not generated.
const PAIN_RULES: Record<WorkflowPain, RuleEntry[]> = {
  research: [
    {
      slug: "prospect-research-brief",
      reason: "You flagged research as your bottleneck — this builds a one-page prospect brief from a name and a few signals.",
    },
    {
      slug: "reading-research-summarizer",
      reason: "You flagged research as your bottleneck — this distills any long report into the takeaways that matter to you.",
    },
  ],
  content: [
    {
      slug: "episode-to-clips-planner",
      reason: "You flagged content production as your bottleneck — this finds the clip-worthy moments so repurposing stops eating your afternoon.",
    },
    {
      slug: "social-post-variant-generator",
      reason: "You flagged content production as your bottleneck — this turns one announcement into platform-native posts in minutes.",
    },
  ],
  "meeting-follow-up": [
    {
      slug: "meeting-notes-to-action-items",
      reason: "You flagged meeting follow-up as your bottleneck — this turns a transcript into a clean action list with owners.",
    },
    {
      slug: "partnership-follow-up-writer",
      reason: "You flagged meeting follow-up as your bottleneck — this writes the specific follow-up that keeps a conversation warm.",
    },
  ],
  "sales-prep": [
    {
      slug: "sales-call-prep",
      reason: "You flagged sales prep as your bottleneck — this builds a tight call plan so you stop improvising mid-deal.",
    },
  ],
  reporting: [
    {
      slug: "weekly-pipeline-summary",
      reason: "You flagged reporting as your bottleneck — this turns messy pipeline notes into the weekly summary leadership wants.",
    },
    {
      slug: "board-investor-update-draft",
      reason: "You flagged reporting as your bottleneck — this drafts the monthly update from raw metrics instead of a blank page.",
    },
  ],
  hiring: [
    {
      slug: "job-description-builder",
      reason: "You flagged hiring as your bottleneck — this writes a JD that attracts the right people instead of another generic template.",
    },
  ],
  operations: [
    {
      slug: "internal-sop-generator",
      reason: "You flagged operations as your bottleneck — this turns the process in your head into an SOP anyone on the team could follow.",
    },
  ],
  "customer-feedback": [
    {
      slug: "customer-feedback-synthesizer",
      reason: "You flagged customer feedback as your bottleneck — this turns a flood of tickets and reviews into themes and quick wins.",
    },
    {
      slug: "audience-feedback-synthesizer",
      reason: "You flagged customer feedback as your bottleneck — this cuts through comments and DMs to show what your audience wants more of.",
    },
  ],
  strategy: [
    {
      slug: "strategic-memo-builder",
      reason: "You flagged strategy as your bottleneck — this structures a hard decision into a memo you can align the team around.",
    },
  ],
};

// Fail fast: every slug referenced by the rule tables must exist in the
// 40-skill library. A typo here would otherwise surface as a silent gap in
// a live attendee's pack.
function assertRuleSlugsExist(): void {
  const missing: string[] = [];
  for (const entries of Object.values(ROLE_RULES)) {
    for (const entry of entries) {
      if (!getSkillBySlug(entry.slug)) missing.push(entry.slug);
    }
  }
  for (const entries of Object.values(PAIN_RULES)) {
    for (const entry of entries) {
      if (!getSkillBySlug(entry.slug)) missing.push(entry.slug);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `lib/fsga/matching.ts: rule table references unknown skill slug(s): ${[...new Set(missing)].join(", ")}`,
    );
  }
}
assertRuleSlugsExist();

export interface MatchSkillsInput {
  roleCategory: RoleCategory;
  companyType?: CompanyType | null;
  seniority?: string | null;
  pain?: WorkflowPain | null;
}

export function matchSkills(input: MatchSkillsInput): SkillMatch[] {
  const base = ROLE_RULES[input.roleCategory];
  const painEntries = input.pain ? (PAIN_RULES[input.pain] ?? []) : [];

  const seen = new Set<string>();
  const ordered: RuleEntry[] = [];

  // Pain-matched slugs are promoted to the front of the list, in pain-map order.
  for (const entry of painEntries) {
    if (seen.has(entry.slug)) continue;
    seen.add(entry.slug);
    ordered.push(entry);
  }
  // Then the role's own base recommendations, in rank order, skipping dupes.
  for (const entry of base) {
    if (seen.has(entry.slug)) continue;
    seen.add(entry.slug);
    ordered.push(entry);
  }

  return ordered.slice(0, MAX_MATCHES).map((entry, index) => ({
    slug: entry.slug,
    reason: entry.reason,
    recommendedFirst: index === 0,
  }));
}
