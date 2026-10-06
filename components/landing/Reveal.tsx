'use client';

import { useEffect } from 'react';

/** Fades `[data-reveal]` elements in as they enter the viewport. Renders nothing. */
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) return;
    root.classList.add('revealReady');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('isIn');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      root.classList.remove('revealReady');
    };
  }, []);
  return null;
}
