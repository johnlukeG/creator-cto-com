import { notFound } from "next/navigation";
import { Section } from "@/components/section";

export const revalidate = 60;

// Real DB fetch (attendee + skill pack + items by publicSlug) lands in Task 4.
export default async function SkillPackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug !== "demo") {
    notFound();
  }

  return (
    <Section pad="normal">
      <div className="max-w-[640px] mx-auto bg-bg-card border border-line rounded-[18px] p-7">
        <div className="text-[10px] tracking-[0.1em] uppercase text-accent">/ skill pack</div>
        <h1 className="text-[28px] font-bold tracking-[-0.03em] mt-3.5 leading-[1.1] text-balance">
          Demo Skill Pack
        </h1>
        <p className="text-[13px] text-ink-muted mt-3 leading-[1.6]">
          Placeholder pack for slug <code>demo</code>. Real attendee data, generated summary, and ranked
          skill items load from the database starting in Task 4.
        </p>
      </div>
    </Section>
  );
}
