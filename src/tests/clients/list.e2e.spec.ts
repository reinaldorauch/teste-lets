import { test, describe } from 'node:test';
import { assert } from 'node:assert';
import { handler } from '../../../src/clients/list.ts';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('clients > list function', () => {
  test('it should list no clients', async () => {
    const event: APIGatewayProxyEvent = {
      body: '',
      headers: ,
      httpMethod: 'GET',
      path: ''
    };
    const result = await handler(event);

    assert(result.statusCode === 200);
  })
})
