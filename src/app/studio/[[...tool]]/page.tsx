import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { sanityEnabled } from "@/lib/sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!sanityEnabled) {
    return (
      <main style={{ padding: 40, fontFamily: "system-ui", color: "#FFFFFF", background: "#0a0a0a", minHeight: "100vh" }}>
        <h1>Studio not connected</h1>
        <p>Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in your environment (see README.md) and redeploy.</p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
