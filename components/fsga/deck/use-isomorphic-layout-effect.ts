"use client";

// FSGA workshop deck — shared isomorphic-effect hook.
//
// useLayoutEffect warns when it runs during SSR ("does nothing on the
// server"). Both deck-shell.tsx (DeckShell) and slides.tsx (useFitScale) are
// server-rendered (/fsga/presenter dynamically, /fsga/static at build time)
// before hydration takes over, so both need the standard isomorphic-effect
// fallback rather than eating the noise.

import { useEffect, useLayoutEffect } from "react";

export const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
