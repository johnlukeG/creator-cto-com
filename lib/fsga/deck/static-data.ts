// FSGA workshop — static featured packs for the deck's act-4 "packs" slide.
//
// Data-only module: no React, no side effects. Four clearly-fictional,
// demo-safe attendees across the core archetypes. Each pack mirrors the exact
// shape scripts/fsga/generate-packs.ts produces from matchSkills(): a role-
// matched shortlist of real library slugs, item one flagged recommendedFirst
// with a personalized reason, copy in the same welcoming pack voice. These
// render when the deck runs in static mode (no live DB).

import { getSkillBySlug } from "../skills/library";
import type { FeaturedPackData } from "./types";

export const STATIC_FEATURED_PACKS: FeaturedPackData[] = [
  // Executive / founder at a DFS operator → executive-founder base list.
  {
    slug: "demo-maya-chen",
    attendeeName: "Maya Chen",
    company: "Draftline DFS (Demo)",
    title: "Founder & CEO",
    customIntro:
      "Welcome, Maya! Based on your role leading Draftline DFS (Demo), here are the AI Skills we think you'll reach for first.",
    summary:
      "A shortlist of 5 AI Skills matched to founders and execs, picked for Maya's work as Founder & CEO at Draftline DFS (Demo).",
    items: [
      {
        skillSlug: "weekly-decision-brief",
        recommendedFirst: true,
        customReason:
          "Start here, Maya. Your Fridays vanish into synthesizing the week from Slack, dashboards, and squad updates. This hands you back one decision-ready brief before the Monday leadership sync.",
      },
      {
        skillSlug: "meeting-prep-brief",
        customReason: "Gets you sharp for every meeting on your calendar without the pre-call scramble.",
      },
      {
        skillSlug: "competitor-movement-summary",
        customReason: "Keeps you ahead of competitor moves without re-reading every press release yourself.",
      },
      {
        skillSlug: "strategic-memo-builder",
        customReason: "Structures the hard calls you're already making into a memo you can align the team around.",
      },
      {
        skillSlug: "post-conference-follow-up-planner",
        customReason: "Turns the stack of cards from your last event into follow-ups before the leads go cold.",
      },
    ],
  },

  // Sales / partnerships at a sports media company → sales-partnerships base list.
  {
    slug: "demo-marcus-bell",
    attendeeName: "Marcus Bell",
    company: "Sideline Sports Media (Demo)",
    title: "VP, Partnerships",
    customIntro:
      "Welcome, Marcus! Based on your partnerships role at Sideline Sports Media (Demo), here are the AI Skills we think you'll reach for first.",
    summary:
      "A shortlist of 5 AI Skills matched to sales and partnerships leads, picked for Marcus's work as VP, Partnerships at Sideline Sports Media (Demo).",
    items: [
      {
        skillSlug: "prospect-research-brief",
        recommendedFirst: true,
        customReason:
          "Start here, Marcus. Before every partnerships call you're digging through a website, LinkedIn, and news to reconstruct who you're meeting. This builds that one-page brief from a name and a few signals in minutes.",
      },
      {
        skillSlug: "sales-call-prep",
        customReason: "Gives you a tight call plan, objective, questions, and value points, so you stop improvising mid-deal.",
      },
      {
        skillSlug: "partnership-follow-up-writer",
        customReason: "Writes the specific, non-generic follow-up that keeps a partnership conversation warm.",
      },
      {
        skillSlug: "sponsorship-fit-scorer",
        customReason: "Scores sponsor fit against a consistent rubric instead of eyeballing every deal.",
      },
      {
        skillSlug: "weekly-pipeline-summary",
        customReason: "Turns your messy pipeline notes into the clean weekly summary leadership actually wants to read.",
      },
    ],
  },

  // Content lead at a podcast network → marketing-content base list.
  {
    slug: "demo-priya-nair",
    attendeeName: "Priya Nair",
    company: "Two-Minute Drill Network (Demo)",
    title: "Head of Content",
    customIntro:
      "Welcome, Priya! Based on your content role at Two-Minute Drill Network (Demo), here are the AI Skills we think you'll reach for first.",
    summary:
      "A shortlist of 5 AI Skills matched to marketing and content teams, picked for Priya's work as Head of Content at Two-Minute Drill Network (Demo).",
    items: [
      {
        skillSlug: "episode-to-clips-planner",
        recommendedFirst: true,
        customReason:
          "Start here, Priya. Every new episode means re-scrubbing the whole thing to hunt for clip moments. This surfaces your most clip-worthy moments with hooks and titles, so repurposing stops eating your afternoon.",
      },
      {
        skillSlug: "newsletter-draft-assistant",
        customReason: "Turns your links, notes, and takes into a full newsletter draft in your voice, on deadline.",
      },
      {
        skillSlug: "social-post-variant-generator",
        customReason: "Adapts one announcement into platform-native posts instead of the same caption pasted everywhere.",
      },
      {
        skillSlug: "campaign-brief-builder",
        customReason: "Gets the whole team aligned on one campaign brief instead of re-litigating the message at kickoff.",
      },
      {
        skillSlug: "content-calendar-generator",
        customReason: "Builds the multi-week calendar around your key dates so you're not planning from a blank page every month.",
      },
    ],
  },

  // Product / ops at a data provider → product-ops base list.
  {
    slug: "demo-devin-park",
    attendeeName: "Devin Park",
    company: "Box Score Data (Demo)",
    title: "Director of Product",
    customIntro:
      "Welcome, Devin! Based on your product role at Box Score Data (Demo), here are the AI Skills we think you'll reach for first.",
    summary:
      "A shortlist of 5 AI Skills matched to product and ops leads, picked for Devin's work as Director of Product at Box Score Data (Demo).",
    items: [
      {
        skillSlug: "customer-feedback-synthesizer",
        recommendedFirst: true,
        customReason:
          "Start here, Devin. Every sprint you read through tickets, app reviews, and survey replies to re-derive the same top issues. This turns that flood into ranked themes and quick wins your roadmap can act on.",
      },
      {
        skillSlug: "feature-spec-builder",
        customReason: "Hands engineering a clear, lightweight spec instead of a 20-page PRD nobody reads.",
      },
      {
        skillSlug: "internal-sop-generator",
        customReason: "Gets the process that only lives in your head onto paper as an SOP a new hire could follow.",
      },
      {
        skillSlug: "process-improvement-finder",
        customReason: "Finds the 3 highest-impact fixes in a workflow that just feels slow.",
      },
      {
        skillSlug: "product-launch-checklist-builder",
        customReason: "Builds the phased launch checklist that catches the easy-to-forget items before they sink a release.",
      },
    ],
  },
];

// Fail fast at import (mirrors matching.ts): every referenced slug must resolve
// in the 40-skill library, or the featured-pack slide would render a silent gap
// in front of the room.
function assertStaticPackSlugsExist(): void {
  const missing: string[] = [];
  for (const pack of STATIC_FEATURED_PACKS) {
    for (const item of pack.items) {
      if (!getSkillBySlug(item.skillSlug)) missing.push(`${pack.slug} → ${item.skillSlug}`);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `lib/fsga/deck/static-data.ts: featured pack references unknown skill slug(s): ${missing.join(", ")}`,
    );
  }
}
assertStaticPackSlugsExist();
