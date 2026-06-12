import { useEffect, useRef } from 'react';

const SELECTOR = '.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)';

function observeElement(el) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => el.classList.add('visible'));
        observer.unobserve(el);
      }
    },
    { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
  );

  // If already in viewport, show immediately
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight * 1.1 && rect.bottom > 0) {
    requestAnimationFrame(() => el.classList.add('visible'));
  } else {
    observer.observe(el);
  }

  return observer;
}

export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = observeElement(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export function useMultiReveal(dep = 0) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observers = [];

    const attachObservers = () => {
      const elements = container.querySelectorAll(SELECTOR);
      elements.forEach(el => {
        const obs = observeElement(el);
        observers.push(obs);
      });
    };

    // Run immediately after paint
    const timer = setTimeout(attachObservers, 60);

    return () => {
      clearTimeout(timer);
      observers.forEach(o => o.disconnect());
    };
  }, [dep]);

  return containerRef;
}
