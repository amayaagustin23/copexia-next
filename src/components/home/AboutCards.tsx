"use client";

import TiltCard from "@/components/anim/TiltCard";
import { flipInX, stagger } from "@/components/anim/motion";
import { motion } from "framer-motion";

const BLOCKS = ["Propósito", "Equipo", "Enfoque"] as const;

const AboutCards = () => {
  return (
    <motion.div className="grid md:grid-cols-3 gap-6" variants={stagger(0.08)}>
      {BLOCKS.map((block, i) => (
        <TiltCard key={block} className="p-6">
          <motion.div
            id={`sobre-nosotros-${block.toLowerCase()}`}
            variants={flipInX}
            animate={{ y: [0, -4, 0] }}
            transition={{
              repeat: Infinity,
              duration: 6 + i,
              ease: "easeInOut",
            }}
          >
            <h3 className="text-lg font-semibold mb-2">{block}</h3>
            <p className="text-muted-foreground">
              Construimos cambios sostenibles con foco en personas, procesos y
              tecnología.
            </p>
          </motion.div>
        </TiltCard>
      ))}
    </motion.div>
  );
};

export default AboutCards;
