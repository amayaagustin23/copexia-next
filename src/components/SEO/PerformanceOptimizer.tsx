'use client';

import { useEffect } from 'react';

export function PerformanceOptimizer() {
  useEffect(() => {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));

    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload next page resources
      const links = document.querySelectorAll('a[href^="/"]');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && !document.querySelector(`link[href="${href}"]`)) {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'prefetch';
          preloadLink.href = href;
          document.head.appendChild(preloadLink);
        }
      });
    };

    // Preload on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadCriticalResources);
    } else {
      setTimeout(preloadCriticalResources, 100);
    }

    // Cleanup
    return () => {
      imageObserver.disconnect();
    };
  }, []);

  return null;
}

export default PerformanceOptimizer;
