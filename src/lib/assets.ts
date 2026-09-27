import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Resolves a photograph in /public/assets/images/ at build time.
 * Returns its public URL when the file exists, otherwise `undefined` so the
 * caller's <Figure> falls back to its placeholder. Dropping the file in and
 * rebuilding is all it takes to swap in the real image.
 */
export function publicImage(name: string): string | undefined {
  return existsSync(join(process.cwd(), 'public', 'assets', 'images', name))
    ? `/assets/images/${name}`
    : undefined;
}
