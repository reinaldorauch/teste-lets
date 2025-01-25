import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { handler } from '@app/clients/list.js';

describe('clients > list function', () => {
  test('it should list no clients', async () => {
    const event: Partial<APIGatewayProxyEvent> = {
      queryStringParameters: {
        page: '0',
        items: '10'
      }
    };
    const ctx = undefined;
    const callback = undefined;
    const result = await handler(event as unknown as APIGatewayProxyEvent, ctx, callback);

    assert(result);
    console.log(result.body);
    assert.equal(result.statusCode, 200);
    assert.deepEqual(JSON.parse(result.body), { data: [], found: 0, page: 0 });
    assert.equal(result.headers['Content-Type'], 'application/json');
  })
})
