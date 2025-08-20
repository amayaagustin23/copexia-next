"use client";

import { useMemo, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export type CopexiaItem = {
  k: string; // letra
  title: string; // título corto
  desc: string; // significado
  value?: number; // opcional (default 100)
};

type Props = {
  items: CopexiaItem[];
  height?: number;
};

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow">
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
          {d.k}
        </span>
        <p className="text-sm font-medium">{d.title}</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{d.desc}</p>
    </div>
  );
}

export default function ChartRadarCopexia({ items, height = 360 }: Props) {
  const [active, setActive] = useState<number | null>(null);

  // Dataset con dos series: v (base) y vHi (solo el activo)
  const data = useMemo(() => {
    const base = items.map((it) => ({
      k: it.k,
      title: it.title,
      desc: it.desc,
      v: it.value ?? 100,
    }));
    return base.map((d, i) => ({
      ...d,
      vHi: active === i ? d.v : 0,
    }));
  }, [items, active]);

  return (
    <div
      className="w-full rounded-2xl border border-border bg-card p-4"
      onMouseLeave={() => setActive(null)}
    >
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart
          data={data}
          onMouseMove={(e: any) => {
            const idx = (e?.activeTooltipIndex ?? null) as number | null;
            setActive(idx);
          }}
        >
          <defs>
            <linearGradient id="radarFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--ring)" stopOpacity={0.35} />
              <stop
                offset="100%"
                stopColor="var(--accent)"
                stopOpacity={0.12}
              />
            </linearGradient>
          </defs>

          <PolarGrid gridType="polygon" stroke="var(--border)" radialLines />
          <PolarAngleAxis
            dataKey="k"
            tick={(props: any) => {
              const { payload, x, y, index } = props;
              const isActive = active === index;
              return (
                <g transform={`translate(${x},${y})`}>
                  <foreignObject x={-14} y={-14} width={28} height={28}>
                    <div
                      className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground/80"
                      }`}
                      style={{ lineHeight: "1" }}
                    >
                      {payload.value}
                    </div>
                  </foreignObject>
                </g>
              );
            }}
          />
          <PolarRadiusAxis tick={false} axisLine={false} />

          {/* Serie base */}
          <Radar
            name="COPEXIA"
            dataKey="v"
            stroke="var(--ring)"
            strokeWidth={2}
            fill="url(#radarFill)"
            isAnimationActive
            animationDuration={700}
          />

          {/* Highlight SOLO en el vértice activo */}
          <Radar
            name="active"
            dataKey="vHi"
            stroke="var(--ring)"
            strokeWidth={3}
            fill="var(--ring)"
            fillOpacity={0.15}
            isAnimationActive={false}
          />

          <Tooltip
            wrapperStyle={{ outline: "none" }}
            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
            content={<CustomTooltip />}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
