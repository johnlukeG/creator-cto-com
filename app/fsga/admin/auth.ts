// FSGA admin — auth primitives shared by the login page and every guarded
// page/server action.
//
// Design (see task brief): no session store — the admin cookie is a
// deterministic digest of the configured password (+ FSGA_IP_SALT), so
// verifying an incoming cookie is just "recompute and compare," constant
// time. If FSGA_ADMIN_PASSWORD is unset, admin is fully disabled: no
// password compare can ever succeed and no cookie can ever verify, so
// there's no path that "fails open."

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE_NAME = "fsga_admin";
const ADMIN_COOKIE_PATH = "/fsga/admin";
const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function sha256(input: string): Buffer {
  return createHash("sha256").update(input).digest();
}

/**
 * Constant-time string compare: hash both sides with sha256 first so the
 * buffers timingSafeEqual compares are always equal-length (32 bytes),
 * regardless of the raw input lengths.
 */
function timingSafeStringEqual(a: string, b: string): boolean {
  return timingSafeEqual(sha256(a), sha256(b));
}

/** True iff an admin password is configured. Admin is fully disabled otherwise. */
export function isAdminConfigured(): boolean {
  return typeof process.env.FSGA_ADMIN_PASSWORD === "string" && process.env.FSGA_ADMIN_PASSWORD.length > 0;
}

/** The digest a valid admin cookie must carry, or null when admin is disabled. */
function expectedCookieDigest(): string | null {
  if (!isAdminConfigured()) return null;
  const salt = process.env.FSGA_IP_SALT ?? "";
  return sha256(`${process.env.FSGA_ADMIN_PASSWORD}:${salt}`).toString("hex");
}

/** Verify a submitted login password against FSGA_ADMIN_PASSWORD, constant-time. */
export function verifyAdminPassword(password: string): boolean {
  if (!isAdminConfigured()) return false;
  return timingSafeStringEqual(password, process.env.FSGA_ADMIN_PASSWORD!);
}

/** Read + verify the admin cookie on the current request, constant-time. */
export async function hasValidAdminCookie(): Promise<boolean> {
  const expected = expectedCookieDigest();
  if (!expected) return false;

  const jar = await cookies();
  const value = jar.get(ADMIN_COOKIE_NAME)?.value;
  if (!value) return false;

  return timingSafeStringEqual(value, expected);
}

/** Set the admin cookie after a verified login. No-op if admin is disabled. */
export async function setAdminCookie(): Promise<void> {
  const expected = expectedCookieDigest();
  if (!expected) return;

  const jar = await cookies();
  jar.set(ADMIN_COOKIE_NAME, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_COOKIE_MAX_AGE,
    path: ADMIN_COOKIE_PATH,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete({ name: ADMIN_COOKIE_NAME, path: ADMIN_COOKIE_PATH });
}

/**
 * Defense-in-depth guard: call at the top of the guarded layout AND every
 * admin server action (actions are invocable endpoints in their own right,
 * independent of whether a page rendered first). Redirects to login unless
 * a valid admin cookie is present — the same redirect covers both "admin
 * disabled" (env unset) and "wrong/missing cookie," since neither should
 * ever grant access.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await hasValidAdminCookie())) {
    redirect("/fsga/admin/login");
  }
}
