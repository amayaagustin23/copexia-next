"use client";

import { fadeIn, stagger } from "@/components/anim/motion";
import { motion } from "framer-motion";

const VALUES = [
  { id: "valores-integridad", t: "Integridad" },
  { id: "valores-impacto", t: "Impacto" },
  { id: "valores-aprendizaje", t: "Aprendizaje continuo" },
] as const;

const ValuesList = () => {
  return (
    <motion.ul
      className="grid md:grid-cols-3 gap-6"
      role="list"
      variants={stagger(0.08)}
    >
      {VALUES.map((v) => (
        <motion.li
          key={v.id}
          id={v.id}
          className="rounded-2xl border border-border p-6 bg-card/60 backdrop-blur-sm"
          variants={fadeIn}
          whileInView={{ scale: [0.94, 1] }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-2">{v.t}</h3>
          <p className="text-muted-foreground">
            Lo que prometemos, lo cumplimos. Medimos, iteramos y mejoramos.
          </p>
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default ValuesList;
