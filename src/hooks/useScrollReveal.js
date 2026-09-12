import { useEffect } from 'react';

/**
 * Lightweight, high-performance IntersectionObserver hook for smooth
 * scroll-triggered entrance animations across all devices.
 */
export function useScrollReveal(options = {}) {
  const {
    threshold = 0.02,
    rootMargin = '0px 0px 50px 0px',
    selector = '.reveal-on-scroll',
  } = options;

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add('revealed');
      });
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => observer.observe(el));

    // Observe dynamically mounted elements
    const mutationObserver = new MutationObserver(() => {
      const newElements = document.querySelectorAll(`${selector}:not(.revealed)`);
      newElements.forEach((el) => observer.observe(el));
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [threshold, rootMargin, selector]);
}

export default useScrollReveal;
