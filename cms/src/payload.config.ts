import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { PAGES } from './pages'
import { globalForPage, sharedGlobal } from './lib/fieldsFromContent'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  // One global per page: a page is a singleton, which is exactly what a global
  // is. Their fields are derived from src/content/copy/ rather than written a
  // second time here.
  globals: [sharedGlobal(), ...PAGES.map((p) => globalForPage(p.key, p.label))],
  // Field-level localization: one document, both languages side by side, so a
  // field cannot ship translated on one side only.
  localization: {
    locales: [
      { label: 'Français', code: 'fr' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'fr',
    fallback: false,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URL || 'file:./cms.db' },
    // WAL keeps reads from blocking while the client saves, and busyTimeout
    // stops a concurrent write from failing outright (it defaults to 0).
    wal: true,
    busyTimeout: 5000,
  }),
  sharp,
  plugins: [],
})
