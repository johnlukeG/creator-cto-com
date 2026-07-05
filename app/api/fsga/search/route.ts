// FSGA workshop — attendee search. Must never 500 to the room: any DB error
// degrades to an empty result set rather than surfacing to the client.

import { searchAttendees } from "@/lib/fsga/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (q.length < 2 || q.length > 64) {
    return Response.json([], { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const results = await searchAttendees(q);
    return Response.json(results, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("fsga search route: DB error", err);
    return Response.json([], { headers: { "Cache-Control": "no-store" } });
  }
}
