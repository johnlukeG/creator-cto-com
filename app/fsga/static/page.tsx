import { Section } from "@/components/section";

export const dynamic = "force-static";

export default function StaticDeckPage() {
  return (
    <Section pad="normal">
      <h1 className="text-[32px] font-bold tracking-[-0.03em] text-center">Static deck</h1>
      <p className="text-[13px] text-ink-muted text-center mt-3">Placeholder — deck system lands in Task 6.</p>
    </Section>
  );
}
