"use client";
import { motion } from "framer-motion";
import { FC } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination, Parallax } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { fadeUp } from "./anim/motion";

type Slide = { bg: string; title: string; caption: string };

const ParallaxCarousel: FC<{ slides: Slide[]; ctaHref: string }> = ({
  slides,
  ctaHref,
}) => (
  <div className="relative max-w-6xl mx-auto" id="inicio" aria-label="Inicio">
    {/* progress bar */}
    <motion.div
      className="fixed left-0 right-0 top-0 h-1 z-40 bg-primary origin-left"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: "easeOut" }}
    />
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
            <div
              className="absolute inset-0 bg-center bg-cover will-change-transform"
              style={{ backgroundImage: `url(${s.bg})` }}
              data-swiper-parallax="-20%"
            />
            <div className="absolute inset-0 bg-black/35" aria-hidden />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
              <motion.h3
                className="text-2xl md:text-3xl font-semibold text-white"
                data-swiper-parallax="-200"
                data-swiper-parallax-opacity="0.8"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.6 }}
              >
                {s.title}
              </motion.h3>
              <motion.p
                className="text-white/85 mt-2 max-w-3xl"
                data-swiper-parallax="-120"
                data-swiper-parallax-opacity="0.6"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.08 }}
              >
                {s.caption}
              </motion.p>
              <motion.div
                className="mt-5"
                data-swiper-parallax="-60"
                data-swiper-parallax-opacity="0.9"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.15 }}
              >
                <a
                  href={ctaHref}
                  className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-primary-foreground font-medium shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Hablemos
                </a>
              </motion.div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);
export default ParallaxCarousel;
