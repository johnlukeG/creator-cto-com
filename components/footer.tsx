import { Logo } from "./atoms";

const cols = [
  { h: "Channel", items: ["YouTube", "About"] },
  { h: "Connect", items: ["X / Twitter", "LinkedIn"] },
];

export function Footer() {
  return (
    <footer className="px-7 sm:px-14 pt-14 pb-8 border-t border-line-soft">
      <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr_1fr] gap-10">
        <div>
          <Logo />
          <p className="text-[12px] text-ink-muted mt-4 leading-[1.6] max-w-[320px]">
            Helping creators turn audience attention into AI-powered products, systems, and businesses they own.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.h}>
            <div className="text-[10.5px] tracking-[0.06em] uppercase text-ink-faint mb-3.5">{col.h}</div>
            <ul className="list-none p-0 m-0 grid gap-2">
              {col.items.map((i) => (
                <li key={i}>
                  <a href="#" className="text-ink no-underline text-[12.5px] hover:text-accent">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 pt-[22px] border-t border-line-soft flex flex-col sm:flex-row gap-2 justify-between text-[11px] text-ink-faint tracking-[0.02em]">
        <div>© 2026 Creator CTO · Built in public</div>
        <div>creatorcto.com · v0.1</div>
      </div>
    </footer>
  );
}
