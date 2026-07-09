// FSGA workshop — hand-tuned pack overrides (static-data mode).
//
// Keyed by the attendee's FROZEN slug from ./attendees. Every field is
// optional: an absent field falls back to the derived matchSkills() +
// buildPackCopy() output in ./packs. `items`, when present, replaces the
// derived shortlist wholesale (ordered; index 0 becomes recommendedFirst).
// This file stands in for the dormant admin UI's curation — including which
// packs are flagged featuredForDemo.

export interface PackItemOverride {
  skillSlug: string;
  customReason?: string;
  customExample?: string;
}

export interface HeroOverride {
  /** A real library skill whose inputs/process/outputs the hero reuses. */
  baseSkillSlug: string;
  /** Branded display name, e.g. "Scott-Fish-Style Donor Follow-Up". */
  name: string;
  /** One sentence naming the attendee's actual company/work. */
  customReason: string;
  /** Optional fully pre-filled starter prompt (overrides the base's). */
  starterPrompt?: string;
}

export interface PackOverride {
  featuredForDemo?: boolean;
  title?: string;
  summary?: string;
  rationale?: string;
  customIntro?: string;
  hero?: HeroOverride;
  items?: PackItemOverride[];
}

export const PACK_OVERRIDES: Readonly<Record<string, PackOverride>> = {
  // Scott Fish — Fantasy Cares (charity built on the Scott Fish Bowl).
  "scott-fish-23us": {
    featuredForDemo: true,
    customIntro:
      "Welcome, Scott! Fantasy Cares runs on relationships and follow-through — so your pack leads with a Skill built around exactly that, then a few every-week staples.",
    hero: {
      baseSkillSlug: "relationship-follow-up-reminder",
      name: "Scott-Fish-Style Donor Follow-Up",
      customReason:
        "Fantasy Cares lives on donor and sponsor relationships — this keeps every commitment, thank-you, and check-in from slipping through the cracks after an event like SFB.",
      starterPrompt:
        "You are my relationship manager for Fantasy Cares. Here are my recent conversations, commitments, and contacts: [PASTE NOTES + PLEDGES + NAMES]. Produce: (1) Owe-a-reply — people waiting on me, most time-sensitive first; (2) Thank-yous — donors/sponsors to acknowledge, with a one-line personalized note each; (3) Check-ins — relationships worth warming before the next drive, with a reason and a suggested opener. Keep it warm and specific, never templated. Flag anyone I haven't touched in 30+ days.",
    },
  },
};
