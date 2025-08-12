"use client";

import ParallaxCarousel from "@/components/ParallaxCarousel";
import Section from "@/components/Section";
import MagneticButton from "@/components/anim/MagneticButton";
import TiltCard from "@/components/anim/TiltCard";
import { fadeIn, fadeUp, stagger } from "@/components/anim/motion";
import { useLocalizedPaths } from "@/lib/hooks/useLocalizedPaths";
import { motion } from "framer-motion";
import { useMemo } from "react";

// data
const slides = [
  {
    bg: "/images/copexia-1.png",
    title: "Transformación cultural y organizacional",
    caption:
      "Alineamos cultura, liderazgo y formas de trabajo para resultados sostenibles.",
  },
  {
    bg: "/images/copexia-2.png",
    title: "Adopción tecnológica",
    caption:
      "Implementación realista para asegurar uso con sentido, continuidad y valor.",
  },
];

export default function HomePage() {
  const rutas = useLocalizedPaths();

  const services = useMemo(
    () => [
      {
        id: "servicios-transformacion",
        title: "Transformación cultural y organizacional",
        desc: "Procesos de cambio que alinean cultura, liderazgo y formas de trabajo para resultados sostenibles.",
      },
      {
        id: "servicios-adopcion",
        title: "Adopción tecnológica",
        desc: "Implementación realista de herramientas para asegurar uso con sentido, continuidad y valor.",
      },
      {
        id: "servicios-optimizacion",
        title: "Optimización de procesos",
        desc: "Eficiencia, simplicidad y mejora continua aplicada a tus operaciones clave.",
      },
      {
        id: "servicios-investigaciones",
        title: "Investigaciones internas",
        desc: "Clima, madurez, liderazgo y recomendaciones accionables para evolucionar desde adentro.",
      },
    ],
    []
  );

  const learning = useMemo(
    () => [
      {
        id: "learning-powerbi",
        title: "Power BI aplicado",
        desc: "Tableros accionables, storytelling con datos y gobierno de BI.",
      },
      {
        id: "learning-adopcion-tecnologica",
        title: "Adopción tecnológica",
        desc: "Estrategias de adopción y change management sin fricción.",
      },
      {
        id: "learning-metodologias",
        title: "Metodologías",
        desc: "Agile, Lean, OKR y herramientas para equipos de alto desempeño.",
      },
      {
        id: "learning-dinamicas",
        title: "Dinámicas y workshops",
        desc: "Talleres prácticos para acelerar aprendizajes en equipo.",
      },
    ],
    []
  );

  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* HERO */}
      <Section id="inicio" title="Lo que hacemos">
        <ParallaxCarousel slides={slides} ctaHref={rutas.secciones.contacto} />
      </Section>

      {/* SERVICIOS (Tilt + stagger) */}
      <Section id="servicios" title="Nuestros servicios">
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={stagger(0.06)}
        >
          {services.map((s, idx) => (
            <TiltCard key={s.id} className="p-6" glow>
              <motion.article
                id={s.id}
                aria-label={s.title}
                variants={fadeUp}
                transition={{ delay: idx * 0.03 }}
              >
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
                <a
                  href={
                    (rutas.sub.servicios as any)[
                      s.id.replace("servicios-", "")
                    ] ?? `#${s.id}`
                  }
                  className="mt-4 inline-flex text-primary hover:opacity-80"
                >
                  Saber más →
                </a>
              </motion.article>
            </TiltCard>
          ))}
        </motion.div>
      </Section>

      {/* SOBRE NOSOTROS (cards que flotan levemente) */}
      <Section id="sobre-nosotros" title="Sobre nosotros">
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={stagger(0.08)}
        >
          {["Propósito", "Equipo", "Enfoque"].map((block, i) => (
            <TiltCard key={block} className="p-6">
              <motion.div
                id={`sobre-nosotros-${block.toLowerCase()}`}
                variants={fadeUp}
                animate={{ y: [0, -4, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 6 + i,
                  ease: "easeInOut",
                }}
              >
                <h3 className="text-lg font-semibold mb-2">{block}</h3>
                <p className="text-muted-foreground">
                  Construimos cambios sostenibles con foco en personas, procesos
                  y tecnología.
                </p>
              </motion.div>
            </TiltCard>
          ))}
        </motion.div>
      </Section>

      {/* LEARNING */}
      <Section id="learning" title="Learning">
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={stagger(0.06)}
        >
          {learning.map((l) => (
            <TiltCard key={l.id} className="p-6" glow>
              <motion.article
                id={l.id}
                variants={fadeUp}
                whileHover={{ scale: 1.01 }}
              >
                <h3 className="text-xl font-semibold mb-2">{l.title}</h3>
                <p className="text-muted-foreground">{l.desc}</p>
                <a
                  href={
                    (rutas.sub.learning as any)[
                      l.id.replace("learning-", "")
                    ] ?? `#${l.id}`
                  }
                  className="mt-4 inline-flex text-primary hover:opacity-80"
                >
                  Ver contenidos →
                </a>
              </motion.article>
            </TiltCard>
          ))}
        </motion.div>
      </Section>

      {/* VALORES (chips que aparecen con scaleIn) */}
      <Section id="valores" title="Valores">
        <motion.ul
          className="grid md:grid-cols-3 gap-6"
          role="list"
          variants={stagger(0.08)}
        >
          {[
            { id: "valores-integridad", t: "Integridad" },
            { id: "valores-impacto", t: "Impacto" },
            { id: "valores-aprendizaje", t: "Aprendizaje continuo" },
          ].map((v) => (
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
      </Section>

      {/* CONTACTO (botón magnético) */}
      <Section id="contacto" title="Contacto">
        <motion.form
          onSubmit={(e) => e.preventDefault()}
          className="grid md:grid-cols-2 gap-4 w-full rounded-2xl border border-border p-6 bg-card/60 backdrop-blur-sm"
          variants={stagger(0.05)}
        >
          <motion.div
            className="flex flex-col gap-2"
            variants={fadeUp}
            id="contacto-nombre"
          >
            <label htmlFor="name" className="text-sm text-muted-foreground">
              Nombre
            </label>
            <input
              id="name"
              className="w-full rounded-xl bg-input border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Tu nombre"
            />
          </motion.div>

          <motion.div
            className="flex flex-col gap-2"
            variants={fadeUp}
            id="contacto-email"
          >
            <label htmlFor="email" className="text-sm text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl bg-input border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="tu@empresa.com"
            />
          </motion.div>

          <motion.div
            className="md:col-span-2 flex flex-col gap-2"
            variants={fadeUp}
            id="contacto-mensaje"
          >
            <label htmlFor="message" className="text-sm text-muted-foreground">
              Mensaje
            </label>
            <textarea
              id="message"
              rows={5}
              className="w-full rounded-xl bg-input border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Contanos tu necesidad"
            />
          </motion.div>

          <motion.div
            className="md:col-span-2 flex justify-end"
            variants={fadeUp}
            id="contacto-submit"
          >
            <MagneticButton>Enviar</MagneticButton>
          </motion.div>
        </motion.form>
      </Section>
    </main>
  );
}
