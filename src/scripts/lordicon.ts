/**
 * Registers the <lord-icon> custom element once.
 * Bundled by Astro — zero external runtime requests.
 */
import { defineElement } from '@lordicon/element';

let registered = false;

export function ensureLordIcon() {
  if (registered || typeof window === 'undefined') return;
  if (customElements.get('lord-icon')) {
    registered = true;
    return;
  }
  defineElement();
  registered = true;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('lord-icon').forEach((el) => {
      el.setAttribute('trigger', 'in');
      el.setAttribute('speed', '0');
    });
  }
}

ensureLordIcon();
document.addEventListener('astro:page-load', ensureLordIcon);
