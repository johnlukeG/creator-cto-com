import type { ReactNode } from "react";
import { Pill } from "./atoms";

// Generic section wrapper — centered title row + children.
// Compact density: padY = 80 * 0.78 ≈ 62px, tight = 40px.
export function Section({
  children,
  id,
  eyebrow,
  title,
  sub,
  pad = "normal",
}: {
  children: ReactNode;
  id?: string;
  eyebrow?: string;
  title?: string;
  sub?: string;
  pad?: "normal" | "tight";
}) {
  const padY = pad === "tight" ? 40 : 62;
  return (
    <section id={id} className="px-7 sm:px-14" style={{ paddingTop: padY, paddingBottom: padY }}>
      {(eyebrow || title) && (
        <div className="text-center mb-7">
          {eyebrow && (
            <div className="mb-4">
              <Pill>{eyebrow}</Pill>
            </div>
          )}
          {title && (
            <h2 className="text-[36px] font-bold tracking-[-0.03em] mx-auto max-w-[760px] leading-[1.05] text-balance">
              {title}
            </h2>
          )}
          {sub && (
            <p className="text-[14px] text-ink-muted max-w-[540px] mx-auto mt-3.5 leading-[1.55] text-pretty">
              {sub}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
