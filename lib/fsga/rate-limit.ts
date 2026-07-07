// FSGA workshop — per-IP hashing + extraction for the generate-skill rate limit.
//
// We never store raw IPs (see generated_skill_ideas.ip_hash + FSGA_IP_SALT in
// .env.example): only a salted SHA-256 hash, so the audit trail can enforce
// per-visitor limits without persisting anything identifying on its own.

import { createHash } from "node:crypto";

export function hashIp(ip: string): string {
  return createHash("sha256")
    .update(ip + (process.env.FSGA_IP_SALT ?? ""))
    .digest("hex");
}

/** First hop of X-Forwarded-For, or "unknown" if the header is absent (e.g. local dev). */
export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (!xff) return "unknown";
  const first = xff.split(",")[0]?.trim();
  return first || "unknown";
}
