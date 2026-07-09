import type { Metadata } from "next";
import { DeckShell } from "@/components/fsga/deck/deck-shell";
import { STATIC_FEATURED_PACKS } from "@/lib/fsga/deck/static-data";

// Static-data mode: no DB load — the deck's current slides don't render
// featured packs, so the presenter route ships the same static demo set
// /fsga/static uses and prerenders at build time. Nothing to fetch, nothing
// to fail at the venue.

export const metadata: Metadata = {
  title: "Presenter · FSGA",
  robots: { index: false, follow: false },
};

export default function PresenterPage() {
  return <DeckShell featuredPacks={STATIC_FEATURED_PACKS} staticMode={false} />;
}
