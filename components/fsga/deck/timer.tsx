"use client";

// FSGA workshop — mm:ss elapsed timer for the presenter notes strip.
//
// Driven entirely by props: `startedAt` (null until the first slide advance,
// per DeckShell's "timer starts on first advance, not on load" rule) and
// `resetKey`, bumped by DeckShell whenever the presenter presses `t`.

import { useEffect, useState } from "react";

function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export function Timer({ startedAt, resetKey }: { startedAt: number | null; resetKey: number }) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (startedAt === null) {
      setElapsedMs(0);
      return;
    }
    const tick = () => setElapsedMs(Date.now() - startedAt);
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
    // resetKey isn't read below, but bumping it forces this effect to
    // re-run and re-anchor the tick immediately on a manual timer reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedAt, resetKey]);

  return <span className="font-mono tabular-nums">{formatElapsed(elapsedMs)}</span>;
}
