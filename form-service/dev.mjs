// Local launcher: `npm run dev` inside form-service/.
//
// Exists because `ADMIN_PASSWORD=... node server.mjs` is POSIX syntax and fails
// in cmd.exe, so an npm script with inline variables would not run on Windows.
//
// Everything here is for a developer machine only. Production gets its values
// from Dokploy environment variables and never reaches this file.
const DEFAULTS = {
  ADMIN_PASSWORD: 'mot-de-passe-local-de-test',
  DATA_DIR: './data-dev',
  PORT: '3919',
  SMTP_HOST: '', // no mail in local runs
};

for (const [key, value] of Object.entries(DEFAULTS)) {
  if (!process.env[key]) process.env[key] = value;
}

const { PORT, ADMIN_PASSWORD, DATA_DIR } = process.env;
console.log(`
  Tableau de bord local
  ─────────────────────
  Demandes reçues   http://localhost:${PORT}/admin/
  Contenu           http://localhost:${PORT}/admin/contenu/

  Mot de passe      ${ADMIN_PASSWORD}
  Données           ${DATA_DIR}  (jetable : supprimez le dossier pour repartir à zéro)

  Sans GITHUB_TOKEN, la publication tourne à blanc : les écrans fonctionnent,
  rien n'est envoyé sur GitHub. L'écran Contenu l'indique.
`);

await import('./server.mjs');
