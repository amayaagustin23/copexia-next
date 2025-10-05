"use client";

import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactSection() {
  const t = useTranslations('home.contact');
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

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

  // Validación del formulario
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.nameRequired');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('validation.nameMin');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.emailInvalid');
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('validation.subjectRequired');
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = t('validation.subjectMin');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('validation.messageRequired');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('validation.messageMin');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  // Manejo de cambios en el formulario
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular envío del formulario
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Resetear formulario después del envío exitoso
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
      // Aquí puedes agregar lógica para mostrar un mensaje de éxito
      console.log('Form submitted successfully:', formData);
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t('info.email.title'),
      content: 'contacto@copexia.com',
      href: 'mailto:contacto@copexia.com',
    },
    {
      icon: Phone,
      title: t('info.phone.title'),
      content: '+54 11 1234-5678',
      href: 'tel:+541112345678',
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
        className={`w-full px-6 sm:px-8 lg:px-12 py-20 max-w-6xl mx-auto transition-all duration-700 ${
          isHovered ? 'transform translate-y-[-2px]' : ''
        }`}
      >
        {/* Header */}
        <header
          className={`text-center mb-16 transition-all duration-700 will-change-transform ${
            inView
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-6 scale-95'
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] sm:text-[11px] tracking-wider uppercase text-muted-foreground mb-4">
              {t('eyebrow')}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              {t('heading')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Información de contacto */}
          <div
            className={`space-y-8 transition-all duration-600 will-change-transform ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: inView ? '200ms' : '0ms' }}
          >
            <div>
              <h3 className="text-xl font-semibold mb-6">{t('info.title')}</h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 group ${
                        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                      style={{ transitionDelay: inView ? `${400 + index * 100}ms` : '0ms' }}
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors duration-200">
                          {item.title}
                        </h4>
                        {item.href && item.href !== '#' ? (
                          <a
                            href={item.href}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">
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
              className={`p-6 rounded-xl border border-border/50 bg-card/30 transition-all duration-600 will-change-transform ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: inView ? '800ms' : '0ms' }}
            >
              <h4 className="font-semibold text-sm mb-3">{t('schedule.title')}</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{t('schedule.weekdays')}</p>
                <p>{t('schedule.weekend')}</p>
                <p className="text-xs mt-2 text-muted-foreground/70">
                  {t('schedule.note')}
                </p>
              </div>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div
            className={`transition-all duration-600 will-change-transform ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: inView ? '400ms' : '0ms' }}
          >
            <div className="p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-6">{t('form.title')}</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      {t('form.name.label')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.name
                          ? 'border-destructive bg-destructive/5'
                          : 'border-border bg-background hover:border-primary/30 focus:border-primary'
                      }`}
                      placeholder={t('form.name.placeholder')}
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {t('form.email.label')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.email
                          ? 'border-destructive bg-destructive/5'
                          : 'border-border bg-background hover:border-primary/30 focus:border-primary'
                      }`}
                      placeholder={t('form.email.placeholder')}
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    {t('form.subject.label')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.subject
                        ? 'border-destructive bg-destructive/5'
                        : 'border-border bg-background hover:border-primary/30 focus:border-primary'
                    }`}
                    placeholder={t('form.subject.placeholder')}
                    disabled={isSubmitting}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {t('form.message.label')}
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none ${
                      errors.message
                        ? 'border-destructive bg-destructive/5'
                        : 'border-border bg-background hover:border-primary/30 focus:border-primary'
                    }`}
                    placeholder={t('form.message.placeholder')}
                    disabled={isSubmitting}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {t('form.submitting')}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
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
          0%, 100% {
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
