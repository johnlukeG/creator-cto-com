"use client";

// FSGA workshop — the deck's runtime shell: fixed-fullscreen stage, keyboard
// navigation, hash-synced position, presenter notes, timer, and progress.
//
// Owns the "suppress the fsga layout chrome" technique too: this component's
// root is a `fixed inset-0` layer above the layout's header/footer, so both
// /fsga/presenter and /fsga/static get the same full-bleed treatment just by
// rendering <DeckShell /> with nothing else in the page body.

import { useCallback, useEffect, useRef, useState } from "react";
import type { TouchEvent as ReactTouchEvent } from "react";
import { SLIDES } from "@/lib/fsga/deck/slides";
import type { FeaturedPackData } from "@/lib/fsga/deck/types";
import { NotesPanel } from "./notes-panel";
import { Progress } from "./progress";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

const SLIDE_COUNT = SLIDES.length;
const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;

function clampIndex(i: number): number {
  return Math.min(Math.max(i, 0), SLIDE_COUNT - 1);
}

function readHashIndex(): number {
  const raw = window.location.hash.replace("#", "");
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? clampIndex(n) : 0;
}

function useStageScale(): number {
  const [scale, setScale] = useState(1);

  useIsomorphicLayoutEffect(() => {
    function recompute() {
      setScale(Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT));
    }
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);

  return scale;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  // VIDEO: while the act-2 Matrix clip has focus, Space/arrows scrub the
  // player — they must not also navigate the deck.
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "VIDEO" || target.isContentEditable;
}

// Swipe guard: a touch that begins on (or inside) an interactive element —
// a calculator answer button, the name-it slide, a link, the Matrix <video> —
// must drive that element, not navigate the deck. Broader than isTypingTarget
// because it walks up from the touch target to catch children of a <button>.
function isInteractiveTarget(target: EventTarget | null): boolean {
  if (isTypingTarget(target)) return true;
  if (target instanceof HTMLElement) {
    return target.closest("button, a, [role='button'], input, textarea") !== null;
  }
  return false;
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen?.().catch(() => {});
    return;
  }
  document.documentElement.requestFullscreen?.().catch(() => {
    // No-op fallback: fullscreen unsupported/denied (e.g. some kiosk browsers).
  });
}

export function DeckShell({
  featuredPacks,
  staticMode,
  navControls = false,
}: {
  featuredPacks: FeaturedPackData[];
  staticMode: boolean;
  // Opt-in on-screen navigation (chevron buttons + touch swipe). Off for the
  // live /fsga/presenter and offline /fsga/static routes so they stay clean;
  // the public /fsga/slides replay route turns it on.
  navControls?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const scale = useStageScale();
  const hasReadHash = useRef(false);

  // Resume on the same slide after a refresh/crash: read #N from the hash
  // once on mount (clamped to range).
  useEffect(() => {
    if (hasReadHash.current) return;
    hasReadHash.current = true;
    setIndex(readHashIndex());
  }, []);

  // Lock body scroll while the deck route is mounted; restore on unmount.
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  const navigate = useCallback(
    (next: number) => {
      const clamped = clampIndex(next);
      setIndex(clamped);
      window.history.replaceState(null, "", `#${clamped}`);
      // Only start the timer on an actual slide change — a clamped no-op
      // (e.g. ArrowLeft on slide 0) must not start the clock.
      if (clamped !== index) {
        setStartedAt((prev) => prev ?? Date.now());
      }
    },
    [index],
  );

  const resetTimer = useCallback(() => {
    setStartedAt(Date.now());
    setResetKey((k) => k + 1);
  }, []);

  // Touch swipe → navigate (only wired up when navControls is on). Records the
  // start point + whether the gesture began on an interactive element; on
  // release, a mostly-horizontal drag past the threshold flips the slide.
  const touchRef = useRef<{ x: number; y: number; skip: boolean } | null>(null);

  const onTouchStart = useCallback((event: ReactTouchEvent) => {
    const t = event.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, skip: isInteractiveTarget(event.target) };
  }, []);

  const onTouchEnd = useCallback(
    (event: ReactTouchEvent) => {
      const start = touchRef.current;
      touchRef.current = null;
      if (!start || start.skip) return;
      const t = event.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        navigate(dx < 0 ? index + 1 : index - 1);
      }
    },
    [navigate, index],
  );

  // Re-subscribed whenever `index` changes so the handler always closes over
  // the current slide position — the deck only has 18 slides, so re-binding
  // on every navigation is negligible.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;

      switch (event.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          event.preventDefault();
          navigate(index + 1);
          break;
        case "ArrowLeft":
        case "PageUp":
          event.preventDefault();
          navigate(index - 1);
          break;
        case "Home":
          event.preventDefault();
          navigate(0);
          break;
        case "End":
          event.preventDefault();
          navigate(SLIDE_COUNT - 1);
          break;
        case "n":
        case "N":
          setNotesOpen((v) => !v);
          break;
        case "t":
        case "T":
          resetTimer();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, navigate, resetTimer]);

  const slide = SLIDES[index];
  const nextSlide = SLIDES[index + 1] ?? null;

  return (
    <div
      className="fixed inset-0 z-40 bg-bg overflow-hidden"
      onTouchStart={navControls ? onTouchStart : undefined}
      onTouchEnd={navControls ? onTouchEnd : undefined}
    >
      <div
        className="absolute left-1/2 top-1/2 overflow-hidden bg-bg"
        style={{
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale > 0 ? scale : 1})`,
          transformOrigin: "center center",
        }}
      >
        {/*
          All 18 slides are mounted at all times, toggled by `visibility`
          (not `display`/conditional-mount): this keeps every slide —
          including the QR code and the packs grid — present in the
          server-rendered HTML for the offline /fsga/static route (no
          client-side hydration required to see real content if JS is slow
          or fails), and it lets teardown's layout-measuring fit-scale hook
          read real geometry for every slide, not just the active one.
        */}
        {SLIDES.map((s, i) => (
          <div key={s.id} className={i === index ? "absolute inset-0 z-10" : "absolute inset-0 z-0 invisible"}>
            {s.render({ featuredPacks, staticMode })}
          </div>
        ))}
        <Progress index={index} total={SLIDE_COUNT} act={slide.act} />
      </div>

      {notesOpen && (
        <NotesPanel
          current={slide}
          next={nextSlide}
          index={index}
          total={SLIDE_COUNT}
          startedAt={startedAt}
          resetKey={resetKey}
        />
      )}

      {/*
        On-screen prev/next controls for the public replay route. Rendered
        outside the scaled stage so they sit at fixed viewport positions (not
        scaled/translated with the slides). Each edge control hides at the end
        of its range. Both funnel through the same navigate() as keyboard/swipe.
      */}
      {navControls && (
        <>
          {index > 0 && (
            <button
              type="button"
              onClick={() => navigate(index - 1)}
              aria-label="Previous slide"
              className="fixed left-3 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg-card/80 text-ink-muted backdrop-blur transition-colors hover:border-accent hover:text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          {index < SLIDE_COUNT - 1 && (
            <button
              type="button"
              onClick={() => navigate(index + 1)}
              aria-label="Next slide"
              className="fixed right-3 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg-card/80 text-ink-muted backdrop-blur transition-colors hover:border-accent hover:text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </>
      )}
    </div>
  );
}
