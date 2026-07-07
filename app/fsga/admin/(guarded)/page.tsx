import Link from "next/link";
import type { Metadata } from "next";
import { Pill } from "@/components/atoms";
import { adminListPacks } from "@/lib/fsga/db/queries";
import { PACK_STATUSES, type PackStatus } from "@/lib/fsga/db/schema";
import { toggleFeaturedAction } from "./actions";

export const metadata: Metadata = {
  title: "FSGA Admin — Packs",
  robots: { index: false, follow: false },
};

const STATUS_LABELS: Record<PackStatus, string> = {
  not_started: "Not started",
  auto_generated: "Auto-generated",
  review_needed: "Review needed",
  approved: "Approved",
  featured_for_demo: "Featured for demo",
};

function statusVariant(status: PackStatus): "accent" | "chip" {
  return status === "approved" || status === "featured_for_demo" ? "accent" : "chip";
}

export default async function AdminPacksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const statusFilter =
    statusParam && (PACK_STATUSES as readonly string[]).includes(statusParam)
      ? (statusParam as PackStatus)
      : undefined;

  const packs = await adminListPacks();

  const counts = packs.reduce(
    (acc, p) => {
      acc[p.pack.status] = (acc[p.pack.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<PackStatus, number>,
  );
  const featuredCount = packs.filter((p) => p.pack.featuredForDemo).length;

  const visiblePacks = statusFilter ? packs.filter((p) => p.pack.status === statusFilter) : packs;
  const redirectTo = statusFilter ? `/fsga/admin?status=${statusFilter}` : "/fsga/admin";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-bold tracking-[-0.03em]">Skill packs</h1>
        <p className="text-[13px] text-ink-muted mt-1">
          {packs.length} packs · {featuredCount} featured
          {PACK_STATUSES.filter((s) => counts[s]).map((s) => (
            <span key={s}> · {counts[s]} {STATUS_LABELS[s].toLowerCase()}</span>
          ))}
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        <Link
          href="/fsga/admin"
          className={`no-underline text-[11px] uppercase tracking-[0.04em] px-3 py-1.5 rounded-full border ${
            !statusFilter ? "border-accent text-accent" : "border-line text-ink-muted"
          }`}
        >
          All ({packs.length})
        </Link>
        {PACK_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/fsga/admin?status=${s}`}
            className={`no-underline text-[11px] uppercase tracking-[0.04em] px-3 py-1.5 rounded-full border ${
              statusFilter === s ? "border-accent text-accent" : "border-line text-ink-muted"
            }`}
          >
            {STATUS_LABELS[s]} ({counts[s] ?? 0})
          </Link>
        ))}
      </nav>

      <div className="border border-line rounded-[18px] overflow-x-auto">
        <table className="w-full text-[13px] min-w-[640px]">
          <thead>
            <tr className="border-b border-line-soft text-left text-ink-muted text-[11px] uppercase tracking-[0.04em]">
              <th className="px-4 py-3 font-medium">Attendee</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {visiblePacks.map(({ attendee, pack }) => (
              <tr key={pack.id} className="border-b border-line-soft last:border-0">
                <td className="px-4 py-3">{attendee.name}</td>
                <td className="px-4 py-3 text-ink-muted">{attendee.company}</td>
                <td className="px-4 py-3 text-ink-muted">{attendee.roleCategory ?? "—"}</td>
                <td className="px-4 py-3">
                  <Pill variant={statusVariant(pack.status)}>{STATUS_LABELS[pack.status]}</Pill>
                </td>
                <td className="px-4 py-3">
                  <form action={toggleFeaturedAction}>
                    <input type="hidden" name="packId" value={pack.id} />
                    <input type="hidden" name="next" value={String(!pack.featuredForDemo)} />
                    <input type="hidden" name="redirectTo" value={redirectTo} />
                    <button
                      type="submit"
                      className="text-[16px] leading-none bg-transparent border-0 cursor-pointer"
                      aria-label={pack.featuredForDemo ? "Unfeature this pack" : "Feature this pack"}
                      title={pack.featuredForDemo ? "Featured — click to unfeature" : "Not featured — click to feature"}
                    >
                      {pack.featuredForDemo ? "★" : "☆"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link href={`/fsga/admin/pack/${pack.id}`} className="text-accent text-[12px] mr-3">
                    edit
                  </Link>
                  <a
                    href={`/fsga/pack/${attendee.publicSlug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-muted text-[12px]"
                  >
                    view ↗
                  </a>
                </td>
              </tr>
            ))}
            {visiblePacks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ink-faint text-[13px]">
                  No packs match this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
