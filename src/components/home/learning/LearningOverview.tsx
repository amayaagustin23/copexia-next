"use client";
import { BookOpenCheck, BrainCircuit, PlugZap } from "lucide-react";

const MODULES = [
  {
    key: "modelado-datos",
    title: "Modelado de datos",
    icon: <BrainCircuit className="h-5 w-5" />,
    text: "Bases sólidas para reportes y análisis reales.",
  },
  {
    key: "storytelling-ux",
    title: "Visualización & Storytelling",
    icon: <BookOpenCheck className="h-5 w-5" />,
    text: "Tableros que se entienden sin explicación.",
  },
  {
    key: "integraciones",
    title: "Integraciones & Automatización",
    icon: <PlugZap className="h-5 w-5" />,
    text: "Power Automate, Apps y scripts para ir más lejos.",
  },
];

const LearningOverview = () => (
  <div className="grid md:grid-cols-3 gap-6">
    {MODULES.map((m) => (
      <article
        key={m.key}
        className="rounded-2xl border p-6 bg-card shadow-sm"
        data-animate
      >
        <div className="flex items-center gap-2 text-primary mb-2">
          {m.icon}
          <h4 className="font-semibold">{m.title}</h4>
        </div>
        <p className="text-sm text-muted-foreground">{m.text}</p>
        <div className="mt-4">
          <a
            href={`#/learning/${m.key}`}
            className="text-sm underline hover:no-underline"
          >
            Ver contenidos
          </a>
        </div>
      </article>
    ))}
  </div>
);

export default LearningOverview;
