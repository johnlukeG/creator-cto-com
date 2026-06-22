import { Section } from "./section";
import { pillars } from "@/lib/content";

const ACCENT_INDEX = 1;

export function Pillars() {
  return (
    <Section
      id="pillars"
      eyebrow="/ what we cover"
      title="Four pillars for creator-founders."
      sub="The themes this channel digs into — what we'll build, teardown, and document, episode by episode."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {pillars.map((p, i) => {
          const on = i === ACCENT_INDEX;
          return (
            <div
              key={p.title}
              className={[
                "rounded-[14px] p-[22px] flex flex-col gap-3.5 border",
                on ? "bg-accent text-accent-ink border-transparent" : "bg-bg-card text-ink border-line",
              ].join(" ")}
            >
              <div
                className={[
                  "w-9 h-9 rounded-[10px] flex items-center justify-center text-[18px]",
                  on ? "bg-accent-ink text-accent" : "bg-bg-muted text-ink",
                ].join(" ")}
              >
                {p.ic}
              </div>
              <div>
                <div className="text-[15px] font-semibold tracking-[-0.01em] mb-2 text-balance">{p.title}</div>
                <div className="text-[12px] leading-[1.55] opacity-[0.78]">{p.body}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
