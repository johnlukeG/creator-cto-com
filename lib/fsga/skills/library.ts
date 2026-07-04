// PLACEHOLDER — full 40-skill library lands in Task 2

import type { Skill, SkillCategory } from "./types";
import { SKILL_CATEGORIES } from "./types";

export const SKILLS: Skill[] = [
  {
    name: "Prospect Research Brief",
    slug: "prospect-research-brief",
    category: "sales-partnerships",
    description:
      "Turns a company name and a few public signals into a one-page prospect brief: what they do, why now, and how to open the conversation.",
    bestFor: "Reps and partnership leads prepping for a first call or intro email.",
    repeatedWork: "Manually digging through a website, LinkedIn, and news before every outbound touch.",
    inputs: ["Company name", "Website URL", "Any known contact or role"],
    processSteps: [
      "Pull the company's public positioning and recent news",
      "Identify likely priorities based on industry and stage",
      "Draft 3 conversation openers tied to those priorities",
      "Flag open questions worth confirming live",
    ],
    outputs: ["One-page prospect brief", "3 tailored conversation openers"],
    exampleUseCase:
      "Before a discovery call with a mid-size media company, generate a brief covering their recent funding, content strategy, and a relevant opener referencing their latest launch.",
    starterPrompt:
      "Research {company} using public sources. Summarize what they do, one signal suggesting why now is a good time to talk, and 3 openers I could use on a first call.",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["sales", "research", "outbound"],
  },
  {
    name: "Weekly Decision Brief",
    slug: "weekly-decision-brief",
    category: "executive-founder",
    description:
      "Compresses a week's worth of scattered updates, metrics, and open threads into a single decision-ready brief for leadership.",
    bestFor: "Founders and execs who lose Friday afternoons synthesizing status into a coherent narrative.",
    repeatedWork: "Rebuilding the same weekly summary from Slack threads, docs, and dashboards by hand.",
    inputs: ["Team updates or Slack summaries", "Key metrics for the week", "Open decisions or blockers"],
    processSteps: [
      "Cluster updates by theme (growth, product, ops, risk)",
      "Surface the 3 decisions that most need leadership input",
      "Draft a one-page brief with context, options, and a recommendation",
    ],
    outputs: ["One-page weekly decision brief", "Ranked list of open decisions"],
    exampleUseCase:
      "Paste in this week's team updates and metrics; get back a brief that opens with the single biggest risk and closes with 3 decisions needing a yes/no.",
    starterPrompt:
      "Here are this week's team updates and metrics: {paste}. Write a one-page decision brief: what changed, what's at risk, and the 3 decisions I need to make this week, each with a recommendation.",
    difficulty: "intermediate",
    riskLevel: "low",
    tags: ["leadership", "synthesis", "reporting"],
  },
  {
    name: "Meeting Notes to Action Items",
    slug: "meeting-notes-to-action-items",
    category: "personal-productivity",
    description:
      "Converts raw meeting notes or a transcript into a clean owner-and-deadline action list, ready to paste into a task tracker.",
    bestFor: "Anyone who leaves meetings with a wall of notes and no clear next steps.",
    repeatedWork: "Re-reading notes after every meeting to manually extract who owns what by when.",
    inputs: ["Raw meeting notes or transcript", "List of attendees (optional)"],
    processSteps: [
      "Scan notes for commitments and decisions",
      "Attach an owner and implied deadline to each action item",
      "Flag any action item with an unclear owner for follow-up",
    ],
    outputs: ["Action item list with owner + deadline", "Flagged list of unclear items"],
    exampleUseCase:
      "Paste a messy transcript from a planning meeting and get back a clean checklist grouped by owner, with unassigned items called out separately.",
    starterPrompt:
      "Here are my raw notes from a meeting: {paste}. Extract a clean action item list with owner and deadline for each. Flag anything with an unclear owner.",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["productivity", "meetings", "follow-up"],
  },
];

export function getSkillBySlug(slug: string): Skill | undefined {
  return SKILLS.find((skill) => skill.slug === slug);
}

export const SKILLS_BY_CATEGORY: Record<SkillCategory, Skill[]> = SKILL_CATEGORIES.reduce(
  (acc, category) => {
    acc[category] = SKILLS.filter((skill) => skill.category === category);
    return acc;
  },
  {} as Record<SkillCategory, Skill[]>,
);
