// FSGA workshop — presenter-only notes strip. Fixed over the real viewport
// (NOT inside the scaled 1920×1080 stage) so it stays readable at any
// projector/window size, per the deck-shell contract. Hidden by default,
// toggled with `n`.

import type { SlideDef } from "@/lib/fsga/deck/types";
import { Timer } from "./timer";

export function NotesPanel({
  current,
  next,
  index,
  total,
  startedAt,
  resetKey,
}: {
  current: SlideDef;
  next: SlideDef | null;
  index: number;
  total: number;
  startedAt: number | null;
  resetKey: number;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 h-[180px] z-[60] bg-bg-muted/95 border-t border-line grid grid-cols-[1fr_280px] gap-8 px-8 py-5">
      <div className="min-h-0 overflow-y-auto">
        <div className="text-[11px] tracking-[0.08em] uppercase text-ink-faint mb-2">Speaker notes</div>
        <p className="text-[17px] leading-[1.55] text-ink">{current.notes}</p>
      </div>

      <div className="flex flex-col justify-between items-end text-right border-l border-line-soft pl-6 shrink-0">
        <div className="text-[13px] text-ink-muted">
          {index + 1} / {total}
        </div>
        <div className="text-[13px] text-ink-muted line-clamp-2">
          {next ? (
            <>
              next: <span className="text-ink">{next.title}</span>
            </>
          ) : (
            <span className="text-ink-faint">end of deck</span>
          )}
        </div>
        <div className="text-[24px] font-bold text-accent">
          <Timer startedAt={startedAt} resetKey={resetKey} />
        </div>
      </div>
    </div>
  );
}
