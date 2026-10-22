import { home } from './home';
import { training } from './training';
import { sapPp } from './sapPp';
import { erp } from './erp';
import { recruitment } from './recruitment';
import { institutions } from './institutions';
import { about } from './about';
import { resources } from './resources';
import { contact } from './contact';
import { privacy } from './privacy';
import { thanks, notFound } from './misc';

export const pagesFr = {
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
  privacy,
} as const;

export type PagesFr = typeof pagesFr;
