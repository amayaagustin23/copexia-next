"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { contactService } from '@/lib/services/contactService';
import { ContactSchema, contactSchema } from '@/schemas/contactSchema';

// Importar el mapa de forma dinámica para evitar problemas con SSR
const Map = dynamic(
  () => import('@/components/ui/map').then((mod) => mod.Map),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] bg-muted/30 rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Cargando mapa...</p>
      </div>
    ),
  }
);

export default function ContactSection() {
  const t = useTranslations('home.contact');
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const form = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // Intersection Observer para animaciones de entrada
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setInView(true);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setInView(true);
          }, 100);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animaciones de hover
  const handleMouseEnter = () => {
    if (inView) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Envío del formulario
  const onSubmit = async (data: ContactSchema) => {
    try {
      const response = await contactService.sendContactMessage(data);

      if (response.success) {
        // Resetear formulario después del envío exitoso
        form.reset();

        toast.success(
          response.message ||
            'Mensaje enviado exitosamente. Te responderemos pronto.'
        );
      } else {
        toast.error(
          response.message ||
            'Hubo un error al enviar el mensaje. Inténtalo de nuevo.'
        );
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);

      // Manejar errores de validación del backend
      if (error.response?.status === 400 && error.response?.data?.message) {
        const messages = Array.isArray(error.response.data.message)
          ? error.response.data.message.join('. ')
          : error.response.data.message;
        toast.error(messages);
      } else {
        toast.error(
          'Error al enviar el mensaje. Por favor, inténtalo más tarde.'
        );
      }
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t('info.email.title'),
      content: 'agostinaparada70@gmail.com',
      href: 'mailto:agostinaparada70@gmail.com',
    },
    {
      icon: Phone,
      title: t('info.phone.title'),
      content: '+54 9 3876 43-8499',
      href: 'tel:+5493876438499',
    },
    {
      icon: MapPin,
      title: t('info.location.title'),
      content: t('info.location.address'),
      href: '#',
    },
  ];

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="w-full bg-gradient-to-br from-background via-muted/20 to-background"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`w-full px-3 xs:px-4 sm:px-6 lg:px-8 py-10 xs:py-12 sm:py-16 lg:py-20 transition-all duration-700 ${
          isHovered ? 'transform translate-y-[-2px]' : ''
        }`}
      >
        <header
          className={`text-center mb-6 xs:mb-8 sm:mb-12 lg:mb-16 transition-all duration-700 will-change-transform ${
            inView
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-6 scale-95'
          }`}
        >
          <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-8">
            <p className="text-[9px] xs:text-[10px] sm:text-[11px] tracking-wider uppercase text-muted-foreground mb-2 xs:mb-3 sm:mb-4">
              {t('eyebrow')}
            </p>
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight mb-2 xs:mb-3 sm:mb-4 leading-tight">
              {t('heading')}
            </h2>
            <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-4 xs:gap-6 sm:gap-8 lg:gap-12">
          <div
            className={`space-y-6 xs:space-y-8 transition-all duration-600 will-change-transform ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: inView ? '200ms' : '0ms' }}
          >
            <div>
              <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-2 xs:gap-3 sm:gap-4 p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 group ${
                        inView
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-4'
                      }`}
                      style={{
                        transitionDelay: inView
                          ? `${400 + index * 100}ms`
                          : '0ms',
                      }}
                    >
                      <div className="flex-shrink-0 w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <Icon className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[10px] xs:text-xs sm:text-sm mb-1 group-hover:text-primary transition-colors duration-200">
                          {item.title}
                        </h4>
                        {item.href && item.href !== '#' ? (
                          <a
                            href={item.href}
                            className="text-[9px] xs:text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200 break-words"
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-[9px] xs:text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {item.content}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Horarios de atención */}
            <div
              className={`p-4 xs:p-6 rounded-lg xs:rounded-xl border border-border/50 bg-card/30 transition-all duration-600 will-change-transform ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: inView ? '800ms' : '0ms' }}
            >
              <h4 className="font-semibold text-xs xs:text-sm mb-2 xs:mb-3">
                {t('schedule.title')}
              </h4>
              <div className="space-y-1 xs:space-y-2 text-xs xs:text-sm text-muted-foreground">
                <p>{t('schedule.weekdays')}</p>
                <p>{t('schedule.weekend')}</p>
                <p className="text-[10px] xs:text-xs mt-2 text-muted-foreground/70 leading-relaxed">
                  {t('schedule.note')}
                </p>
              </div>
            </div>

            {/* Mapa de ubicación */}
            <div
              className={`rounded-lg xs:rounded-xl border border-border/50 bg-card/30 overflow-hidden transition-all duration-600 will-change-transform ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: inView ? '900ms' : '0ms' }}
            >
              <Map
                latitude={-26.8241}
                longitude={-65.2226}
                zoom={13}
                markerTitle="Copexia"
                markerDescription={t('info.location.address')}
                className="h-[250px] xs:h-[300px] lg:h-[350px]"
              />
            </div>
          </div>

          {/* Formulario de contacto */}
          <div
            className={`transition-all duration-600 will-change-transform ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: inView ? '400ms' : '0ms' }}
          >
            <div className="p-4 xs:p-6 lg:p-8 rounded-lg xs:rounded-xl lg:rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
              <h3 className="text-lg xs:text-xl font-semibold mb-4 xs:mb-6">
                {t('form.title')}
              </h3>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 xs:space-y-6"
              >
                <div className="grid xs:grid-cols-2 gap-3 xs:gap-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs xs:text-sm font-medium mb-1 xs:mb-2"
                    >
                      {t('form.name.label')}
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      {...form.register('fullName')}
                      className={`w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs xs:text-sm ${
                        form.formState.errors.fullName
                          ? 'border-destructive bg-destructive/5'
                          : 'border-border bg-background hover:border-primary/30 focus:border-primary'
                      }`}
                      placeholder={t('form.name.placeholder')}
                      disabled={form.formState.isSubmitting}
                    />
                    {form.formState.errors.fullName && (
                      <p className="mt-1 text-[10px] xs:text-xs text-destructive">
                        {form.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs xs:text-sm font-medium mb-1 xs:mb-2"
                    >
                      {t('form.email.label')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...form.register('email')}
                      className={`w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs xs:text-sm ${
                        form.formState.errors.email
                          ? 'border-destructive bg-destructive/5'
                          : 'border-border bg-background hover:border-primary/30 focus:border-primary'
                      }`}
                      placeholder={t('form.email.placeholder')}
                      disabled={form.formState.isSubmitting}
                    />
                    {form.formState.errors.email && (
                      <p className="mt-1 text-[10px] xs:text-xs text-destructive">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-xs xs:text-sm font-medium mb-1 xs:mb-2"
                  >
                    {t('form.subject.label')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...form.register('subject')}
                    className={`w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs xs:text-sm ${
                      form.formState.errors.subject
                        ? 'border-destructive bg-destructive/5'
                        : 'border-border bg-background hover:border-primary/30 focus:border-primary'
                    }`}
                    placeholder={t('form.subject.placeholder')}
                    disabled={form.formState.isSubmitting}
                  />
                  {form.formState.errors.subject && (
                    <p className="mt-1 text-[10px] xs:text-xs text-destructive">
                      {form.formState.errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs xs:text-sm font-medium mb-1 xs:mb-2"
                  >
                    {t('form.message.label')}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    {...form.register('message')}
                    className={`w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-xs xs:text-sm ${
                      form.formState.errors.message
                        ? 'border-destructive bg-destructive/5'
                        : 'border-border bg-background hover:border-primary/30 focus:border-primary'
                    }`}
                    placeholder={t('form.message.placeholder')}
                    disabled={form.formState.isSubmitting}
                  />
                  {form.formState.errors.message && (
                    <p className="mt-1 text-[10px] xs:text-xs text-destructive">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-4 xs:px-6 py-2.5 xs:py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed text-xs xs:text-sm active:scale-95"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <div className="w-3 h-3 xs:w-4 xs:h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {t('form.submitting')}
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3 xs:h-4 xs:w-4" />
                      {t('form.submit')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos adicionales */}
      <style jsx>{`
        @keyframes contactFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        .group:hover {
          animation: contactFloat 2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .group:hover {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
