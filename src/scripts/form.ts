/**
 * Shared form behaviour: accessible validation + progressive-enhancement submit.
 *
 * Without JavaScript the form still submits natively to its `action`.
 * With JavaScript we validate first, then POST via fetch so the visitor keeps
 * their place on the page and gets an inline success or failure message.
 */

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = ['pdf', 'doc', 'docx'];

type Msgs = Record<string, string>;

function messages(form: HTMLFormElement): Msgs {
  const d = form.dataset;
  return {
    required: d.msgRequired ?? 'This field is required.',
    email: d.msgEmail ?? 'Please enter a valid email address.',
    consent: d.msgConsent ?? 'You must agree in order to continue.',
    fileType: d.msgFiletype ?? 'Unsupported file format.',
    fileSize: d.msgFilesize ?? 'File is too large.',
    summary: d.msgSummary ?? 'Please correct the highlighted fields.',
    sending: d.msgSending ?? 'Sending…',
  };
}

function errorSlot(form: HTMLFormElement, name: string): HTMLElement | null {
  return form.querySelector<HTMLElement>(`[data-error-for="${CSS.escape(name)}"]`);
}

function setError(form: HTMLFormElement, field: HTMLElement, name: string, msg: string) {
  field.setAttribute('aria-invalid', 'true');
  const slot = errorSlot(form, name);
  if (slot) slot.textContent = msg;
}

function clearError(form: HTMLFormElement, field: HTMLElement, name: string) {
  field.removeAttribute('aria-invalid');
  const slot = errorSlot(form, name);
  if (slot) slot.textContent = '';
}

/** Only validate controls that are currently visible (fieldsets can be hidden). */
function isActive(el: HTMLElement): boolean {
  return el.closest('[hidden]') === null && el.offsetParent !== null;
}

function validate(form: HTMLFormElement): HTMLElement | null {
  const m = messages(form);
  let firstInvalid: HTMLElement | null = null;

  const controls = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    'input, select, textarea',
  );

  controls.forEach((el) => {
    if (el.type === 'hidden' || el.name === 'website') return;
    if (!isActive(el) && el.type !== 'checkbox') {
      clearError(form, el, el.name);
      return;
    }

    clearError(form, el, el.name);
    let msg = '';

    if (el.type === 'checkbox') {
      if (el.required && !(el as HTMLInputElement).checked) msg = m.consent;
    } else if (el.required && !el.value.trim()) {
      msg = m.required;
    } else if (el.type === 'email' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value)) {
      msg = m.email;
    } else if (el.type === 'file') {
      const file = (el as HTMLInputElement).files?.[0];
      if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        if (!ALLOWED_EXT.includes(ext)) msg = m.fileType;
        else if (file.size > MAX_FILE_BYTES) msg = m.fileSize;
      }
    }

    if (msg) {
      setError(form, el, el.name, msg);
      if (!firstInvalid) firstInvalid = el;
    }
  });

  return firstInvalid;
}

function init(form: HTMLFormElement) {
  if (form.dataset.bound === 'true') return;
  form.dataset.bound = 'true';

  const m = messages(form);
  const status = form.querySelector<HTMLElement>('[data-status]');
  const alert = form.querySelector<HTMLElement>('[data-alert]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const submitText = submit?.querySelector('span');
  const timetrap = form.querySelector<HTMLInputElement>('[data-timetrap]');

  // Time-trap: a form completed in under 3 seconds is almost certainly a bot.
  const openedAt = Date.now();
  if (timetrap) timetrap.value = String(openedAt);

  // Clear a field's error as soon as the visitor fixes it.
  form.addEventListener('input', (e) => {
    const el = e.target as HTMLElement;
    if (el.getAttribute('aria-invalid') === 'true') {
      clearError(form, el, (el as HTMLInputElement).name);
    }
  });

  form.addEventListener('submit', async (e) => {
    if (alert) alert.textContent = '';
    if (status) status.textContent = '';

    const firstInvalid = validate(form);
    if (firstInvalid) {
      e.preventDefault();
      if (alert) alert.textContent = m.summary;
      (firstInvalid as HTMLElement).focus();
      return;
    }

    const endpoint = form.dataset.endpoint;
    // No endpoint configured yet: let the native POST fall through to /merci/.
    if (!endpoint) return;

    // Spam guards.
    const hp = form.querySelector<HTMLInputElement>('input[name="website"]');
    if (hp?.value || Date.now() - openedAt < 3000) {
      e.preventDefault();
      window.location.href = form.dataset.thanks ?? '/';
      return;
    }

    e.preventDefault();
    if (submit) submit.disabled = true;
    if (submitText) submitText.textContent = m.sending;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(String(res.status));
      window.location.href = form.dataset.thanks ?? '/';
    } catch {
      // The message already carries a mailto address so the visitor is never stuck.
      if (alert) alert.textContent = form.dataset.msgNetwork ?? '';
      if (submit) submit.disabled = false;
      if (submitText) submitText.textContent = form.dataset.submitLabel ?? '';
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach(init);
