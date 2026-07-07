import { Btn } from "@/components/atoms";
import { Section } from "@/components/section";
import { SearchBox } from "@/components/fsga/search-box";

export default function PackNotFound() {
  return (
    <Section pad="normal">
      <div className="max-w-[480px] mx-auto text-center">
        <h1 className="text-[24px] font-bold tracking-[-0.03em] text-balance">
          This pack link doesn&rsquo;t match an attendee.
        </h1>
        <p className="text-[13px] text-ink-muted mt-2.5 leading-[1.6]">
          Double check the link, or find your pack below.
        </p>

        <div className="mt-6">
          <SearchBox />
        </div>

        <div className="mt-6">
          <Btn href="/fsga/starter" variant="ghost">
            Build a starter Skill Pack instead
          </Btn>
        </div>
      </div>
    </Section>
  );
}
