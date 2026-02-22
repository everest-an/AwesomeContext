import { ImageResponse } from "next/og";

export const runtime = "edge";
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
          background: "#0a0a0f",
          borderRadius: 40,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32" fill="none">
          <defs>
            <linearGradient id="t" x1="3.9" y1="9" x2="28.1" y2="9">
              <stop stopColor="#b4a4f4" />
              <stop offset="1" stopColor="#9b8ce8" />
            </linearGradient>
            <linearGradient id="l" x1="3.9" y1="9" x2="16" y2="30">
              <stop stopColor="#6e56cf" />
              <stop offset="1" stopColor="#4a3a9e" />
            </linearGradient>
            <linearGradient id="r" x1="28.1" y1="9" x2="16" y2="30">
              <stop stopColor="#5a46b5" />
              <stop offset="1" stopColor="#3d2e8a" />
            </linearGradient>
          </defs>
          <path d="M16 2 L28.1 9 L16 16 L3.9 9 Z" fill="url(#t)" />
          <path d="M3.9 9 L16 16 L16 30 L3.9 23 Z" fill="url(#l)" />
          <path d="M16 16 L28.1 9 L28.1 23 L16 30 Z" fill="url(#r)" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
