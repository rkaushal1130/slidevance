import assert from 'node:assert';
import { test } from 'node:test';
import { createApp } from '../src/app.js';

test('App initialization and health check route', async () => {
  const app = createApp();
  assert.ok(app, 'Express app should be created');

  const server = app.listen(0);
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/health`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
    assert.ok(body.timestamp);
    console.log('✅ Health check test passed:', body);
  } finally {
    server.close();
  }
});
