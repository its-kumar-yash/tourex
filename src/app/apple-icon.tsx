import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#8a1c3b" }}>
        <svg width="150" height="150" viewBox="0 0 48 48">
          <path d="M12 40V24c0-7 5.4-12.5 12-15 6.6 2.5 12 8 12 15v16" fill="none" stroke="#f3a712" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="24" cy="29" r="6" fill="#e2741d" />
          <path d="M9 40h30" stroke="#fde3c3" strokeWidth="3" strokeLinecap="round" />
          <circle cx="24" cy="14.5" r="1.8" fill="#fde3c3" />
        </svg>
      </div>
    ),
    size,
  );
}
