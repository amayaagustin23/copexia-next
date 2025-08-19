"use client";
import { ClipboardCheck, Cpu, Workflow } from "lucide-react";

const SERVICES = [
  {
    key: "transformacion",
    title: "Transformación organizacional",
    icon: <Workflow className="h-5 w-5" />,
    bullets: [
      "Diagnóstico cultural y operativo",
      "Mapeo de procesos clave",
      "Plan de cambio paso a paso",
    ],
  },
  {
    key: "adopcion",
    title: "Adopción tecnológica",
    icon: <Cpu className="h-5 w-5" />,
    bullets: [
      "Selección de herramientas útiles",
      "Onboarding y seguimiento real",
      "KPIs de uso y valor",
    ],
  },
  {
    key: "optimizacion",
    title: "Mejora de procesos",
    icon: <ClipboardCheck className="h-5 w-5" />,
    bullets: [
      "Estandarización y 5S",
      "Métricas simples que importan",
      "Menos fricción, más flujo",
    ],
  },
];

const ServicesOverview = () => (
  <div className="grid md:grid-cols-3 gap-6">
    {SERVICES.map((s) => (
      <div
        key={s.key}
        className="rounded-2xl border p-6 bg-card shadow-sm hover:shadow-md transition"
        data-animate
      >
        <div className="flex items-center gap-2 text-primary mb-3">
          {s.icon}
          <h4 className="font-semibold text-lg">{s.title}</h4>
        </div>
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          {s.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="mt-4">
          <a
            href={`#/servicio/${s.key}`}
            className="text-sm underline hover:no-underline"
          >
            Ver más
          </a>
        </div>
      </div>
    ))}
  </div>
);

export default ServicesOverview;
