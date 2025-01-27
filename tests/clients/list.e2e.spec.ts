import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';

import { handler } from '@app/clients/list.handler.js';

describe('clients > list function', () => {
  test('it should list no clients', async () => {
    const result = await handler(undefined, undefined, undefined);

    assert(result);
    assert.equal(result.statusCode, 200);
    assert.deepEqual(JSON.parse(result.body), { data: [], found: 0 });
    assert.equal(result.headers['Content-Type'], 'application/json');
  })
})
