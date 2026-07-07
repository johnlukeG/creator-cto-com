"use server";

// Server actions for every mutation the guarded admin pages expose. Every
// export here calls requireAdmin() FIRST — actions are invocable endpoints
// in their own right (a form POST doesn't prove the page that rendered the
// form ever ran requireAdmin() itself), so this is the defense-in-depth
// layer the task brief calls for, not a redundant check.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  adminToggleFeatured,
  adminUpdatePackStatus,
  adminUpdatePackText,
} from "@/lib/fsga/db/queries";
import { PACK_STATUSES, type PackStatus } from "@/lib/fsga/db/schema";
import { clearAdminCookie, requireAdmin } from "../auth";

function isPackStatus(value: string): value is PackStatus {
  return (PACK_STATUSES as readonly string[]).includes(value);
}

function safeRedirectTarget(value: string): string {
  // Guard against the redirectTo hidden field being turned into an
  // open redirect — only ever follow it within /fsga/admin.
  return value.startsWith("/fsga/admin") ? value : "/fsga/admin";
}

export async function logoutAction(): Promise<void> {
  await clearAdminCookie();
  redirect("/fsga/admin/login");
}

export async function updateStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const packId = String(formData.get("packId") ?? "");
  const status = String(formData.get("status") ?? "");
  const redirectTo = safeRedirectTarget(String(formData.get("redirectTo") ?? "/fsga/admin"));

  if (!packId || !isPackStatus(status)) {
    redirect(redirectTo);
  }

  await adminUpdatePackStatus(packId, status);
  revalidatePath("/fsga/admin");
  revalidatePath(`/fsga/admin/pack/${packId}`);
  redirect(redirectTo);
}

export async function toggleFeaturedAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const packId = String(formData.get("packId") ?? "");
  const next = formData.get("next") === "true";
  const redirectTo = safeRedirectTarget(String(formData.get("redirectTo") ?? "/fsga/admin"));

  if (!packId) {
    redirect(redirectTo);
  }

  await adminToggleFeatured(packId, next);
  revalidatePath("/fsga/admin");
  revalidatePath(`/fsga/admin/pack/${packId}`);
  redirect(redirectTo);
}

export async function updatePackTextAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const packId = String(formData.get("packId") ?? "");
  if (!packId) {
    redirect("/fsga/admin");
  }

  const title = String(formData.get("title") ?? "").trim();
  const customIntro = String(formData.get("customIntro") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();

  await adminUpdatePackText(packId, {
    title: title || null,
    customIntro: customIntro || null,
    summary: summary || null,
  });
  revalidatePath(`/fsga/admin/pack/${packId}`);
  revalidatePath("/fsga/admin");
  redirect(`/fsga/admin/pack/${packId}`);
}
