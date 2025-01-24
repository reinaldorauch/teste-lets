import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { handler } from '../../src/clients/list';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('clients > list function', () => {
  test('it should list no clients', async () => {
    const event = {};
    const ctx = undefined;
    const callback = undefined;
    const result = await handler(event as unknown as APIGatewayProxyEvent, ctx, callback);

    assert(result);
    assert(result.statusCode === 200);
  })
})
