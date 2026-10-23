import { getPayload } from 'payload'
import config from './payload.config'

/**
 * Creates or rotates the website's service account.
 *
 * The site reads drafts with this key when Live Preview gives it no editor
 * token. It is not a person: it never signs into the admin, and its password
 * is random and thrown away.
 *
 * The key is set here rather than generated, so the same value can live in
 * both services' environment. Payload does not hand a generated key back
 * through its API — it only shows it in the admin screen.
 *
 * Run from cms/:  npm run service-key
 */
const payload = await getPayload({ config })
const email = 'site@lagniconsulting.ca'

const KEY = process.env.PAYLOAD_API_KEY ?? ''
if (KEY.length < 24) {
  console.error('\nPAYLOAD_API_KEY absent ou trop court (24 caractères minimum) dans cms/.env\n')
  process.exit(1)
}

const found = await payload.find({ collection: 'users', where: { email: { equals: email } } })
const data = { enableAPIKey: true, apiKey: KEY }

if (found.docs[0]) {
  await payload.update({ collection: 'users', id: found.docs[0].id, data })
  console.log(`\ncompte de service mis à jour : ${email}\n`)
} else {
  await payload.create({
    collection: 'users',
    data: { ...data, email, password: crypto.randomUUID() + crypto.randomUUID() },
  })
  console.log(`\ncompte de service créé : ${email}\n`)
}

process.exit(0)
