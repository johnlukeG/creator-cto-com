// FSGA workshop — deck content: 4-act, 14-slide copy + speaker notes.
// Outline source: scratchpad-fsga-outline-2.md (2026-07-08 revision).
//
// Data-only module: no React, no side effects. Slide layouts are built
// against these exact ids and kinds in slides.tsx. Projected copy
// (title/big/body/bullets/visual) is terse and confident; `notes` is what
// JL SAYS out loud — a skimmable cue card (notes render in a ~180px
// presenter strip), not prepared remarks. Skill references use real slugs
// from lib/fsga/skills/library.ts. The QR code + URL render from
// code/config, not from copy here.

import { getSkillBySlug } from "../skills/library";

export type SlideKind =
  | "title"
  | "orbit"
  | "loading"
  | "grid"
  | "matrix"
  | "folder"
  | "compare"
  | "playbook"
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
  eyebrow?: string; // small label above title, e.g. "act one · repeated work"
  title: string; // the big line (headline / kicker); also the presenter-strip label
  body?: string; // supporting sentence(s), max ~2
  bullets?: string[]; // list/grid/compare/scorecard content; some kinds parse "key: text"
  big?: string; // single oversized statement
  visual?: string; // kind-specific visual copy (orbit centerpiece, close footer)
  notes: string; // speaker notes: what JL SAYS. 3–6 sentences, first person, include any timing/pacing cue
}

export const DECK_TITLE = "Your First AI Skill";

// The Skill JL tears down live in act 3. Must exist in the library.
export const TEARDOWN_SKILL_SLUG = "newsletter-draft-assistant";

export const DECK_SLIDES: SlideContent[] = [
  // ── Act 1 — start with their work ────────────────────────────────────────
  {
    id: "title",
    act: 1,
    kind: "title",
    eyebrow: "FSGA Conference · Live Workshop",
    title: "Your First AI Skill",
    body: "We're going to find one repeated task from your real work and turn it into the start of a reusable AI Skill.",
    notes:
      "Hey everyone — I'm JL, Creator CTO, and here's the whole session in one sentence: we find one repeated task from your real work and turn it into the start of a reusable AI Skill. Quick show of hands before we get going: how familiar are you with AI Skills — never heard of them, heard the term, or already using them? [Toss the football to someone; get one answer out loud.] Calibrate act two off the hands: mostly blank faces, slow down on the definition; hands on 'already using,' lean into the scorecard and the packs.",
  },
  {
    id: "coming-back",
    act: 1,
    kind: "orbit",
    eyebrow: "act one · repeated work",
    title: "The work that keeps coming back",
    big: "Some of your most valuable work keeps coming back in slightly different clothes.",
    body: "Different prospect. Different sponsor. Different employee. Different investor. Same kind of thinking.",
    visual: "Same thinking. New version.",
    bullets: [
      "sponsor call",
      "hiring process",
      "investor update",
      "board deck",
      "sales follow-up",
      "content plan",
      "partner research",
      "customer recap",
    ],
    notes:
      "I'm not only talking about busywork — a lot of your repeated work is high-judgment work. [Sweep the orbit labels.] The sponsor call, the hiring process, the investor update, the board deck: different prospect, different sponsor, different employee every time. The details change, but the shape of the thinking keeps coming back — the same work in slightly different clothes.",
  },
  {
    id: "context-reload",
    act: 1,
    kind: "loading",
    eyebrow: "act one · the hidden tax",
    title: "Where the waste actually is",
    big: "The waste isn't only doing it again. It's reloading the context again.",
    body: "The goal. The audience. The constraints. The tone. The standard. The next step.",
    bullets: ["Context", "Judgment", "Steps", "Standards", "Format"],
    notes:
      "Here's where the waste actually is. Before you produce the thing, you have to reload all the thinking around the thing: what is this for, who is it for, what does good look like, what should happen next. [Point at the loading rows.] That reload — context, judgment, steps, standards, format — is the tax, and you pay it every single time, even on work you're great at.",
  },
  {
    id: "spot-the-repeat",
    act: 1,
    kind: "grid",
    eyebrow: "act one · spot the repeat",
    title: "You probably repeat one of these",
    // "iconKey: label" — icon keys resolve against TASK_ICONS in
    // components/fsga/deck/task-icons.tsx; unknown keys render label-only.
    bullets: [
      "call: Prep for a sponsor or partnership call",
      "hire: Gather background on a prospective new hire",
      "meeting: Turn a meeting into next steps and follow-ups",
      "recap: Synthesize a recap for investors, employees, or customers",
      "formats: Convert one content idea into posts, clips, emails, and talking points",
      "review: Review a potential partner, vendor, or acquisition target",
      "industry: Summarize industry movement for leadership",
      "deck: Rebuild a sales, strategy, or board deck from scattered notes",
    ],
    notes:
      "Have a look at this board. Don't worry about picking the best one yet — just notice which one feels familiar. [Give them a beat to scan.] Which of these shows up in your work — or what would you add to this board? [Toss the football; take one or two answers out loud.] Hold onto yours; it's your raw material for the rest of the session.",
  },

  // ── Act 2 — name the concept ─────────────────────────────────────────────
  {
    id: "load-knowhow",
    act: 2,
    kind: "matrix",
    eyebrow: "act two · the metaphor",
    title: "Load the know-how",
    body: "In The Matrix, Trinity needs to fly a helicopter. The system loads the capability the moment she needs it.",
    notes:
      "You all know this scene: Trinity needs to fly a helicopter, and the system loads the capability the moment she needs it. [Pause on the visual.] Most of us get the idea immediately — a task shows up, you need a capability, the right know-how gets loaded. AI Skills are the grounded version of that. You're not downloading kung fu; you're packaging instructions, context, standards, and examples so the AI can reuse them. Now let's bring that back down to Monday-morning work.",
  },
  {
    id: "skill-definition",
    act: 2,
    kind: "folder",
    eyebrow: "act two · definition",
    title: "What an AI Skill is",
    big: "An AI Skill is reusable know-how for a specific kind of task.",
    body: "It packages what an AI assistant needs to help with that task again.",
    bullets: ["workflow", "context", "examples", "standards", "files", "output format"],
    notes:
      "Here's the definition, and the important word is reusable. A Skill packages the workflow, the context, the examples, the files, and the standards an AI assistant needs to help with one kind of task — so it starts with more context next time instead of from zero. And this is provider-neutral: the pattern applies in ChatGPT, Claude, Claude Code, Cursor, or your own internal tooling, even if each platform implements it a little differently.",
  },
  {
    id: "prompt-vs-skill",
    act: 2,
    kind: "compare",
    eyebrow: "act two · distinction",
    title: "A prompt asks once. A Skill teaches the work.",
    body: "When the same task keeps coming back, the guidance should come back with it.",
    bullets: [
      "Prompt: Written in the moment",
      "Prompt: Lives inside one conversation",
      "Prompt: Good for quick, one-off help",
      "Prompt: You provide the context again next time",
      "Skill: Created once and reused",
      "Skill: Carries the task instructions",
      "Skill: Includes examples, files, standards, and workflow steps",
      "Skill: Helps the AI behave like a specialist for that task",
    ],
    notes:
      "To be clear, prompts are still useful — the question is how many times you want to explain the same work. [Walk the two columns.] A prompt is written in the moment and lives inside one conversation; next time, you provide all the context again. A Skill is created once and carries the instructions, examples, standards, and workflow steps with it. Simple rule: if the task is a one-off, prompt it. If it keeps coming back, skill it.",
  },

  // ── Act 3 — show the shape ───────────────────────────────────────────────
  {
    id: "playbook",
    act: 3,
    kind: "playbook",
    eyebrow: "act three · the model",
    title: "Same playbook. New situation.",
    body: "A Skill helps the AI handle a familiar kind of work with new information each time.",
    bullets: [
      "Input: What changed this time?",
      "Process: What the AI knows how to do",
      "Output: What it should produce",
    ],
    notes:
      "This room knows playbooks, so here's the model. [Point at the football row.] Same playbook — new down, distance, defense, and field position — different result. Skills work exactly like that: same Skill, new notes, audience, goal, and context — different finished output. The input changes every time, the process stays reusable, and the output is specific to this situation. The Skill isn't the final answer; it's the reusable know-how that produces the next answer.",
  },
  {
    id: "teardown",
    act: 3,
    kind: "teardown",
    eyebrow: "act three · example",
    title: "One Skill, all the way through",
    body: "The Newsletter Draft Assistant — the Input, Process, Output shape, filled in for real.",
    notes:
      "Let's open one all the way up: the Newsletter Draft Assistant. [Walk the pipeline left to right.] The repeated work: turning scattered links, notes, and takes into a clear email for your audience. The Input: your raw ingredients, your format, your voice. The Process: find the angle, match the voice, structure the draft, flag what still needs human judgment. The Output: a sendable draft with subject lines and review notes. This is not handing your voice to AI — the Skill gives the AI your standards before it starts writing, and you still make the final call. It just gets you a much stronger first draft.",
  },

  // ── Act 4 — make it theirs ───────────────────────────────────────────────
  {
    id: "qr-reveal",
    act: 4,
    kind: "qr",
    eyebrow: "act four · your pack",
    title: "We built one for you",
    body: "Scan the code. Find your name. You'll see a starter pack based on your role and likely repeated work.",
    bullets: ["Scan", "Find your name", "Open your Skill Pack"],
    notes:
      "I wanted this to be concrete, so before today we built starter packs for people in this room. Pull out your phone: scan, find your name, open your Skill Pack. [WAIT. Do not talk over it. Let the heads go down and come back up.] Your pack isn't meant to be perfect — it's meant to give you a first rep, matched to your role and the work you probably repeat. [Optional live beat: pull up one attendee's pack on screen and walk it briefly.]",
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
      "It's useful even before it's perfect",
    ],
    notes:
      "So which task should you pick? The first Skill should be boring in the best way: something real, repeated, and easy to test. [Count the checks on your fingers.] You repeat it often, it has a clear input, you know what good output looks like, you can explain the steps, and it's useful before it's perfect. Here's a question for the room: what's a task you would never fully automate, but would love a better first draft of? [Toss the football; take an answer.]",
  },
  {
    id: "scorecard",
    act: 4,
    kind: "scorecard",
    eyebrow: "act four · first rep",
    title: "Should this become a Skill?",
    body: "High on frequency, context reload, and reusable judgment? Good Skill candidate.",
    bullets: [
      "Frequency: How often does this task come back?",
      "Context reload: How much do you have to remember or re-explain?",
      "Clear input: Can you name the raw material that starts it?",
      "Clear output: Would you recognize a useful finished version?",
      "Reusable judgment: Are there standards, examples, or rules you apply each time?",
      "Low-risk first draft: Is a better first draft useful even with human review?",
    ],
    notes:
      "Now do this for real: pick one repeated task from your work and score it, one to five, on each of these six. Don't overthink it. [Give them a real minute; don't rescue the silence.] If it scores high on frequency, context reload, and reusable judgment, it's probably a good Skill candidate. The best first Skill is usually not the flashiest one — it's the task where you keep reloading the same context and standards.",
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
      "Last step: name it. One sentence — turn this input into that output, using your standards, your examples, your process. [Read two of the examples slowly.] Keep the first version simple: if the sentence tells you the input, the output, and the standards the AI needs, you've specced your first Skill. Before you leave, email yourself your pack and your worksheet — there's a button on your pack page. The goal is to leave with one thing you can try.",
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

// Fail fast at import: the Skill JL tears down live must exist in the library.
// A typo here would blow up the act-3 teardown slide in front of the room.
if (!getSkillBySlug(TEARDOWN_SKILL_SLUG)) {
  throw new Error(
    `lib/fsga/deck/deck-content.ts: TEARDOWN_SKILL_SLUG "${TEARDOWN_SKILL_SLUG}" not found in skill library`,
  );
}
