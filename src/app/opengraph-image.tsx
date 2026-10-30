import { ImageResponse } from "next/og";

export const alt = "Next.js showcase — Benoît Bremaud's public GitHub projects";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Next.js requires a default export for metadata image files.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0f172a",
          color: "#f8fafc",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700 }}>Next.js showcase</div>
        <div style={{ fontSize: 36, marginTop: 24, color: "#cbd5e1" }}>Benoît Bremaud · public GitHub projects</div>
      </div>
    ),
    size,
  );
}
