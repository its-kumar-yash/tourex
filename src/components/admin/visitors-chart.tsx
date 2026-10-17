"use client";

import { useState } from "react";

export type DayPoint = { day: string; visitors: number; page_views: number; package_views: number };

const W = 720;
const H = 220;
const PAD = { top: 12, right: 8, bottom: 28, left: 36 };
const BAR_MAX = 24;
const SERIES = "#2a78d6"; // sequential blue, single series
const GRID = "#e1e0d9";
const MUTED = "#898781";

function niceMax(v: number) {
  if (v <= 5) return 5;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

/** Single-series column chart: unique visitors per day, with a hover tooltip. */
export function VisitorsChart({ data }: { data: DayPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(1, ...data.map((d) => d.visitors)));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const band = innerW / data.length;
  const barW = Math.min(BAR_MAX, band * 0.6);
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const ticks = [0, max / 2, max];
  const label = (iso: string) => {
    const [, m, d] = iso.split("-").map(Number);
    return `${d}/${m}`;
  };
  const h = hover != null ? data[hover] : null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Unique visitors per day, last 14 days">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth="1" />
            <text x={PAD.left - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill={MUTED}>
              {t.toLocaleString("en-IN")}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = PAD.left + band * i + band / 2;
          const top = y(d.visitors);
          const height = Math.max(0, PAD.top + innerH - top);
          const r = Math.min(4, height / 2);
          return (
            <g key={d.day} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              {/* hit target larger than the mark */}
              <rect x={cx - band / 2} y={PAD.top} width={band} height={innerH} fill="transparent" />
              {height > 0 && (
                <path
                  d={`M${cx - barW / 2},${PAD.top + innerH} v${-(height - r)} a${r},${r} 0 0 1 ${r},${-r} h${barW - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${height - r} z`}
                  fill={SERIES}
                  opacity={hover == null || hover === i ? 1 : 0.55}
                />
              )}
              {(i % 2 === 0 || data.length <= 7) && (
                <text x={cx} y={H - 8} textAnchor="middle" fontSize="11" fill={MUTED}>
                  {label(d.day)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {h && hover != null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 rounded-xl border border-line bg-white px-3 py-2 text-xs shadow-[var(--shadow-card)]"
          style={{ left: `${((PAD.left + band * hover + band / 2) / W) * 100}%`, top: 0 }}
        >
          <p className="font-medium">{h.day}</p>
          <p>{h.visitors} visitors</p>
          <p className="text-ink-soft">{h.page_views} page views · {h.package_views} package views</p>
        </div>
      )}
    </div>
  );
}
