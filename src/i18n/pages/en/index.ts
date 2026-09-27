import { home } from './home';
import { training } from './training';
import { sapPp } from './sapPp';
import { erp } from './erp';
import { recruitment } from './recruitment';
import { institutions } from './institutions';
import { about } from './about';
import { resources } from './resources';
import { contact } from './contact';
import { thanks, notFound } from './misc';

export const pagesEn = {
  home,
  training,
  sapPp,
  erp,
  recruitment,
  institutions,
  about,
  resources,
  contact,
  thanks,
  notFound,
} as const;


import type { PagesFr } from '../fr';

/** Compile-time parity check: EN must cover every FR page key. */
type _Parity = keyof PagesFr extends keyof typeof pagesEn ? true : never;
const _parity: _Parity = true;
void _parity;
