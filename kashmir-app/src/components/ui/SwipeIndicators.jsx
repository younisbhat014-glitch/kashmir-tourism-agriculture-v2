import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CARD_ROW_SELECTOR = 'main .mobile-swipe-row';

export default function SwipeIndicators() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 900px)');
    const registrations = new Map();
    let animationFrame;

    const updateIndicator = (row, indicator) => {
      const rect = row.getBoundingClientRect();
      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      const canScroll = row.scrollWidth > row.clientWidth + 2;
      const isAtStart = row.scrollLeft <= 2;

      indicator.classList.toggle('is-visible', mobileQuery.matches && isVisible && canScroll && isAtStart);
      indicator.style.left = `${Math.min(window.innerWidth - indicator.offsetWidth - 12, rect.right - indicator.offsetWidth)}px`;
      indicator.style.top = `${Math.max(82, rect.top - indicator.offsetHeight - 10)}px`;
    };

    const updateAll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        registrations.forEach(({ indicator }, row) => updateIndicator(row, indicator));
      });
    };

    const registerRows = () => {
      document.querySelectorAll(CARD_ROW_SELECTOR).forEach((row) => {
        if (registrations.has(row)) return;

        const indicator = document.createElement('div');
        indicator.className = 'floating-swipe-indicator';
        indicator.setAttribute('aria-hidden', 'true');
        indicator.textContent = 'Swipe \u2192';
        document.body.appendChild(indicator);

        const registration = { indicator, scrollTimer: undefined };
        const handleRowScroll = () => {
          indicator.classList.remove('is-visible');
          clearTimeout(registration.scrollTimer);
          registration.scrollTimer = setTimeout(updateAll, 140);
        };

        registration.handleRowScroll = handleRowScroll;
        row.addEventListener('scroll', handleRowScroll, { passive: true });
        registrations.set(row, registration);
      });

      updateAll();
    };

    const mutationObserver = new MutationObserver(registerRows);
    const main = document.querySelector('main');

    registerRows();
    if (main) mutationObserver.observe(main, { childList: true, subtree: true });
    window.addEventListener('scroll', updateAll, { passive: true });
    window.addEventListener('resize', updateAll);
    mobileQuery.addEventListener('change', updateAll);

    return () => {
      cancelAnimationFrame(animationFrame);
      mutationObserver.disconnect();
      window.removeEventListener('scroll', updateAll);
      window.removeEventListener('resize', updateAll);
      mobileQuery.removeEventListener('change', updateAll);
      registrations.forEach(({ indicator, handleRowScroll, scrollTimer }, row) => {
        clearTimeout(scrollTimer);
        row.removeEventListener('scroll', handleRowScroll);
        indicator.remove();
      });
      registrations.clear();
    };
  }, [pathname, search]);

  return null;
}
