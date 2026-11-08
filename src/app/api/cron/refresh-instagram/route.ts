import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { instagramAccounts } from "@/lib/config";
import { getStoredTokens, TOKEN_DOC_ID, tokenFor } from "@/lib/instagram";
import { serverClient } from "@/lib/sanity/client";
import { sanityEnabled } from "@/lib/sanity/env";

/**
 * Weekly Vercel Cron: refresh each long-lived Instagram token (valid 60 days)
 * and store the new one in a private Sanity document so it never expires.
 */
export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const stored = await getStoredTokens();
  const updated: Record<string, string> = {};
  const report: Record<string, string> = {};

  for (const acc of instagramAccounts) {
    const token = tokenFor(acc, stored);
    if (!token) { report[acc.key] = "no token"; continue; }
    const res = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`, { cache: "no-store" });
    if (!res.ok) { report[acc.key] = `failed ${res.status}`; continue; }
    const json = (await res.json()) as { access_token: string; expires_in: number };
    updated[acc.key] = json.access_token;
    report[acc.key] = `ok, expires in ${Math.round(json.expires_in / 86400)}d`;
  }

  const write = process.env.SANITY_API_WRITE_TOKEN;
  if (sanityEnabled && write && Object.keys(updated).length) {
    await serverClient(write).createOrReplace({ _id: TOKEN_DOC_ID, _type: "instagramTokens", ...Object.fromEntries(instagramAccounts.map((a) => [a.key, stored[a.key]]).filter(([, v]) => v)), ...updated, updatedAt: new Date().toISOString() });
    report.saved = "sanity";
  } else if (Object.keys(updated).length) {
    report.saved = "not saved — set SANITY_API_WRITE_TOKEN, or tokens will expire after 60 days";
  }
  revalidateTag("instagram-token");
  revalidateTag("instagram");
  return NextResponse.json(report);
}
