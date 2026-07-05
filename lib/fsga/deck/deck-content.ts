// FSGA workshop — deck content: 6-act slide copy + speaker notes.
//
// Data-only module: no React, no side effects. Task 6 builds slide layouts
// against these exact ids and kinds. Projected copy (title/big/body/bullets)
// is terse and confident; `notes` is what JL SAYS out loud, written like a
// coach with pacing cues. Skill references use real slugs from
// lib/fsga/skills/library.ts. The QR code + URL and the featured-pack cards
// render from code/data, not from copy here.

import { getSkillBySlug } from "../skills/library";

export type SlideKind =
  | "title"
  | "statement"
  | "list"
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
  notes: string; // speaker notes: what JL SAYS. first person, with pacing cues
}

export const DECK_TITLE = "FSGA AI Skills Workshop";

// The Skill JL tears down live in act 4. Must exist in the library.
export const TEARDOWN_SKILL_SLUG = "sales-call-prep";

export const DECK_SLIDES: SlideContent[] = [
  // ── Act 1 — arrive → recognition ────────────────────────────────────────
  {
    id: "title",
    act: 1,
    kind: "title",
    eyebrow: "FSGA Conference · Live Workshop",
    title: "FSGA AI Skills Workshop",
    body: "JL · Creator CTO. You'll leave with one AI Skill built for your actual job.",
    notes:
      "Hey everyone, I'm JL. I make videos about practical AI workflows as Creator CTO, and I want to promise you something up front. [Pause, scan the room.] Most AI talks leave you with a list of tools and a vague feeling you should be doing more. This one leaves you with one thing you can run on Monday, built around work you already do. Give me 30 minutes and let's build it together. So let me start with an uncomfortable question.",
  },
  {
    id: "pain-week",
    act: 1,
    kind: "statement",
    eyebrow: "act one · the problem",
    title: "The honest question",
    big: "How much of your week is redoing work you've already done?",
    body: "Not new work. The same recap, the same email, the same deck, rebuilt from scratch.",
    notes:
      "Sit with this one for a second. [Let the question hang. Do not fill the silence.] I'm not talking about the hard, creative, why-you-got-into-this work. I'm talking about the sponsorship recap you rebuild every month, the prospect research you redo before every call, the newsletter you reassemble from the same show notes. Be honest with yourself right now: what's your number? A quarter of your week? Half? Keep that number in your head, because in 30 minutes we're going to give some of it back.",
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
      "Here's what gets me about this. The people in this room are sharp. You run partnerships, you build products, you grow audiences. And a huge chunk of your week goes to work that doesn't need your brain, it just needs your hours. [Slow down here.] That's not a you problem, every industry has it. But our industry runs in weekly cycles, game weeks, slates, launches, so the repetition never lets up. I'm not going to say the letters A-I yet. First I just want you to feel how much of this you're carrying.",
  },

  // ── Act 2 — "he gets our work" ──────────────────────────────────────────
  {
    id: "your-work-sales",
    act: 2,
    kind: "list",
    eyebrow: "act two · your work",
    title: "If you're in sales or partnerships",
    bullets: [
      "Prospect research before every partnerships meeting",
      "Sponsor fit and activation ideas, deal by deal",
      "Rebuilding the sponsorship deck for each brand",
      "Post-conference follow-ups, forty cards deep",
      "The weekly pipeline summary leadership keeps asking for",
    ],
    notes:
      "Now let's make it specific, because I did my homework on this room. If you sell or run partnerships, your repeated work looks like this. [Gesture down the list.] The prospect research before every first call. Scoring whether a sponsor actually fits your property. Rebuilding that deck for the fifth brand this quarter. And the follow-up pile after an event exactly like this one, where warm leads go cold because you ran out of Tuesday. [Look at someone you met earlier.] Raise a hand if the follow-up pile just hit a nerve. Yeah. Hold that thought.",
  },
  {
    id: "your-work-content",
    act: 2,
    kind: "list",
    eyebrow: "act two · your work",
    title: "If you're in content or media",
    bullets: [
      "Turning one podcast into a week of clips",
      "The newsletter, rebuilt from the same show notes",
      "Weekly reporting nobody enjoys assembling",
      "Scheduling interviews and screening for the next hire",
      "Meeting follow-ups that slip three days late",
    ],
    notes:
      "Same deal on the content and media side. You record one great podcast, then you burn the afternoon hunting for clip moments to feed TikTok, Reels, and Shorts. You write the newsletter from the same show notes you just used. You pull the weekly numbers nobody enjoys pulling. [Beat.] And if you're hiring, stack screening resumes and scheduling interviews on top of all of it. Ask the room straight: who here has an episode from last week that still isn't clipped? [Wait for the laugh, and the raised hands.] None of this is your craft. It's the tax you pay to do your craft. So what if you didn't have to?",
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
      "Okay. Now we can say it. AI. [Pause.] And I'd bet a lot of you feel the same way about it: clearly interesting, you've poked at ChatGPT, but it still feels vague. Like everyone else got a memo you missed. Here's what I want you to hear. The gap isn't the tool, and it definitely isn't your intelligence. The gap is that most people use AI as a one-off, they type a question, get an answer, and start from scratch tomorrow. The people getting real leverage aren't smarter than you. They just stopped starting over.",
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
      "If you take one sentence home, take this one. An AI Skill is a reusable workflow, not a one-off prompt. [Let it land. Don't rush off it.] Here's the difference in plain terms. A one-off prompt is you, at 11pm, re-explaining your whole situation to the AI from scratch, again. A Skill is that same instruction written down once, so next week you just drop in this week's inputs and it runs. Think of it like your sponsorship recap: you don't redesign the deck every month, you fill in the new numbers. A Skill is that, for anything you repeat.",
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
      "Every single Skill, no matter how fancy it sounds, has the same three-part shape. Input, process, output. [Point to each as you say it.] Input is the raw stuff you'd hand a new hire: the show notes, the pipeline, the messy transcript. Process is what you'd tell them to do with it, the steps you already run in your head. Output is the finished thing, the clip list, the follow-up email, the brief. Here's the freeing part: if you can explain a task to someone on their first day, you already have everything you need to build it. You're not learning to code. You're learning to describe your own work clearly.",
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
      "So how do you pick the right first one? Five quick tests. [Count them on your fingers.] One, you do it often, weekly beats yearly. Two, it's annoying enough that automating it buys back real time. Three, you can describe the steps, because if you can't explain it, the AI can't either. Four, it's low-risk, so a rough draft won't get you fired, an internal recap, not a legal filing. And five, my favorite, it's still useful at seventy percent, because you're the editor, not the intern. Anything that passes all five is a great place to start.",
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
      "Now I want to prove this isn't hypothetical. [Slow way down. This is the moment.] Before today, we took the attendee list for this room and built a personalized AI Skill Pack for as many of you as we could. Your name, your role, your first Skills to try. So go ahead, pull out your phone and scan that code right now. [WAIT. Do not talk over it. Let the room scan. Watch the heads go down, then start coming back up.] Find your name. Take ten seconds with it. [Wait for the first 'oh, that's me,' then ride the energy.] That feeling right there, the 'wait, this is for me' feeling? That's what a Skill does. It takes something generic and makes it yours.",
  },
  {
    id: "featured-packs",
    act: 4,
    kind: "packs",
    eyebrow: "act four · the proof",
    title: "People in this room",
    body: "Real roles, real first Skills. Yours works exactly the same way.",
    notes:
      "Let's look at a few of these together, up on the screen. [Point to the first card.] Here's a founder at a DFS operator, and her first Skill is a weekly decision brief, because her Fridays disappear into synthesis. Here's a partnerships lead at a media company, first Skill is prospect research before every call. [Gesture across the cards.] Notice these aren't random. Each pack is matched to what that person actually does all week. The one on your phone was built the same way. Now let's open one all the way up and see what's really inside.",
  },
  {
    id: "teardown",
    act: 4,
    kind: "teardown",
    eyebrow: "act four · inside a Skill",
    title: "One Skill, all the way through",
    body: "Sales Call Prep. Watch the Input, Process, Output shape show up for real.",
    notes:
      "Let's tear one down end to end so you see there's no magic here. This is Sales Call Prep, one of the most-picked Skills in the room. [Walk the card top to bottom.] Start with the repeated work: improvising your discovery questions and value points on every single call. The Input is the prospect, what you sell, and your notes so far. The Process is the steps, name the one outcome you want, draft the discovery questions, phrase your value as benefits, propose a clean next step. The Output is a one-page call plan you can glance at mid-call. The Result: you stop winging it, and every rep runs the same sharp play. That's the whole thing. Repeated work, in, steps, out.",
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
      "Your turn, and this is the part that actually changes your Monday. [Ask it, then get out of the way.] Write down one task, on your phone or a napkin, that you do more than twice a month and are a little sick of. Not the perfect one. The first real one that popped into your head when I said that. [Give them a true 60 seconds. Actually count it. Do NOT rescue the silence at 15 seconds, that's exactly when they start thinking.] I'll wait right here. [At 60 seconds:] Got one? Good. Hold onto it, we're about to turn it into a sentence.",
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
      "Now take that task and pour it into this sentence. My first Skill should help me turn blank into blank, so that blank. [Read it slowly. Then read it again.] For me it might be: turn a podcast episode into ten clips, so that I stop losing my whole Thursday. For you it might be: turn a pile of business cards into ranked follow-ups, so that no warm lead goes cold. [Pause.] The 'so that' is the important part, that's the time you're buying back. There's a form on the page you scanned, at slash build-your-own, that walks you right through it. Fill it in before you leave and you've basically specced your first Skill.",
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
      "One warning before you go, because I've watched people faceplant right here. The mistake is not starting too small. It's starting with ten things at once, getting overwhelmed, and shipping none of them. [Get firm.] Choose one workflow. Not ten. Run your candidate back through the five tests: repeated, annoying, describable, low-risk, still useful at seventy percent. Whichever one passes cleanest, that's your first Skill. Get one working, feel the hours come back, and the next five get obvious on their own.",
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
      "Here's how you make sure today doesn't evaporate by Monday. On your pack page, the one you scanned into, there's a button to email yourself the whole thing, your Skills and the worksheet you just filled in. [Hold up your phone and mime the tap.] Do it right now, while you're thinking about it, not later. Future-you, staring at a full inbox on Monday morning, will be genuinely grateful. The pack doesn't expire. It'll be sitting there when you're ready to build.",
  },
  {
    id: "follow",
    act: 6,
    kind: "close",
    eyebrow: "act six · keep going",
    title: "Where to keep learning this",
    body: "I make this stuff every week as Creator CTO. YouTube: @creator-cto.",
    notes:
      "If today clicked and you want to go deeper, this is what I do all week. I'm Creator CTO on YouTube, at creator dash c-t-o, and I break down exactly these kinds of AI workflows, step by step, for people who aren't engineers. [Point to the handle on screen.] No fluff, no hype, just the practical builds. If you only ever use the one Skill from today and never watch a single video, I'll still call this a win. But the door's open if you want more.",
  },
  {
    id: "thanks",
    act: 6,
    kind: "close",
    eyebrow: "act six · thank you",
    title: "Thank you. Now go build one.",
    body: "Scan again if you missed it. Find your pack. I'll be right here after.",
    notes:
      "That's the talk. [Warm, unhurried.] Thank you for giving me your attention, that's the scarcest thing in this room and I don't take it lightly. If you didn't grab your pack, the code is still up, scan it now. And please, come find me after, I want to hear the one task you wrote down, and I'll help you sharpen it into a Skill on the spot. [Smile. Hold the moment.] Go build one. Just one. See you out there.",
  },
];

// Fail fast at import: the Skill JL tears down live must exist in the library.
// A typo here would blow up the act-4 teardown slide in front of the room.
if (!getSkillBySlug(TEARDOWN_SKILL_SLUG)) {
  throw new Error(
    `lib/fsga/deck/deck-content.ts: TEARDOWN_SKILL_SLUG "${TEARDOWN_SKILL_SLUG}" not found in skill library`,
  );
}
