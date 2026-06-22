// Creator CTO landing page — shared building blocks
// All three variants (Safe, Mid, Bold) compose from these primitives plus
// their own layout-specific components in variants.jsx.
//
// Design system:
//   Type:    JetBrains Mono (or Martian Mono / Geist Mono via Tweak)
//   Palette: warm off-white #f4f1ea, deep ink #131311, accent mint #4ad6a0
//   Voice:   builder-led, pragmatic, direct/utility headlines

const { useState, useEffect, useRef, useMemo } = React;

// ── Tokens ───────────────────────────────────────────────────────────────
const tokens = {
  light: {
    bg:        '#f4f1ea',
    bgMuted:   '#ebe7dd',
    bgCard:    '#faf7f0',
    ink:       '#131311',
    inkMuted:  '#5a564f',
    inkFaint:  'rgba(19,19,17,0.5)',
    line:      'rgba(19,19,17,0.12)',
    lineSoft:  'rgba(19,19,17,0.06)',
    accent:    '#4ad6a0',
    accentInk: '#0a2b1f',
    chip:      '#1a1a18',
    chipInk:   '#f4f1ea',
  },
  dark: {
    bg:        '#0e0f0d',
    bgMuted:   '#161815',
    bgCard:    '#181a17',
    ink:       '#f1ede4',
    inkMuted:  '#a4a097',
    inkFaint:  'rgba(241,237,228,0.5)',
    line:      'rgba(241,237,228,0.14)',
    lineSoft:  'rgba(241,237,228,0.07)',
    accent:    '#4ad6a0',
    accentInk: '#06140e',
    chip:      '#f1ede4',
    chipInk:   '#0e0f0d',
  },
};

// Density scales — the page itself stays at design width but spacing changes
const densityMap = {
  compact: { unit: 0.78, h1: 56, h2: 36, body: 14, gap: 14 },
  regular: { unit: 1.0,  h1: 72, h2: 44, body: 15, gap: 18 },
  comfy:   { unit: 1.18, h1: 84, h2: 52, body: 16, gap: 22 },
};

// Type pairings — three feel quite different
const fontMap = {
  'jetbrains': {
    display: '"JetBrains Mono", ui-monospace, monospace',
    body:    '"JetBrains Mono", ui-monospace, monospace',
    weightDisplay: 600,
    weightBody:    400,
    tracking: '-0.02em',
  },
  'martian': {
    display: '"Martian Mono", ui-monospace, monospace',
    body:    '"Martian Mono", ui-monospace, monospace',
    weightDisplay: 700,
    weightBody:    400,
    tracking: '-0.04em',
  },
  'geist': {
    display: '"Geist Mono", ui-monospace, monospace',
    body:    '"Geist Mono", ui-monospace, monospace',
    weightDisplay: 600,
    weightBody:    400,
    tracking: '-0.025em',
  },
};

// Headline variants — direct/utility voice
const headlineVariants = [
  {
    id: 'channel',
    eyebrow: '/ creator-cto.com',
    title: 'A channel for creators building AI-native products.',
    sub: 'Real builds, AI workflows, and the systems behind creator-led businesses. Hosted by JL — shipping in public, every week.',
  },
  {
    id: 'transition',
    eyebrow: '/ the transition',
    title: 'From content creator to AI-native operator.',
    sub: 'Turn audience attention into products, systems, and businesses you actually own. Practical, builder-led, no hype.',
  },
  {
    id: 'leverage',
    eyebrow: '/ leverage stack',
    title: 'Distribution. Ownership. Leverage.',
    sub: 'Three forces reshaping the creator economy — and a weekly playbook for stacking all three with AI.',
  },
  {
    id: 'flywheel',
    eyebrow: '/ creator → product',
    title: 'Build the flywheel between your audience and your code.',
    sub: 'Tutorials, teardowns, and live builds for creators who are ready to ship software, not just content.',
  },
];

// ── Atoms ────────────────────────────────────────────────────────────────

function Pill({ children, t, variant = 'outline', style }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 12px',
    borderRadius: 999,
    fontSize: 11,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    ...style,
  };
  if (variant === 'chip') {
    return <span style={{ ...base, background: t.chip, color: t.chipInk }}>{children}</span>;
  }
  if (variant === 'accent') {
    return <span style={{ ...base, background: t.accent, color: t.accentInk }}>{children}</span>;
  }
  return <span style={{ ...base, border: `1px solid ${t.line}`, color: t.inkMuted }}>{children}</span>;
}

function Btn({ children, t, variant = 'primary', icon = '↗', style, onClick }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 18px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    fontFamily: 'inherit',
    letterSpacing: '-0.01em',
    textDecoration: 'none',
    transition: 'transform .15s ease, background .15s ease',
    ...style,
  };
  let look;
  if (variant === 'primary') look = { background: t.accent, color: t.accentInk };
  else if (variant === 'dark') look = { background: t.chip, color: t.chipInk };
  else if (variant === 'ghost') look = { background: 'transparent', color: t.ink, border: `1px solid ${t.line}` };
  else look = { background: 'transparent', color: t.ink };
  return (
    <button onClick={onClick} style={{ ...base, ...look }}>
      <span>{children}</span>
      {icon && <span style={{ fontSize: 13, opacity: 0.85 }}>{icon}</span>}
    </button>
  );
}

function Logo({ t, size = 32 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: size, height: size, borderRadius: 8,
        background: t.chip, color: t.accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.5, fontWeight: 700, letterSpacing: '-0.06em',
        position: 'relative',
      }}>
        <span style={{ position: 'relative', zIndex: 1 }}>{'</>'}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>Creator CTO</span>
        <span style={{ fontSize: 9.5, color: 'inherit', opacity: 0.55, marginTop: 3, letterSpacing: '0.04em' }}>creatorcto.com</span>
      </div>
    </div>
  );
}

function Nav({ t, accentCta = false }) {
  const links = ['Videos', 'Pillars', 'About', 'Newsletter'];
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 28px', borderBottom: `1px solid ${t.lineSoft}`,
    }}>
      <Logo t={t} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 13, color: t.inkMuted }}>
        {links.map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{ color: 'inherit', textDecoration: 'none' }}>{l}</a>
        ))}
      </div>
      <Btn t={t} variant={accentCta ? 'primary' : 'dark'} icon="↗">Subscribe</Btn>
    </nav>
  );
}

// ── Hero visual variants ─────────────────────────────────────────────────

function HeroYouTube({ t }) {
  return (
    <div style={{
      position: 'relative', borderRadius: 20, overflow: 'hidden',
      background: t.chip, aspectRatio: '16/10', boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
    }}>
      {/* Player shell */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, #1a1a18 0%, #2a2a26 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Diagonal striped placeholder */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 12px, transparent 12px 24px)',
        }} />
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: t.accent, color: t.accentInk,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, paddingLeft: 6,
          boxShadow: `0 0 0 12px ${t.accent}33`,
        }}>▶</div>
      </div>
      {/* Top overlay row */}
      <div style={{
        position: 'absolute', top: 14, left: 14, right: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
          color: '#fff', padding: '6px 10px', borderRadius: 6,
          fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>● Live build</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, whiteSpace: 'nowrap' }}>EP 047 / 23:14</div>
      </div>
      {/* Bottom title overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '40px 18px 16px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
        color: '#fff',
      }}>
        <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>Creator CTO · 12K views · 2 days ago</div>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>
          I built a SaaS in 4 hours using Claude (real revenue, real users)
        </div>
      </div>
      {/* Scrub bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.15)' }}>
        <div style={{ width: '34%', height: '100%', background: t.accent }} />
      </div>
    </div>
  );
}

function HeroTerminal({ t }) {
  const lines = [
    { p: '~/creator-cto', cmd: 'claude build "ai-newsletter-generator"' },
    { out: '✓ scaffolding next.js project' },
    { out: '✓ wiring openai + supabase' },
    { out: '✓ deploying to vercel' },
    { out: '→ live at creator-cto.app/build-047', highlight: true },
    { p: '~/creator-cto', cmd: 'gh release create v0.1 --notes "shipped"' },
    { out: '✓ shipped in 4h 12m', highlight: true },
  ];
  return (
    <div style={{
      borderRadius: 18, overflow: 'hidden',
      background: '#0d0e0c', boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
      border: `1px solid ${t.line}`, fontFamily: '"JetBrains Mono", monospace',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#16181430',
      }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
        <span style={{ marginLeft: 10, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>build-log.sh</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#4ad6a0' }}>● recording</span>
      </div>
      <div style={{ padding: '20px 22px', fontSize: 12.5, lineHeight: 1.85, color: '#d8d6cc' }}>
        {lines.map((l, i) => (
          <div key={i}>
            {l.cmd && (
              <>
                <span style={{ color: '#7e8273' }}>{l.p} </span>
                <span style={{ color: '#4ad6a0' }}>$ </span>
                <span>{l.cmd}</span>
              </>
            )}
            {l.out && (
              <span style={{ color: l.highlight ? '#4ad6a0' : '#a8a89a' }}>  {l.out}</span>
            )}
          </div>
        ))}
        <div>
          <span style={{ color: '#7e8273' }}>~/creator-cto </span>
          <span style={{ color: '#4ad6a0' }}>$ </span>
          <span style={{
            display: 'inline-block', width: 8, height: 14, background: '#4ad6a0',
            verticalAlign: 'middle', animation: 'cctoBlink 1s steps(2) infinite',
          }} />
        </div>
      </div>
    </div>
  );
}

function HeroFlywheel({ t }) {
  const nodes = [
    { label: 'Audience', x: 50, y: 12, sub: '142K subs' },
    { label: 'Content', x: 88, y: 50, sub: 'weekly' },
    { label: 'Product', x: 50, y: 88, sub: 'in public' },
    { label: 'Leverage', x: 12, y: 50, sub: 'AI stack' },
  ];
  return (
    <div style={{
      position: 'relative', aspectRatio: '1/1', borderRadius: 20,
      background: t.bgCard, border: `1px solid ${t.line}`, padding: 24,
      boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
    }}>
      {/* Flywheel circle */}
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 24, width: 'calc(100% - 48px)', height: 'calc(100% - 48px)' }}>
        <circle cx="50" cy="50" r="38" fill="none" stroke={t.line} strokeWidth="0.4" strokeDasharray="1.5 1.5" />
        <circle cx="50" cy="50" r="38" fill="none" stroke={t.accent} strokeWidth="0.6"
          strokeDasharray="60 240" strokeLinecap="round" transform="rotate(-90 50 50)" />
        {/* Arrow heads on circle */}
        {[0, 90, 180, 270].map(deg => {
          const rad = (deg - 90) * Math.PI / 180;
          const x = 50 + 38 * Math.cos(rad);
          const y = 50 + 38 * Math.sin(rad);
          return <circle key={deg} cx={x} cy={y} r="1.2" fill={t.ink} />;
        })}
      </svg>
      {/* Center label */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        textAlign: 'center', zIndex: 2,
      }}>
        <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.inkFaint }}>The</div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>Creator</div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: t.accent }}>Flywheel</div>
      </div>
      {/* Nodes */}
      {nodes.map(n => (
        <div key={n.label} style={{
          position: 'absolute', left: `${n.x}%`, top: `${n.y}%`,
          transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 2,
        }}>
          <div style={{
            background: t.chip, color: t.chipInk,
            padding: '8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500,
            boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
          }}>{n.label}</div>
          <div style={{ fontSize: 10, color: t.inkFaint, marginTop: 6, letterSpacing: '0.02em' }}>{n.sub}</div>
        </div>
      ))}
    </div>
  );
}

function HeroCreatorStack({ t }) {
  return (
    <div style={{ position: 'relative', aspectRatio: '4/5' }}>
      {/* Portrait placeholder */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '70%', height: '78%',
        borderRadius: 18, background: t.chip, overflow: 'hidden',
        backgroundImage: `repeating-linear-gradient(45deg, ${t.bgMuted} 0 8px, ${t.bgCard} 8px 16px)`,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: t.inkFaint, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>creator portrait</div>
        <div style={{
          position: 'absolute', bottom: 14, left: 14,
          background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '6px 10px',
          borderRadius: 6, fontSize: 10, letterSpacing: '0.05em',
        }}>JL · founder</div>
      </div>
      {/* Stacked product cards */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '58%', display: 'grid', gap: 10 }}>
        {[
          { name: 'Newsletter Engine', meta: 'AI · 4.2K MRR', accent: true },
          { name: 'Build Logs', meta: 'open-source · 8.1K ⭐' },
          { name: 'Idea Lab', meta: 'experiments · 12 shipped' },
        ].map((p, i) => (
          <div key={p.name} style={{
            background: p.accent ? t.accent : t.bgCard,
            color: p.accent ? t.accentInk : t.ink,
            border: p.accent ? 'none' : `1px solid ${t.line}`,
            borderRadius: 12, padding: '12px 14px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>{p.name}</div>
            <div style={{ fontSize: 10.5, marginTop: 3, opacity: 0.7 }}>{p.meta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const HeroVisualMap = {
  youtube:  HeroYouTube,
  terminal: HeroTerminal,
  flywheel: HeroFlywheel,
  stack:    HeroCreatorStack,
};

// ── Sections ─────────────────────────────────────────────────────────────

function VideosSection({ t, d, accent = 'card' }) {
  const videos = [
    { ep: '047', title: 'I built a SaaS in 4 hours using Claude', tag: 'Live build', dur: '23:14', views: '12K', featured: true },
    { ep: '046', title: 'The newsletter teardown: how Lenny does $5M/yr', tag: 'Teardown', dur: '18:02', views: '8.4K' },
    { ep: '045', title: 'AI agents for creators (the actually useful stack)', tag: 'AI workflow', dur: '31:47', views: '24K' },
    { ep: '044', title: 'Why your audience is your unfair advantage', tag: 'Strategy', dur: '14:20', views: '6.1K' },
  ];
  return (
    <Section t={t} d={d} id="videos" eyebrow="/ latest" title="Builds, teardowns, and experiments." sub="New episode every Tuesday. Long-form, hands-on, no fluff.">
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 16 }}>
        {videos.map((v, i) => (
          <VideoCard key={v.ep} t={t} v={v} large={i === 0} accentFeatured={accent === 'accent' && i === 0} />
        ))}
      </div>
    </Section>
  );
}

function VideoCard({ t, v, large, accentFeatured }) {
  const isAccent = accentFeatured;
  return (
    <a href="#" style={{
      gridColumn: large ? 'span 2' : 'span 1',
      gridRow: large ? 'span 2' : 'span 1',
      textDecoration: 'none', color: 'inherit',
      background: isAccent ? t.accent : t.bgCard,
      border: `1px solid ${isAccent ? 'transparent' : t.line}`,
      borderRadius: 14, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      transition: 'transform .2s ease, box-shadow .2s ease',
    }}>
      {/* thumbnail */}
      <div style={{
        position: 'relative', aspectRatio: large ? '16/9' : '16/10',
        background: isAccent ? '#3ab988' : t.chip,
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 10px, transparent 10px 20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: large ? 60 : 40, height: large ? 60 : 40, borderRadius: '50%',
          background: isAccent ? t.accentInk : t.accent,
          color: isAccent ? t.accent : t.accentInk,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: large ? 20 : 14, paddingLeft: 3,
        }}>▶</div>
        <div style={{
          position: 'absolute', top: 12, left: 12,
          background: 'rgba(0,0,0,0.7)', color: '#fff',
          padding: '4px 8px', borderRadius: 4, fontSize: 10, letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}>EP {v.ep}</div>
        <div style={{
          position: 'absolute', bottom: 12, right: 12,
          background: 'rgba(0,0,0,0.7)', color: '#fff',
          padding: '3px 7px', borderRadius: 4, fontSize: 10,
          whiteSpace: 'nowrap',
        }}>{v.dur}</div>
      </div>
      <div style={{ padding: large ? '20px 22px' : '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 10.5, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.6 }}>
          {v.tag} · {v.views} views
        </div>
        <div style={{
          fontSize: large ? 22 : 14, lineHeight: 1.25, fontWeight: 600,
          letterSpacing: '-0.02em', textWrap: 'pretty',
        }}>{v.title}</div>
      </div>
    </a>
  );
}

function PillarsSection({ t, d, accentIndex = 1 }) {
  const pillars = [
    { ic: '◐', title: 'Creator → Product Flywheel', body: 'Turn audience attention into apps, SaaS tools, memberships, and durable assets — not just ad revenue.' },
    { ic: '◇', title: 'AI-Native Building', body: 'Use AI to dramatically accelerate research, coding, ops, and shipping. Solo and small teams, leveraged.' },
    { ic: '◈', title: 'Tech Translation', body: 'APIs, architecture, and AI systems explained for creators without engineering backgrounds.' },
    { ic: '◉', title: 'Creator Business Infra', body: 'The systems behind a creator business: workflows, hiring developers, validating ideas, operational leverage.' },
  ];
  return (
    <Section t={t} d={d} id="pillars" eyebrow="/ what we cover" title="Four pillars for creator-founders." sub="Every video, essay, and build maps to one of these. Pick one and start.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {pillars.map((p, i) => (
          <div key={p.title} style={{
            background: i === accentIndex ? t.accent : t.bgCard,
            color: i === accentIndex ? t.accentInk : t.ink,
            border: `1px solid ${i === accentIndex ? 'transparent' : t.line}`,
            borderRadius: 14, padding: 22, display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: i === accentIndex ? t.accentInk : t.bgMuted,
              color: i === accentIndex ? t.accent : t.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>{p.ic}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 8, textWrap: 'balance' }}>{p.title}</div>
              <div style={{ fontSize: 12, lineHeight: 1.55, opacity: 0.78 }}>{p.body}</div>
            </div>
            <a href="#" style={{
              marginTop: 'auto', alignSelf: 'flex-start',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase',
              color: 'inherit', textDecoration: 'none',
              background: i === accentIndex ? t.accentInk : 'transparent',
              padding: i === accentIndex ? '6px 10px' : '0',
              borderRadius: 999,
              borderBottom: i === accentIndex ? 'none' : `1px solid currentColor`,
              opacity: i === accentIndex ? 1 : 0.7,
              color: i === accentIndex ? t.accent : 'inherit',
              whiteSpace: 'nowrap',
            }}>Watch series ↗</a>
          </div>
        ))}
      </div>
    </Section>
  );
}

function TestimonialsSection({ t, d }) {
  const quotes = [
    { q: 'Finally, someone showing the actual workflow instead of vague theory. Shipped my first AI tool after watching 3 episodes.', name: 'Sara K.', role: 'newsletter, 12K subs' },
    { q: 'The teardown format is gold. I learned more from one episode than a dozen courses.', name: 'Marcus T.', role: 'YouTube, 80K subs' },
    { q: 'JL talks to creators like adults who can learn the next layer of building. Rare.', name: 'Priya R.', role: 'podcast host, 4 yrs' },
  ];
  return (
    <Section t={t} d={d} id="reviews" eyebrow="/ from the audience" title="Builders who took the leap." sub="A few notes from creators turning attention into products.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {quotes.map((q, i) => (
          <div key={i} style={{
            background: t.bgCard, border: `1px solid ${t.line}`, borderRadius: 14,
            padding: 24, display: 'flex', flexDirection: 'column', gap: 18,
          }}>
            <div style={{ fontSize: 22, color: t.accent, lineHeight: 1, fontWeight: 700 }}>"</div>
            <div style={{ fontSize: 14, lineHeight: 1.55, textWrap: 'pretty' }}>{q.q}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: t.bgMuted, border: `1px solid ${t.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600, color: t.inkMuted,
              }}>{q.name[0]}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{q.name}</div>
                <div style={{ fontSize: 10.5, color: t.inkFaint, marginTop: 2 }}>{q.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FaqSection({ t, d }) {
  const items = [
    { q: 'Who is this for?', a: 'Independent creators, podcasters, newsletter writers, and YouTubers who already have an audience and want to build owned products on top of it. Also: developers, operators, and consultants working inside creator businesses.' },
    { q: 'Do I need to know how to code?', a: 'No. The whole point is showing you how AI lets non-engineers ship real software. We do go technical when it matters — but always with the goal of empowering builders, not gatekeeping.' },
    { q: 'How is this different from other "AI for creators" channels?', a: 'We document real builds with real revenue and real users, not hype. Every concept maps to something we (or a guest) actually shipped.' },
    { q: 'How often do new videos come out?', a: 'Every Tuesday. Plus occasional livestreams when we ship a new product.' },
    { q: 'Is there a paid offering?', a: 'The channel and newsletter are free. Tools and templates we build along the way live in the resources hub — most are free, some are paid.' },
  ];
  const [open, setOpen] = useState(1);
  return (
    <Section t={t} d={d} id="faq" eyebrow="/ faq" title="Frequently asked questions." sub="The questions creators ask before subscribing.">
      <div style={{ display: 'grid', gap: 8 }}>
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={i} style={{
              background: isOpen ? t.bgCard : t.bgCard,
              border: `1px solid ${t.line}`, borderRadius: 12,
              overflow: 'hidden',
            }}>
              <button onClick={() => setOpen(isOpen ? -1 : i)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 18,
                padding: '18px 22px', background: 'transparent', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                color: 'inherit',
              }}>
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: isOpen ? t.chip : t.bgMuted,
                  color: isOpen ? t.chipInk : t.inkMuted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 500,
                }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em' }}>{it.q}</span>
                <span style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: t.accent, color: t.accentInk,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 500,
                }}>{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div style={{ padding: '0 22px 22px 68px', fontSize: 13, lineHeight: 1.65, color: t.inkMuted, textWrap: 'pretty' }}>
                  {it.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function CtaBlock({ t, d, headline = "Stop renting your audience. Start owning the stack." }) {
  return (
    <Section t={t} d={d} pad="tight">
      <div style={{
        background: t.accent, color: t.accentInk,
        borderRadius: 20, padding: '48px 44px',
        display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'center',
      }}>
        <div>
          <Pill t={t} variant="chip" style={{ background: t.accentInk, color: t.accent }}>Subscribe</Pill>
          <h3 style={{
            fontSize: d.h2, fontWeight: 700, letterSpacing: '-0.03em', textWrap: 'balance',
            margin: '18px 0 10px', lineHeight: 1.05,
          }}>{headline}</h3>
          <p style={{ fontSize: 14, opacity: 0.78, lineHeight: 1.55, maxWidth: 460 }}>
            New build, teardown, or AI experiment in your inbox every Tuesday. Free, no spam, unsubscribe whenever.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <Btn t={t} variant="dark">Subscribe on YouTube</Btn>
            <Btn t={t} variant="ghost" icon="" style={{ borderColor: t.accentInk, color: t.accentInk }}>Read the newsletter</Btn>
          </div>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12,
          fontSize: 12,
        }}>
          {[
            { n: '142K', l: 'YouTube subs' },
            { n: '8.4K', l: 'Newsletter readers' },
            { n: '47',   l: 'Builds shipped' },
            { n: 'Tue',  l: 'New episode every' },
          ].map(s => (
            <div key={s.l} style={{
              background: t.accentInk, color: t.accent,
              borderRadius: 12, padding: '16px 18px',
            }}>
              <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em' }}>{s.n}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4, letterSpacing: '0.03em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function FooterBlock({ t, d }) {
  return (
    <footer style={{ padding: '56px 56px 32px', borderTop: `1px solid ${t.lineSoft}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40 }}>
        <div>
          <Logo t={t} />
          <p style={{ fontSize: 12, color: t.inkMuted, marginTop: 16, lineHeight: 1.6, maxWidth: 320 }}>
            Helping creators turn audience attention into AI-powered products, systems, and businesses they own.
          </p>
        </div>
        {[
          { h: 'Channel', items: ['YouTube', 'Latest video', 'Playlists', 'About'] },
          { h: 'Connect', items: ['Newsletter', 'X / Twitter', 'LinkedIn', 'RSS'] },
          { h: 'Resources', items: ['Tools hub', 'Templates', 'Build logs', 'Sponsorships'] },
        ].map(col => (
          <div key={col.h}>
            <div style={{ fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: t.inkFaint, marginBottom: 14 }}>{col.h}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
              {col.items.map(i => (
                <li key={i}><a href="#" style={{ color: t.ink, textDecoration: 'none', fontSize: 12.5 }}>{i}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 48, paddingTop: 22, borderTop: `1px solid ${t.lineSoft}`,
        display: 'flex', justifyContent: 'space-between',
        fontSize: 11, color: t.inkFaint, letterSpacing: '0.02em',
      }}>
        <div>© 2026 Creator CTO · Built in public</div>
        <div>creatorcto.com · v0.47</div>
      </div>
    </footer>
  );
}

// Generic section wrapper — title row + children
function Section({ t, d, children, id, eyebrow, title, sub, pad = 'normal' }) {
  const padY = pad === 'tight' ? 40 : 80 * d.unit;
  return (
    <section id={id} style={{ padding: `${padY}px 56px` }}>
      {(eyebrow || title) && (
        <div style={{ marginBottom: 36 * d.unit, textAlign: 'center' }}>
          {eyebrow && (
            <div style={{ marginBottom: 16 }}>
              <Pill t={t}>{eyebrow}</Pill>
            </div>
          )}
          {title && (
            <h2 style={{
              fontSize: d.h2, fontWeight: 700, letterSpacing: '-0.03em',
              margin: '0 auto', maxWidth: 760, lineHeight: 1.05, textWrap: 'balance',
            }}>{title}</h2>
          )}
          {sub && (
            <p style={{
              fontSize: 14, color: t.inkMuted, maxWidth: 540, margin: '14px auto 0',
              lineHeight: 1.55, textWrap: 'pretty',
            }}>{sub}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

// Export
Object.assign(window, {
  tokens, densityMap, fontMap, headlineVariants,
  Pill, Btn, Logo, Nav,
  HeroVisualMap,
  VideosSection, PillarsSection, TestimonialsSection, FaqSection,
  CtaBlock, FooterBlock, Section,
});
