import { Section } from "@/components/section";
import { BuildSkillForm } from "@/components/fsga/build-skill-form";

export default function BuildYourOwnPage() {
  return (
    <Section pad="normal">
      <h1 className="text-[28px] sm:text-[32px] font-bold tracking-[-0.03em] text-center text-balance">
        Build your first Skill
      </h1>
      <p className="text-[13px] text-ink-muted text-center mt-3 max-w-[460px] mx-auto leading-[1.6]">
        Every Skill starts as one sentence: turn a repeated input into a useful output, for a reason that
        matters.
      </p>

      <div className="mt-8">
        <BuildSkillForm />
      </div>
    </Section>
  );
}
