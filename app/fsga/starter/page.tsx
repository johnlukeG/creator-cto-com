import { Suspense } from "react";
import { Section } from "@/components/section";
import { StarterFlow } from "@/components/fsga/starter-flow";

export default function StarterPage() {
  return (
    <Section pad="normal">
      <h1 className="text-[28px] sm:text-[32px] font-bold tracking-[-0.03em] text-center text-balance">
        Find your starter Skill
      </h1>
      <p className="text-[13px] text-ink-muted text-center mt-3 max-w-[440px] mx-auto leading-[1.6]">
        Three quick questions, then a personalized set of AI Skills to try.
      </p>

      <div className="mt-8">
        <Suspense fallback={<p className="text-[12px] text-ink-faint text-center">Loading…</p>}>
          <StarterFlow />
        </Suspense>
      </div>
    </Section>
  );
}
