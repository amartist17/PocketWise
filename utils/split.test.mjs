import assert from 'node:assert/strict';
import test from 'node:test';

import { buildSplitMessage, splitEqually } from './split.ts';

test('splitEqually preserves every paise', () => {
  const shares = splitEqually(100, [{ id: '1', name: 'A' }, { id: '2', name: 'B' }, { id: '3', name: 'C' }]);
  assert.deepEqual(shares.map((share) => share.amount), [33.34, 33.33, 33.33]);
  assert.equal(Math.round(shares.reduce((sum, share) => sum + share.amount, 0) * 100), 10000);
});

test('splitEqually rejects unusable totals', () => {
  assert.deepEqual(splitEqually(0, [{ id: '1', name: 'A' }]), []);
  assert.deepEqual(splitEqually(Number.NaN, [{ id: '1', name: 'A' }]), []);
  assert.deepEqual(splitEqually(100, []), []);
});

test('buildSplitMessage labels the request safely', () => {
  const shares = splitEqually(250, [{ id: '1', name: 'Aarav' }, { id: '2', name: 'Mira' }]);
  const message = buildSplitMessage('Dinner', 250, shares);
  assert.match(message, /PocketWise split: Dinner/);
  assert.match(message, /payment request, not a payment confirmation/);
});
