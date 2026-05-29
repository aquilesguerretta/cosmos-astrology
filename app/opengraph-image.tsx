import { ImageResponse } from "next/og";

export const alt = "Cosmos — Your Cosmic Blueprint";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 35%, #2D1B69 0%, #0A0A0F 70%)",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 10, color: "#9B97A8", display: "flex" }}>
          VOL. XIV · EQUINOX EDITION
        </div>
        <div style={{ fontSize: 150, color: "#E8C97A", marginTop: 12, display: "flex" }}>Cosmos</div>
        <div style={{ fontSize: 32, color: "#9B97A8", marginTop: 8, display: "flex" }}>
          Your Cosmic Blueprint
        </div>
      </div>
    ),
    size,
  );
}
