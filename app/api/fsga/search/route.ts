// Real skill-search implementation lands in Task 3/4.
export async function GET() {
  return Response.json([], {
    headers: { "Cache-Control": "no-store" },
  });
}
