const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const compiled = ts.transpileModule(fs.readFileSync('app/api/pilot/route.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const valid = { name: ' Amina ', email: 'AMINA@example.com', location: 'Kaduna, Nigeria', role: 'farmer', crops: 'Maize', consent: true, website: '' };

function handler(env = {}, fetch = async () => new Response(null, { status: 204 })) {
  const context = { exports: {}, require, Buffer, URL, AbortSignal, process: { env: { NODE_ENV: 'test', ...env } }, fetch };
  vm.runInNewContext(compiled, context);
  return context.exports.POST;
}
function request(data = valid, headers = {}) {
  return new Request('https://furrow.example/api/pilot', {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(data),
  });
}

test('does not claim success when delivery is unconfigured', async () => {
  assert.equal((await handler()(request())).status, 503);
});
test('validates required fields, email, role, consent and lengths', async () => {
  for (const changes of [{ name: ' ' }, { email: 'broken' }, { location: '' }, { role: 'unknown' }, { consent: false }, { name: 'x'.repeat(101) }, { crops: 'x'.repeat(241) }]) {
    assert.equal((await handler()(request({ ...valid, ...changes }))).status, 400);
  }
});
test('rejects malformed JSON, oversized bodies, bots and cross-origin posts', async () => {
  const post = handler();
  assert.equal((await post(new Request('https://furrow.example/api/pilot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' }))).status, 400);
  assert.equal((await post(request({ ...valid, crops: 'x'.repeat(9000) }))).status, 413);
  assert.equal((await post(request({ ...valid, website: 'spam.example' }))).status, 400);
  assert.equal((await post(request(valid, { origin: 'https://another.example' }))).status, 403);
  assert.equal((await post(request(valid, { 'Content-Type': 'text/plain' }))).status, 415);
});
test('forwards normalized fields and reports success only after delivery', async () => {
  let delivered;
  const post = handler({ PILOT_WEBHOOK_URL: 'https://receiver.example/signup', PILOT_WEBHOOK_TOKEN: 'test-token' }, async (url, options) => {
    delivered = JSON.parse(options.body);
    assert.equal(String(url), 'https://receiver.example/signup');
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    assert.equal(options.redirect, 'error');
    return new Response(null, { status: 204 });
  });
  const response = await post(request({ ...valid, unwanted: 'not forwarded' }, { origin: 'https://furrow.example' }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(delivered.email, 'amina@example.com');
  assert.equal(delivered.name, 'Amina');
  assert.equal(delivered.consent, true);
  assert.equal(delivered.unwanted, undefined);
  assert.ok(delivered.submittedAt);
});
test('handles rejected deliveries and network failures without false success', async () => {
  for (const send of [async () => new Response(null, { status: 500 }), async () => { throw new Error('timeout'); }]) {
    const post = handler({ PILOT_WEBHOOK_URL: 'https://receiver.example/signup' }, send);
    const response = await post(request());
    assert.equal(response.status, 502);
    assert.match((await response.json()).error, /couldn’t save/);
  }
});
