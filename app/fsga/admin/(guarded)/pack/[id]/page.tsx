import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Pill } from "@/components/atoms";
import { BtnButton, Field, TextArea, TextInput } from "@/components/fsga/atoms";
import { adminGetPack } from "@/lib/fsga/db/queries";
import { PACK_STATUSES, type PackStatus } from "@/lib/fsga/db/schema";
import { toggleFeaturedAction, updatePackTextAction, updateStatusAction } from "../../actions";

export const metadata: Metadata = {
  title: "FSGA Admin — Edit pack",
  robots: { index: false, follow: false },
};

const STATUS_LABELS: Record<PackStatus, string> = {
  not_started: "Not started",
  auto_generated: "Auto-generated",
  review_needed: "Review needed",
  approved: "Approved",
  featured_for_demo: "Featured for demo",
};

export default async function AdminPackEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await adminGetPack(id);
  if (!detail) notFound();

  const { attendee, pack, items } = detail;
  const redirectTo = `/fsga/admin/pack/${pack.id}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/fsga/admin" className="text-[12px] text-ink-muted no-underline">
          ← All packs
        </Link>
        <h1 className="text-[22px] font-bold tracking-[-0.03em] mt-2">{attendee.name}</h1>
        <p className="text-[13px] text-ink-muted">
          {attendee.title ? `${attendee.title} at ` : ""}
          {attendee.company}
          {attendee.roleCategory ? ` · ${attendee.roleCategory}` : ""}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Pill variant={pack.status === "approved" || pack.status === "featured_for_demo" ? "accent" : "chip"}>
          {STATUS_LABELS[pack.status]}
        </Pill>

        <form action={toggleFeaturedAction} className="inline-flex">
          <input type="hidden" name="packId" value={pack.id} />
          <input type="hidden" name="next" value={String(!pack.featuredForDemo)} />
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button type="submit" className="text-[13px] bg-transparent border-0 cursor-pointer text-ink">
            {pack.featuredForDemo ? "★ featured (click to unfeature)" : "☆ not featured (click to feature)"}
          </button>
        </form>

        <a href={`/fsga/pack/${attendee.publicSlug}`} target="_blank" rel="noreferrer" className="text-[12px] text-ink-muted">
          view public page ↗
        </a>
      </div>

      <p className="text-[12px] text-ink-faint">
        The deck shows packs that are ★ featured AND status approved/featured_for_demo.
      </p>

      <div>
        <p className="text-[11px] uppercase tracking-[0.04em] text-ink-muted mb-2">Status</p>
        <div className="flex flex-wrap gap-2">
          {PACK_STATUSES.map((s) => (
            <form key={s} action={updateStatusAction}>
              <input type="hidden" name="packId" value={pack.id} />
              <input type="hidden" name="status" value={s} />
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <BtnButton type="submit" variant={pack.status === s ? "dark" : "ghost"} disabled={pack.status === s}>
                {STATUS_LABELS[s]}
              </BtnButton>
            </form>
          ))}
        </div>
      </div>

      <form
        action={updatePackTextAction}
        className="flex flex-col gap-4 bg-bg-card border border-line rounded-[18px] p-5"
      >
        <input type="hidden" name="packId" value={pack.id} />
        <Field label="Title">
          <TextInput name="title" defaultValue={pack.title ?? ""} />
        </Field>
        <Field label="Custom intro">
          <TextArea name="customIntro" rows={3} defaultValue={pack.customIntro ?? ""} />
        </Field>
        <Field label="Summary">
          <TextArea name="summary" rows={3} defaultValue={pack.summary ?? ""} />
        </Field>
        <div>
          <BtnButton type="submit">Save</BtnButton>
        </div>
      </form>

      <div className="flex flex-col gap-2">
        <h2 className="text-[11px] uppercase tracking-[0.04em] text-ink-muted">Items ({items.length})</h2>
        <div className="flex flex-col divide-y divide-line-soft border border-line rounded-[18px]">
          {items.map((item) => (
            <div key={item.id} className="px-4 py-3 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-ink-faint">#{item.rank}</span>
                <span className="text-[14px] font-medium">{item.skillSlug}</span>
                {item.recommendedFirst ? <Pill variant="accent">start here</Pill> : null}
              </div>
              {item.customReason ? <p className="text-[13px] text-ink-muted">{item.customReason}</p> : null}
            </div>
          ))}
          {items.length === 0 ? (
            <div className="px-4 py-6 text-center text-ink-faint text-[13px]">No items yet.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
