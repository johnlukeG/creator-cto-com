// FSGA workshop — templated pack copy builder.
//
// Pure module: no DB imports. Extracted from scripts/fsga/generate-packs.ts
// so the static data path (lib/fsga/data/packs.ts) and the DB generation
// script share one source of truth for pack copy.
//
// Unlike the DB import script (which skips company-less rows), the static
// attendee list keeps rows with an unknown company — every line of copy here
// must read naturally when `company` is "".

import type { RoleCategory } from "./skills/types";

export const ROLE_LABELS: Record<RoleCategory, string> = {
  "executive-founder": "founders and execs",
  "sales-partnerships": "sales and partnerships leads",
  "marketing-content": "marketing and content teams",
  "product-ops": "product and ops leads",
  "hiring-people": "hiring managers",
  "analyst-research": "analysts and researchers",
  other: "busy operators",
};

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

export function buildPackCopy(
  attendee: { name: string; company: string; title: string | null },
  roleCategory: RoleCategory,
  skillCount: number,
): { title: string; summary: string; rationale: string; customIntro: string } {
  const first = firstName(attendee.name);
  const roleLabel = ROLE_LABELS[roleCategory];
  const titleAt = attendee.title
    ? attendee.company
      ? `${attendee.title} at ${attendee.company}`
      : attendee.title
    : attendee.company;

  return {
    title: `${first}'s AI Skill Pack`,
    summary: titleAt
      ? `A shortlist of ${skillCount} AI skills matched to ${roleLabel}, picked for ${first}'s work as ${titleAt}.`
      : `A shortlist of ${skillCount} AI skills matched to ${roleLabel}, picked for ${first}.`,
    rationale: attendee.company
      ? `These target the repeated, manual work that eats a week at ${attendee.company} — built to be useful today, not just interesting.`
      : `These target the repeated, manual work that eats a week — built to be useful today, not just interesting.`,
    customIntro: attendee.company
      ? `Welcome, ${first}! Based on your role at ${attendee.company}, here are the AI skills we think you'll reach for first.`
      : `Welcome, ${first}! Based on your role, here are the AI skills we think you'll reach for first.`,
  };
}
