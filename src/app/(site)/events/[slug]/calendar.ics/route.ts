import { getEvent } from "@/lib/data";
import { eventToIcs } from "@/lib/ics";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) return new Response("Not found", { status: 404 });
  return new Response(eventToIcs(e), {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="${slug}.ics"` },
  });
}
