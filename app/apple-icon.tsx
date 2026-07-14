import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 40%, #2D1B69 0%, #0A0A0F 75%)",
        }}
      >
        <svg width="128" height="128" viewBox="0 0 22 22">
          <circle cx="11" cy="11" r="6" fill="none" stroke="#E8C97A" strokeWidth="0.7" />
          <circle cx="11" cy="11" r="10" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.6" />
          <circle cx="11" cy="11" r="1.5" fill="#E8C97A" />
          <circle cx="17" cy="11" r="1" fill="#E8C97A" />
        </svg>
      </div>
    ),
    size,
  );
}
