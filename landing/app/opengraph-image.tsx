import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AwesomeContext — MCP Server for Claude Code";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
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
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1525 50%, #0a0a0f 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 300,
            background: "radial-gradient(ellipse, rgba(110, 86, 207, 0.2) 0%, transparent 70%)",
          }}
        />

        {/* Logo mark */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 32 32"
          fill="none"
        >
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

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#e8e8ed",
            marginTop: 24,
            letterSpacing: "-0.02em",
          }}
        >
          AwesomeContext
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(232, 232, 237, 0.55)",
            marginTop: 12,
          }}
        >
          MCP Server for Claude Code
        </div>

        {/* Metrics bar */}
        <div
          style={{
            display: "flex",
            gap: 48,
            marginTop: 40,
          }}
        >
          {[
            { value: "122+", label: "Modules" },
            { value: "<5ms", label: "Retrieval" },
            { value: "96%", label: "Token Savings" },
          ].map((m) => (
            <div
              key={m.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 700, color: "#9b8ce8" }}>
                {m.value}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(232, 232, 237, 0.35)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginTop: 4,
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
