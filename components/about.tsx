import { Section } from "./section";
import { about } from "@/lib/content";

export function About() {
  return (
    <>
      {/* Meta strip — mirrors the landing hero's status bar for continuity */}
      <div className="flex items-center gap-6 px-7 py-3 border-b border-line-soft text-[10.5px] tracking-[0.06em] uppercase text-ink-muted bg-bg">
        <span className="text-accent whitespace-nowrap">{about.meta.label}</span>
        <span className="whitespace-nowrap">{about.meta.system}</span>
        <span className="ml-auto whitespace-nowrap">{about.meta.version}</span>
      </div>

      {/* The context — why this exists */}
      <Section eyebrow={about.context.eyebrow} title={about.context.title} titleAs="h1">
        <div className="max-w-[640px] mx-auto flex flex-col gap-4 text-[15px] leading-[1.65] text-ink-muted text-pretty">
          {about.context.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "text-ink" : undefined}>
              {p}
            </p>
          ))}
        </div>
      </Section>

      {/* Who's behind it — first-person bio */}
      <Section eyebrow={about.bio.eyebrow} title={about.bio.title} pad="tight">
        <div className="max-w-[640px] mx-auto flex flex-col gap-4 text-[15px] leading-[1.65] text-ink-muted text-pretty">
          {about.bio.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Section>

      {/* Who this is for / who it isn't */}
      <Section eyebrow={about.audience.eyebrow} title={about.audience.title} pad="tight">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-[760px] mx-auto">
          <div className="rounded-[14px] p-[22px] border border-line bg-bg-card">
            <div className="text-[10.5px] tracking-[0.06em] uppercase text-accent mb-3.5">For</div>
            <ul className="list-none p-0 m-0 grid gap-2.5">
              {about.audience.for.map((item) => (
                <li key={item} className="text-[13px] leading-[1.5] text-ink flex gap-2.5">
                  <span className="text-accent">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[14px] p-[22px] border border-line bg-bg-card">
            <div className="text-[10.5px] tracking-[0.06em] uppercase text-ink-faint mb-3.5">Not for</div>
            <ul className="list-none p-0 m-0 grid gap-2.5">
              {about.audience.notFor.map((item) => (
                <li key={item} className="text-[13px] leading-[1.5] text-ink-muted flex gap-2.5">
                  <span className="text-ink-faint">–</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
