/**
 * Scroll reveal for elements marked `data-reveal="fade-up" | "stagger"`.
 * Adds `.is-visible` once, the first time an element enters the viewport.
 * Styles live in base.css and only apply after `.reveal-ready` is set on <html>.
 */
let observer: IntersectionObserver | null = null;

export function initReveal() {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)');
  if (targets.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  document.documentElement.classList.add('reveal-ready');

  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.add('is-visible');
        obs.unobserve(el);
        const steps = el.dataset.reveal === 'stagger' ? el.children.length : 0;
        window.setTimeout(() => el.classList.add('reveal-done'), 900 + steps * 90);
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
  );

  targets.forEach((el) => observer?.observe(el));
}

initReveal();
document.addEventListener('astro:page-load', initReveal);
