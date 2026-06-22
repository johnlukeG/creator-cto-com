"use client";

import { useState } from "react";
import { Section } from "./section";
import { faq } from "@/lib/content";

export function Faq() {
  const [open, setOpen] = useState(1);
  return (
    <Section
      id="faq"
      eyebrow="/ faq"
      title="Frequently asked questions."
      sub="The questions creators ask before subscribing."
    >
      <div className="grid gap-2">
        {faq.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="bg-bg-card border border-line rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full flex items-center gap-[18px] px-[22px] py-[18px] bg-transparent border-none cursor-pointer text-left text-inherit font-[inherit]"
              >
                <span
                  className={[
                    "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0",
                    isOpen ? "bg-chip text-chip-ink" : "bg-bg-muted text-ink-muted",
                  ].join(" ")}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[14px] font-medium tracking-[-0.01em]">{it.q}</span>
                <span className="w-7 h-7 rounded-md bg-accent text-accent-ink flex items-center justify-center text-[16px] font-medium shrink-0">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <div className="px-[22px] pb-[22px] pl-[68px] text-[13px] leading-[1.65] text-ink-muted text-pretty">
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
