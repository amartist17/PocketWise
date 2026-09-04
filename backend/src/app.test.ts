import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';

process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/pocketwise-test';
process.env.JWT_SECRET = 'test-secret-that-is-longer-than-thirty-two-characters';

let server: Server;
let origin: string;

before(async () => {
  const { app } = await import('./app.js');
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', resolve));
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(() => server.close());

test('GET /api/health reports service health', async () => {
  const response = await fetch(`${origin}/api/health`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, 'ok');
});

test('transaction endpoints reject anonymous requests', async () => {
  const response = await fetch(`${origin}/api/transactions`);
  assert.equal(response.status, 401);
  assert.equal((await response.json()).message, 'Authentication required.');
});

test('unknown routes return a JSON 404', async () => {
  const response = await fetch(`${origin}/api/unknown`);
  assert.equal(response.status, 404);
  assert.equal((await response.json()).message, 'Route not found.');
});
