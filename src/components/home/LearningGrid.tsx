"use client";

import TiltCard from "@/components/anim/TiltCard";
import { flipInX, stagger } from "@/components/anim/motion";
import { motion } from "framer-motion";

type Rutas = ReturnType<
  typeof import("@/lib/hooks/useLocalizedPaths").useLocalizedPaths
>;
type Props = { rutas: Rutas };

const LEARNING = [
  {
    id: "learning-powerbi",
    title: "Power BI aplicado",
    desc: "Tableros accionables, storytelling con datos y gobierno de BI.",
    key: "powerbi",
  },
  {
    id: "learning-adopcion-tecnologica",
    title: "Adopción tecnológica",
    desc: "Estrategias de adopción y change management sin fricción.",
    key: "adopcion",
  },
  {
    id: "learning-metodologias",
    title: "Metodologías",
    desc: "Agile, Lean, OKR y herramientas para equipos de alto desempeño.",
    key: "metodologias",
  },
  {
    id: "learning-dinamicas",
    title: "Dinámicas y workshops",
    desc: "Talleres prácticos para acelerar aprendizajes en equipo.",
    key: "dinamicas",
  },
] as const;

const LearningGrid = ({ rutas }: Props) => {
  return (
    <motion.div className="grid md:grid-cols-2 gap-6" variants={stagger(0.06)}>
      {LEARNING.map((l) => (
        <TiltCard key={l.id} className="p-6" glow>
          <motion.article
            id={l.id}
            variants={flipInX}
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-xl font-semibold mb-2">{l.title}</h3>
            <p className="text-muted-foreground">{l.desc}</p>
            <a
              href={(rutas.sub.learning as any)[l.key] ?? `#${l.id}`}
              className="mt-4 inline-flex text-primary hover:opacity-80"
            >
              Ver contenidos →
            </a>
          </motion.article>
        </TiltCard>
      ))}
    </motion.div>
  );
};

export default LearningGrid;
