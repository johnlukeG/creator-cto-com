// FSGA workshop — full 40-skill library across 6 categories.
// Data-only module: no React, no side effects. Consumed by pack generation,
// the deck teardown slides, and the fallback pack generator.

import type { Skill, SkillCategory } from "./types";
import { SKILL_CATEGORIES } from "./types";

export const SKILLS: Skill[] = [
  // ── executive-founder (7) ──────────────────────────────────────────────
  {
    name: "Weekly Decision Brief",
    slug: "weekly-decision-brief",
    category: "executive-founder",
    description:
      "Compresses a week of scattered updates, metrics, and open threads into a single decision-ready brief for leadership.",
    bestFor: "Founders and execs who lose Fridays synthesizing status into a coherent narrative.",
    repeatedWork: "Rebuilding the same weekly summary from Slack threads, docs, and dashboards by hand.",
    inputs: [
      "Team updates or Slack summaries for the week",
      "Key metrics with prior-period values",
      "Open decisions, blockers, or risks",
    ],
    processSteps: [
      "Cluster updates by theme (growth, product, ops, risk)",
      "Surface the 3 decisions that most need leadership input",
      "Attach options and a recommendation to each decision",
      "Flag any missing numbers instead of guessing",
    ],
    outputs: ["One-page weekly decision brief", "Ranked list of decisions with recommendations"],
    exampleUseCase:
      "A DFS operator's CEO pastes the week's squad updates and KPIs before the Monday leadership sync. The brief opens with the single biggest retention risk and closes with three yes/no decisions, each with a recommended call.",
    starterPrompt:
      "You are my chief of staff. Here are this week's raw inputs — team updates, key metrics, and open threads: [PASTE UPDATES + METRICS + BLOCKERS]. Produce a one-page weekly decision brief for me as [ROLE] at [COMPANY]. Structure it as: (1) Headline — the single most important thing that changed this week, in one sentence; (2) Momentum — 3 bullets on what moved forward, each with a metric or evidence; (3) Risks — 2-3 things slipping, with severity; (4) Decisions I need to make this week — list each decision, the realistic options, and your recommended choice with a one-line rationale. Keep it under 400 words, plain language, no filler. Where a number is missing, mark it [NEEDS DATA] rather than inventing one.",
    difficulty: "intermediate",
    riskLevel: "low",
    tags: ["leadership", "synthesis", "reporting"],
  },
  {
    name: "Competitor Movement Summary",
    slug: "competitor-movement-summary",
    category: "executive-founder",
    description:
      "Turns a pile of competitor signals — launches, pricing, hires, posts — into a one-page read on what changed and what it means for you.",
    bestFor: "Execs and product leads tracking a crowded operator or media landscape.",
    repeatedWork: "Re-reading press releases and competitor socials and re-deriving the same 'so what' every month.",
    inputs: [
      "Recent competitor signals with source and date",
      "Your company and what you compete on",
      "The audience for the summary (board, product, sales)",
    ],
    processSteps: [
      "Group signals by competitor and by move type",
      "Infer the apparent strategy shift behind each move",
      "Translate moves into implications for your roadmap or positioning",
      "Separate confirmed facts from inference",
    ],
    outputs: ["One-page competitor movement brief", "List of recommended responses to discuss"],
    exampleUseCase:
      "A sportsbook's strategy lead collects a rival's new same-game-parlay launch, a pricing tweak, and two senior hires. The summary flags that the rival is pushing into live betting and recommends one defensive response to raise at the next roadmap review.",
    starterPrompt:
      "Act as a competitive analyst. Here are recent signals I've collected about competitors — press releases, product launches, pricing changes, hires, and social posts: [PASTE SIGNALS WITH SOURCE + DATE]. My company is [COMPANY], competing on [WHAT YOU COMPETE ON]. Summarize what changed across the set into a one-page brief: (1) a 3-bullet 'what moved' recap; (2) a per-competitor line on their apparent strategy shift; (3) 'so what for us' — 2-3 implications for our roadmap or positioning; (4) one recommended response worth discussing this week. Separate confirmed facts from inference and label anything speculative as [ASSUMPTION]. Keep it skimmable for a leadership audience.",
    difficulty: "intermediate",
    riskLevel: "low",
    tags: ["strategy", "research", "competitive"],
  },
  {
    name: "Board/Investor Update Draft",
    slug: "board-investor-update-draft",
    category: "executive-founder",
    description:
      "Drafts a calm, credible monthly investor update from raw metrics, wins, misses, and asks.",
    bestFor: "Founders who dread writing the monthly update and default to hype or silence.",
    repeatedWork: "Re-formatting the same KPI-plus-narrative update from scratch every month.",
    inputs: [
      "This month's KPIs with prior-month values",
      "Wins, challenges, and lowlights",
      "Specific asks for investors (intros, help, hires)",
    ],
    processSteps: [
      "Write a 3-sentence TL;DR of the month",
      "Build a metrics table with month-over-month change and a one-line read",
      "Balance highlights against honest lowlights and mitigations",
      "Turn vague needs into specific, actionable asks",
    ],
    outputs: ["Investor update ready to paste into email", "Metrics table with month-over-month deltas"],
    exampleUseCase:
      "The founder of a sports-data startup feeds in a soft revenue month alongside two new operator contracts. The draft opens honestly about the miss, explains the plan, and asks investors for two specific warm intros.",
    starterPrompt:
      "Draft a monthly investor update for [COMPANY], a [sports betting / fantasy / sports data] company. Raw inputs: this month's KPIs [PASTE METRICS], wins [PASTE], challenges [PASTE], and asks [PASTE]. Write in a calm, credible founder voice — confident but honest about misses. Structure: (1) TL;DR in 3 sentences; (2) a metrics table with month-over-month change and a one-line read on each; (3) Highlights (3-4 bullets); (4) Lowlights and what we're doing about them (2-3 bullets); (5) Asks — specific intros or help I need from investors. Avoid hype words and unverifiable claims. Flag any metric I left blank as [NEEDS DATA]. Keep the whole update under 500 words.",
    difficulty: "intermediate",
    riskLevel: "medium",
    tags: ["reporting", "fundraising", "leadership"],
  },
  {
    name: "Meeting Prep Brief",
    slug: "meeting-prep-brief",
    category: "executive-founder",
    description:
      "Turns attendees, context, and a purpose into a two-minute prep brief so you walk into any meeting sharp.",
    bestFor: "Anyone who joins back-to-back meetings with no time to prepare.",
    repeatedWork: "Skimming email history and LinkedIn before every call to reconstruct who's who and why you're meeting.",
    inputs: [
      "Attendees and their roles",
      "The company or team they represent",
      "The meeting's purpose and any prior notes",
    ],
    processSteps: [
      "State the single best outcome for you in one line",
      "Give a one-line read on each attendee's likely priorities",
      "Draft prioritized talking points and anticipated questions",
      "Name your most important ask or next step",
    ],
    outputs: ["One-page meeting prep brief", "List of likely questions with crisp answers"],
    exampleUseCase:
      "Before meeting a league's digital team about a data-licensing deal, an exec generates a brief mapping each attendee's priorities and three talking points, so the conversation opens on the league's fan-engagement goals rather than pricing.",
    starterPrompt:
      "Help me prep for a meeting. Details: attendees and their roles [PASTE], the company or team they represent [NAME], the meeting's stated purpose [PURPOSE], and any prior context or notes [PASTE]. Produce a one-page prep brief: (1) Objective — what a great outcome looks like for me, in one sentence; (2) Who's in the room — a one-line read on each attendee's likely priorities; (3) Talking points — 3-4 things I should raise, in priority order; (4) Likely questions they'll ask and a crisp answer for each; (5) My single most important ask or next step. Keep it tight and scannable so I can read it in two minutes before the call. Where you're inferring someone's priorities, mark it [ASSUMPTION].",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["meetings", "preparation", "leadership"],
  },
  {
    name: "Strategic Memo Builder",
    slug: "strategic-memo-builder",
    category: "executive-founder",
    description:
      "Structures a sharp decision memo — question, options, risks, and a recommendation — from your raw thinking on a hard call.",
    bestFor: "Leaders who need to think through a consequential decision and align others on it.",
    repeatedWork: "Re-inventing the structure of a good decision doc every time a big call comes up.",
    inputs: [
      "The decision or question to resolve",
      "Background, constraints, and any relevant data",
      "The audience and how much they already know",
    ],
    processSteps: [
      "Sharpen the real question into one sentence, challenging the framing",
      "Lay out 2-3 realistic options with pros, cons, and rough cost",
      "Surface key risks and what you'd need to learn to de-risk",
      "Land a recommendation with clear reasoning",
    ],
    outputs: ["Structured strategic decision memo", "Ranked options with trade-offs and a recommendation"],
    exampleUseCase:
      "A fantasy platform's head of product weighs launching a same-game-parlay feature for the NFL season. The memo reframes the question around retention, compares build-vs-partner options, and recommends a phased pilot with the two metrics that would prove it out.",
    starterPrompt:
      "Act as a strategy partner. I need a decision memo on [DECISION, e.g. whether to launch a same-game-parlay product for the 2025 NFL season]. Context I have: [PASTE background, constraints, data]. Build a structured strategic memo: (1) The question, stated sharply in one sentence; (2) Why it matters now; (3) 2-3 realistic options, each with pros, cons, and rough cost/effort; (4) Key risks and unknowns, with what we'd need to learn to de-risk each; (5) A recommendation with reasoning. Push back on my framing if the real question is different, and note where my context is thin. Write for a smart executive who has 5 minutes. Target 500-700 words.",
    difficulty: "advanced",
    riskLevel: "low",
    tags: ["strategy", "decision-making", "leadership"],
  },
  {
    name: "Post-Conference Follow-Up Planner",
    slug: "post-conference-follow-up-planner",
    category: "executive-founder",
    description:
      "Turns a messy pile of conference contacts into prioritized, personalized follow-ups before the leads go cold.",
    bestFor: "Execs and BD leads who return from events with 40 cards and no system.",
    repeatedWork: "Retyping the same 'great to meet you' email and losing warm leads to inbox chaos.",
    inputs: [
      "Contact notes — names, companies, roles, what you discussed",
      "Your goal for each relationship",
      "Your typical tone and voice",
    ],
    processSteps: [
      "Tier each contact A/B/C by opportunity and fit",
      "Assign a specific next step to each (call, deck, data sample, check-in)",
      "Draft a personalized message referencing what you actually discussed",
      "Sequence the sends with timing over the coming days",
    ],
    outputs: ["Tiered contact list with next steps", "Personalized follow-up messages in send order"],
    exampleUseCase:
      "After the FSGA Winter Conference, a BD lead pastes a business-card dump. The planner tiers a data provider as A with a deck-send next step and drafts a follow-up referencing their comment about live-odds latency.",
    starterPrompt:
      "I just got back from [CONFERENCE, e.g. the FSGA Winter Conference] and need to turn my contacts into follow-ups before they go cold. Here are my notes — names, companies, roles, and what we discussed: [PASTE MESSY NOTES / CARD DUMP]. For each contact, produce: (1) a priority tier (A = pursue now, B = nurture, C = archive) with a one-line reason; (2) the specific next step (intro call, send deck, share data sample, casual check-in); (3) a short, personalized follow-up message referencing what we actually talked about — no generic 'great to meet you.' Then give me a suggested send order and timing over the next 10 days. Keep each message under 90 words and in this voice: [DESCRIBE TONE].",
    difficulty: "starter",
    riskLevel: "medium",
    tags: ["networking", "follow-up", "outbound"],
  },
  {
    name: "Personal Chief of Staff Daily Brief",
    slug: "chief-of-staff-daily-brief",
    category: "executive-founder",
    description:
      "Assembles a one-screen daily brief from your calendar, priorities, and urgent threads so you start the day decisive.",
    bestFor: "Busy operators who want a chief-of-staff read on the day without hiring one.",
    repeatedWork: "Re-scanning your calendar, tasks, and inbox every morning to figure out what actually matters.",
    inputs: [
      "Today's calendar",
      "Your open priorities and goals",
      "Anything urgent in your inbox or Slack",
    ],
    processSteps: [
      "Name the 3 things that must happen for the day to count as a win",
      "Add a one-line prep note before each meeting that needs one",
      "Surface loose ends waiting on you or on others",
      "Call out one thing to drop or delegate",
    ],
    outputs: ["One-screen daily brief", "Time-blocked calendar with prep notes"],
    exampleUseCase:
      "A sports-media founder pastes a day of partner calls and a launch deadline. The brief names the launch as the day's win, flags a prep note before the podcast-network call, and suggests delegating a vendor thread.",
    starterPrompt:
      "Be my chief of staff and build my daily brief. Inputs: today's calendar [PASTE], my open priorities [PASTE], and anything urgent in my inbox or Slack [PASTE]. Produce a one-screen brief: (1) The 3 things that must happen today for the day to count as a win; (2) A time-blocked read of my calendar with a one-line prep note before each meeting that needs one; (3) Loose ends — things waiting on me, or things I'm waiting on others for that I should nudge; (4) One thing I can safely drop or delegate. Be decisive about what matters and blunt about what doesn't. Keep it under 250 words so I can read it with my coffee.",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["productivity", "planning", "leadership"],
  },

  // ── sales-partnerships (7) ──────────────────────────────────────────────
  {
    name: "Prospect Research Brief",
    slug: "prospect-research-brief",
    category: "sales-partnerships",
    description:
      "Turns a company name and a few public signals into a one-page prospect brief: what they do, why now, and how to open the conversation.",
    bestFor: "Reps and partnership leads prepping for a first call or intro email.",
    repeatedWork: "Digging through a website, LinkedIn, and news before every outbound touch.",
    inputs: [
      "Prospect company name and website",
      "Public signals — news, launches, LinkedIn notes",
      "What you sell and who usually owns the decision",
    ],
    processSteps: [
      "Summarize what they do and how they make money",
      "Find a 'why now' signal that makes this a good moment to reach out",
      "Identify the likely decision-owner and what they care about",
      "Draft 3 tailored openers tied to those priorities",
    ],
    outputs: ["One-page prospect brief", "3 tailored conversation openers"],
    exampleUseCase:
      "Before a discovery call with a mid-size sports-media company, a rep generates a brief covering their recent podcast expansion and an opener referencing their push into betting content.",
    starterPrompt:
      "Research [PROSPECT COMPANY] and build me a one-page prospect brief before I reach out. Use what you know plus these public signals I've gathered: [PASTE website copy, recent news, LinkedIn notes]. They are a [operator / brand / data provider / media company] and I sell [YOUR PRODUCT/SERVICE]. Cover: (1) What they do and how they make money, in plain terms; (2) A 'why now' signal — a recent launch, hire, funding, or season timing that makes this a good moment to talk; (3) Who likely owns this decision and what they probably care about; (4) 3 tailored conversation openers tied to those priorities — not generic. End with 2 open questions I should confirm live. Label anything you're inferring as [ASSUMPTION].",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["sales", "research", "outbound"],
  },
  {
    name: "Sponsorship Fit Scorer",
    slug: "sponsorship-fit-scorer",
    category: "sales-partnerships",
    description:
      "Scores how well a prospective sponsor fits your property and generates activation ideas that would actually move their metric.",
    bestFor: "Sales and partnership leads qualifying inbound and outbound sponsor interest.",
    repeatedWork: "Eyeballing sponsor fit deal-by-deal with no consistent rubric.",
    inputs: [
      "Your property, audience, and reach",
      "The prospective sponsor, what they sell, and who they target",
      "Their goals and any past-deal signals",
    ],
    processSteps: [
      "Assess audience overlap between your audience and their target customer",
      "Score fit 1-10 with a one-sentence justification",
      "Generate activation ideas mapped to their goal",
      "Flag red flags and recommend pursue, qualify, or pass",
    ],
    outputs: ["Fit score with justification", "2-3 activation ideas and a recommended next step"],
    exampleUseCase:
      "A fantasy-football podcast network scores an energy-drink brand wanting app installs. The scorer rates overlap as strong, proposes a host-read plus a bracket-challenge contest, and flags a compliance note before pursuing.",
    starterPrompt:
      "Score how well a potential sponsor fits our property. Our property: [DESCRIBE, e.g. a fantasy football podcast network reaching 200k weekly listeners, mostly 25-40 male sports bettors]. The prospective sponsor: [NAME + WHAT THEY SELL + who they target]. What I know about their goals and past deals: [PASTE]. Produce a fit assessment: (1) a score from 1-10 with a one-sentence justification; (2) audience overlap — where our audience and their target customer align, and where they don't; (3) 2-3 activation ideas that would actually move their metric; (4) red flags or mismatches to raise internally; (5) a recommended next step (pursue, qualify further, or pass). Be honest about weak fits rather than forcing a 10.",
    difficulty: "advanced",
    riskLevel: "low",
    tags: ["sales", "sponsorship", "qualification"],
  },
  {
    name: "Sales Call Prep",
    slug: "sales-call-prep",
    category: "sales-partnerships",
    description:
      "Builds a one-page call plan — objective, discovery questions, value points, proof, and next step — for any deal conversation.",
    bestFor: "Reps who walk into calls without a clear plan for what to ask and say.",
    repeatedWork: "Improvising discovery questions and value points on every call.",
    inputs: [
      "The prospect and who you're meeting",
      "What you sell and the deal stage",
      "Discovery notes or prior conversations",
    ],
    processSteps: [
      "Name the one outcome you want from the call",
      "Draft discovery questions that surface real pain and buying process",
      "Phrase 2-3 value points as benefits, with proof to reference",
      "Propose a clean next step to close on",
    ],
    outputs: ["One-page call plan", "Discovery question list with value points"],
    exampleUseCase:
      "Ahead of a second call with a regional sportsbook, a rep builds a plan whose discovery questions target their acquisition-cost pain and lines up a comparable-operator case study to reference.",
    starterPrompt:
      "Prep me for a sales call. The prospect is [COMPANY + who I'm meeting]. What I sell: [PRODUCT]. Where we are in the deal: [STAGE / prior conversations]. Notes and discovery so far: [PASTE]. Build a call plan: (1) The one outcome I want from this call; (2) 4-5 discovery questions that surface their real pain and buying process; (3) The 2-3 value points most relevant to them, each phrased as a benefit not a feature; (4) Proof I can reference — case study, data point, comparable client; (5) A clean next step to propose at the end. Keep it to one page I can glance at mid-call. Don't invent facts about their business — mark gaps as [CONFIRM ON CALL].",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["sales", "preparation", "discovery"],
  },
  {
    name: "Partnership Follow-Up Writer",
    slug: "partnership-follow-up-writer",
    category: "sales-partnerships",
    description:
      "Writes a specific, non-generic follow-up after a partnership conversation that restates value and locks the next step.",
    bestFor: "BD and partnership leads keeping deals warm between conversations.",
    repeatedWork: "Rewriting the same follow-up email and defaulting to 'just circling back.'",
    inputs: [
      "Who you met and what you discussed",
      "What they seemed to care about",
      "The next step you loosely agreed on",
    ],
    processSteps: [
      "Open by referencing something specific from the conversation",
      "Restate the value in their terms",
      "Confirm the next step with a single clear ask or proposed time",
      "Produce a warm version and a crisp version to choose from",
    ],
    outputs: ["Two follow-up email drafts (warm and business-first)", "A clear proposed next step"],
    exampleUseCase:
      "After meeting a betting operator's partnerships lead, a BD rep drafts a follow-up that references their comment about affiliate-tracking gaps and proposes a 20-minute technical call next week.",
    starterPrompt:
      "Write a follow-up message after a partnership conversation. Context: I met with [NAME] at [COMPANY]. Here's what we discussed and what they seemed to care about: [PASTE NOTES]. The next step we loosely agreed on was [NEXT STEP]. Draft a follow-up email that: (1) opens by referencing something specific from our conversation, not 'great to connect'; (2) restates the value in their terms; (3) confirms the next step and makes it easy to say yes with a proposed time or one clear ask; (4) stays under 120 words. Give me two versions — one warm and relationship-first, one crisp and business-first — so I can pick. Match this tone: [DESCRIBE]. No hype, no exclamation-mark spam.",
    difficulty: "starter",
    riskLevel: "medium",
    tags: ["sales", "follow-up", "outbound"],
  },
  {
    name: "Objection Prep Assistant",
    slug: "objection-prep-assistant",
    category: "sales-partnerships",
    description:
      "Prepares non-defensive responses to the objections most likely to come up in a deal, plus the one that could kill it.",
    bestFor: "Reps who get caught flat-footed by price, integration, or compliance pushback.",
    repeatedWork: "Rehearsing objection responses from memory before every important deal call.",
    inputs: [
      "What you're selling and to whom",
      "The prospect's likely concerns",
      "Any proof points or comparable clients you can cite",
    ],
    processSteps: [
      "Name the real worry behind each objection",
      "Draft a concise, non-defensive response in your voice",
      "Add a proof point or reframe that lowers the felt risk",
      "Identify the deal-killer objection and how to get ahead of it",
    ],
    outputs: ["Objection-and-response pairs", "The deal-killer objection with a get-ahead-of-it plan"],
    exampleUseCase:
      "Before a renewal with a DFS platform, a rep preps for the 'your data feed lags in-game' objection with a latency benchmark and a reframe around their live-betting roadmap.",
    starterPrompt:
      "Help me prepare for objections before a deal conversation. I'm selling [PRODUCT/PARTNERSHIP] to [PROSPECT]. Their likely concerns based on what I know: [PASTE — e.g. price, integration effort, regulatory/compliance, existing vendor]. For each objection, give me: (1) what's really behind it — the underlying worry; (2) a concise, non-defensive response in my voice; (3) a proof point or reframe that lowers the risk they feel; (4) a question I can ask to keep the conversation moving instead of arguing. Then flag the single objection most likely to kill the deal and how I should get ahead of it early. Keep each response short enough to say naturally out loud — no scripts that sound rehearsed.",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["sales", "objections", "preparation"],
  },
  {
    name: "Proposal Outline Builder",
    slug: "proposal-outline-builder",
    category: "sales-partnerships",
    description:
      "Produces the skeleton and the arguments for a partnership proposal — sections, assets to gather, and pricing tiers — so you can fill it in fast.",
    bestFor: "Partnership leads who spend hours structuring proposals from a blank page.",
    repeatedWork: "Rebuilding proposal structure and re-deciding what to include for every deal.",
    inputs: [
      "What you're proposing (the deal shape)",
      "What you know about their goals, budget, and audience",
      "Assets and case studies you have available",
    ],
    processSteps: [
      "Frame the opportunity from their perspective in one line",
      "Order the sections and name the strongest point for each",
      "List the assets, metrics, and proof to gather per section",
      "Sketch 2-3 pricing/package tiers at a high level",
    ],
    outputs: ["Proposal outline with per-section arguments", "2-3 high-level package tiers"],
    exampleUseCase:
      "Pitching a season-long jersey-patch plus content sponsorship to a beverage brand, a partnership lead gets an outline that leads with the brand's app-install goal and specifies which audience metrics to pull for the reach section.",
    starterPrompt:
      "Build the outline for a partnership proposal I'll send to [COMPANY]. What we're proposing: [DESCRIBE — e.g. a season-long jersey-patch plus content sponsorship]. What I know about their goals, budget signals, and audience: [PASTE]. Produce a proposal outline with: (1) a one-line framing of the opportunity from their perspective; (2) recommended sections in order, with a sentence on what each should contain and the strongest point to make; (3) the specific assets, metrics, or case studies I should gather for each section; (4) 2-3 package/pricing tiers to present, described at a high level; (5) the single strongest reason for them to say yes. Don't write final copy — give me the skeleton and the arguments so I can fill it in fast.",
    difficulty: "intermediate",
    riskLevel: "medium",
    tags: ["sales", "proposals", "sponsorship"],
  },
  {
    name: "Weekly Pipeline Summary",
    slug: "weekly-pipeline-summary",
    category: "sales-partnerships",
    description:
      "Turns messy pipeline notes into a clean weekly summary with deals to watch, stuck deals, and where you need help.",
    bestFor: "Reps and sales managers reporting pipeline status without a polished CRM view.",
    repeatedWork: "Reassembling the same deal roll-up from notes and CRM exports every week.",
    inputs: [
      "Active deals with stage, value, and last activity",
      "What moved this week",
      "Where you need help from leadership",
    ],
    processSteps: [
      "Compute a top-line: total value, active deals, and what moved",
      "Pick the 3 deals most likely to close and their next step",
      "Diagnose stuck deals and propose to unstick or disqualify",
      "Present deals in a clean table with close estimates",
    ],
    outputs: ["Weekly pipeline narrative", "Deal table with stage, value, next step, and close estimate"],
    exampleUseCase:
      "A sales manager at a data provider pastes eight active operator deals. The summary flags two league contracts as most likely to close, marks a stalled agency deal for disqualification, and asks leadership for an exec intro.",
    starterPrompt:
      "Turn my messy pipeline notes into a weekly sales summary for my [manager / leadership team]. Here are my active deals with stage, value, and last activity: [PASTE — from CRM export or notes]. Produce: (1) A top-line — total pipeline value, number of active deals, and what moved this week; (2) Deals to watch — the 3 most likely to close and what each needs next; (3) Stuck deals — what's stalled and my plan to unstick or disqualify; (4) Where I need help from leadership. Present the deals in a clean table (deal, stage, value, next step, close estimate). Be honest about slippage rather than optimistic. Keep the narrative under 250 words above the table.",
    difficulty: "intermediate",
    riskLevel: "low",
    tags: ["sales", "reporting", "pipeline"],
  },

  // ── marketing-content (7) ───────────────────────────────────────────────
  {
    name: "Campaign Brief Builder",
    slug: "campaign-brief-builder",
    category: "marketing-content",
    description:
      "Turns a goal, audience, and offer into a one-page campaign brief the whole team can align on.",
    bestFor: "Marketers kicking off a campaign who need everyone rowing in one direction.",
    repeatedWork: "Rewriting the same brief structure and re-litigating the message at every kickoff.",
    inputs: [
      "The campaign goal and success metric",
      "Audience and the core insight about them",
      "Timeline, budget, and the offer or hook",
    ],
    processSteps: [
      "State the objective and the single metric that defines success",
      "Nail the audience insight and the primary message",
      "Assign channels and the role each plays",
      "List deliverables with rough timing and flag undefined inputs",
    ],
    outputs: ["One-page campaign brief", "Channel plan with deliverables and timing"],
    exampleUseCase:
      "For an NFL season-launch push targeting lapsed players, a growth marketer gets a brief that commits to a single reactivation message and assigns email, paid social, and a creator partnership distinct roles.",
    starterPrompt:
      "Write a campaign brief for [CAMPAIGN, e.g. our NFL season-launch push]. Inputs: the goal [e.g. 30k reactivated players], the audience [DESCRIBE], the timeline [DATES], the budget or constraints [PASTE], and the offer or hook [DESCRIBE]. Produce a one-page brief the whole team can align on: (1) Objective and the single metric that defines success; (2) Audience and the core insight about what they want; (3) Key message and 2-3 supporting proof points; (4) Channels and the role each plays; (5) Deliverables with rough timing; (6) What success looks like at the end. Be decisive — pick a primary message rather than hedging. Flag anything I left undefined as [NEEDS INPUT] so I know what to lock before kickoff.",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["marketing", "campaigns", "planning"],
  },
  {
    name: "Content Calendar Generator",
    slug: "content-calendar-generator",
    category: "marketing-content",
    description:
      "Builds a multi-week content calendar tied to your pillars, goals, and key dates, balanced across formats.",
    bestFor: "Content and social leads who plan the calendar from scratch every month.",
    repeatedWork: "Reassembling a posting schedule around game weeks and launches by hand each cycle.",
    inputs: [
      "Channel or brand and its audience",
      "Goals for the period and content pillars",
      "Key dates — game weeks, launches, holidays",
    ],
    processSteps: [
      "Map key dates onto the weeks in scope",
      "Balance the mix across content pillars and formats",
      "Assign each slot a hook, format, and CTA",
      "Add reserve ideas in case something underperforms",
    ],
    outputs: ["Week-by-week content calendar table", "Reserve idea list"],
    exampleUseCase:
      "A sports-betting newsletter and X account plan four weeks around the NFL slate. The calendar ties Thursday posts to game previews, balances education against promo, and holds three backup angles in reserve.",
    starterPrompt:
      "Build me a [4-week] content calendar for [CHANNEL/BRAND, e.g. our sports-betting newsletter plus X account]. Context: our audience is [DESCRIBE], our goals this period are [e.g. grow subscribers and drive app installs], key dates and events are [PASTE — game weeks, launches, holidays], and our content pillars are [LIST or ask me]. Produce a week-by-week calendar as a table with: date, platform, content pillar, working title/hook, format (post, clip, newsletter, thread), and CTA. Balance the mix across pillars, tie posts to the key dates, and avoid repeating the same angle twice in a week. Add a short 'why this works' note under the table and 3 ideas I can hold in reserve if something underperforms.",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["marketing", "content", "planning"],
  },
  {
    name: "Episode-to-Clips Planner",
    slug: "episode-to-clips-planner",
    category: "marketing-content",
    description:
      "Finds the most clip-worthy moments in a podcast or video episode and packages each with a hook, title, and platform.",
    bestFor: "Content teams repurposing long-form shows into short-form clips.",
    repeatedWork: "Re-scrubbing a full episode to hunt for standalone clip moments every week.",
    inputs: [
      "Episode transcript or detailed notes with timestamps",
      "The show topic and target platforms",
      "How many clips you want",
    ],
    processSteps: [
      "Scan for 5-8 standalone-worthy moments with timestamps",
      "Give each a one-line reason it works as a clip",
      "Write a 2-second hook, an on-screen title, and the best platform",
      "Rank by viral potential and pick the first to post",
    ],
    outputs: ["Ranked clip list with timestamps", "Hook, title, and platform for each clip"],
    exampleUseCase:
      "A fantasy-football YouTube show feeds in an episode transcript. The planner surfaces a spicy waiver-wire take at 14:20, writes a hook and title for it, and flags it as the strongest first Short.",
    starterPrompt:
      "I have a [podcast / YouTube] episode and need to turn it into short clips. Here's the transcript or detailed notes with timestamps: [PASTE]. The show is [NAME/TOPIC] and clips will go on [TikTok / Reels / Shorts / X]. Identify the 5-8 most clip-worthy moments and for each give me: (1) the timestamp range; (2) a one-line reason it works standalone — hot take, surprising stat, funny beat, useful tip; (3) a punchy hook/caption for the first 2 seconds; (4) an on-screen title; (5) the best platform for it. Rank them by viral potential and note which single clip I should post first. Prefer moments that make sense with no context over ones that need the full episode.",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["content", "repurposing", "video"],
  },
  {
    name: "Newsletter Draft Assistant",
    slug: "newsletter-draft-assistant",
    category: "marketing-content",
    description:
      "Drafts a full newsletter edition in your voice from raw links, notes, and takes — subject lines included.",
    bestFor: "Creators and marketers shipping a recurring newsletter under deadline.",
    repeatedWork: "Turning a folder of links and half-formed takes into a polished edition every week.",
    inputs: [
      "Raw ingredients — links, notes, stats, takes",
      "Your usual sections and format",
      "Your voice and audience",
    ],
    processSteps: [
      "Write a subject line plus two alternates",
      "Draft a personality-forward intro that earns the open",
      "Sharpen each section's take and add useful context",
      "Flag anything unverified rather than inventing details",
    ],
    outputs: ["Complete newsletter draft", "Subject line with two alternates"],
    exampleUseCase:
      "A daily-fantasy newsletter writer pastes five links and three takes about the coming slate. The draft returns a scroll-stopping subject line and an intro in their voice, with one unverified injury note flagged for a check.",
    starterPrompt:
      "Draft this week's edition of my newsletter, [NAME], for an audience of [DESCRIBE, e.g. daily fantasy players]. Here are the raw ingredients — links, notes, stats, and takes I want to include: [PASTE]. My usual format is [DESCRIBE sections], and my voice is [DESCRIBE tone]. Write a complete draft with: (1) a subject line plus two alternates; (2) a short, personality-forward intro that earns the open; (3) the main sections with my takes sharpened and tightened; (4) clear CTAs where relevant. Keep my voice — don't make it sound like corporate marketing. Where I gave you a bare link or fact, add a sentence of useful context, but flag anything you couldn't verify as [CHECK] rather than inventing details.",
    difficulty: "starter",
    riskLevel: "medium",
    tags: ["content", "newsletter", "writing"],
  },
  {
    name: "Social Post Variant Generator",
    slug: "social-post-variant-generator",
    category: "marketing-content",
    description:
      "Adapts one core message into platform-native variants for X, LinkedIn, Instagram, and short-form video.",
    bestFor: "Social managers who need one announcement to land differently on each platform.",
    repeatedWork: "Manually rewording the same post for every channel and losing the platform-native voice.",
    inputs: [
      "The core message or announcement",
      "Your audience and brand voice",
      "Which platforms you're posting to",
    ],
    processSteps: [
      "Adapt the angle to each platform's audience and format",
      "Write X, LinkedIn, Instagram, and a video hook version",
      "Offer two options for the highest-stakes platform",
      "Add hashtags only where they genuinely help",
    ],
    outputs: ["Platform-native post variants", "A short-form video hook line"],
    exampleUseCase:
      "Announcing free live win-probability for every NFL game, a social lead gets a punchy X post, a credible LinkedIn take, an Instagram caption, and a spoken three-second video hook — each adapted, not reworded.",
    starterPrompt:
      "Take one core message and give me platform-native variants. The core message/announcement: [PASTE, e.g. 'we just launched free live win-probability for every NFL game']. My audience: [DESCRIBE]. Brand voice: [DESCRIBE]. Produce distinct versions for: (1) X — punchy, 1-2 posts, thread-able if it helps; (2) LinkedIn — a credible, slightly longer take with a hook first line; (3) Instagram caption — visual-friendly with a clear CTA; (4) a short-form video hook — the first 3 seconds spoken. Don't just reword the same sentence — adapt the angle to each platform. Give me 2 options for the X post. Include 3-5 relevant hashtags only where they actually help. Avoid clichés like 'game changer' and 'excited to announce.'",
    difficulty: "starter",
    riskLevel: "medium",
    tags: ["marketing", "social", "content"],
  },
  {
    name: "Sponsor Integration Idea Generator",
    slug: "sponsor-integration-idea-generator",
    category: "marketing-content",
    description:
      "Brainstorms native sponsor integration ideas across your content formats, ranked by audience fit and sponsor value.",
    bestFor: "Content and partnership teams designing sponsor activations that don't feel like ads.",
    repeatedWork: "Reinventing integration concepts for every sponsor from a blank page.",
    inputs: [
      "Your property and its formats",
      "The sponsor, their product, and their goal",
      "Constraints — compliance, host authenticity, tone",
    ],
    processSteps: [
      "Generate 8-10 ideas across host reads, segments, contests, and social",
      "For each, note format, audience fit, and how it serves the sponsor",
      "Rank by a blend of audience-friendliness and sponsor value",
      "Flag the 2 most native versus bolted-on",
    ],
    outputs: ["Ranked list of integration ideas", "The 2 most native concepts highlighted"],
    exampleUseCase:
      "For a betting-brand sponsor on a fantasy podcast, the generator proposes a weekly 'lock of the week' segment and a bracket contest, ranks them by fit, and flags a required responsible-gambling disclaimer.",
    starterPrompt:
      "Brainstorm sponsor integration ideas for [SPONSOR] across our content. Our property: [DESCRIBE — e.g. a three-times-weekly fantasy football podcast plus YouTube channel]. The sponsor sells [PRODUCT] and wants to drive [THEIR GOAL — e.g. app installs / brand awareness]. Constraints: [PASTE — e.g. must be compliant for a betting brand, keep it authentic to the hosts]. Give me 8-10 integration ideas across formats: host reads, segments, custom bits, contests, co-branded content, social extensions. For each: a one-line description, the format, why it fits our audience, and how it serves the sponsor's goal. Rank by a blend of audience-friendliness and sponsor value, and flag the 2 that feel most native to our show versus bolted-on. Avoid ideas that feel like an ad-read interruption.",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["content", "sponsorship", "brainstorming"],
  },
  {
    name: "Audience Feedback Synthesizer",
    slug: "audience-feedback-synthesizer",
    category: "marketing-content",
    description:
      "Cuts through comments, DMs, and poll replies to surface themes, what people want more of, and 3 actions to take.",
    bestFor: "Creators and content leads drowning in audience feedback with no time to read it all.",
    repeatedWork: "Manually reading every comment and reply to figure out what the audience actually thinks.",
    inputs: [
      "Raw feedback — comments, DMs, replies, poll responses, reviews",
      "What the feedback is about (show, product, campaign)",
      "What decision the synthesis will inform",
    ],
    processSteps: [
      "Cluster feedback into the top 4-5 themes with frequency",
      "Separate what people love from common complaints",
      "Note any surprising or contrarian signal",
      "Recommend 3 actions ranked by impact-to-effort",
    ],
    outputs: ["One-page feedback synthesis with themes and quotes", "3 ranked next actions"],
    exampleUseCase:
      "After a format change, a podcast host pastes a week of comments and DMs. The synthesizer shows listeners love the new segment but want shorter episodes, and recommends trimming runtime as the top action.",
    starterPrompt:
      "Synthesize what my audience is telling me. Here's a pile of raw feedback — comments, DMs, replies, poll responses, and reviews about [SHOW / PRODUCT / CAMPAIGN]: [PASTE]. Cut through it and give me: (1) the top 4-5 themes, each with how often it came up and 1-2 representative quotes; (2) what people love and want more of; (3) the most common complaints or requests; (4) any surprising or contrarian signal worth noting; (5) 3 concrete actions I could take next, ranked by impact-to-effort. Separate signal from noise — don't over-weight a single loud comment. If sentiment is mixed on something, say so honestly rather than picking a side. Keep the whole thing to one page.",
    difficulty: "intermediate",
    riskLevel: "low",
    tags: ["content", "feedback", "synthesis"],
  },

  // ── product-ops (7) ─────────────────────────────────────────────────────
  {
    name: "Customer Feedback Synthesizer",
    slug: "customer-feedback-synthesizer",
    category: "product-ops",
    description:
      "Turns support tickets, reviews, and survey responses into a product-ready summary of themes, severity, and quick wins.",
    bestFor: "Product managers who need signal from a flood of customer feedback.",
    repeatedWork: "Reading every ticket and review to re-derive the same top issues each sprint.",
    inputs: [
      "Raw feedback — tickets, app reviews, survey responses",
      "The product or area it concerns",
      "What you'll use the summary to decide",
    ],
    processSteps: [
      "Rank the top themes by frequency and severity",
      "Classify each as bug, missing feature, UX confusion, or pricing",
      "Separate quick wins from bigger bets",
      "Name the single issue hurting retention most, with reasoning",
    ],
    outputs: ["Theme table with volume and severity", "Quick-wins versus bigger-bets split"],
    exampleUseCase:
      "A DFS app's PM pastes 60 reviews and tickets. The synthesizer flags withdrawal delays as the top retention killer, separates a quick copy fix from a lineup-import rebuild, and lists three questions to check against analytics.",
    starterPrompt:
      "You're my product analyst. Here's raw customer feedback about [PRODUCT — e.g. our DFS app] from support tickets, app reviews, and survey responses: [PASTE]. Synthesize it into a product-ready summary: (1) the top 5 themes ranked by frequency and severity, each with a representative quote and rough volume; (2) which themes are bugs vs. missing features vs. UX confusion vs. pricing; (3) quick wins we could ship fast vs. bigger bets; (4) the single issue hurting retention the most, with your reasoning; (5) 3 open questions worth digging into with data. Don't let one angry review distort the ranking — weight by how many people raised each thing. Present the themes in a table and keep the narrative tight.",
    difficulty: "intermediate",
    riskLevel: "low",
    tags: ["product", "feedback", "synthesis"],
  },
  {
    name: "Feature Spec Builder",
    slug: "feature-spec-builder",
    category: "product-ops",
    description:
      "Turns a feature idea into a lightweight spec with user stories, requirements, non-goals, and open questions.",
    bestFor: "PMs and founders who need to hand engineering something clear without a 20-page PRD.",
    repeatedWork: "Re-structuring the same spec sections and re-thinking edge cases for every feature.",
    inputs: [
      "The feature idea and the problem it solves",
      "Who it's for",
      "Constraints — tech, timeline, compliance",
    ],
    processSteps: [
      "State the problem and the success metric",
      "Write 3-5 user stories in as-a / I-want / so-that form",
      "List core requirements and explicit v1 non-goals",
      "Surface edge cases and open questions, asking where input is thin",
    ],
    outputs: ["One-to-two page feature spec", "User stories with requirements and open questions"],
    exampleUseCase:
      "For a shareable-parlay-card feature, a PM gets a spec that defines the retention goal, writes stories for creating and sharing cards, and flags a compliance open question about displaying odds.",
    starterPrompt:
      "Help me turn a feature idea into a lightweight spec. The idea: [DESCRIBE, e.g. 'let users create shareable parlay cards']. Who it's for and the problem it solves: [PASTE]. Any constraints — tech, timeline, compliance: [PASTE]. Produce a one-to-two page spec: (1) Problem statement and the user it serves; (2) Goal and the success metric; (3) User stories (3-5, in 'as a… I want… so that…' form); (4) Core requirements and explicit non-goals for v1; (5) Key edge cases and open questions for engineering and design; (6) A rough phasing (MVP vs. later). Ask sharp clarifying questions where my input is thin instead of inventing requirements. Keep it practical enough to hand to a small team, not a 20-page PRD.",
    difficulty: "intermediate",
    riskLevel: "low",
    tags: ["product", "spec", "planning"],
  },
  {
    name: "Internal SOP Generator",
    slug: "internal-sop-generator",
    category: "product-ops",
    description:
      "Turns your messy description of a process into a clean, repeatable SOP a new hire could follow without asking.",
    bestFor: "Ops leads documenting the tribal knowledge that lives in one person's head.",
    repeatedWork: "Explaining the same process over and over because it's never been written down.",
    inputs: [
      "The process and your rough description of the steps",
      "Who will follow it",
      "Tools involved",
    ],
    processSteps: [
      "State the purpose and prerequisites",
      "Write specific, numbered step-by-step instructions",
      "Capture decision points and branches",
      "Add a checklist version and common mistakes",
    ],
    outputs: ["Full SOP document", "Quick-reference checklist version"],
    exampleUseCase:
      "An ops lead describes how they onboard a new affiliate partner. The generator produces a numbered SOP with the tracking-link setup branch and a checklist a junior teammate can run solo.",
    starterPrompt:
      "Write a clear internal SOP for [PROCESS, e.g. 'onboarding a new affiliate partner']. Here's how it currently works, in my own messy words: [PASTE / describe the steps]. The people who'll follow this: [ROLE]. Tools involved: [LIST]. Turn it into a clean, repeatable SOP: (1) Purpose and when to use it; (2) Prerequisites and who's responsible; (3) Numbered step-by-step instructions, each specific and actionable; (4) Decision points or branches ('if X, then…'); (5) A quick checklist version at the end for fast reference; (6) Common mistakes to avoid. Write it so a new hire could follow it without asking questions. Where my description is ambiguous or a step seems missing, flag it as [CLARIFY] rather than guessing.",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["operations", "documentation", "process"],
  },
  {
    name: "Bug Report Triage Assistant",
    slug: "bug-report-triage-assistant",
    category: "product-ops",
    description:
      "Turns a vague bug report into a clean, engineering-ready ticket with repro steps, severity, and missing-info flags.",
    bestFor: "PMs and support leads who forward messy reports that bounce back for detail.",
    repeatedWork: "Rewriting user complaints into structured tickets one at a time.",
    inputs: [
      "The raw bug report",
      "The product or area affected",
      "Any environment or account detail available",
    ],
    processSteps: [
      "Write a clear one-line title",
      "Extract numbered steps to reproduce and expected vs. actual behavior",
      "Assign a severity with a one-line impact justification",
      "List what's still missing or the questions to send back",
    ],
    outputs: ["Clean bug ticket", "List of missing info or follow-up questions"],
    exampleUseCase:
      "A support lead pastes a user's 'the app crashes sometimes' complaint about a sportsbook. The assistant drafts repro steps, marks it high severity for affecting live bet placement, and lists the device details still needed.",
    starterPrompt:
      "Triage this bug report so it's ready for engineering. Raw report (from a user, teammate, or support ticket): [PASTE]. Product/area: [NAME]. Turn it into a clean ticket: (1) A clear one-line title; (2) Steps to reproduce, numbered; (3) Expected vs. actual behavior; (4) A suggested severity (critical / high / medium / low) with a one-line justification based on user impact; (5) Likely area or component if inferable; (6) What info is still missing to reproduce it. If the report is too vague to act on, list the exact questions to send back to the reporter. Don't speculate about the root cause beyond an optional short 'possible cause' note clearly labeled as a guess.",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["product", "triage", "operations"],
  },
  {
    name: "Product Launch Checklist Builder",
    slug: "product-launch-checklist-builder",
    category: "product-ops",
    description:
      "Generates a phased launch checklist with owners, timing, and the easy-to-forget items that sink launches.",
    bestFor: "PMs and ops leads coordinating a launch across product, marketing, and support.",
    repeatedWork: "Rebuilding the launch checklist from memory and forgetting the same items every time.",
    inputs: [
      "The product or feature and its launch date",
      "Audience and teams involved",
      "Hard constraints — compliance, dependencies",
    ],
    processSteps: [
      "Organize items by phase: pre-launch, launch day, post-launch",
      "Assign each item an owner role and a due offset (T-minus)",
      "Cover the forgotten stuff: QA, tracking, docs, comms, rollback",
      "Flag the 3 items most likely to cause a bad launch if skipped",
    ],
    outputs: ["Phased launch checklist table", "The 3 highest-risk items highlighted"],
    exampleUseCase:
      "Launching a live-odds widget, a PM gets a checklist that sequences QA and analytics tracking at T-7, a compliance sign-off gate at T-3, and a rollback plan flagged as a top launch-day risk.",
    starterPrompt:
      "Build a launch checklist for [PRODUCT/FEATURE, e.g. our new live-odds widget] going live on [DATE]. Context: audience [DESCRIBE], teams involved [LIST — product, eng, marketing, support, compliance], and any hard constraints [PASTE]. Produce a checklist organized by phase — pre-launch, launch day, post-launch — with each item having an owner role and a rough due offset (e.g. 'T-7 days'). Cover the easy-to-forget stuff: QA, analytics/tracking, support docs and macros, comms/announcement, rollback plan, and a compliance/legal check where relevant. Flag the 3 items that would most likely cause a bad launch if skipped. Keep it to a scannable table plus those 3 flagged risks. Ask me what's missing if a critical workstream isn't represented in my inputs.",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["product", "launch", "operations"],
  },
  {
    name: "Tool Evaluation Brief",
    slug: "tool-evaluation-brief",
    category: "product-ops",
    description:
      "Compares tool options against your real priorities and lands a recommendation tied to your situation, not popularity.",
    bestFor: "Operators and PMs choosing software without time for a full RFP.",
    repeatedWork: "Rebuilding a comparison matrix and re-arguing trade-offs for every tool decision.",
    inputs: [
      "The need and the tools you're considering",
      "What matters most — budget, integrations, scale, compliance",
      "Your team's context and constraints",
    ],
    processSteps: [
      "Score each option against your criteria in a comparison table",
      "Write a short pros/cons paragraph per option",
      "Recommend the best fit with clear reasoning and a runner-up",
      "List vendor questions and things to verify in a trial",
    ],
    outputs: ["Tool comparison table and recommendation", "Vendor questions and trial checklist"],
    exampleUseCase:
      "Choosing a support platform for a sportsbook, an ops lead gets a matrix scoring each tool on compliance and integrations, a recommendation tied to their scale, and a list of latency questions to ask each vendor.",
    starterPrompt:
      "Help me evaluate tools for [NEED, e.g. 'a customer support platform for our sportsbook']. Options I'm considering: [LIST TOOLS], or suggest strong ones if I leave it blank. What matters most to us: [PASTE — e.g. budget, integrations, scale, compliance, ease of use]. Produce a decision brief: (1) a comparison table scoring each option against my criteria; (2) a short pros/cons paragraph per option; (3) the best fit for our situation with clear reasoning; (4) a runner-up and when it'd be the better call; (5) questions to ask each vendor and things to verify in a trial. Be explicit about trade-offs and don't just pick the most popular tool — tie the recommendation to my stated priorities. Note where you're inferring a product detail as [VERIFY].",
    difficulty: "intermediate",
    riskLevel: "low",
    tags: ["operations", "evaluation", "tools"],
  },
  {
    name: "Process Improvement Finder",
    slug: "process-improvement-finder",
    category: "product-ops",
    description:
      "Maps a painful process, finds the bottlenecks, and returns the 3 changes with the best impact-to-effort ratio.",
    bestFor: "Ops leads who feel a process is slow but can't pinpoint where it breaks.",
    repeatedWork: "Re-analyzing a clunky workflow from scratch each time it becomes a fire.",
    inputs: [
      "The process, step by step, with who does what and which tools",
      "How often it runs and how long it takes",
      "Where the pain shows up",
    ],
    processSteps: [
      "Map the steps and flag bottlenecks, redundant handoffs, and manual work",
      "Identify the 3 highest impact-to-effort changes",
      "For each, describe the fix, owner, and time or errors saved",
      "Note new risks and suggest one do-this-week quick win",
    ],
    outputs: ["Process map with flagged bottlenecks", "3 prioritized improvements with a quick win"],
    exampleUseCase:
      "A data provider's ops lead describes their weekly player-data QA process. The finder flags a duplicate manual review, recommends automating one validation step, and names a spreadsheet-template fix as the do-this-week win.",
    starterPrompt:
      "Act as an operations consultant. Here's a process that feels slow or painful: [DESCRIBE step by step, including who does what and the tools involved]. Roughly how often it runs and how long it takes: [PASTE]. Analyze it and find improvements: (1) Map the current steps and flag bottlenecks, redundant handoffs, and manual work that could be automated; (2) Identify the 3 changes with the best impact-to-effort ratio; (3) For each, describe the fix, who owns it, and the expected time or error saved; (4) Note any risk the change introduces; (5) Suggest one 'do this week' quick win. Be specific and practical — no generic 'improve communication' advice. If a step's purpose is unclear, ask before assuming it's waste.",
    difficulty: "intermediate",
    riskLevel: "low",
    tags: ["operations", "process", "efficiency"],
  },

  // ── hiring-people (6) ───────────────────────────────────────────────────
  {
    name: "Job Description Builder",
    slug: "job-description-builder",
    category: "hiring-people",
    description:
      "Writes a compelling, honest job description from the real day-to-day of the role — no buzzwords, no task dumps.",
    bestFor: "Hiring managers who need a JD that attracts the right people, not a generic template.",
    repeatedWork: "Copy-pasting an old JD and lightly editing it into another wall of bullet points.",
    inputs: [
      "The role and the company",
      "What the role does day to day",
      "Must-have vs. nice-to-have skills, reporting line, comp",
    ],
    processSteps: [
      "Write a short hook about why the role matters here",
      "Turn responsibilities into outcome-focused bullets",
      "Split requirements into must-haves and nice-to-haves",
      "Cut buzzwords and add an inclusive, clear apply step",
    ],
    outputs: ["Complete job description", "Must-have vs. nice-to-have requirements split"],
    exampleUseCase:
      "A fantasy-sports operator hiring a Partnerships Manager gets a JD that leads with the impact of the role on affiliate revenue, frames responsibilities as outcomes, and drops 'rockstar' and 'wear many hats.'",
    starterPrompt:
      "Write a job description for a [ROLE, e.g. Partnerships Manager] at [COMPANY], a [DESCRIBE — e.g. fantasy sports operator]. Inputs: what the role actually does day to day [PASTE], must-have vs. nice-to-have skills [PASTE], who they'll report to and work with [PASTE], and location/comp if I want it included [PASTE]. Produce a compelling, honest JD: (1) A short hook about why this role matters here; (2) What you'll do — outcome-focused bullets, not a task dump; (3) What we're looking for — separated into must-haves and nice-to-haves; (4) What we offer; (5) An inclusive, no-jargon closing and clear apply step. Keep it tight and human — cut buzzwords like 'rockstar' and 'wear many hats.' Flag anything I left blank as [FILL IN] instead of inventing comp or benefits.",
    difficulty: "starter",
    riskLevel: "medium",
    tags: ["hiring", "job-description", "writing"],
  },
  {
    name: "Candidate Scorecard Builder",
    slug: "candidate-scorecard-builder",
    category: "hiring-people",
    description:
      "Builds a structured interview scorecard with role-specific competencies and rating anchors so interviewers score consistently.",
    bestFor: "Hiring managers who want objective, comparable interview evaluations.",
    repeatedWork: "Re-inventing evaluation criteria and rating scales for each new role.",
    inputs: [
      "The role and its key responsibilities",
      "What great looks like in the role",
      "The seniority level",
    ],
    processSteps: [
      "Define 4-6 role-specific competencies, not generic culture fit",
      "Write 1-4 rating anchors describing weak vs. strong answers",
      "Add signal questions and red flags per competency",
      "Provide an overall recommendation scale with weighting guidance",
    ],
    outputs: ["Reusable interview scorecard template", "Rating anchors and red flags per competency"],
    exampleUseCase:
      "Hiring a data engineer for a player-props product, a manager gets a scorecard with competencies like data-pipeline reliability, each with anchored 1-to-4 descriptions so three interviewers grade the same candidate alike.",
    starterPrompt:
      "Build an interview scorecard for a [ROLE] hire. The role's key responsibilities: [PASTE]. What great looks like in this role: [DESCRIBE, or ask me]. Produce a structured scorecard interviewers can use consistently: (1) 4-6 evaluation competencies specific to this role (not generic 'culture fit'), each with a one-line definition; (2) for each competency, a 1-4 rating anchor describing what a 1 vs. a 4 answer sounds like; (3) 1-2 signal questions per competency; (4) clear red flags to watch for; (5) an overall recommendation scale (strong yes / yes / no / strong no) with guidance on how to weigh the competencies. Keep it objective and evidence-based so different interviewers score the same candidate similarly. Format it as a clean, reusable template.",
    difficulty: "starter",
    riskLevel: "medium",
    tags: ["hiring", "interviewing", "evaluation"],
  },
  {
    name: "Interview Question Pack",
    slug: "interview-question-pack",
    category: "hiring-people",
    description:
      "Generates a structured set of behavioral and scenario questions mapped to the competencies you need to assess.",
    bestFor: "Interviewers who want to run a consistent, revealing 45-minute interview.",
    repeatedWork: "Improvising interview questions or recycling ones that candidates have gamed.",
    inputs: [
      "The role, company, and seniority level",
      "The 3-4 competencies to assess",
      "The interview length",
    ],
    processSteps: [
      "Write 2-3 behavioral questions per competency with strong-answer notes",
      "Add role-specific scenario or case questions",
      "Include motivation and stage-fit questions",
      "Provide follow-up probes to get past rehearsed answers",
    ],
    outputs: ["Structured interview question pack", "Follow-up probes and strong-answer notes"],
    exampleUseCase:
      "For a mid-level growth marketer at a DFS platform, the pack provides behavioral questions on paid-acquisition ownership plus a live scenario on a CAC spike, each with what a strong answer includes.",
    starterPrompt:
      "Generate an interview question pack for a [ROLE] at [COMPANY]. Context: the role's core responsibilities [PASTE], the seniority level [LEVEL], and the 3-4 competencies I most need to assess [LIST or ask me]. Produce a structured pack: (1) 2-3 behavioral questions per competency, each surfacing real past behavior ('tell me about a time…'), with a note on what a strong answer includes; (2) 1-2 role-specific scenario or case questions with what I'm listening for; (3) a couple of questions to assess motivation and fit for our stage; (4) suggested follow-up probes to get past rehearsed answers. Avoid clichéd or easily-gamed questions and anything that could invite bias. Format so I can run a consistent 45-minute interview from it.",
    difficulty: "starter",
    riskLevel: "medium",
    tags: ["hiring", "interviewing", "questions"],
  },
  {
    name: "Resume Screen Summary",
    slug: "resume-screen-summary",
    category: "hiring-people",
    description:
      "Screens a resume against the role and returns a fair, evidence-based match summary with gaps to probe.",
    bestFor: "Recruiters and hiring managers screening a stack of resumes quickly and consistently.",
    repeatedWork: "Re-reading each resume against the job requirements and re-forming the same judgment.",
    inputs: [
      "The job requirements — must-haves and nice-to-haves",
      "The candidate's resume",
      "The screening bar for this stage",
    ],
    processSteps: [
      "Write a 2-sentence snapshot of the candidate",
      "Match each requirement: met, partially met, or not evident, with evidence",
      "Note standout strengths and gaps to probe",
      "Recommend advance, maybe, or pass with a one-line reason",
    ],
    outputs: ["Requirement-by-requirement match table", "Advance / maybe / pass recommendation"],
    exampleUseCase:
      "Screening for a partnerships role at a data company, a recruiter pastes a resume and the JD. The summary marks sponsorship experience as met, flags that CRM ownership is silent rather than failed, and recommends advancing.",
    starterPrompt:
      "Screen this resume against the role and give me a fast, fair summary. The job requirements (must-haves and nice-to-haves): [PASTE JD or bullet list]. The resume: [PASTE]. Produce: (1) a 2-sentence snapshot of the candidate; (2) a requirement-by-requirement match table (met / partially met / not evident) with the supporting detail from the resume; (3) standout strengths for this specific role; (4) gaps or things to probe in a screen call; (5) a recommendation — advance, maybe, or pass — with a one-line reason. Judge only on evidence in the resume; don't infer demographics or make assumptions beyond what's written, and note where the resume is simply silent on a requirement rather than penalizing it as a fail. Keep it under 300 words.",
    difficulty: "intermediate",
    riskLevel: "medium",
    tags: ["hiring", "screening", "resumes"],
  },
  {
    name: "New Hire Onboarding Plan",
    slug: "new-hire-onboarding-plan",
    category: "hiring-people",
    description:
      "Builds a 30-60-90 day onboarding plan with phase goals, activities, people to meet, and milestones.",
    bestFor: "Managers who want new hires productive fast without a generic HR checklist.",
    repeatedWork: "Reinventing the onboarding plan role-by-role and winging the first two weeks.",
    inputs: [
      "The role, team, and what the person will own",
      "Key people, tools, and systems to learn",
      "What 'ramped up' looks like at day 90",
    ],
    processSteps: [
      "Set goals for each 30/60/90 phase",
      "Front-load week one with access, context, and a quick win",
      "List people to meet and why, plus a milestone per phase",
      "Add a manager checklist for the 30/60/90 marks",
    ],
    outputs: ["30-60-90 day onboarding plan", "Manager checklist by milestone"],
    exampleUseCase:
      "Onboarding a partnerships manager at a sports-media company, a manager gets a plan that gets them into affiliate tooling in week one, meeting content leads by day 30, and closing a small renewal by day 90.",
    starterPrompt:
      "Build a 30-60-90 day onboarding plan for a new [ROLE] joining [TEAM/COMPANY]. Context: what this person will own [PASTE], who they'll work with [LIST], the tools and systems they need to learn [LIST], and what 'ramped up' looks like at day 90 [DESCRIBE]. Produce a plan in three phases, each with: goals for the phase, specific learning/onboarding activities, people to meet and why, and a concrete deliverable or milestone that proves progress. Front-load the first week with the essentials — access, context, a quick win — and get them to a real contribution fast without overwhelming them. Add a short 'manager checklist' of things I should do at 30, 60, and 90 days. Keep it specific to this role, not a generic HR template.",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["hiring", "onboarding", "people"],
  },
  {
    name: "Performance Feedback Draft Assistant",
    slug: "performance-feedback-draft-assistant",
    category: "hiring-people",
    description:
      "Drafts balanced, specific, evidence-based performance feedback from your raw notes and examples.",
    bestFor: "Managers who struggle to turn observations into clear, fair feedback.",
    repeatedWork: "Staring at a blank review form and generalizing because the examples are scattered.",
    inputs: [
      "The person and their role",
      "Your notes and specific examples — wins, misses, observations",
      "The purpose (review, growth conversation)",
    ],
    processSteps: [
      "Summarize overall performance briefly",
      "Tie each strength and growth area to a concrete example",
      "Frame growth areas constructively with a suggested action",
      "Set clear goals and flag where evidence is too thin to claim",
    ],
    outputs: ["Balanced performance feedback draft", "Goals and expectations for next period"],
    exampleUseCase:
      "For a mid-year review of a content producer, a manager pastes notes on strong clip performance and missed deadlines. The draft praises the clip wins with specifics and frames deadline consistency as a concrete goal.",
    starterPrompt:
      "Help me draft performance feedback for [NAME], a [ROLE] on my team. Here are my raw notes and specific examples from this period — wins, misses, and observations: [PASTE]. The purpose: [e.g. mid-year review / a growth conversation]. Draft balanced, specific feedback: (1) a short summary of overall performance; (2) strengths — each tied to a concrete example, not vague praise; (3) growth areas — framed constructively, each with a specific example and a suggested action; (4) clear goals or expectations for next period; (5) a warm, honest closing. Keep it direct but supportive, and make every point evidence-based rather than a personality judgment. Flag anywhere my notes are too thin to make a fair claim as [NEEDS A SPECIFIC EXAMPLE] so I don't generalize.",
    difficulty: "starter",
    riskLevel: "medium",
    tags: ["people", "feedback", "management"],
  },

  // ── personal-productivity (6) ───────────────────────────────────────────
  {
    name: "Daily Priority Planner",
    slug: "daily-priority-planner",
    category: "personal-productivity",
    description:
      "Turns your task list, meetings, and deadlines into a focused, time-blocked plan with a ruthless top 3.",
    bestFor: "Anyone whose to-do list is longer than the hours in the day.",
    repeatedWork: "Re-triaging the same overflowing task list every morning without a clear focus.",
    inputs: [
      "Your task list, meetings, and deadlines",
      "Your single most important current goal",
      "The hours you actually have today",
    ],
    processSteps: [
      "Pick the top 3 priorities that move your goal, with a why",
      "Time-block a realistic schedule around meetings",
      "Name the one thing to do if nothing else happens",
      "Say plainly what to defer, delegate, or drop",
    ],
    outputs: ["Focused daily plan with a top 3", "Time-blocked schedule and a drop/defer list"],
    exampleUseCase:
      "A founder juggling investor prep and a launch pastes their day. The planner names the launch as the must-do, blocks two focus hours before the first call, and tells them to push a vendor thread to tomorrow.",
    starterPrompt:
      "Help me plan my day. Here's everything on my plate: my task list [PASTE], my meetings [PASTE], and my deadlines [PASTE]. My single most important goal right now is [GOAL]. Produce a focused plan: (1) the top 3 priorities for today — the things that actually move my goal — with a one-line why for each; (2) a realistic time-blocked schedule around my meetings, protecting focus time for the priorities; (3) a short 'if I only do one thing' pick; (4) what to defer, delegate, or drop, said plainly. Be ruthless — don't just reformat my to-do list into a longer to-do list. If I've over-committed for the hours available, tell me and cut. Keep it under 200 words.",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["productivity", "planning", "focus"],
  },
  {
    name: "Inbox Triage Assistant",
    slug: "inbox-triage-assistant",
    category: "personal-productivity",
    description:
      "Sorts a backlog of messages into act-now, delegate, quick-reply, and archive — with quick replies drafted for you.",
    bestFor: "People buried in email who need to clear the backlog without missing what matters.",
    repeatedWork: "Re-reading every message to decide what needs a reply and what can wait.",
    inputs: [
      "The messages you're behind on — sender, subject, gist",
      "Who you can delegate to",
      "Your reply tone",
    ],
    processSteps: [
      "Sort messages into urgent, delegate, quick-reply, read-later, and archive",
      "Order urgent items by real consequence, not loudness",
      "Draft short replies for the quick-win messages",
      "Flag anything time-sensitive or missing context",
    ],
    outputs: ["Triaged inbox by category", "Drafted quick replies ready to send"],
    exampleUseCase:
      "Back from a conference, a BD lead pastes 30 unread threads. The assistant flags a partner's contract question as act-now, drafts three two-line replies, and routes a vendor invoice to finance.",
    starterPrompt:
      "Triage my inbox. Here are the emails/messages I'm behind on — sender, subject, and the gist of each: [PASTE]. Sort them into: (1) Urgent + needs me — reply or act today, with the specific action for each; (2) Delegate — who it should go to and a one-line handoff; (3) Quick replies — ones I can clear in under 2 minutes, with a suggested short response drafted for each; (4) Read later / FYI; (5) Archive/ignore. For the urgent items, order them by real consequence, not loudness. Draft the quick replies in a [warm but efficient] tone so I can send them fast. Flag anything that looks time-sensitive or where I might be missing context as [CHECK].",
    difficulty: "starter",
    riskLevel: "medium",
    tags: ["productivity", "email", "triage"],
  },
  {
    name: "Meeting Notes to Action Items",
    slug: "meeting-notes-to-action-items",
    category: "personal-productivity",
    description:
      "Converts raw meeting notes or a transcript into a clean owner-and-deadline action list ready to paste into a tracker.",
    bestFor: "Anyone who leaves meetings with a wall of notes and no clear next steps.",
    repeatedWork: "Re-reading notes after every meeting to manually extract who owns what by when.",
    inputs: [
      "Raw meeting notes or transcript",
      "List of attendees (optional)",
      "Your task tracker's format (optional)",
    ],
    processSteps: [
      "Summarize what was decided in 2-3 bullets",
      "Extract action items with owner and deadline from context",
      "Separate unresolved questions from decisions",
      "Mark unclear owners or dates rather than guessing",
    ],
    outputs: ["Action item table with owner and deadline", "Open questions and your own commitments"],
    exampleUseCase:
      "After a season-launch planning meeting, a producer pastes a messy transcript. The tool returns a decisions recap, an action table with owners, and their own commitment to deliver the promo cut flagged separately.",
    starterPrompt:
      "Turn my raw meeting notes into a clean action list. Notes or transcript: [PASTE]. Attendees (optional): [LIST]. Extract: (1) a short summary of what was decided (2-3 bullets); (2) an action-item table — task, owner, due date — pulling the implied owner and deadline from context; (3) open questions or decisions that were left unresolved; (4) anything I personally committed to, called out separately so I don't miss it. Where an owner or date is unclear, mark it [UNASSIGNED] or [NO DATE] rather than guessing — I'd rather chase it than assume wrong. Keep decisions and actions separate from general discussion, and give me the action table in a format I can paste straight into my task tracker.",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["productivity", "meetings", "follow-up"],
  },
  {
    name: "Travel/Conference Prep Brief",
    slug: "travel-conference-prep-brief",
    category: "personal-productivity",
    description:
      "Builds a day-by-day trip brief with your schedule, who to meet, logistics, and your top goals — all on one page.",
    bestFor: "Anyone heading to a conference or work trip who wants to arrive prepared, not scrambling.",
    repeatedWork: "Reassembling your agenda, meeting list, and packing checklist before every trip.",
    inputs: [
      "The conference or destination and dates",
      "Your agenda and confirmed meetings",
      "People to meet and your goals for the trip",
    ],
    processSteps: [
      "Build a day-by-day schedule with meetings, sessions, and buffers",
      "Prioritize people to meet with a reason and an opener each",
      "Assemble a logistics and prep checklist",
      "Name your top 3 goals and the single most important outcome",
    ],
    outputs: ["One-page trip prep brief", "Prioritized people-to-meet list with openers"],
    exampleUseCase:
      "Before the FSGA Summer Conference in Nashville, an exec gets a day-by-day plan that spaces out partner meetings, flags a scheduling clash between two sessions, and lists three must-meet contacts with openers.",
    starterPrompt:
      "Build me a prep brief for an upcoming trip to [CONFERENCE/CITY, e.g. the FSGA Summer Conference in Nashville] on [DATES]. Here's what I have: my agenda and confirmed meetings [PASTE], people I want to connect with [LIST], and my goals for the trip [DESCRIBE]. Produce: (1) a day-by-day schedule with my meetings, key sessions, and buffer/travel time; (2) a prioritized list of people to meet, each with a one-line reason and a suggested opener; (3) a logistics checklist — what to pack/bring, confirmations to make, things to prep in advance; (4) my top 3 goals for the trip and the single most important outcome. Flag any scheduling conflicts you spot in my agenda. Keep it to one page I can pull up on my phone.",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["productivity", "travel", "networking"],
  },
  {
    name: "Relationship Follow-Up Reminder",
    slug: "relationship-follow-up-reminder",
    category: "personal-productivity",
    description:
      "Turns a contact list into a prioritized reconnect plan with a genuine reason and opener for each person.",
    bestFor: "Relationship-driven professionals who let important contacts go cold.",
    repeatedWork: "Trying to remember who you haven't talked to in a while and why you should reach out.",
    inputs: [
      "Contacts with last-touch date and context",
      "How important each relationship is",
      "Any recent news about them",
    ],
    processSteps: [
      "Rank overdue contacts by importance and time since last touch",
      "Give each a specific, non-generic reason to reconnect now",
      "Draft a one-line opener for each",
      "Group into this week / this month / this quarter",
    ],
    outputs: ["Prioritized reconnect list with reasons and openers", "A suggested ongoing cadence per contact"],
    exampleUseCase:
      "A partnerships lead pastes 15 key contacts with last-touch dates. The tool surfaces a league exec they haven't spoken to in five months, suggests referencing the league's new streaming deal, and drafts the opener.",
    starterPrompt:
      "Help me stay on top of my professional relationships. Here's a list of important contacts and when I last connected with each, plus any context: [PASTE — name, company, last touch, notes]. Produce a follow-up plan: (1) who I'm overdue to reach out to, ranked by relationship importance and time since last contact; (2) for each, a specific, non-generic reason to reconnect now — their news, a shared interest, a relevant intro, or a genuine check-in; (3) a one-line opener I could actually send; (4) a suggested cadence for keeping each relationship warm going forward. Prioritize genuine value over transactional 'just checking in' spam. Group them into this week / this month / this quarter so it feels doable, not overwhelming.",
    difficulty: "starter",
    riskLevel: "medium",
    tags: ["productivity", "networking", "follow-up"],
  },
  {
    name: "Reading/Research Summarizer",
    slug: "reading-research-summarizer",
    category: "personal-productivity",
    description:
      "Distills an article, report, or transcript into a TL;DR, key points, and the takeaways that matter for your angle.",
    bestFor: "Busy readers who need the value of long material without reading all of it.",
    repeatedWork: "Slogging through long reports to extract the few points that actually matter to you.",
    inputs: [
      "The source — article, report, transcript, or notes",
      "Your angle — what you're trying to learn",
      "How long a summary you want",
    ],
    processSteps: [
      "Write a 3-sentence TL;DR",
      "Pull the 5-7 key points, one line each",
      "Highlight the takeaways most relevant to your angle",
      "Flag weak or unsupported claims and give 'so what for me'",
    ],
    outputs: ["Structured summary with TL;DR and key points", "Angle-specific implications and actions"],
    exampleUseCase:
      "A sportsbook strategist drops a 30-page market report and their retention angle. The summarizer returns a TL;DR, the seven key findings, and two implications for their loyalty program, flagging one shaky growth claim.",
    starterPrompt:
      "Summarize this so I get the value without reading all of it. Source (article, report, transcript, or notes): [PASTE OR DESCRIBE]. Why I care / what I'm trying to learn: [YOUR ANGLE, e.g. 'implications for our sportsbook's retention strategy']. Produce: (1) a 3-sentence TL;DR; (2) the 5-7 key points, each in one line; (3) the 2-3 most important or surprising takeaways for my specific angle; (4) any claims that seem weak, unsupported, or worth double-checking; (5) 'so what for me' — concrete implications or actions. Stay faithful to the source — don't add facts it doesn't contain — and if it's thin or one-sided, say so. Keep the whole summary under 250 words and lead with what matters most to me.",
    difficulty: "starter",
    riskLevel: "low",
    tags: ["productivity", "research", "summary"],
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
