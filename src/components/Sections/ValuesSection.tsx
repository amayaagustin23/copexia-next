"use client";

import {
  Eye,
  Handshake,
  Heart,
  Sparkles,
  Star,
  Target,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  ComponentType,
  SVGProps,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ValueItem = {
  n: number;
  title: string;
  desc: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export default function ValuesSection() {
  const t = useTranslations("home.values");

  const items: ValueItem[] = useMemo(
    () => [
      { n: 1, title: t("v1.title"), desc: t("v1.desc"), icon: Sparkles }, // Personalización
      { n: 2, title: t("v2.title"), desc: t("v2.desc"), icon: Eye }, // Transparencia
      { n: 3, title: t("v3.title"), desc: t("v3.desc"), icon: Heart }, // Pasión
      { n: 4, title: t("v4.title"), desc: t("v4.desc"), icon: Target }, // Empuje con propósito
      { n: 5, title: t("v5.title"), desc: t("v5.desc"), icon: Users }, // Acompañamiento activo
      { n: 6, title: t("v6.title"), desc: t("v6.desc"), icon: Handshake }, // Construcción compartida
      { n: 7, title: t("v7.title"), desc: t("v7.desc"), icon: Star }, // Excelencia
    ],
    [t]
  );

  const [active, setActive] = useState(0);
  const barRef = useRef<HTMLDivElement | null>(null);

  // Progreso con CSS transitions (sin anime)
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const pct = (active / (items.length - 1)) * 100;
    el.style.width = `${pct}%`;
  }, [active, items.length]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight")
      setActive((i) => Math.min(i + 1, items.length - 1));
    if (e.key === "ArrowLeft") setActive((i) => Math.max(i - 1, 0));
  };

  const ActiveIcon = items[active].icon; // ✅ componente en mayúscula

  return (
    <section id="valores" className="w-full bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <header className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {t("heading")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("subheading")}
          </p>
        </header>

        {/* Ribbon */}
        <div
          className="relative mx-auto max-w-5xl"
          role="tablist"
          aria-label={t("heading")}
          onKeyDown={onKey}
        >
          {/* Línea base */}
          <div className="relative h-2 rounded-full bg-muted border border-border" />

          {/* Progreso */}
          <div
            ref={barRef}
            className="absolute left-0 top-0 h-2 rounded-full"
            style={{
              background: "var(--ring)",
              width: "0%",
              transition: "width 520ms cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
            aria-hidden
          />

          {/* Checkpoints con íconos */}
          <div className="relative mt-[-14px] flex justify-between">
            {items.map((it, i) => {
              const isActive = i === active;
              const Icon = it.icon; // ✅ cada botón usa su propio icono
              return (
                <button
                  key={it.n}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`value-panel-${i}`}
                  id={`value-tab-${i}`}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className="group grid place-items-center focus:outline-none"
                >
                  <span
                    className={[
                      "grid h-8 w-8 place-items-center rounded-full border transition-transform",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-sm scale-110"
                        : "bg-card text-foreground/80 border-border group-hover:scale-105",
                    ].join(" ")}
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel detalle */}
        <div
          key={active /* re-mount para animación CSS */}
          id={`value-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`value-tab-${active}`}
          className="mx-auto mt-6 max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center text-center"
          style={{ animation: "valuesFade 280ms ease-out" }}
        >
          <ActiveIcon className="h-8 w-8 text-primary mb-3" />
          <h3 className="text-lg font-medium">{items[active].title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {items[active].desc}
          </p>
        </div>

        {/* Mobile helper */}
        <p className="mt-3 text-center text-xs text-muted-foreground md:hidden">
          <span className="font-medium">Tip:</span> deslizá la fila de íconos o
          tocá cada uno.
        </p>
      </div>

      {/* keyframes global (evita conflictos con nombres de clase) */}
      <style jsx global>{`
        @keyframes valuesFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
