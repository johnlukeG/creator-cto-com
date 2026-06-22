import { marqueeItems } from "@/lib/content";

export function Marquee() {
  // Two identical halves so the -50% translate loops seamlessly.
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="bg-chip text-chip-ink overflow-hidden border-t border-b border-line">
      <div className="flex gap-14 py-[18px] text-[13px] tracking-[-0.01em] whitespace-nowrap animate-marquee w-max">
        {items.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-3">
            <span className="text-accent">●</span>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
