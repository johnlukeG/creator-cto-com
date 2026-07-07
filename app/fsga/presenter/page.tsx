import type { Metadata } from "next";
import { DeckShell } from "@/components/fsga/deck/deck-shell";
import { getFeaturedPacks } from "@/lib/fsga/db/queries";
import { STATIC_FEATURED_PACKS } from "@/lib/fsga/deck/static-data";
import type { FeaturedPackData } from "@/lib/fsga/deck/types";

// Live-venue route: always render fresh (never cache a stale featured-pack
// set), and never let a DB outage take the deck down mid-talk — fall back to
// the same static demo packs /fsga/static uses.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Presenter · FSGA",
  robots: { index: false, follow: false },
};

async function loadFeaturedPacks(): Promise<FeaturedPackData[]> {
  try {
    const rows = await getFeaturedPacks();
    if (rows.length === 0) return STATIC_FEATURED_PACKS;

    return rows.map((row) => ({
      slug: row.slug,
      attendeeName: row.attendee.name,
      company: row.attendee.company,
      title: row.attendee.title ?? undefined,
      customIntro: row.pack.customIntro ?? undefined,
      summary: row.pack.summary ?? undefined,
      items: row.items.map((item) => ({
        skillSlug: item.slug,
        customReason: item.customReason ?? undefined,
        recommendedFirst: item.recommendedFirst,
      })),
    }));
  } catch (err) {
    console.error("fsga presenter page: DB error fetching featured packs, falling back to static data", err);
    return STATIC_FEATURED_PACKS;
  }
}

export default async function PresenterPage() {
  const featuredPacks = await loadFeaturedPacks();

  return <DeckShell featuredPacks={featuredPacks} staticMode={false} />;
}
