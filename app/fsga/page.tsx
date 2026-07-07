import Link from "next/link";
import { Pill } from "@/components/atoms";
import { Section } from "@/components/section";
import { SearchBox } from "@/components/fsga/search-box";

export default function FsgaHomePage() {
  return (
    <Section pad="normal">
      <div className="text-center max-w-[640px] mx-auto">
        <div className="mb-4 flex justify-center">
          <Pill>/ fsga · ai skills workshop</Pill>
        </div>
        <h1 className="text-[32px] sm:text-[44px] font-bold tracking-[-0.03em] leading-[1.08] text-balance">
          Stop doing repeatable work <span className="text-accent">from scratch.</span>
        </h1>
        <p className="text-[14px] text-ink-muted max-w-[480px] mx-auto mt-3.5 leading-[1.55] text-pretty">
          Find the personalized AI Skill Pack built around how you already work.
        </p>

        <div className="mt-7">
          <SearchBox />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 mt-8">
          <Link
            href="/fsga/starter"
            className="bg-bg-card border border-line rounded-[18px] p-5 text-left no-underline hover:border-accent transition-colors block"
          >
            <div className="text-[13px] font-bold tracking-[-0.03em] text-ink">Not on the attendee list?</div>
            <div className="text-[12px] text-ink-muted mt-1.5 leading-[1.5]">
              Answer 3 quick questions and get a starter Skill Pack.
            </div>
          </Link>
          <Link
            href="/fsga/build-your-own"
            className="bg-bg-card border border-line rounded-[18px] p-5 text-left no-underline hover:border-accent transition-colors block"
          >
            <div className="text-[13px] font-bold tracking-[-0.03em] text-ink">Build your first Skill</div>
            <div className="text-[12px] text-ink-muted mt-1.5 leading-[1.5]">
              Turn one repeated task into a Skill, from scratch.
            </div>
          </Link>
        </div>
      </div>
    </Section>
  );
}
