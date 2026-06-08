import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const REVEAL_SELECTOR = [
  'main .glass-card',
  'main .section-badge',
  'main .section-title',
  'main .section-subtitle',
  'main .about-mission > *',
  'main .about-contact',
  'main .spot-more-section',
  'main .agri-highlight-grid > *',
].join(',');

export default function ScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('scroll-reveal');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -36px',
    });

    const registerElements = (root = document) => {
      const elements = [
        ...(root.matches?.(REVEAL_SELECTOR) ? [root] : []),
        ...root.querySelectorAll(REVEAL_SELECTOR),
      ];

      elements.forEach((element, index) => {
        if (element.classList.contains('scroll-reveal')) return;

        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) return;

        element.style.setProperty('--scroll-reveal-delay', `${Math.min(index % 4, 3) * 55}ms`);
        element.classList.add('scroll-reveal');
        observer.observe(element);
      });
    };

    const frame = requestAnimationFrame(() => registerElements());
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(({ addedNodes }) => {
        addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) registerElements(node);
        });
      });
    });

    const main = document.querySelector('main');
    if (main) mutationObserver.observe(main, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mutationObserver.disconnect();
      observer.disconnect();
      document.querySelectorAll('.scroll-reveal').forEach(element => {
        element.classList.remove('scroll-reveal');
      });
    };
  }, [pathname]);

  return null;
}
