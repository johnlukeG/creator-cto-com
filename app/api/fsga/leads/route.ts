// FSGA workshop — lead capture (starter flow, build-your-own form, pack CTAs).
//
// Honeypot: `website` is a hidden field real attendees never see or fill.
// If it arrives non-empty, we report success (so a bot doesn't learn it was
// caught) but skip the insert entirely.

import { z } from "zod";
import { insertLead } from "@/lib/fsga/db/queries";

const LeadSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  company: z.string().max(200).optional(),
  role: z.string().max(200).optional(),
  workflowInterest: z.string().max(200).optional(),
  subscribe: z.boolean().optional(),
  requestedPackCopy: z.boolean().optional(),
  source: z.enum(["build_form", "starter_flow", "pack_page"]),
  packSlug: z.string().max(160).optional(),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const { website, ...data } = parsed.data;

  // Honeypot tripped — pretend success, do not insert.
  // Untrimmed length check: any nonempty value (including whitespace-only)
  // trips the honeypot, since a real attendee never touches this field.
  if (typeof website === "string" && website.length > 0) {
    return Response.json({ ok: true });
  }

  try {
    await insertLead({
      name: data.name,
      email: data.email,
      company: data.company ?? null,
      role: data.role ?? null,
      workflowInterest: data.workflowInterest ?? null,
      subscribe: data.subscribe ?? false,
      requestedPackCopy: data.requestedPackCopy ?? false,
      source: data.source,
      packSlug: data.packSlug ?? null,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("fsga leads route: DB error", err);
    return Response.json({ ok: false }, { status: 500 });
  }
}
