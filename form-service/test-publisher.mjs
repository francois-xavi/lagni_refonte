// Publisher tests. No network, no token: a stubbed fetch stands in for GitHub.
// Run with `node test-publisher.mjs`.
import assert from 'node:assert';
import { createPublisher, dryRunPublisher, commitMessage, PublishError } from './publisher.mjs';

/** Minimal GitHub stub. `movedRef` makes the ref update fail like a real push race. */
function stub({ movedRef = false } = {}) {
  const seen = [];
  const reply = (status, body) =>
    Promise.resolve({ ok: status < 400, status, text: async () => JSON.stringify(body) });

  return {
    seen,
    fetch(url, init) {
      const path = url.replace(/^https:\/\/api\.github\.com\/repos\/o\/r/, '');
      seen.push(`${init.method} ${path}`);
      assert.match(init.headers.authorization, /^Bearer /, 'token must be sent');
      assert.equal(init.headers['user-agent'], 'lagni-form-service');

      if (path === '/git/ref/heads/main') return reply(200, { object: { sha: 'HEAD1' } });
      if (path === '/git/commits/HEAD1') return reply(200, { tree: { sha: 'TREE0' } });
      if (path === '/git/blobs') return reply(201, { sha: 'BLOB' + seen.length });
      if (path === '/git/trees') return reply(201, { sha: 'TREE1' });
      if (path === '/git/commits') {
        const body = JSON.parse(init.body);
        assert.deepEqual(body.parents, ['HEAD1'], 'parent must be the head we read');
        assert.equal(body.tree, 'TREE1');
        return reply(201, { sha: 'COMMIT1' });
      }
      if (path === '/git/refs/heads/main') {
        assert.equal(JSON.parse(init.body).force, false, 'never force-push');
        return movedRef
          ? reply(422, { message: 'Update is not a fast forward' })
          : reply(200, {});
      }
      throw new Error('unexpected call ' + path);
    },
  };
}

const files = [
  { path: 'src/content/faq/contact.json', content: '[]' },
  { path: 'src/content/settings/site.json', content: '{}' },
];

// 1. Happy path: blob → tree → commit → ref, in that order.
{
  const s = stub();
  const pub = createPublisher({ token: 't', owner: 'o', repo: 'r', fetch: s.fetch });
  const out = await pub.publish({ files, message: 'test', baseSha: 'HEAD1' });
  assert.equal(out.sha, 'COMMIT1');
  assert.equal(out.files, 2);
  assert.deepEqual(s.seen, [
    'GET /git/ref/heads/main',
    'GET /git/commits/HEAD1',
    'POST /git/blobs',
    'POST /git/blobs',
    'POST /git/trees',
    'POST /git/commits',
    'PATCH /git/refs/heads/main',
  ]);
}

// 2. The editor opened the screen before someone else pushed: refused before
//    a single object is created.
{
  const s = stub();
  const pub = createPublisher({ token: 't', owner: 'o', repo: 'r', fetch: s.fetch });
  await assert.rejects(
    () => pub.publish({ files, message: 'test', baseSha: 'OLD' }),
    (e) => e instanceof PublishError && e.conflict,
  );
  assert.ok(!s.seen.includes('POST /git/blobs'), 'nothing must be written on conflict');
}

// 3. The branch moves *during* publication: GitHub rejects the non-forced
//    update, and that surfaces as a conflict rather than a crash.
{
  const s = stub({ movedRef: true });
  const pub = createPublisher({ token: 't', owner: 'o', repo: 'r', fetch: s.fetch });
  await assert.rejects(
    () => pub.publish({ files, message: 'test', baseSha: 'HEAD1' }),
    (e) => e instanceof PublishError && e.conflict && e.status === 422,
  );
}

// 4. Empty publication is refused.
{
  const pub = createPublisher({ token: 't', owner: 'o', repo: 'r', fetch: stub().fetch });
  await assert.rejects(() => pub.publish({ files: [], message: 'x' }), PublishError);
}

// 5. No token → dry run. Same contract, records instead of sending.
{
  const pub = createPublisher({ owner: 'o', repo: 'r' });
  assert.equal(pub.dryRun, true);
  const out = await pub.publish({ files, message: 'test', baseSha: await pub.head() });
  assert.equal(out.dryRun, true);
  assert.equal(out.files, 2);
  assert.deepEqual(pub.calls[0].files, files.map((f) => f.path));
  // The recorded head advances, so a stale sha is refused here too.
  await assert.rejects(
    () => pub.publish({ files, message: 'test', baseSha: 'dryrun-head' }),
    (e) => e.conflict,
  );
}

// 6. Commit message shape.
{
  const m = commitMessage(['2 questions FAQ', '1 témoignage'], new Date('2026-10-22T18:05:00Z'));
  assert.match(m, /^Contenu : 2 questions FAQ, 1 témoignage\n\n/);
  assert.match(m, /Publié depuis \/admin\/contenu\/ le .*2026/);
}

assert.equal(dryRunPublisher().dryRun, true);
console.log('publisher: all checks passed');
