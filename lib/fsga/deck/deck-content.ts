// FSGA workshop — deck content: 6-act slide copy + speaker notes.
//
// Data-only module: no React, no side effects. Task 6 builds slide layouts
// against these exact ids and kinds. Projected copy (title/big/body/bullets)
// is terse and confident; `notes` is what JL SAYS out loud — a skimmable cue
// card (notes render in a ~180px presenter strip), not prepared remarks.
// Skill references use real slugs from lib/fsga/skills/library.ts. The QR
// code + URL and the featured-pack cards render from code/data, not from
// copy here.

import { getSkillBySlug } from "../skills/library";

export type SlideKind =
  | "title"
  | "statement"
  | "list"
  | "grid"
  | "week"
  | "model"
  | "framework"
  | "qr"
  | "packs"
  | "teardown"
  | "exercise"
  | "sentence"
  | "close";

export interface SlideContent {
  id: string; // kebab-case, unique
  act: 1 | 2 | 3 | 4 | 5 | 6;
  kind: SlideKind;
  eyebrow?: string; // small label above title, e.g. "act one · the problem"
  title: string; // the big line (headline / kicker)
  body?: string; // supporting sentence(s), max ~2
  bullets?: string[]; // for list/framework/model slides, 3–6 items
  big?: string; // single oversized statement (statement/sentence slides)
  notes: string; // speaker notes: what JL SAYS. 3–6 sentences, first person, include any timing/pacing cue
}

export const DECK_TITLE = "Your First AI Skill";

// The Skill JL tears down live in act 4. Must exist in the library.
export const TEARDOWN_SKILL_SLUG = "sales-call-prep";

export const DECK_SLIDES: SlideContent[] = [
  // ── Act 1 — arrive → recognition ────────────────────────────────────────
  {
    id: "title",
    act: 1,
    kind: "title",
    eyebrow: "FSGA Conference · Live Workshop",
    title: "Your First AI Skill",
    body: "JL · Creator CTO. Not another tool list — you'll leave with one Skill built for your actual job.",
    notes:
      "Hey everyone, I'm JL, and I make videos about practical AI workflows as Creator CTO. Here's my promise up front: most AI talks leave you with a list of tools and a vague feeling you should be doing more. [Pause, scan the room.] This one leaves you with one Skill you can run on Monday, built around work you already do. So let me start with an uncomfortable question.",
  },
  {
    id: "pain-week",
    act: 1,
    kind: "statement",
    eyebrow: "act one · the problem",
    title: "The hidden tax",
    big: "The most expensive work you do is work you've already done.",
    body: "The recap rebuilt every month. The research redone before every call. The deck, again, for the fifth brand.",
    notes:
      "How much of your week is redoing work you've already done? [Let the question hang. Do not fill the silence.] I'm not talking about the hard, creative work. I mean the sponsorship recap you rebuild every month, the prospect research you redo before every call, the newsletter you reassemble from the same show notes. Be honest with yourself: what's your number, a quarter of your week, half? Keep that number in your head, because in 30 minutes we start giving some of it back.",
  },
  {
    id: "smart-people",
    act: 1,
    kind: "statement",
    eyebrow: "act one · the problem",
    title: "It's not a talent problem",
    big: "Smart people, doing the same manual work, over and over.",
    body: "The work isn't hard. It's just repetitive, and it never stops arriving.",
    notes:
      "The people in this room are sharp, and a huge chunk of your week still goes to work that doesn't need your brain, just your hours. [Slow down here.] That's not a talent problem; our industry runs in weekly cycles, so the repetition never lets up. I'm not saying the letters A-I yet. First I want you to feel how much of this you're carrying.",
  },

  // ── Act 2 — "he gets our work" ──────────────────────────────────────────
  {
    id: "your-work",
    act: 2,
    kind: "grid",
    eyebrow: "act two · your work",
    title: "You do at least one of these",
    // "iconKey: label" — icon keys resolve against TASK_ICONS in
    // components/fsga/deck/task-icons.tsx; unknown keys render label-only.
    bullets: [
      "followup: The follow-up pile",
      "recap: The weekly recap",
      "research: Research before every call",
      "deck: The deck rebuild",
      "formats: One thing → five formats",
      "schedule: The scheduling dance",
    ],
    notes:
      "I did my homework on this room, and every job here pays at least one of these taxes. [Walk the grid; name real examples someone told you at this event.] Sales and partnerships: that's prospect research before every first call, the deck rebuilt for the fifth brand this quarter, and the follow-up pile after an event exactly like this one, where warm leads go cold because you ran out of Tuesday. Content and media: one great podcast, then an afternoon hunting clips for TikTok, Reels, and Shorts, then the newsletter rebuilt from the same show notes. Raise a hand when you spot yours. [Wait for hands.] Keep it in mind — that one's your candidate for the rest of the hour.",
  },
  {
    id: "week-cost",
    act: 2,
    kind: "week",
    eyebrow: "act two · what it costs",
    title: "What it adds up to",
    body: "About a day and a half, every week, on work you've already done once.",
    notes:
      "Here's a typical week with that work shaded in. [Let the bars do the talking; don't read them.] If your week is anywhere near typical, that's about a day and a half, every week, going to work you've already done once. Remember the number from act one? This is where it hides — not one big block, a slice off every single day. None of this is your craft; it's the tax you pay to do your craft. Who's looking at this thinking 'mine's worse'? [Wait for hands, take the laugh.] Hold that feeling, because the rest of the hour is about taking it back.",
  },

  // ── Act 3 — learn ───────────────────────────────────────────────────────
  {
    id: "ai-vague",
    act: 3,
    kind: "statement",
    eyebrow: "act three · the idea",
    title: "Let's name the real gap",
    big: "AI is interesting. But it still feels vague.",
    body: "The gap isn't the tool. It's one-off prompts versus a reusable workflow.",
    notes:
      "Okay, now we can say it: AI. [Pause.] Most of you have poked at ChatGPT and it still feels vague, like everyone else got a memo you missed. Here's the truth: the gap isn't the tool, and it isn't your intelligence. Most people use AI as a one-off, so they start from scratch every single time. The people getting real leverage aren't smarter than you; they just stopped starting over.",
  },
  {
    id: "skill-definition",
    act: 3,
    kind: "statement",
    eyebrow: "act three · the idea",
    title: "This is the whole talk",
    big: "An AI Skill is a reusable workflow. Not a one-off prompt.",
    body: "A one-off prompt, you retype every time. A Skill you write once, then run forever.",
    notes:
      "If you take one sentence home, take this one. [Let it land. Don't rush off it.] A one-off prompt is you at 11pm re-explaining your whole situation from scratch, again. A Skill is that instruction written down once, so next week you just drop in new inputs and run it. It's your sponsorship recap: you don't redesign the deck every month, you fill in the new numbers. A Skill is that, for anything you repeat.",
  },
  {
    id: "skill-model",
    act: 3,
    kind: "model",
    eyebrow: "act three · the model",
    title: "Every Skill has the same shape",
    body: "If you can describe it to a new teammate, you can build it as a Skill.",
    bullets: [
      "Input: the raw material you paste in",
      "Process: the steps, spelled out once",
      "Output: the finished thing you needed",
    ],
    notes:
      "Every Skill has the same three-part shape: input, process, output. [Point to each as you say it.] Input is what you'd hand a new hire, like the show notes or the messy transcript. Process is what you'd tell them to do with it, the steps you already run in your head. Output is the finished thing, the clip list or the call plan. If you can explain a task to someone on their first day, you can build it as a Skill; you're describing your work, not learning to code.",
  },
  {
    id: "skill-spotting",
    act: 3,
    kind: "framework",
    eyebrow: "act three · the test",
    title: "How to spot a good first Skill",
    bullets: [
      "You repeat it often",
      "It's annoying enough to matter",
      "You can describe the steps",
      "It's low-risk enough to test",
      "Useful even when it's only 70% right",
    ],
    notes:
      "Five quick tests for your first Skill. [Count them on your fingers.] One, you do it often, weekly beats yearly. Two, it's annoying enough that automating it buys back real time. Three, you can describe the steps, because if you can't explain it, the AI can't either. Four, it's low-risk, an internal recap, not a legal filing. Five, it's still useful at seventy percent, because you're the editor, not the intern.",
  },

  // ── Act 4 — see ─────────────────────────────────────────────────────────
  {
    id: "qr-reveal",
    act: 4,
    kind: "qr",
    eyebrow: "act four · the proof",
    title: "We built one for you",
    body: "Scan the code. Find your name. That's your personalized Skill Pack.",
    notes:
      "[Slow way down. This is the moment.] Before today, we took the attendee list for this room and built a personalized AI Skill Pack for as many of you as we could. Pull out your phone and scan that code right now. [WAIT. Do not talk over it. Let the heads go down and come back up.] Find your name and take ten seconds with it. [Ride the first 'oh, that's me.'] That 'wait, this is for me' feeling is what a Skill does: it takes something generic and makes it yours.",
  },
  {
    id: "featured-packs",
    act: 4,
    kind: "packs",
    eyebrow: "act four · the proof",
    title: "People in this room",
    body: "Real roles, real first Skills. Yours works exactly the same way.",
    notes:
      "Here's a founder at a DFS operator, and her first Skill is a weekly decision brief, because her Fridays disappear into synthesis. [Point to the cards as you go.] Here's a partnerships lead at a media company, whose first Skill is prospect research before every call. These aren't random; each pack is matched to what that person actually does all week. The one on your phone was built the same way. Now let's open one all the way up.",
  },
  {
    id: "teardown",
    act: 4,
    kind: "teardown",
    eyebrow: "act four · inside a Skill",
    title: "One Skill, all the way through",
    body: "Sales Call Prep. Watch the Input, Process, Output shape show up for real.",
    notes:
      "This is Sales Call Prep, one of the most-picked Skills in the room, so let's tear it down. [Walk the card top to bottom.] The repeated work: improvising discovery questions and value points on every single call. The Input: the prospect, what you sell, and your notes so far. The Process: name the outcome you want, draft the discovery questions, phrase value as benefits, propose a clean next step. The Output: a one-page call plan you can glance at mid-call. The Result: you stop winging it, and every rep runs the same sharp play.",
  },

  // ── Act 5 — do ──────────────────────────────────────────────────────────
  {
    id: "exercise",
    act: 5,
    kind: "exercise",
    eyebrow: "act five · your turn",
    title: "Write down one task you do more than twice a month.",
    body: "Pen, phone, napkin. Whatever's closest. Just get one real task down.",
    notes:
      "Write down one task, on your phone or a napkin, that you do more than twice a month and are a little sick of. Not the perfect one, the first real one that popped into your head. [Give them a true 60 seconds. Do NOT rescue the silence at 15 seconds; that's exactly when they start thinking.] I'll wait right here. [At 60:] Got one? Hold onto it, because we're about to turn it into a sentence.",
  },
  {
    id: "sentence",
    act: 5,
    kind: "sentence",
    eyebrow: "act five · your turn",
    title: "Turn it into one sentence",
    big: "My first Skill should help me turn ___ into ___ so that ___.",
    body: "Fill it in for real at creatorcto.com/fsga/build-your-own.",
    notes:
      "Take that task and pour it into this sentence. [Read it slowly, then read it again.] For me it's: turn a podcast episode into ten clips, so that I stop losing my Thursday. The 'so that' is the part that matters; that's the time you're buying back. There's a form at slash build-your-own, on the page you scanned, that walks you through it. Fill it in before you leave and you've specced your first Skill.",
  },

  // ── Act 6 — leave ───────────────────────────────────────────────────────
  {
    id: "one-not-ten",
    act: 6,
    kind: "statement",
    eyebrow: "act six · where to start",
    title: "The only trap to avoid",
    big: "Choose one workflow. Not ten.",
    body: "Repeated, annoying, describable, low-risk, useful at 70%. Pick the one that passes cleanest.",
    notes:
      "One warning, because I've watched people faceplant right here. The mistake isn't starting too small; it's starting ten things at once and shipping none of them. [Get firm.] Run your candidate back through the five tests and pick whichever passes cleanest. Get one working and feel the hours come back. The next five get obvious on their own.",
  },
  {
    id: "save-pack",
    act: 6,
    kind: "statement",
    eyebrow: "act six · take it with you",
    title: "Don't let this evaporate",
    big: "Email yourself your pack and your worksheet.",
    body: "There's a button on your pack page. One tap and it's in your inbox for Monday.",
    notes:
      "On your pack page there's a button to email yourself the whole thing, your Skills and the worksheet you just filled in. [Hold up your phone and mime the tap.] Do it right now, while you're thinking about it. Monday-morning you will be grateful. The pack doesn't expire; it'll be waiting when you're ready to build.",
  },
  {
    id: "follow",
    act: 6,
    kind: "close",
    eyebrow: "act six · keep going",
    title: "Where to keep learning this",
    body: "I make this stuff every week as Creator CTO. YouTube: @creator-cto.",
    notes:
      "If today clicked, this is what I do all week. I'm Creator CTO on YouTube, at creator dash c-t-o, breaking down exactly these AI workflows for people who aren't engineers. [Point to the handle on screen.] If you only ever use the one Skill from today, I'll still call it a win. But the door's open if you want more.",
  },
  {
    id: "thanks",
    act: 6,
    kind: "close",
    eyebrow: "act six · thank you",
    title: "Thank you. Now go build one.",
    body: "Scan again if you missed it. Find your pack. I'll be right here after.",
    notes:
      "[Warm, unhurried.] Thank you for your attention; it's the scarcest thing in this room. If you didn't grab your pack, the code is still up, so scan it now. Come find me after, because I want to hear the task you wrote down, and I'll help you sharpen it into a Skill on the spot. [Smile. Hold the moment.] Go build one, just one. See you out there.",
  },
];

// Fail fast at import: the Skill JL tears down live must exist in the library.
// A typo here would blow up the act-4 teardown slide in front of the room.
if (!getSkillBySlug(TEARDOWN_SKILL_SLUG)) {
  throw new Error(
    `lib/fsga/deck/deck-content.ts: TEARDOWN_SKILL_SLUG "${TEARDOWN_SKILL_SLUG}" not found in skill library`,
  );
}
