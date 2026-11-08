import "server-only";
import { instagramAccounts, type InstaAccount } from "./config";
import { sanityEnabled } from "./sanity/env";
import { serverClient } from "./sanity/client";
import type { InstaPost } from "./types";

/**
 * Instagram feed, merged from all club handles.
 * Source order per account: Graph API token (Sanity secret doc → env var) → Behold.so JSON feed → nothing.
 * Responses are cached for 1 hour (ISR).
 */
export const INSTAGRAM_REVALIDATE = 3600;
export const TOKEN_DOC_ID = "secrets.instagram"; // ids with a "." are private in Sanity

type TokenDoc = Record<string, string | undefined>;

export async function getStoredTokens(): Promise<TokenDoc> {
  const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
  if (!sanityEnabled || !token) return {};
  try {
    const doc = await serverClient(token).fetch<TokenDoc | null>(`*[_id == $id][0]`, { id: TOKEN_DOC_ID }, { next: { revalidate: INSTAGRAM_REVALIDATE, tags: ["instagram-token"] } });
    return doc ?? {};
  } catch {
    return {};
  }
}

export function tokenFor(acc: InstaAccount, stored: TokenDoc) {
  return stored[acc.key] || process.env[acc.tokenEnv] || "";
}

async function fromGraph(acc: InstaAccount, token: string, limit: number): Promise<InstaPost[]> {
  const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  const res = await fetch(`https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token)}`, {
    next: { revalidate: INSTAGRAM_REVALIDATE, tags: ["instagram"] },
  });
  if (!res.ok) throw new Error(`Graph API ${res.status} for ${acc.handle}`);
  const json = (await res.json()) as { data: { id: string; caption?: string; media_type: InstaPost["mediaType"]; media_url?: string; thumbnail_url?: string; permalink: string; timestamp: string }[] };
  return json.data.map((p) => ({
    id: `${acc.key}-${p.id}`, account: acc.key, handle: acc.handle!, chapterSlug: acc.chapterSlug,
    caption: p.caption ?? "", mediaType: p.media_type, mediaUrl: p.media_url ?? null, thumbnailUrl: p.thumbnail_url ?? null,
    permalink: p.permalink, timestamp: p.timestamp,
  }));
}

async function fromBehold(acc: InstaAccount, url: string, limit: number): Promise<InstaPost[]> {
  const res = await fetch(url, { next: { revalidate: INSTAGRAM_REVALIDATE, tags: ["instagram"] } });
  if (!res.ok) throw new Error(`Behold ${res.status} for ${acc.handle}`);
  const json = await res.json();
  const posts: Record<string, string>[] = Array.isArray(json) ? json : json.posts ?? [];
  return posts.slice(0, limit).map((p) => ({
    id: `${acc.key}-${p.id}`, account: acc.key, handle: acc.handle!, chapterSlug: acc.chapterSlug,
    caption: p.caption ?? "", mediaType: (p.mediaType as InstaPost["mediaType"]) ?? "IMAGE",
    mediaUrl: p.mediaUrl ?? null, thumbnailUrl: p.thumbnailUrl ?? null, permalink: p.permalink, timestamp: p.timestamp,
  }));
}

function placeholders(acc: InstaAccount, n: number): InstaPost[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `${acc.key}-ph-${i}`, account: acc.key, handle: acc.handle!, chapterSlug: acc.chapterSlug,
    caption: `Latest from @${acc.handle} will appear here once Instagram is connected.`,
    mediaType: "IMAGE" as const, mediaUrl: null, permalink: `https://www.instagram.com/${acc.handle}/`,
    timestamp: new Date(Date.now() - (i + 1) * 86_400_000 * (2 + acc.key.length)).toISOString(), placeholder: true,
  }));
}

export async function getInstagramFeed(limitPerAccount = 8): Promise<{ posts: InstaPost[]; connected: boolean }> {
  const stored = await getStoredTokens();
  let connected = false;
  const results = await Promise.all(
    instagramAccounts.filter((a) => a.handle).map(async (acc) => {
      try {
        const token = tokenFor(acc, stored);
        if (token) { const p = await fromGraph(acc, token, limitPerAccount); connected = true; return p; }
        const behold = process.env[acc.beholdEnv];
        if (behold) { const p = await fromBehold(acc, behold, limitPerAccount); connected = true; return p; }
      } catch (e) {
        console.error("[instagram]", e);
      }
      return placeholders(acc, 3);
    }),
  );
  const posts = results.flat().sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
  return { posts, connected };
}
