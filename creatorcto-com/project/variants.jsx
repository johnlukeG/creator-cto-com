// Creator CTO — three landing-page variants composed from components.jsx
// Safe / Mid / Bold. Each takes the same props (t, d, tweaks).

const { useState: useStateV } = React;

// ── Variant 1 — SAFE ─────────────────────────────────────────────────────
// Reference-faithful: centered card layout, neutral palette, generous whitespace.
function VariantSafe({ t, d, f, tweaks }) {
  const headline = window.headlineVariants.find(h => h.id === tweaks.headline) || window.headlineVariants[0];
  const HeroVisual = window.HeroVisualMap[tweaks.hero] || window.HeroVisualMap.youtube;
  const sec = tweaks.sections;

  return (
    <div style={{ background: t.bg, color: t.ink, fontFamily: f.body, letterSpacing: f.tracking, fontWeight: f.weightBody }}>
      <Nav t={t} />

      {/* Hero */}
      <section style={{ padding: `${72 * d.unit}px 56px ${48 * d.unit}px` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div>
            <Pill t={t}>{headline.eyebrow}</Pill>
            <h1 style={{
              fontSize: d.h1, fontWeight: 700, letterSpacing: '-0.04em',
              margin: '24px 0 20px', lineHeight: 1.0, textWrap: 'balance',
            }}>{headline.title}</h1>
            <p style={{ fontSize: 16, lineHeight: 1.5, color: t.inkMuted, maxWidth: 480, textWrap: 'pretty' }}>
              {headline.sub}
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
              <Btn t={t} variant="primary">Subscribe on YouTube</Btn>
              <Btn t={t} variant="ghost" icon="">Watch latest →</Btn>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 18, marginTop: 36,
              fontSize: 11, color: t.inkFaint, letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              <span>● 142K subscribers</span>
              <span style={{ width: 1, height: 12, background: t.line }} />
              <span>47 builds shipped</span>
              <span style={{ width: 1, height: 12, background: t.line }} />
              <span>New ep every Tue</span>
            </div>
          </div>
          <div><HeroVisual t={t} /></div>
        </div>
      </section>

      {/* Sections, in order from tweaks */}
      {sec.videos       && <VideosSection t={t} d={d} accent="card" />}
      {sec.pillars      && <PillarsSection t={t} d={d} accentIndex={1} />}
      {sec.testimonials && <TestimonialsSection t={t} d={d} />}
      {sec.faq          && <FaqSection t={t} d={d} />}
      {sec.cta          && <CtaBlock t={t} d={d} headline="Subscribe on YouTube. Stay creator-led." />}
      {sec.footer       && <FooterBlock t={t} d={d} />}
    </div>
  );
}

// ── Variant 2 — MID ──────────────────────────────────────────────────────
// Asymmetric editorial — chartreuse-style accent panel hugs the hero, more rhythm.
function VariantMid({ t, d, f, tweaks }) {
  const headline = window.headlineVariants.find(h => h.id === tweaks.headline) || window.headlineVariants[1];
  const HeroVisual = window.HeroVisualMap[tweaks.hero] || window.HeroVisualMap.terminal;
  const sec = tweaks.sections;

  return (
    <div style={{ background: t.bg, color: t.ink, fontFamily: f.body, letterSpacing: f.tracking, fontWeight: f.weightBody }}>
      <Nav t={t} accentCta={true} />

      {/* Hero — left text, right an accent-block embedded with the visual */}
      <section style={{ padding: `${56 * d.unit}px 24px` }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 16,
          alignItems: 'stretch',
        }}>
          {/* Text card */}
          <div style={{
            background: t.bgCard, borderRadius: 22,
            padding: `${48 * d.unit}px ${44 * d.unit}px`,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            border: `1px solid ${t.lineSoft}`,
          }}>
            <div>
              <Pill t={t}>{headline.eyebrow}</Pill>
              <h1 style={{
                fontSize: d.h1 * 1.0, fontWeight: 700, letterSpacing: '-0.04em',
                margin: '24px 0 22px', lineHeight: 0.98, textWrap: 'balance',
              }}>{headline.title}</h1>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: t.inkMuted, maxWidth: 460, textWrap: 'pretty' }}>
                {headline.sub}
              </p>
            </div>
            <div style={{ marginTop: 36 }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
                <Btn t={t} variant="primary">Subscribe ▶</Btn>
                <Btn t={t} variant="ghost" icon="">Newsletter</Btn>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                fontSize: 10.5, color: t.inkFaint, letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.accent }} />
                  Live build dropping Tuesday
                </span>
              </div>
            </div>
          </div>

          {/* Accent panel with hero visual */}
          <div style={{
            background: t.accent, borderRadius: 22, padding: 32,
            position: 'relative', display: 'flex', alignItems: 'center',
            minHeight: 540 * d.unit, overflow: 'hidden',
          }}>
            {/* Floating stat card */}
            <div style={{
              position: 'absolute', top: 26, left: 26, zIndex: 3,
              background: t.bgCard, borderRadius: 12, padding: '12px 16px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
              border: `1px solid ${t.line}`,
            }}>
              <div style={{ fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: t.inkFaint }}>
                This week's build
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>
                Newsletter Engine v2
              </div>
              <div style={{ fontSize: 10.5, color: t.inkMuted, marginTop: 2 }}>
                4h 12m → shipped <span style={{ color: '#1a8a5a' }}>+ $1.2K MRR</span>
              </div>
            </div>
            {/* Stamp */}
            <div style={{
              position: 'absolute', bottom: 26, right: 26, zIndex: 3,
              background: t.chip, color: t.chipInk,
              padding: '10px 14px', borderRadius: 10,
              fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
              fontWeight: 500,
            }}>EP 047 / building in public</div>
            {/* Visual fill */}
            <div style={{ width: '100%', maxWidth: '100%' }}>
              <HeroVisual t={t} />
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div style={{
          marginTop: 28, padding: '20px 28px',
          background: t.bgCard, borderRadius: 14, border: `1px solid ${t.lineSoft}`,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
        }}>
          {[
            { n: '142K', l: 'YouTube subscribers' },
            { n: '8.4K', l: 'Newsletter readers' },
            { n: '47',   l: 'Real products shipped' },
            { n: '2.1M', l: 'Hours watched' },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{s.n}</div>
              <div style={{ fontSize: 10.5, color: t.inkFaint, marginTop: 3, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {sec.videos       && <VideosSection t={t} d={d} accent="accent" />}
      {sec.pillars      && <PillarsSection t={t} d={d} accentIndex={1} />}
      {sec.testimonials && <TestimonialsSection t={t} d={d} />}
      {sec.faq          && <FaqSection t={t} d={d} />}
      {sec.cta          && <CtaBlock t={t} d={d} />}
      {sec.footer       && <FooterBlock t={t} d={d} />}
    </div>
  );
}

// ── Variant 3 — BOLD ─────────────────────────────────────────────────────
// Editorial / system-driven. Big tickers, oversized type, dot-grid background,
// a section divider with a marquee-style "now building" line.
function VariantBold({ t, d, f, tweaks }) {
  const headline = window.headlineVariants.find(h => h.id === tweaks.headline) || window.headlineVariants[2];
  const HeroVisual = window.HeroVisualMap[tweaks.hero] || window.HeroVisualMap.flywheel;
  const sec = tweaks.sections;

  return (
    <div style={{
      background: t.bg, color: t.ink,
      fontFamily: f.body, letterSpacing: f.tracking, fontWeight: f.weightBody,
      backgroundImage: `radial-gradient(${t.line} 0.6px, transparent 0.6px)`,
      backgroundSize: '20px 20px',
    }}>
      <Nav t={t} accentCta={true} />

      {/* Top meta strip — like a system status bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 24,
        padding: '12px 28px', borderBottom: `1px solid ${t.lineSoft}`,
        fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase',
        color: t.inkMuted, background: t.bg,
      }}>
        <span style={{ color: t.accent, whiteSpace: 'nowrap' }}>● recording</span>
        <span style={{ whiteSpace: 'nowrap' }}>creatorcto.system / status: shipping</span>
        <span style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>v0.47 — May 2026</span>
      </div>

      {/* Hero — oversized headline + side caption */}
      <section style={{ padding: `${64 * d.unit}px 28px` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 56, alignItems: 'flex-start' }}>
          <div>
            <h1 style={{
              fontSize: Math.round(d.h1 * 1.4), fontWeight: 700,
              letterSpacing: '-0.05em', lineHeight: 0.92,
              margin: 0, textWrap: 'balance',
            }}>
              {headline.title.split(' ').map((w, i, arr) => (
                <span key={i} style={{ color: i >= arr.length - 2 ? t.accent : 'inherit' }}>
                  {w}{i < arr.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h1>
          </div>
          <aside style={{ paddingTop: 20 }}>
            <Pill t={t} variant="chip">{headline.eyebrow}</Pill>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: t.inkMuted, marginTop: 18, textWrap: 'pretty' }}>
              {headline.sub}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
              <Btn t={t} variant="primary" style={{ width: '100%', justifyContent: 'space-between', whiteSpace: 'nowrap' }}>Subscribe on YouTube</Btn>
              <Btn t={t} variant="ghost" icon="" style={{ width: '100%', justifyContent: 'space-between', whiteSpace: 'nowrap' }}>Read the newsletter →</Btn>
            </div>
          </aside>
        </div>

        {/* Hero visual + adjacent build-spec card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginTop: 48 }}>
          <div style={{
            background: t.bgCard, border: `1px solid ${t.line}`,
            borderRadius: 18, padding: 28, position: 'relative',
          }}>
            <HeroVisual t={t} />
          </div>
          <div style={{
            background: t.chip, color: t.chipInk,
            borderRadius: 18, padding: 28,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.accent }}>
                /spec
              </div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 14, lineHeight: 1.15, textWrap: 'balance' }}>
                The Creator CTO operating system.
              </div>
              <div style={{ display: 'grid', gap: 14, marginTop: 24, fontSize: 12, opacity: 0.85 }}>
                {[
                  ['01', 'Distribution', 'Ship content that compounds.'],
                  ['02', 'Ownership',     'Own your products, not platforms.'],
                  ['03', 'Leverage',      'AI as a capability multiplier.'],
                ].map(([n, k, v]) => (
                  <div key={n} style={{ display: 'grid', gridTemplateColumns: '36px 110px 1fr', alignItems: 'baseline', gap: 12 }}>
                    <span style={{ color: t.accent, fontVariantNumeric: 'tabular-nums' }}>{n}</span>
                    <span style={{ fontWeight: 600 }}>{k}</span>
                    <span style={{ opacity: 0.7 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              marginTop: 28, padding: '14px 16px', borderRadius: 10,
              background: 'rgba(255,255,255,0.06)', fontSize: 11,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ opacity: 0.7 }}>Watch the manifesto →</span>
              <span style={{ color: t.accent }}>EP 001 · 12:04</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee / now-building strip */}
      <div style={{
        background: t.chip, color: t.chipInk, overflow: 'hidden',
        borderTop: `1px solid ${t.line}`, borderBottom: `1px solid ${t.line}`,
      }}>
        <div style={{
          display: 'flex', gap: 56, padding: '18px 0',
          fontSize: 13, letterSpacing: '-0.01em', whiteSpace: 'nowrap',
          animation: 'cctoMarquee 38s linear infinite',
        }}>
          {Array.from({ length: 3 }).map((_, k) => (
            <React.Fragment key={k}>
              {[
                'Now building: Newsletter Engine v2',
                '↗ shipped: Idea Lab',
                '◐ in research: AI agent for podcasters',
                '↗ shipped: Build Logs',
                '⊕ next ep: Tuesday 6pm ET',
                '◇ open-source: cto-stack',
              ].map((s, i) => (
                <span key={`${k}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: t.accent }}>●</span>{s}
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {sec.videos       && <VideosSection t={t} d={d} accent="accent" />}
      {sec.pillars      && <PillarsSection t={t} d={d} accentIndex={1} />}
      {sec.testimonials && <TestimonialsSection t={t} d={d} />}
      {sec.faq          && <FaqSection t={t} d={d} />}
      {sec.cta          && <CtaBlock t={t} d={d} headline="Stop renting your audience. Own the stack." />}
      {sec.footer       && <FooterBlock t={t} d={d} />}
    </div>
  );
}

Object.assign(window, { VariantSafe, VariantMid, VariantBold });
