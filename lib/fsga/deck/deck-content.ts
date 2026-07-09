// FSGA workshop — deck content: 4-act, 15-slide copy + speaker notes.
// Outline source: scratchpad-fsga-outline-3.md (2026-07-09 revision).
//
// Data-only module: no React, no side effects. Slide layouts are built
// against these exact ids and kinds in slides.tsx. Projected copy
// (title/big/body/bullets/visual) is terse and confident; `notes` is what
// JL SAYS out loud — a skimmable cue card (notes render in a ~180px
// presenter strip), not prepared remarks. The QR code + URL render from
// code/config, not from copy here.
//
// Flow: act 1 makes the concept click (metaphor → definition → prompt
// contrast), act 2 spots the opportunity (pattern → hidden decisions →
// repeat test), act 3 makes it real with Joe Bryant's newsletter, act 4
// makes it theirs (packs → checklist → calculator → name it).

export type SlideKind =
  | "title"
  | "matrix"
  | "folder"
  | "compare"
  | "pattern"
  | "decisions"
  | "test"
  | "person"
  | "ingredients"
  | "teardown"
  | "qr"
  | "framework"
  | "scorecard"
  | "sentence"
  | "close";

export interface SlideContent {
  id: string; // kebab-case, unique
  act: 1 | 2 | 3 | 4;
  kind: SlideKind;
  eyebrow?: string; // small label above title, e.g. "act one · definition"
  title: string; // the big line (headline / kicker); also the presenter-strip label
  body?: string; // supporting sentence(s), max ~2
  bullets?: string[]; // list/grid/compare content; some kinds parse "key: text"
  big?: string; // single oversized statement
  visual?: string; // kind-specific visual copy (person tagline, teardown footnote, close footer)
  notes: string; // speaker notes: what JL SAYS. 3–6 sentences, first person, include any timing/pacing cue
}

export const DECK_TITLE = "Your First AI Skill";

export const DECK_SLIDES: SlideContent[] = [
  // ── Act 1 — make the concept click ───────────────────────────────────────
  {
    id: "title",
    act: 1,
    kind: "title",
    eyebrow: "FSGA Conference · Live Workshop",
    title: "Your First AI Skill",
    body: "We're going to find one repeated task from your real work and turn it into the start of a reusable AI Skill.",
    notes:
      "Hey everyone — I'm JL, Creator CTO. Three quick hands before we start: raise your hand if you've never heard the phrase AI Skill before. Raise it if you've heard the phrase but haven't built one. Raise it if you're already using something like Skills, custom GPTs, Claude Skills, Cursor rules, or reusable AI workflows. [Toss the football to someone after the room read; get one answer out loud.] Perfect — we'll build the idea from the ground up. Before we look for opportunities in your work, let's make the concept clear.",
  },
  {
    id: "load-the-skill",
    act: 1,
    kind: "matrix",
    eyebrow: "act one · the metaphor",
    title: "Load the Skill",
    body: "What if the right capability was ready when the task showed up?",
    notes:
      "This clip gives us the mental model. [Click play — 36 seconds, audio up. Let 'Tank, I need a pilot program' land, cut after the takeoff if pressed.] A task shows up. The right capability gets loaded. That's the idea we're borrowing — in real work, an AI Skill is reusable task expertise packaged for the next time the work shows up. [Click somewhere off the video before using arrow keys.] Now let's bring that back to actual business work.",
  },
  {
    id: "skill-definition",
    act: 1,
    kind: "folder",
    eyebrow: "act one · definition",
    title: "What an AI Skill is",
    big: "An AI Skill is reusable task expertise for a specific kind of work.",
    body: "It packages the workflow, context, examples, files, and standards an AI assistant needs to help with that task again.",
    bullets: ["workflow", "context", "examples", "standards", "files", "output format"],
    notes:
      "Here's the definition, and the important word is reusable. A Skill helps the AI start with more context next time instead of from zero. And this is provider-neutral — the pattern applies across tools, even if each platform implements it differently: ChatGPT, Claude, Claude Code, Cursor, or your own internal tooling. The easiest comparison is a prompt.",
  },
  {
    id: "prompt-vs-skill",
    act: 1,
    kind: "compare",
    eyebrow: "act one · distinction",
    title: "A prompt asks once. A Skill teaches the work.",
    bullets: [
      "Prompt: Written in the moment",
      "Prompt: Lives inside one conversation",
      "Prompt: Useful for quick help",
      "Prompt: You provide the context again next time",
      "Skill: Created once and reused",
      "Skill: Carries task instructions",
      "Skill: Can include examples, files, standards, and workflow steps",
      "Skill: Helps the AI handle a familiar kind of task",
    ],
    body: "When the same task keeps coming back, the guidance should come back with it.",
    notes:
      "To be clear, prompts are still useful — a prompt is what you write in the moment. [Walk the two columns.] A Skill is where you put the repeatable parts: steps, rules, examples, format, judgment. If you keep explaining the same task, that is a signal. So where do good Skills come from?",
  },

  // ── Act 2 — spot the opportunity ─────────────────────────────────────────
  {
    id: "same-shape",
    act: 2,
    kind: "pattern",
    eyebrow: "act two · the pattern",
    title: "Same shape. New details.",
    // "group: label" — situation cards flow through one shared pipeline into
    // outputs. Situation icons resolve by label in slides.tsx.
    bullets: [
      "situation: Live show prep",
      "situation: New hire",
      "situation: Investor update",
      "situation: Customer recap",
      "step: Gather context",
      "step: Apply judgment",
      "step: Create the useful thing",
      "output: Run of show",
      "output: Interview brief",
      "output: Update memo",
      "output: Recap email",
    ],
    body: "Different situation. Same shape underneath.",
    notes:
      "A good Skill usually starts with a repeat. The surface changes: one day it's show prep, another day a candidate, another day an investor update. [Trace the flow top to bottom.] Underneath there's often a familiar pattern — gather context, apply judgment, create the useful thing. And the repeated part is usually deeper than the thing you produce.",
  },
  {
    id: "before-the-draft",
    act: 2,
    kind: "decisions",
    eyebrow: "act two · the hidden work",
    title: "Before the draft, there are decisions.",
    bullets: [
      "Who is this for?",
      "What matters most?",
      "What tone should it have?",
      "What examples should it follow?",
      "What format should it use?",
      "What should happen next?",
    ],
    body: "The draft is the output. The decisions are the repeatable part.",
    notes:
      "Before the draft exists, you make decisions. Who is this for? What matters most? What tone, what examples, what format, what should happen next? [Walk the checklist into the draft.] If you make the same decisions every time, those decisions belong in the Skill. So how do we spot a good opportunity?",
  },
  {
    id: "repeat-test",
    act: 2,
    kind: "test",
    eyebrow: "act two · spot the opportunity",
    title: "The Repeat Test",
    // "q: question | option · option · …" — three big question cards.
    bullets: [
      "q: How often does it come back? | Daily · Weekly · Monthly · Quarterly · Yearly",
      "q: What do you keep reloading? | Audience · context · standards · examples · tone · rules · decision criteria",
      "q: What useful thing comes out? | Email · brief · recap · deck · checklist · questions · recommendation · first draft",
    ],
    body: "If it repeats, reloads judgment, and produces something useful, it may be a Skill.",
    notes:
      "Here's the quick version of the calculator. First: how often does this task come back? Daily and weekly are especially interesting because the cost compounds. Second: what do you keep reloading each time — audience, context, standards, examples, tone, rules, decision criteria? Third: what useful thing comes out the other side? If you can answer all three, you probably have a Skill candidate. Raise your hand if you already have a task in mind. [Toss the football: what's the task?] Now let's take one real person in the room and walk through what this looks like.",
  },

  // ── Act 3 — make it real with Joe ────────────────────────────────────────
  {
    id: "joe-example",
    act: 3,
    kind: "person",
    eyebrow: "act three · real example",
    title: "Joe writes a newsletter his audience knows.",
    body: "Every edition is new, but the work has a familiar shape: choose the angle, match the voice, serve the audience, and package the message.",
    // photo lives in public/fsga/ so the offline/static deck serves it
    // from the same origin, like the Matrix clip.
    bullets: [
      "name: Joe Bryant",
      "org: Footballguys",
      "role: Audience newsletter",
      "photo: /fsga/joe-bryant.jpg",
    ],
    visual: "New topic. Familiar voice. Repeatable format.",
    notes:
      "I want to use an actual example from someone in the room. Joe Bryant writes a fantasy football newsletter for the Footballguys audience. The topic changes every edition — but the audience, the voice, the format, the standards, what a good edition feels like should stay consistent. That makes this a strong Skill example. So instead of saying 'write a newsletter,' we can be much more specific about what the Skill needs.",
  },
  {
    id: "skill-ingredients",
    act: 3,
    kind: "ingredients",
    eyebrow: "act three · what goes inside",
    title: "What the Skill needs to know",
    // "Bucket: item · item · …" — five ingredient buckets, numbered in order.
    bullets: [
      "Format: subject line · opening · sections · CTA · sign-off",
      "Voice: Joe's tone · Footballguys brand voice · how direct, casual, or analytical it should feel",
      "Audience: fantasy football players · what they care about · what they already know · what they need help deciding",
      "Fresh input: this week's topic · notes · player takes · links · sponsor or product mention",
      "Past examples: previous editions · strong intros · subject lines · recurring sections · what “good” looks like",
    ],
    body: "The Skill is not just the task. It is the standards around the task.",
    notes:
      "This is where Skills get interesting — the task is not just 'write an email.' The Skill needs the format. It needs the voice. It needs to understand the audience. It needs the new topic for this edition. And past editions help refine what good sounds like — that's the difference between a generic AI draft and a useful first draft. Now we can map that into the basic Skill shape.",
  },
  {
    id: "joe-skill",
    act: 3,
    kind: "teardown",
    eyebrow: "act three · skill shape",
    title: "Joe's Newsletter Draft Skill",
    body: "The repeated work: turning weekly fantasy football ideas, updates, and takes into a newsletter that sounds like Joe and serves the Footballguys audience.",
    // Input → Process → Output pipeline; the Process column is the Skill.
    bullets: [
      "input: This week's topic",
      "input: Rough notes",
      "input: Player takes",
      "input: Links",
      "input: Sponsor or product mention",
      "input: Past editions",
      "process: Find the main point",
      "process: Choose the strongest angle",
      "process: Match Joe + Footballguys voice",
      "process: Use the familiar format",
      "process: Draft subject line options",
      "process: Write the first version",
      "process: Flag what Joe should personally review",
      "output: Newsletter draft",
      "output: Subject line options",
      "output: Preview text",
      "output: CTA",
      "output: Review notes",
    ],
    visual: "Joe reviews it. Joe makes the final call.",
    notes:
      "This is the full shape. [Walk the pipeline left to right.] The input changes every edition. The process is the reusable part — that's where the Skill lives. The output is specific to this week. The past editions matter because they teach the Skill what good looks like. Joe still owns the voice and the final call; the Skill helps create a better starting point. Your version may be live show prep, hiring, investor updates, content, customer recaps, or something else — so now let's make it personal.",
  },

  // ── Act 4 — make it theirs ───────────────────────────────────────────────
  {
    id: "qr-reveal",
    act: 4,
    kind: "qr",
    eyebrow: "act four · your pack",
    title: "We built one for you",
    body: "A starter pack based on your role and your likely repeated work.",
    bullets: ["Scan", "Find your name", "Open your Skill Pack"],
    notes:
      "I wanted this to be concrete, so before today we built starter packs for people in this room. Pull out your phone: scan, find your name, open your Skill Pack. [WAIT. Do not talk over it. Let the heads go down and come back up.] Your pack isn't meant to be perfect — it's meant to give you a first rep. Look for the repeated work that feels familiar. [Optional live beat: pull up one attendee's pack on screen and walk it briefly.] As you look at your pack, here's how to decide which Skill is worth starting with.",
  },
  {
    id: "good-first-skill",
    act: 4,
    kind: "framework",
    eyebrow: "act four · choosing well",
    title: "What makes a good first Skill?",
    bullets: [
      "You repeat it often",
      "It has a clear input",
      "You know what a good output looks like",
      "The steps can be explained",
      "It is useful before it is perfect",
    ],
    notes:
      "The first Skill should be real and easy to test. You're not looking for the biggest automation idea in the company — you're looking for something where a better first draft would help. [Count the checks on your fingers.] Raise your hand if you have a task you would not fully automate, but you would love a better first draft of. [Toss the football: what's the task?] Now let's score one.",
  },
  {
    id: "scorecard",
    act: 4,
    kind: "scorecard",
    eyebrow: "act four · first rep",
    title: "Should this become a Skill?",
    // Dimensions, answer copy, and verdict logic live in lib/fsga/scorecard.ts —
    // shared with the interactive calculator on the attendee pack page.
    notes:
      "This is the expanded version of the Repeat Test — pick one task and score it quickly. Daily is separate because daily work compounds fast. High judgment reload is the signal that a Skill can help; if the output is clear and a draft would help, it's probably worth testing. This same calculator is on your pack page — do yours on your phone while I run one up here. [Take the football volunteer's task and click it through live; let the meter climb and the verdict land. Give the room a real minute; don't rescue the silence.] Once you score it, give it a name.",
  },
  {
    id: "name-the-skill",
    act: 4,
    kind: "sentence",
    eyebrow: "act four · name it",
    title: "Name the Skill",
    big: "This Skill should help me turn [input] into [output] using [process, standards, examples].",
    bullets: [
      "Turn rough newsletter notes into a polished audience email using my voice, structure, and past examples.",
      "Turn meeting notes into follow-ups using our standard next-step format.",
      "Turn scattered updates into an investor recap using our usual tone, metrics, and priorities.",
      "Turn candidate notes into an interview prep brief using the role requirements and hiring criteria.",
    ],
    notes:
      "This sentence is not the whole Skill — it's the starting point. It should name the input, the output, and what standards, examples, or process the AI needs to use. [Read two of the examples slowly.] Before you leave, email yourself your pack and your worksheet — there's a button on your pack page. The goal is to leave with one thing you can try.",
  },
  {
    id: "thanks",
    act: 4,
    kind: "close",
    eyebrow: "thank you",
    title: "Thank you. Now go build one.",
    body: "Scan again if you missed it. Find your pack. I'll be around after.",
    visual: "Creator CTO · YouTube: @creator-cto",
    notes:
      "[Warm, unhurried.] Thanks, everybody. If you didn't grab your pack, the code's still up — scan it now. If you want help spotting your first Skill, come find me after; I'll help you sharpen it on the spot. [Smile. Hold the moment.] Go build one.",
  },
];
