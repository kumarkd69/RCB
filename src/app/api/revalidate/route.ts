import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type Payload = { _type: string; slug?: string };

/**
 * Sanity webhook → revalidate pages within seconds of publishing.
 * Webhook settings: POST {SITE}/api/revalidate, projection {_type, "slug": slug.current}, secret = SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<Payload>(req, process.env.SANITY_REVALIDATE_SECRET);
    if (!isValidSignature) return new NextResponse("Invalid signature", { status: 401 });
    if (!body?._type) return new NextResponse("Bad request", { status: 400 });
    revalidateTag(body._type);
    // settings/chapters appear in the shared layout → refresh everything
    if (["siteSettings", "chapter", "teamMember"].includes(body._type)) revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true, type: body._type, slug: body.slug ?? null, now: Date.now() });
  } catch (e) {
    console.error(e);
    return new NextResponse((e as Error).message, { status: 500 });
  }
}
