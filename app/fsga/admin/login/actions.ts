"use server";

import { redirect } from "next/navigation";
import { isAdminConfigured, setAdminCookie, verifyAdminPassword } from "../auth";

export async function loginAction(formData: FormData): Promise<void> {
  // Belt-and-suspenders: the page already hides the form when admin is
  // disabled, but a direct POST (no JS, stale tab) must still be refused.
  if (!isAdminConfigured()) {
    redirect("/fsga/admin/login");
  }

  const password = String(formData.get("password") ?? "");
  if (!verifyAdminPassword(password)) {
    redirect("/fsga/admin/login?error=1");
  }

  await setAdminCookie();
  redirect("/fsga/admin");
}
