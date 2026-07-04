import { Btn } from "@/components/atoms";
import { Section } from "@/components/section";

export default function FsgaHomePage() {
  return (
    <Section pad="normal">
      <div className="text-center max-w-[720px] mx-auto">
        <h1 className="text-[40px] sm:text-[52px] font-bold tracking-[-0.03em] leading-[1.05] text-balance">
          Your personalized <span className="text-accent">AI Skill Pack</span> starts here.
        </h1>
        <p className="text-[14px] text-ink-muted max-w-[540px] mx-auto mt-3.5 leading-[1.55] text-pretty">
          Placeholder copy — real hook lands before the workshop. Scan the QR at your seat or pick a path
          below to find the skills built around how you work.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
          <Btn href="/fsga/starter" variant="primary">
            Find my starter skill
          </Btn>
          <Btn href="/fsga/build-your-own" variant="ghost">
            Build your own pack
          </Btn>
        </div>
      </div>
    </Section>
  );
}
