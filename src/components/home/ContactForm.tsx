"use client";

import MagneticButton from "@/components/anim/MagneticButton";
import { fadeUp, stagger } from "@/components/anim/motion";
import { motion } from "framer-motion";

const ContactForm = () => {
  return (
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
  );
};

export default ContactForm;
