import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Section } from "@/components/section";
import { PackView } from "@/components/fsga/pack-view";
import { getAllPackSlugs, getPublicPackBySlug } from "@/lib/fsga/data/packs";

// Static-data mode: packs derive from committed repo data, so every attendee
// page is prerendered at build time — zero runtime compute at the venue.
// dynamicParams stays at its default (true) so an unknown slug still falls
// through to notFound()'s SearchBox recovery page.
export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllPackSlugs().map((slug) => ({ slug }));
}

// Wrapped in React's request-scoped cache() so generateMetadata and the page
// body share one lookup instead of two.
const fetchPack = cache(async (slug: string) => {
  // Static data can't fail the way the DB could, but the error branch stays
  // so reverting to lib/fsga/db/queries is a pure import flip.
  try {
    return { pack: await getPublicPackBySlug(slug), error: false as const };
  } catch (err) {
    console.error(`fsga pack page: error fetching slug "${slug}"`, err);
    return { pack: null, error: true as const };
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { pack } = await fetchPack(slug);

  return {
    title: pack ? `${pack.attendee.name}'s AI Skill Pack` : "AI Skill Pack",
    robots: { index: false, follow: false },
  };
}

export default async function SkillPackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { pack, error } = await fetchPack(slug);

  if (error) {
    return (
      <Section pad="normal">
        <div className="max-w-[480px] mx-auto text-center bg-bg-card border border-line rounded-[18px] p-7">
          <h1 className="text-[20px] font-bold tracking-[-0.03em]">Temporarily unavailable</h1>
          <p className="text-[13px] text-ink-muted mt-2.5 leading-[1.6]">
            We couldn&rsquo;t load this pack right now — try again in a minute.
          </p>
        </div>
      </Section>
    );
  }

  if (!pack) {
    notFound();
  }

  return (
    <Section pad="normal">
      <PackView pack={pack} packSlug={slug} />
    </Section>
  );
}
