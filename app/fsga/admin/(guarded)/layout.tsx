import type { ReactNode } from "react";
import Link from "next/link";
import { Pill } from "@/components/atoms";
import { Section } from "@/components/section";
import { requireAdmin } from "../auth";
import { logoutAction } from "./actions";

// Guards every page in this route group. Lives in (guarded) — a route
// group, so it does NOT wrap app/fsga/admin/login — rather than directly
// in app/fsga/admin/, so the login page can render without requireAdmin()
// ever running (else logging in would redirect to itself).
export default async function AdminGuardedLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <Section pad="tight">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Pill variant="chip">admin</Pill>
          <Link href="/fsga/admin" className="text-[13px] text-ink-muted hover:text-ink no-underline">
            Packs
          </Link>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-[12px] text-ink-faint hover:text-ink underline bg-transparent border-0 cursor-pointer">
            Log out
          </button>
        </form>
      </div>
      {children}
    </Section>
  );
}
