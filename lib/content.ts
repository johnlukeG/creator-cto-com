// Landing-page content, lifted from the design prototype (components.jsx).

export const LINKS = {
  youtube: "https://youtube.com/@creator-cto",
};

export const headline = {
  eyebrow: "/ creator-cto.com",
  title: "A channel for creators building AI-native products.",
  sub: "Real builds, AI workflows, and the systems behind creator-led businesses. Hosted by JL — building in public.",
};

export const spec = {
  rows: [
    ["01", "Distribution", "Ship content that compounds."],
    ["02", "Ownership", "Own your products, not platforms."],
    ["03", "Leverage", "AI as a capability multiplier."],
  ] as const,
};

export const marqueeItems = [
  "Building in public",
  "◇ AI-native product experiments",
  "◐ real builds, start to finish",
  "⊕ creator → founder → operator",
  "↗ new builds on YouTube",
  "◇ no hype, just the process",
];

export const videos = [
  { ep: "047", title: "I built a SaaS in 4 hours using Claude", tag: "Live build", dur: "23:14", views: "12K", featured: true },
  { ep: "046", title: "The newsletter teardown: how Lenny does $5M/yr", tag: "Teardown", dur: "18:02", views: "8.4K" },
  { ep: "045", title: "AI agents for creators (the actually useful stack)", tag: "AI workflow", dur: "31:47", views: "24K" },
  { ep: "044", title: "Why your audience is your unfair advantage", tag: "Strategy", dur: "14:20", views: "6.1K" },
];

export const pillars = [
  { ic: "◐", title: "Creator → Product Flywheel", body: "Turn audience attention into apps, SaaS tools, memberships, and durable assets — not just ad revenue." },
  { ic: "◇", title: "AI-Native Building", body: "Use AI to dramatically accelerate research, coding, ops, and shipping. Solo and small teams, leveraged." },
  { ic: "◈", title: "Tech Translation", body: "APIs, architecture, and AI systems explained for creators without engineering backgrounds." },
  { ic: "◉", title: "Creator Business Infra", body: "The systems behind a creator business: workflows, hiring developers, validating ideas, operational leverage." },
];

export const testimonials = [
  { q: "Finally, someone showing the actual workflow instead of vague theory. Shipped my first AI tool after watching 3 episodes.", name: "Sara K.", role: "newsletter, 12K subs" },
  { q: "The teardown format is gold. I learned more from one episode than a dozen courses.", name: "Marcus T.", role: "YouTube, 80K subs" },
  { q: "JL talks to creators like adults who can learn the next layer of building. Rare.", name: "Priya R.", role: "podcast host, 4 yrs" },
];

export const faq = [
  { q: "Who is this for?", a: "Independent creators, podcasters, newsletter writers, and YouTubers who already have an audience and want to build owned products on top of it. Also: developers, operators, and consultants working inside creator businesses." },
  { q: "Do I need to know how to code?", a: "No. The whole point is showing how AI lets non-engineers ship real software. We do go technical when it matters — but always to empower builders, not gatekeep." },
  { q: 'How is this different from other "AI for creators" channels?', a: "We document real builds end to end — the code, the decisions, the tradeoffs — instead of hype. The goal is to show the actual process, not just polished outcomes." },
  { q: "How often do new videos come out?", a: "We're just getting started, so there's no fixed schedule yet. Subscribe on YouTube and you'll see new builds and teardowns as they drop." },
  { q: "Is there a paid offering?", a: "Not yet. Everything lives on YouTube and it's free. If we build tools or resources worth sharing down the line, we'll point you to them." },
];

export const about = {
  meta: {
    label: "● / about",
    system: "creatorcto.system / built in public",
    version: "v0.1 — 2026",
  },
  context: {
    eyebrow: "/ about",
    title: "Why this channel exists.",
    paragraphs: [
      "The internet used to reward creators for attention. The AI era rewards something else — creators who turn that attention into systems and products they actually own.",
      "Creator CTO documents that shift: the move from content creator to AI-native builder and operator. Real builds, real tradeoffs, in public. No hype, no magic — just the process of turning an audience into durable assets.",
    ],
  },
  bio: {
    eyebrow: "/ who's behind it",
    title: "Built around a builder, not a brand.",
    paragraphs: [
      "I'm JL. I build software products, and Creator CTO is where I show the work — in public, as it happens. It isn't a media brand with a content calendar behind it. It's one builder, documenting real projects end to end.",
      "I've spent the last few years shipping real things — job boards, fantasy-sports platforms, internal tooling — mostly solo, and increasingly with AI carrying a real share of the load. [[TODO: sharpen — drop in your strongest proof point: a flagship product + a concrete result (users, revenue, launch), plus years building or any prior role]]",
      "That's the premise here. Most “AI for creators” content stops at the demo; I'm more interested in the parts that don't make the highlight reel — the architecture calls, the dead ends, the unglamorous infrastructure that decides whether a product actually holds up. If you're a creator trying to build something you own, that's what I'm documenting for you.",
    ],
  },
  audience: {
    eyebrow: "/ who this is for",
    title: "For creators who want to own the stack.",
    for: [
      "Creators with an audience who want owned products, not just brand deals",
      "Operators and developers building inside creator businesses",
      "Anyone who wants a clear path from creator → founder → operator",
    ],
    notFor: [
      "Anyone looking for motivation instead of mechanics",
      "Get-rich-quick or AI-magic narratives",
      "Pure theory with nothing shipped",
    ],
  },
} as const;

