"use client";

import { FC } from "react";
import { Autoplay, Navigation, Pagination, Parallax } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Slide = { bg: string; title: string; caption: string };

const slides: Slide[] = [
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

const ParallaxCarousel: FC<{ slides: Slide[] }> = ({ slides }) => (
  <div className="relative max-w-6xl mx-auto">
    <Swiper
      modules={[Parallax, Autoplay, Pagination, Navigation]}
      parallax
      speed={900}
      loop
      centeredSlides
      grabCursor
      slidesPerView={1}
      autoplay={{ delay: 3200, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      className="!pb-10"
    >
      {slides.map((s, i) => (
        <SwiperSlide key={i}>
          <div className="h-[360px] md:h-[440px] relative overflow-hidden rounded-2xl">
            {/* Fondo con parallax (se mueve distinto al contenido) */}
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url(${s.bg})` }}
              data-swiper-parallax="-20%"
            />
            {/* Velo para legibilidad */}
            <div className="absolute inset-0 bg-black/35" aria-hidden />
            {/* Contenido con distintos offsets */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
              <h3
                className="text-2xl md:text-3xl font-semibold text-white"
                data-swiper-parallax="-200"
                data-swiper-parallax-opacity="0.8"
              >
                {s.title}
              </h3>
              <p
                className="text-white/85 mt-2 max-w-3xl"
                data-swiper-parallax="-120"
                data-swiper-parallax-opacity="0.6"
              >
                {s.caption}
              </p>
              <div
                className="mt-5"
                data-swiper-parallax="-60"
                data-swiper-parallax-opacity="0.9"
              >
                <a
                  href="#contacto"
                  className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-primary-foreground font-medium shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Hablemos
                </a>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

const Section = ({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="w-full max-w-6xl mx-auto px-6 py-16 md:py-20">
    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
      {title}
    </h2>
    {children}
  </section>
);

const HomePage = () => {
  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* CAROUSEL con Parallax */}
      <Section title="Lo que hacemos">
        <ParallaxCarousel slides={slides} />
      </Section>

      {/* SERVICIOS */}
      <Section id="servicios" title="Nuestros servicios">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Transformación cultural y organizacional",
              desc: "Procesos de cambio que alinean cultura, liderazgo y formas de trabajo para resultados sostenibles.",
            },
            {
              title: "Adopción tecnológica",
              desc: "Implementación realista de herramientas para asegurar uso con sentido, continuidad y valor.",
            },
            {
              title: "Optimización de procesos",
              desc: "Eficiencia, simplicidad y mejora continua aplicada a tus operaciones clave.",
            },
            {
              title: "Investigaciones internas",
              desc: "Clima, madurez, liderazgo y recomendaciones accionables para evolucionar desde adentro.",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border p-6 bg-card/60 backdrop-blur-sm hover:bg-card transition"
            >
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CONTACTO */}
      <Section id="contacto" title="Contacto">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid md:grid-cols-2 gap-4 w-full rounded-2xl border border-border p-6 bg-card/60 backdrop-blur-sm"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm text-muted-foreground">
              Nombre
            </label>
            <input
              id="name"
              className="w-full rounded-xl bg-input border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Tu nombre"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl bg-input border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="tu@empresa.com"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label htmlFor="message" className="text-sm text-muted-foreground">
              Mensaje
            </label>
            <textarea
              id="message"
              rows={5}
              className="w-full rounded-xl bg-input border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Contanos tu necesidad"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-primary-foreground font-medium shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring">
              Enviar
            </button>
          </div>
        </form>
      </Section>

      <footer className="w-full border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Copexia — Todos los derechos reservados
      </footer>
    </main>
  );
};

export default HomePage;
