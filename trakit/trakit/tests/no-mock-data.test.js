import test from 'node:test';
import assert from 'node:assert/strict';

import { storage } from '../src/lib/storage.js';

test('storage should not seed mock users or products by default', async () => {
  const users = await storage.users.getAll();
  const products = await storage.products.getAll();

  assert.deepEqual(users, []);
  assert.deepEqual(products, []);
});
