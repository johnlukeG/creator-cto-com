import type { Metadata } from "next";
import { DeckShell } from "@/components/fsga/deck/deck-shell";
import { STATIC_FEATURED_PACKS } from "@/lib/fsga/deck/static-data";

// Public replay route: fully prerendered (force-static, zero DB) exactly like
// /fsga/static, but with on-screen nav controls (chevrons + swipe) so a
// returning attendee — usually on a phone, after the talk — can walk the deck
// themselves. The live /fsga/presenter route stays keyboard-only and clean.
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Slides · FSGA",
  robots: { index: false, follow: false },
};

export default function SlidesPage() {
  return <DeckShell featuredPacks={STATIC_FEATURED_PACKS} staticMode={true} navControls />;
}
