import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId, sanityEnabled } from "./env";

export const client = createClient({
  projectId: projectId || "missing",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/** Fetch with cache tags so the Sanity webhook can revalidate by document type. */
export async function sanityFetch<T>(query: string, params: QueryParams = {}, tags: string[] = []): Promise<T> {
  if (!sanityEnabled) throw new Error("Sanity not configured");
  return client.fetch<T>(query, params, { next: { revalidate: 3600, tags } });
}

export const serverClient = (token?: string) =>
  createClient({ projectId: projectId || "missing", dataset, apiVersion, useCdn: false, token });
