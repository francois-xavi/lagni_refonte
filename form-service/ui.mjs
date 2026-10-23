// Presentation layer for /admin/. server.mjs keeps routing and data access;
// everything that produces HTML lives here.
//
// Two constraints shape all of it:
//
//   1. No JavaScript. The CSP is `default-src 'none'; style-src 'unsafe-inline'`,
//      so every interaction is native HTML: <details>, POST forms, GET links.
//      Inline <svg> is markup, not a fetched resource, so icons are fine.
//   2. The brand fonts are not available here. Archivo and Inter reach the
//      public site through npm @fontsource imports in the Astro build; a
//      standalone Node service does not serve them. We use the system stack on
//      purpose — sharp, instant, no external request, CSP untouched. Brand
//      consistency comes from colour, spacing and shape instead.

export const esc = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

export const fmtDate = (s) =>
  new Date(`${s.replace(' ', 'T')}Z`).toLocaleString('fr-CA', {
    timeZone: 'America/Toronto',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

// ───────────────────────────────────────────────────────────────── tokens
// These duplicate src/styles/tokens.css by necessity: this service is a
// separate deployable with no access to the site's stylesheets. Keep the names
// identical so both codebases read the same, and update them together.

const TOKENS = `
:root{
  --blue-900:#002e6b; --blue-800:#003a87; --blue-700:#004aad;
  --blue-200:#c7dbf4; --blue-100:#e8f0fb; --blue-050:#f4f8fd;
  --orange-700:#ac521a; --orange-650:#b85a1f; --orange-500:#ff914d;
  --orange-200:#ffd6bb; --orange-050:#fff3ea;
  --ink:#1a2433; --ink-soft:#33415a; --muted:#5b6b7f;
  --line:#dce4ee; --line-soft:#eaf0f7; --white:#fff; --bg:#f4f7fb;
  /* Field boundaries need 3:1 (WCAG 1.4.11); --line is 1.28:1 and is kept for
     decorative rules only. */
  --field-line:#8490a1;
  --danger:#b3261e; --danger-bg:#fdecea; --danger-line:#f2c4c0;
  --success:#1c6c4a; --success-bg:#e7f4ee; --success-line:#b6ddc9;
  --focus-ring:var(--blue-900); --focus-halo:#fff;
  --s-1:.25rem; --s-2:.5rem; --s-3:.75rem; --s-4:1rem; --s-5:1.25rem;
  --s-6:1.5rem; --s-8:2rem; --s-10:2.5rem; --s-12:3rem;
  --radius-sm:4px; --radius:8px; --radius-lg:12px; --radius-pill:999px;
  --shadow-sm:0 1px 3px rgba(0,46,107,.08);
  --shadow-md:0 4px 16px rgba(0,46,107,.10);
  --font:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
}`;

const CSS = `${TOKENS}
*,*::before,*::after{box-sizing:border-box}
*{margin:0}
body{font-family:var(--font);font-size:1rem;line-height:1.6;color:var(--ink);background:var(--bg);-webkit-font-smoothing:antialiased}
h1,h2,h3{line-height:1.2;letter-spacing:-.015em;color:var(--blue-900);text-wrap:balance}
h1{font-size:1.625rem;font-weight:800}
h2{font-size:1.0625rem;font-weight:700}
p{text-wrap:pretty}
a{color:var(--blue-700);text-underline-offset:.2em}
ul{padding:0;list-style:none}
button,input,select,textarea{font:inherit;color:inherit}

/* Dark ring for light surfaces, white halo for the blue header: one rule that
   clears 3:1 on both (WCAG 2.2 SC 1.4.11). */
:focus-visible{outline:3px solid var(--focus-ring);outline-offset:2px;box-shadow:0 0 0 6px var(--focus-halo);border-radius:2px}

.skip{position:absolute;left:var(--s-4);top:var(--s-2);z-index:20;transform:translateY(-250%);background:var(--blue-700);color:var(--white);padding:var(--s-3) var(--s-5);border-radius:var(--radius);font-weight:600;text-decoration:none;transition:transform .15s ease}
.skip:focus{transform:translateY(0)}

/* ── header ── */
.hdr{background:var(--blue-700);color:var(--white)}
.hdr__in{max-width:68rem;margin-inline:auto;padding:var(--s-3) var(--s-4);display:flex;align-items:center;gap:var(--s-4) var(--s-6);flex-wrap:wrap}
.hdr__brand{font-weight:800;letter-spacing:-.01em;margin-right:auto;display:flex;align-items:baseline;gap:var(--s-2)}
.hdr__brand span{font-size:.75rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.78)}
.hdr__nav{display:flex;gap:var(--s-1);flex-wrap:wrap}
.hdr__nav a{color:var(--white);text-decoration:none;font-weight:600;font-size:.9375rem;padding:var(--s-2) var(--s-3);border-radius:var(--radius);border:1.5px solid transparent;transition:background-color .18s ease,border-color .18s ease}
.hdr__nav a:hover{background:rgba(255,255,255,.14)}
.hdr__nav a[aria-current]{background:var(--white);color:var(--blue-700)}
.hdr__out{background:none;border:0;color:var(--white);font-size:.9375rem;font-weight:600;cursor:pointer;padding:var(--s-2);text-decoration:underline;text-underline-offset:.2em}

/* ── layout ── */
.wrap{max-width:68rem;margin-inline:auto;padding:var(--s-8) var(--s-4) var(--s-12)}
.wrap--bare{max-width:34rem;text-align:center}
.wrap--bare .head{justify-content:center}
.wrap--bare .lead{margin-inline:auto}
main:focus{outline:none}
.head{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--s-4);flex-wrap:wrap;margin-bottom:var(--s-2)}
.lead{color:var(--muted);max-width:62ch;margin-bottom:var(--s-6)}
.stack>*+*{margin-top:var(--s-3)}

/* ── flash ── */
.flash{display:flex;align-items:center;gap:var(--s-3);padding:var(--s-3) var(--s-4);margin-bottom:var(--s-6);border-radius:var(--radius);font-weight:600;background:var(--success-bg);border:1px solid var(--success-line);color:var(--success)}
.flash:empty{display:none}
.flash svg{flex-shrink:0}

/* ── filters ── */
.filters{display:flex;gap:var(--s-2);flex-wrap:wrap;margin-bottom:var(--s-6)}
.filters a{display:inline-flex;align-items:center;gap:var(--s-2);padding:var(--s-2) var(--s-4);border:1px solid var(--line);border-radius:var(--radius-pill);background:var(--white);color:var(--ink-soft);text-decoration:none;font-size:.9375rem;font-weight:600;transition:border-color .18s ease,background-color .18s ease}
.filters a:hover{border-color:var(--blue-200);background:var(--blue-050)}
.filters a[aria-current]{background:var(--blue-700);border-color:var(--blue-700);color:var(--white)}
.filters .n{font-variant-numeric:tabular-nums;font-size:.8125rem;padding:0 .4rem;border-radius:var(--radius-pill);background:var(--blue-050);color:var(--blue-900)}
.filters a[aria-current] .n{background:rgba(255,255,255,.22);color:var(--white)}

/* ── cards ── */
.card{background:var(--white);border:1px solid var(--line);border-left:4px solid var(--line);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);overflow:hidden}
.card--new{border-left-color:var(--orange-500)}
.card--done{border-left-color:var(--line);background:#fcfdfe}
.card>summary{display:flex;align-items:center;gap:var(--s-2) var(--s-4);flex-wrap:wrap;padding:var(--s-4) var(--s-5);cursor:pointer;list-style:none}
.card>summary::-webkit-details-marker{display:none}
.card>summary:hover{background:var(--blue-050)}
.card__name{flex:1;min-width:11rem;font-size:1.0625rem}
.card__meta{display:flex;gap:var(--s-2) var(--s-3);flex-wrap:wrap;align-items:center;font-size:.875rem;color:var(--muted)}
.card__chev{flex-shrink:0;color:var(--muted);transition:transform .2s ease}
.card[open] .card__chev{transform:rotate(90deg)}
.card__body{padding:0 var(--s-5) var(--s-5);border-top:1px solid var(--line-soft)}
.card dl{display:grid;gap:var(--s-1) var(--s-5);margin-top:var(--s-4)}
@media(min-width:640px){.card dl{grid-template-columns:max-content minmax(0,1fr)}}
.card dt{font-size:.8125rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);padding-top:.1rem}
.card dd{margin:0 0 var(--s-2);white-space:pre-wrap;overflow-wrap:anywhere;color:var(--ink-soft)}
@media(min-width:640px){.card dd{margin-bottom:0}}
.card__actions{display:flex;gap:var(--s-2);flex-wrap:wrap;align-items:center;margin-top:var(--s-5);padding-top:var(--s-4);border-top:1px solid var(--line-soft)}

/* ── badges ── */
.badge{display:inline-flex;align-items:center;gap:.3rem;padding:.15rem .6rem;border-radius:var(--radius-pill);font-size:.8125rem;font-weight:700;white-space:nowrap}
.badge--new{background:var(--orange-050);color:var(--orange-700);border:1px solid var(--orange-200)}
.badge--done{background:var(--success-bg);color:var(--success);border:1px solid var(--success-line)}
.badge--plain{background:var(--blue-050);color:var(--blue-900);border:1px solid var(--blue-100)}

/* ── buttons ── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:var(--s-2);padding:.6rem 1.05rem;font-size:.9375rem;font-weight:600;line-height:1.2;text-decoration:none;border:1.5px solid transparent;border-radius:var(--radius);cursor:pointer;white-space:nowrap;transition:background-color .18s ease,border-color .18s ease,color .18s ease}
.btn svg{flex-shrink:0}
/* White on --orange-500 fails AA; the darker fill keeps 4.6:1. */
.btn--primary{background:var(--orange-650);border-color:var(--orange-650);color:var(--white)}
.btn--primary:hover{background:var(--orange-700);border-color:var(--orange-700)}
.btn--outline{background:var(--white);border-color:var(--blue-700);color:var(--blue-700)}
.btn--outline:hover{background:var(--blue-050);color:var(--blue-800)}
.btn--danger{background:var(--white);border-color:var(--danger);color:var(--danger)}
.btn--danger:hover{background:var(--danger-bg)}
.btn--lg{padding:.8rem 1.4rem;font-size:1rem}
.btn[disabled]{opacity:.55;cursor:not-allowed}
.btn[disabled]:hover{background:var(--orange-650);border-color:var(--orange-650)}

/* Delete confirmation: native <details>, no JS, no window.confirm. */
.confirm{margin-left:auto}
.confirm>summary{display:inline-flex;align-items:center;gap:var(--s-2);padding:.6rem .9rem;border-radius:var(--radius);font-size:.9375rem;font-weight:600;color:var(--danger);cursor:pointer;list-style:none}
.confirm>summary::-webkit-details-marker{display:none}
.confirm>summary:hover{background:var(--danger-bg)}
.confirm__box{display:flex;align-items:center;gap:var(--s-3);flex-wrap:wrap;margin-top:var(--s-2);padding:var(--s-3) var(--s-4);background:var(--danger-bg);border:1px solid var(--danger-line);border-radius:var(--radius)}
.confirm__box p{font-size:.875rem;color:var(--danger);font-weight:600}

/* ── notice (brand pattern: tint + 4px left rule + round white icon plate) ── */
.notice{display:grid;grid-template-columns:auto minmax(0,1fr);gap:var(--s-4);align-items:start;padding:var(--s-4) var(--s-5);margin-bottom:var(--s-6);border:1px solid var(--line);border-left-width:4px;border-radius:var(--radius-lg)}
.notice--warning{background:var(--orange-050);border-color:var(--orange-200);border-left-color:var(--orange-500)}
.notice--info{background:var(--blue-050);border-color:var(--blue-100);border-left-color:var(--blue-700)}
.notice--danger{background:var(--danger-bg);border-color:var(--danger-line);border-left-color:var(--danger)}
.notice__icon{display:grid;place-items:center;width:2.25rem;height:2.25rem;border-radius:50%;background:var(--white)}
.notice--warning .notice__icon{color:var(--orange-700)}
.notice--info .notice__icon{color:var(--blue-700)}
.notice--danger .notice__icon{color:var(--danger)}
.notice h2{font-size:1rem;margin-bottom:var(--s-1)}
.notice--warning h2{color:var(--orange-700)}
.notice--danger h2{color:var(--danger)}
.notice p,.notice li{font-size:.9375rem;color:var(--ink-soft)}
.notice ul{margin-top:var(--s-2);display:grid;gap:var(--s-1)}
.notice a{font-weight:600}
@media(max-width:420px){.notice{grid-template-columns:minmax(0,1fr)}}

/* ── fields ── */
.fset{background:var(--white);border:1px solid var(--line);border-radius:var(--radius-lg);padding:var(--s-5);margin-bottom:var(--s-4);box-shadow:var(--shadow-sm)}
.fset>legend{font-size:.8125rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:0 var(--s-2)}
.fgrid{display:grid;gap:var(--s-4);margin-top:var(--s-2)}
@media(min-width:640px){.fgrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
.field{display:flex;flex-direction:column;gap:var(--s-1)}
.field>label{font-size:.875rem;font-weight:600;color:var(--ink-soft)}
.field input{width:100%;padding:.6rem .7rem;background:var(--white);border:1px solid var(--field-line);border-radius:var(--radius-sm)}
.field input:hover{border-color:var(--blue-700)}
/* Error state is an attribute, not a class — same contract as the public site. */
.field input[aria-invalid='true']{border-color:var(--danger);background:var(--danger-bg)}
.field__help{font-size:.8125rem;color:var(--muted)}
.field__error{font-size:.8125rem;font-weight:700;color:var(--danger)}
.field__error:empty{display:none}

/* ── empty state ── */
.empty{display:grid;justify-items:center;gap:var(--s-3);padding:var(--s-12) var(--s-6);text-align:center;background:var(--blue-050);border:1px solid var(--blue-100);border-radius:var(--radius-lg)}
.empty__icon{display:grid;place-items:center;width:3.5rem;height:3.5rem;border-radius:50%;color:var(--blue-700);background:var(--white);box-shadow:0 0 0 8px rgba(232,240,251,.6)}
.empty p{max-width:46ch;color:var(--muted)}

/* ── login ── */
.login{max-width:23rem;margin:var(--s-6) auto 0;text-align:left;background:var(--white);border:1px solid var(--line);border-radius:var(--radius-lg);box-shadow:var(--shadow-md);padding:var(--s-8) var(--s-6)}
.login .lead{margin-bottom:var(--s-6)}
.login .field{margin-bottom:var(--s-5)}
.login .btn{width:100%}

.foot{margin-top:var(--s-8);padding-top:var(--s-5);border-top:1px solid var(--line);font-size:.875rem;color:var(--muted)}

@media(prefers-reduced-motion:reduce){*{transition-duration:.001ms!important;animation-duration:.001ms!important}}
`;

// ───────────────────────────────────────────────────────────────── icons
// Inline SVG: markup, not a fetched resource, so `default-src 'none'` allows it.

const PATHS = {
  mail: '<path d="M3 5h18v14H3z"/><path d="m3 6 9 7 9-7"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  trash: '<path d="M4 6h16"/><path d="M9 6V4h6v2"/><path d="M6 6v14h12V6"/><path d="M10 10v6M14 10v6"/>',
  download: '<path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/>',
  alert: '<path d="M12 4 2 20h20L12 4z"/><path d="M12 10v5"/><path d="M12 18h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><path d="M12 8h.01"/>',
  inbox: '<path d="M3 13h5l1 3h6l1-3h5"/><path d="M4 5h16l1 8v6H3v-6z"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
};

export function icon(name, size = 18) {
  const d = PATHS[name];
  if (!d) return '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
}

// ───────────────────────────────────────────────────────── primitives

export const badge = (tone, label) =>
  `<span class="badge badge--${tone}">${tone === 'new' ? '●' : tone === 'done' ? icon('check', 13) : ''} ${esc(label)}</span>`;

export const notice = ({ tone = 'info', title, body, iconName }) => `
<aside class="notice notice--${tone}">
  <span class="notice__icon">${icon(iconName ?? (tone === 'info' ? 'info' : 'alert'), 18)}</span>
  <div>${title ? `<h2>${esc(title)}</h2>` : ''}${body}</div>
</aside>`;

export const emptyState = ({ iconName = 'inbox', title, body }) => `
<div class="empty">
  <span class="empty__icon">${icon(iconName, 26)}</span>
  <h2>${esc(title)}</h2>
  <p>${esc(body)}</p>
</div>`;

/**
 * One field. The error slot is always emitted and always referenced by
 * aria-describedby, exactly like src/components/forms/FormField.astro — the
 * validator only has to fill it. `.field__error:empty` hides it when clean.
 */
export const field = ({ name, label, type = 'text', value = '', error = '', help = '', attrs = '' }) => {
  const id = `f-${name.replace(/[^\w-]/g, '-')}`;
  const errId = `${id}-error`;
  const helpId = help ? `${id}-help` : '';
  const by = [helpId, errId].filter(Boolean).join(' ');
  return `<p class="field">
  <label for="${id}">${esc(label)}</label>
  <input id="${id}" name="${esc(name)}" type="${type}" value="${esc(value)}"
    ${error ? 'aria-invalid="true"' : ''} aria-describedby="${by}" required ${attrs}>
  ${help ? `<span class="field__help" id="${helpId}">${esc(help)}</span>` : ''}
  <span class="field__error" id="${errId}" data-error-for="${esc(name)}">${esc(error)}</span>
</p>`;
};

// ───────────────────────────────────────────────────── flash messages

/**
 * Closed set: the message is looked up here, never taken from the URL. An
 * unknown or hostile `?done=` value renders nothing and cannot reach the HTML.
 */
const FLASH = {
  handled: 'Demande marquée comme traitée.',
  unhandled: 'Demande remise en « nouveau ».',
  deleted: 'Demande supprimée.',
  saved: 'Brouillon enregistré.',
};

export function flashFor(url) {
  const message = FLASH[url.searchParams.get('done') ?? ''];
  return message ? `${icon('check', 18)}<span>${esc(message)}</span>` : '';
}

// ────────────────────────────────────────────────────────────── layout

const NAV = [
  ['/admin/', 'Demandes'],
  ['/admin/contenu/', 'Contenu'],
];

/**
 * The one shell every screen goes through: skip link, header, a single <h1>,
 * and a live region for action feedback.
 *
 * @param {object} o
 * @param {string} o.title   document title
 * @param {string} o.h1      page heading — stable wording, counts go in a badge
 * @param {string} o.body    markup placed under the heading
 * @param {string} [o.current] pathname of the active nav entry
 * @param {string} [o.flash]  inner HTML of the status region
 * @param {string} [o.lead]   one line under the heading
 * @param {string} [o.aside]  markup placed to the right of the heading
 * @param {boolean} [o.bare]  login/error screens: no nav, no logout
 */
export function layout({ title, h1, body, current = '', flash = '', lead = '', aside = '', bare = false }) {
  const nav = bare
    ? ''
    : `<nav class="hdr__nav" aria-label="Sections">${NAV.map(
        ([href, label]) =>
          `<a href="${href}"${current === href ? ' aria-current="page"' : ''}>${label}</a>`,
      ).join('')}</nav>
<form method="post" action="/admin/logout"><button class="hdr__out" type="submit">Déconnexion</button></form>`;

  return `<!doctype html><html lang="fr"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>${CSS}</style>
<body>
<a class="skip" href="#main">Aller au contenu</a>
<header class="hdr"><div class="hdr__in">
  <p class="hdr__brand">Lagni Consulting <span>Administration</span></p>
  ${nav}
</div></header>
<main id="main" class="wrap${bare ? ' wrap--bare' : ''}" tabindex="-1">
  <div class="flash" role="status">${flash}</div>
  <div class="head"><h1>${esc(h1)}</h1>${aside}</div>
  ${lead ? `<p class="lead">${lead}</p>` : ''}
  ${body}
</main>`;
}
