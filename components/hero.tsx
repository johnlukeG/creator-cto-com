import { Btn, Pill } from "./atoms";
import { HeroYouTube } from "./hero-youtube";
import { headline, spec, LINKS } from "@/lib/content";

function AccentHeadline({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className={i >= words.length - 2 ? "text-accent" : undefined}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <>
      {/* Top meta strip — system status bar */}
      <div className="flex items-center gap-6 px-7 py-3 border-b border-line-soft text-[10.5px] tracking-[0.06em] uppercase text-ink-muted bg-bg">
        <span className="text-accent whitespace-nowrap">● recording</span>
        <span className="whitespace-nowrap">creatorcto.system / status: building</span>
        <span className="ml-auto whitespace-nowrap">v0.1 — 2026</span>
      </div>

      {/* Hero */}
      <section className="px-7 py-[50px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-14 items-start">
          <div>
            <h1 className="text-[44px] sm:text-[56px] lg:text-[78px] font-bold tracking-[-0.05em] leading-[0.92] m-0 text-balance">
              <AccentHeadline text={headline.title} />
            </h1>
          </div>
          <aside className="pt-5">
            <Pill variant="chip">{headline.eyebrow}</Pill>
            <p className="text-[13px] leading-[1.6] text-ink-muted mt-[18px] text-pretty">{headline.sub}</p>
            <div className="flex flex-col gap-2.5 mt-[22px]">
              <Btn href={LINKS.youtube} variant="primary" className="w-full justify-between whitespace-nowrap">
                Subscribe on YouTube
              </Btn>
            </div>
          </aside>
        </div>

        {/* Hero visual + adjacent build-spec card */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mt-12">
          <div className="bg-bg-card border border-line rounded-[18px] p-7 relative">
            <HeroYouTube />
          </div>
          <div className="bg-chip text-chip-ink rounded-[18px] p-7 flex flex-col justify-between">
            <div>
              <div className="text-[10px] tracking-[0.1em] uppercase text-accent">/ the thesis</div>
              <div className="text-[22px] font-semibold tracking-[-0.02em] mt-3.5 leading-[1.15] text-balance">
                Distribution × Ownership × Leverage.
              </div>
              <div className="grid gap-3.5 mt-6 text-[12px] opacity-85">
                {spec.rows.map(([n, k, v]) => (
                  <div key={n} className="grid grid-cols-[36px_110px_1fr] items-baseline gap-3">
                    <span className="text-accent tabular-nums">{n}</span>
                    <span className="font-semibold">{k}</span>
                    <span className="opacity-70">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-7 px-4 py-3.5 rounded-[10px] bg-white/[0.06] text-[11px] flex items-center justify-between">
              <span className="opacity-70">The three forces every build maps to</span>
              <span className="text-accent">follow along →</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
