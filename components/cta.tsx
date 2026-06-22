import { Section } from "./section";
import { Btn, Pill } from "./atoms";
import { LINKS } from "@/lib/content";

export function Cta() {
  return (
    <Section id="subscribe" pad="tight">
      <div className="bg-accent text-accent-ink rounded-[20px] p-8 sm:p-11 text-center max-w-[760px] mx-auto">
        <Pill variant="chip" className="!bg-accent-ink !text-accent">
          Subscribe
        </Pill>
        <h3 className="text-[36px] font-bold tracking-[-0.03em] text-balance my-3 leading-[1.05]">
          Stop renting your audience. Own the stack.
        </h3>
        <p className="text-[14px] opacity-[0.78] leading-[1.55] max-w-[460px] mx-auto">
          Real builds, teardowns, and AI experiments — documented start to finish. Subscribe on YouTube and follow along.
        </p>
        <div className="flex justify-center mt-[22px]">
          <Btn href={LINKS.youtube} variant="dark">
            Subscribe on YouTube
          </Btn>
        </div>
      </div>
    </Section>
  );
}
