// Commits content files to GitHub, which makes Dokploy rebuild the site.
//
// There is no git binary in the image (see form-service/Dockerfile), so this
// walks the Git Data API by hand: blob → tree → commit → ref.
//
// The last step is the lock. `PATCH /git/refs` without `force` only accepts a
// fast-forward, and the commit's parent is the head we read at the start. If
// anyone pushed in between, GitHub refuses and we surface that as a conflict —
// drafts stay in SQLite and nothing is overwritten.
//
// Without GITHUB_TOKEN this returns a dry-run publisher that records what it
// would have sent. That is what lets the whole dashboard be built and tested
// before the deployment key exists.

const API = 'https://api.github.com';

export class PublishError extends Error {
  constructor(message, { conflict = false, status = 0 } = {}) {
    super(message);
    this.name = 'PublishError';
    this.conflict = conflict;
    this.status = status;
  }
}

/**
 * @param {object} o
 * @param {string} [o.token]   fine-grained PAT, Contents: read & write, one repo
 * @param {string} o.owner
 * @param {string} o.repo
 * @param {string} [o.branch]  the branch Dokploy watches
 * @param {typeof globalThis.fetch} [o.fetch]
 */
export function createPublisher({ token, owner, repo, branch = 'main', fetch: f } = {}) {
  if (!token) return dryRunPublisher({ owner, repo, branch });

  const doFetch = f ?? globalThis.fetch;
  const base = `${API}/repos/${owner}/${repo}`;

  async function call(method, path, body) {
    const res = await doFetch(base + path, {
      method,
      headers: {
        authorization: `Bearer ${token}`,
        accept: 'application/vnd.github+json',
        'x-github-api-version': '2022-11-28',
        'user-agent': 'lagni-form-service',
        ...(body ? { 'content-type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const text = await res.text();
    if (!res.ok) {
      // 422 on the ref update means the branch moved under us.
      const conflict = method === 'PATCH' && res.status === 422;
      throw new PublishError(
        conflict
          ? 'Le contenu a changé depuis votre ouverture. Rechargez la page.'
          : `GitHub ${method} ${path} → ${res.status} ${text.slice(0, 200)}`,
        { conflict, status: res.status },
      );
    }
    return text ? JSON.parse(text) : {};
  }

  /** Current head of the branch: the sha to lock against. */
  async function head() {
    const ref = await call('GET', `/git/ref/heads/${branch}`);
    return ref.object.sha;
  }

  /**
   * @param {{ path: string, content: string }[]} files
   * @param {string} message
   * @param {string} [baseSha] head read when the editor opened the screen
   */
  async function publish({ files, message, baseSha }) {
    if (!files?.length) throw new PublishError('Rien à publier.');

    const headSha = await head();
    // Cheap pre-check so the editor is told before we create any objects.
    // The authoritative check is still the non-forced ref update below.
    if (baseSha && baseSha !== headSha) {
      throw new PublishError(
        'Le contenu a changé depuis votre ouverture. Rechargez la page.',
        { conflict: true },
      );
    }

    const parent = await call('GET', `/git/commits/${headSha}`);

    const tree = [];
    for (const file of files) {
      const blob = await call('POST', '/git/blobs', {
        content: Buffer.from(file.content, 'utf8').toString('base64'),
        encoding: 'base64',
      });
      tree.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha });
    }

    const newTree = await call('POST', '/git/trees', { base_tree: parent.tree.sha, tree });
    const commit = await call('POST', '/git/commits', {
      message,
      tree: newTree.sha,
      parents: [headSha],
    });
    await call('PATCH', `/git/refs/heads/${branch}`, { sha: commit.sha, force: false });

    return { sha: commit.sha, files: files.length, dryRun: false };
  }

  return { head, publish, dryRun: false, target: `${owner}/${repo}@${branch}` };
}

/** Records calls instead of sending them, so the flow is testable with no key. */
export function dryRunPublisher({ owner = '?', repo = '?', branch = 'main' } = {}) {
  const calls = [];
  let fakeHead = 'dryrun-head';
  return {
    dryRun: true,
    calls,
    target: `${owner}/${repo}@${branch} (à blanc)`,
    async head() {
      return fakeHead;
    },
    async publish({ files, message, baseSha }) {
      if (!files?.length) throw new PublishError('Rien à publier.');
      if (baseSha && baseSha !== fakeHead) {
        throw new PublishError(
          'Le contenu a changé depuis votre ouverture. Rechargez la page.',
          { conflict: true },
        );
      }
      calls.push({ files: files.map((x) => x.path), message });
      fakeHead = `dryrun-${calls.length}`;
      return { sha: fakeHead, files: files.length, dryRun: true };
    },
  };
}

/** `Contenu : 2 questions FAQ, 1 témoignage` + a dated, attributed body. */
export function commitMessage(parts, now = new Date()) {
  const when = now.toLocaleString('fr-CA', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Toronto',
  });
  return `Contenu : ${parts.join(', ')}\n\nPublié depuis /admin/contenu/ le ${when}.\n`;
}
