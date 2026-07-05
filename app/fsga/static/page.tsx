import type { Metadata } from "next";
import { DeckShell } from "@/components/fsga/deck/deck-shell";
import { STATIC_FEATURED_PACKS } from "@/lib/fsga/deck/static-data";

// Offline-safe fallback route: fully prerendered at build time, zero runtime
// DB dependency. Must never import lib/fsga/db/* — if venue wifi/DB dies,
// this is the deck that still opens.
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "FSGA deck (offline)",
  robots: { index: false, follow: false },
};

export default function StaticDeckPage() {
  return <DeckShell featuredPacks={STATIC_FEATURED_PACKS} staticMode={true} />;
}
