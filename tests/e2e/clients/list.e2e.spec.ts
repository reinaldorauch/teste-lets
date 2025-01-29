import { test, describe, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { handler } from '@app/clients/list-handler.js';
import { cleanDb } from '../db.js';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('clients > list function', () => {
  beforeEach(async () => {
    await cleanDb();
  });

  test('it should list no clients', async () => {
    const event = { httpMethod: 'GET' } as APIGatewayProxyEvent;
    const result = await handler(event);

    assert(result);
    assert.equal(result.statusCode, 200);
    assert.deepEqual(JSON.parse(result.body), { clients: [], found: 0 });
    assert.equal(result.headers['Content-Type'], 'application/json');
  });
})
