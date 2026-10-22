import { ImageResponse } from "next/og";

export const alt = "Desi Tours and Travels: hand-picked tours across India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Link preview for WhatsApp, Instagram and other shares of non-package pages. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#8a1c3b", color: "#fffcf7", padding: 72 }}>
        <div style={{ display: "flex", height: 16, width: "100%", background: "linear-gradient(90deg,#e2741d 0 25%,#f3a712 25% 50%,#0f6e6e 50% 75%,#fde3c3 75% 100%)" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05 }}>Desi Tours &amp; Travels</div>
          <div style={{ fontSize: 40, marginTop: 24, color: "#fde3c3" }}>Hand-picked tours across India, with local guides</div>
        </div>
        <div style={{ fontSize: 30, color: "#f3a712" }}>Atithi Devo Bhava · Guests are family</div>
      </div>
    ),
    size,
  );
}
