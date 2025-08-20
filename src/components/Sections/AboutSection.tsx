"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { CopexiaItem } from "../ChartRadarCopexia";

type Cell = {
  ch: string;
  key: string;
  isAnchor?: boolean;
  word?: string;
  letterKey?: string;
};

type CrossSpec = {
  word: string;
  letter: string;
  /** Ocurrencia de la letra dentro de la palabra a alinear (1 = primera). */
  occurrence?: number;
};

const ANCHOR = "COPEXIA";

// ===== Utils
const indexOfOccurrence = (word: string, letter: string, occurrence = 1) => {
  let count = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      count++;
      if (count === occurrence) return i;
    }
  }
  return -1;
};

export default function AboutSection() {
  const t = useTranslations("home.about");

  const items: CopexiaItem[] = useMemo(
    () => [
      { k: "C", title: t("letters.C.title"), desc: t("letters.C.desc") },
      { k: "O", title: t("letters.O.title"), desc: t("letters.O.desc") },
      { k: "P", title: t("letters.P.title"), desc: t("letters.P.desc") },
      { k: "E", title: t("letters.E.title"), desc: t("letters.E.desc") },
      { k: "X", title: t("letters.X.title"), desc: t("letters.X.desc") },
      { k: "I", title: t("letters.I.title"), desc: t("letters.I.desc") },
      { k: "A", title: t("letters.A.title"), desc: t("letters.A.desc") },
    ],
    [t]
  );

  const crosses: CrossSpec[] = useMemo(
    () => [
      { word: "COLABORACION", letter: "C", occurrence: 2 },
      { word: "ORGANIZACION", letter: "O" },
      { word: "PERSONALIZACION", letter: "P" },
      { word: "ESTRATEGIA", letter: "E", occurrence: 2 },
      { word: "EXCELENCIA", letter: "X" }, // o "EXPERIENCIA"
      { word: "INNOVACION", letter: "I", occurrence: 2 },
      { word: "ACOMPANAMIENTO", letter: "A" },
    ],
    []
  );

  const { grid, minX, maxX, minY, maxY, infoByLetter } = useMemo(() => {
    const map = new Map<string, Cell>();
    const keyOf = (x: number, y: number) => `${x},${y}`;

    const byLetter = new Map<string, CopexiaItem>();
    items.forEach((it) => byLetter.set(it.k, it));

    // ancla vertical COPEXIA en x=0
    for (let i = 0; i < ANCHOR.length; i++) {
      const ch = ANCHOR[i];
      const k = keyOf(0, i);
      map.set(k, { ch, key: k, isAnchor: true, letterKey: ch, word: ANCHOR });
    }

    // palabras horizontales
    for (const cw of crosses) {
      const row = ANCHOR.indexOf(cw.letter);
      if (row < 0) continue;

      const idxInside = indexOfOccurrence(
        cw.word,
        cw.letter,
        cw.occurrence ?? 1
      );
      if (idxInside < 0) continue;

      const startX = -idxInside; // cruza en x=0
      for (let i = 0; i < cw.word.length; i++) {
        const x = startX + i;
        const y = row;
        const ch = cw.word[i];
        const k = keyOf(x, y);

        const existing = map.get(k);
        if (existing) {
          if (existing.ch !== ch) continue;
        } else {
          map.set(k, {
            ch,
            key: k,
            isAnchor: x === 0,
            word: cw.word,
            letterKey: cw.letter,
          });
        }
      }
    }

    // bounds
    let minX = 0,
      maxX = 0,
      minY = 0,
      maxY = ANCHOR.length - 1;
    for (const k of map.keys()) {
      const [xStr, yStr] = k.split(",");
      const x = parseInt(xStr, 10);
      const y = parseInt(yStr, 10);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    return {
      grid: map,
      minX,
      maxX,
      minY,
      maxY,
      infoByLetter: byLetter,
    };
  }, [items, crosses]);

  const rows = maxY - minY + 1;
  const cols = maxX - minX + 1;

  // ===== Animaciones sin anime.js =====
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // centro para calcular stagger desde el centro
  const centerX = minX + Math.floor(cols / 2);
  const centerY = minY + Math.floor(rows / 2);
  const baseDelay = 28; // ms por “anillo” de distancia al centro

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full bg-background text-foreground"
    >
      {/* Keyframes locales para “respirar” */}
      <style jsx>{`
        @keyframes breathe {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Header con transición manual */}
        <header
          className={[
            "mb-8 transition-all duration-[450ms] will-change-transform",
            inView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[10px]",
          ].join(" ")}
          data-hero
        >
          <p className="text-[11px] tracking-wider uppercase text-muted-foreground">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
            {t("heading")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("intro1")}</p>
          <p className="mt-3 text-muted-foreground">{t("intro2")}</p>
          <p className="mt-3 text-muted-foreground">{t("differential")}</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="lg:order-1">
            <h3 className="text-lg font-medium mb-3">{t("meaningTitle")}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t("meaningDesc")}
            </p>

            <div
              className="relative max-w-2xl w-full mx-auto"
              aria-label="Crucigrama COPEXIA"
              role="application"
            >
              <div
                className="grid w-full"
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: rows * cols }).map((_, i) => {
                  const r = Math.floor(i / cols) + minY;
                  const c = (i % cols) + minX;
                  const cell = grid.get(`${c},${r}`);
                  const has = Boolean(cell);
                  const isAnchorCol = c === 0 && has;

                  const item = cell?.letterKey
                    ? infoByLetter.get(cell.letterKey)
                    : undefined;

                  // stagger: distancia Manhattan al centro
                  const dist = Math.abs(c - centerX) + Math.abs(r - centerY);
                  const delayMs = dist * baseDelay;

                  return (
                    <div
                      key={`${c},${r}`}
                      data-cell
                      data-anchor={isAnchorCol ? "true" : "false"}
                      className={[
                        "relative aspect-square m-[2px] rounded-md border will-change-transform",
                        // colores de celda
                        has
                          ? "border-border bg-card"
                          : "border-transparent bg-muted/30",
                        isAnchorCol ? "bg-primary text-primary-foreground" : "",
                        // tipografía y centrado
                        "grid place-items-center text-sm font-semibold",
                        // transición de entrada + hover
                        "transition-[transform,opacity,filter] duration-500 ease-out",
                        inView
                          ? "opacity-100 scale-100 blur-0"
                          : "opacity-0 scale-[0.8] blur-[2px]",
                        "hover:scale-[1.06]",
                      ].join(" ")}
                      style={{
                        transitionDelay: inView ? `${delayMs}ms` : undefined,
                        animation:
                          inView && isAnchorCol
                            ? "breathe 2200ms ease-in-out infinite"
                            : undefined,
                      }}
                    >
                      {cell?.ch ?? ""}
                      {has && item && (
                        <div
                          className={[
                            "pointer-events-none absolute z-10 w-64 rounded-xl border border-border bg-popover p-3 shadow-sm",
                            "opacity-0 translate-y-1 transition-all duration-200",
                            "hover:opacity-100 hover:translate-y-0",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-2">
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                              {cell!.letterKey}
                            </span>
                            <p className="font-medium text-sm">{item.title}</p>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {items.map((it) => (
                  <li key={it.k} className="flex items-start gap-2">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                      {it.k}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{it.title}</p>
                      <p className="text-xs text-muted-foreground">{it.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:order-2" />
        </div>
      </div>
    </section>
  );
}
