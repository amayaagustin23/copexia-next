"use client";

import { fadeUp, stagger } from "@/components/anim/motion";
import { motion } from "framer-motion";

type Props = { contactoHref: string };

const HomeHero = ({ contactoHref }: Props) => {
  const bg = "/images/copexia-1.png";

  return (
    <motion.div
      className="relative w-full overflow-hidden px-0!important "
      variants={stagger(0.06)}
      initial="hidden"
      animate="show"
    >
      <div
        aria-hidden
        className="absolute inset-0 top-0 h-full  bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-background/40 to-background" />

      <div className="relative z-10 p-2 md:p-14">
        <motion.h2
          className="text-3xl md:text-4xl font-semibold"
          variants={fadeUp}
        >
          Transformación cultural y organizacional
        </motion.h2>

        <motion.p
          className="mt-3 max-w-2xl text-muted-foreground"
          variants={fadeUp}
          transition={{ delay: 0.05 }}
        >
          Alineamos cultura, liderazgo y formas de trabajo para resultados
          sostenibles.
        </motion.p>

        <motion.div variants={fadeUp} transition={{ delay: 0.1 }}>
          <a
            href={contactoHref}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 hover:opacity-85"
          >
            Hablemos →
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomeHero;
