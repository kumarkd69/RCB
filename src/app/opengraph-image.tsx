import { ImageResponse } from "next/og";

export const alt = "Namma RCB HQ Official — RCB fan club";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 72, background: "radial-gradient(ellipse at 50% 100%, #B5121B 0%, #0a0a0a 65%)", color: "#FFFFFF", fontFamily: "sans-serif" }}>
        <div style={{ position: "absolute", top: 0, left: 180, width: 220, height: 630, background: "linear-gradient(180deg, rgba(255,246,214,.35), transparent 70%)", transform: "rotate(-18deg)" }} />
        <div style={{ position: "absolute", top: 0, right: 180, width: 220, height: 630, background: "linear-gradient(180deg, rgba(255,246,214,.35), transparent 70%)", transform: "rotate(18deg)" }} />
        <div style={{ fontSize: 28, letterSpacing: 8, color: "#CBA135", textTransform: "uppercase" }}>Official RCB-recognised fan club</div>
        <div style={{ fontSize: 150, fontWeight: 900, lineHeight: 1, display: "flex", gap: 30 }}>
          NAMMA <span style={{ color: "#EC1C24" }}>RCB</span> HQ
        </div>
        <div style={{ fontSize: 34, marginTop: 16, color: "#a8a29a" }}>Screenings · Fan meets · Away trips · Social drives</div>
      </div>
    ),
    size,
  );
}
