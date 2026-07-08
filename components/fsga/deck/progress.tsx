// FSGA workshop — minimal projected-stage progress chrome: a thin accent bar
// at the very bottom of the 1920×1080 stage plus a subtle act label. Part of
// the projected stage itself (scales with it) — unlike NotesPanel, which is
// deliberately kept off the scaled stage for presenter-side readability.

export function Progress({ index, total, act }: { index: number; total: number; act: 1 | 2 | 3 | 4 }) {
  const pct = total > 0 ? ((index + 1) / total) * 100 : 0;

  return (
    <div className="absolute inset-x-0 bottom-0 h-[6px]">
      <div className="h-full bg-accent/70" style={{ width: `${pct}%` }} />
      <div className="absolute right-10 bottom-[14px] text-[16px] tracking-[0.08em] uppercase text-ink-faint">
        act {act}
      </div>
    </div>
  );
}
