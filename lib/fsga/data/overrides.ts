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

export interface PackOverride {
  featuredForDemo?: boolean;
  title?: string;
  summary?: string;
  rationale?: string;
  customIntro?: string;
  items?: PackItemOverride[];
}

export const PACK_OVERRIDES: Readonly<Record<string, PackOverride>> = {
  // Example — John Luke Garofalo (Front Yard Fantasy):
  // "john-luke-garofalo-awzb": {
  //   featuredForDemo: true,
  //   customIntro: "Welcome, John Luke! You built this thing — here's your own pack.",
  //   items: [
  //     { skillSlug: "weekly-decision-brief", customReason: "Start here — ..." },
  //     { skillSlug: "meeting-prep-brief" },
  //   ],
  // },
};
