import { ParseError } from '@app/lib/parse.error.js';
import { handleAssertions } from '@app/lib/util.js';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import assert, { AssertionError } from 'node:assert';
import { test, describe } from 'node:test';

describe('util > handleAssertions', () => {
  test('should return the value of the wrapped function', async () => {
    const retVal: APIGatewayProxyResult = { statusCode: 200, body: '' };
    const res = await handleAssertions(async () => retVal)({ httpMethod: 'GET' } as APIGatewayProxyEvent);
    assert.deepStrictEqual(res, retVal);
  })

  test('should return 422 it a ParseError is thrown inside', async () => {
    const event = { httpMethod: 'GET' } as APIGatewayProxyEvent;
    const handler = async () => {
      throw new ParseError('teste');
    };

    const res = await handleAssertions(handler)(event);

    assert.equal(res.statusCode, 422);
    const { message } = JSON.parse(res.body);
    assert.equal(message, 'teste');
  })

  test('should return 400 if a AssertionError is thrown inside', async () => {
    const event = { httpMethod: 'GET' } as APIGatewayProxyEvent;
    const handler = async () => {
      throw new AssertionError({ message: 'teste' });
    };

    const res = await handleAssertions(handler)(event);

    assert.equal(res.statusCode, 400);
    const { message } = JSON.parse(res.body);
    assert.equal(message, 'teste');

  })

  test('should throw any other exception from the wrapped function', async () => {
    const event = { httpMethod: 'GET' } as APIGatewayProxyEvent;
    const handler = async () => {
      throw new Error('teste');
    };

    try {
      await handleAssertions(handler)(event);
    } catch (err) {
      assert(err);
      assert(err instanceof Error);
      assert.equal(err.message, 'teste');
    }
  })
})
