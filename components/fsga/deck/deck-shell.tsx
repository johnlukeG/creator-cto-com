"use client";

// FSGA workshop — the deck's runtime shell: fixed-fullscreen stage, keyboard
// navigation, hash-synced position, presenter notes, timer, and progress.
//
// Owns the "suppress the fsga layout chrome" technique too: this component's
// root is a `fixed inset-0` layer above the layout's header/footer, so both
// /fsga/presenter and /fsga/static get the same full-bleed treatment just by
// rendering <DeckShell /> with nothing else in the page body.

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { SLIDES } from "@/lib/fsga/deck/slides";
import type { FeaturedPackData } from "@/lib/fsga/deck/types";
import { NotesPanel } from "./notes-panel";
import { Progress } from "./progress";

const SLIDE_COUNT = SLIDES.length;
const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;

// useLayoutEffect warns when it runs during SSR ("does nothing on the
// server"). DeckShell IS server-rendered (both /fsga/presenter, dynamically,
// and /fsga/static, at build time) before hydration takes over, so guard
// with the standard isomorphic-effect fallback rather than eating the noise.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
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
}: {
  featuredPacks: FeaturedPackData[];
  staticMode: boolean;
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

  const navigate = useCallback((next: number) => {
    const clamped = clampIndex(next);
    setIndex(clamped);
    window.history.replaceState(null, "", `#${clamped}`);
    setStartedAt((prev) => prev ?? Date.now());
  }, []);

  const resetTimer = useCallback(() => {
    setStartedAt(Date.now());
    setResetKey((k) => k + 1);
  }, []);

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
    <div className="fixed inset-0 z-40 bg-bg overflow-hidden">
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
    </div>
  );
}
