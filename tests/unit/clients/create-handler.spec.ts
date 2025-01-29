import { mockClient } from 'aws-sdk-client-mock';
import { beforeEach, describe, test } from "node:test";
import { strict as assert } from "node:assert";

import { handler } from "@app/clients/create-handler.js";
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { clientMock } from '../../mocks.js';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { omit } from '@tests/utils.js';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe("create handler", () => {
  const headers = {
    'content-type': 'application/json'
  }

  beforeEach(() => {
    ddbMock.reset();
  })

  test('should try to put a new client into the db', async () => {
    const newClient = clientMock();
    const event = {
      headers,
      httpMethod: 'POST',
      body: JSON.stringify(newClient)
    } as unknown as APIGatewayProxyEvent;

    const res = await handler(event);

    assert(res, 'should have a response');

    const { statusCode, body, headers: resHeaders } = res;

    assert.equal(statusCode, 201);
    assert.deepEqual(headers, resHeaders);
    assert.deepEqual({ ...omit(newClient, ['clientId']) }, omit(JSON.parse(body), ['clientId']));
  })

  test('it should error if other httpMethod is set', async () => {
    const event = {
      httpMethod: 'GET'
    } as unknown as APIGatewayProxyEvent;

    const res = await handler(event);
    assert(res, 'should have response');
    assert.equal(res.statusCode, 400, 'should respond with HTTP_BAD_REQUEST');
    const { message } = JSON.parse(res.body);
    assert.equal(message, 'this function only allows POST requests');
  });

  test('it should error if has no body', async () => {
    const event = { httpMethod: 'POST' } as unknown as APIGatewayProxyEvent;

    const res = await handler(event);
    assert(res, 'should have a response');
    assert.equal(res.statusCode, 400, 'statusCode should be HTTP_BAD_REQUEST');
    const { message } = JSON.parse(res.body);
    assert.equal(message, 'this function should have a body');
  });

  test('it should error if headers is null', async () => {
    const event = { httpMethod: 'POST', body: '{}' } as unknown as APIGatewayProxyEvent;

    const res = await handler(event);
    assert(res, 'should have a response');
    assert.equal(res.statusCode, 400, 'statusCode should be HTTP_BAD_REQUEST');
    const { message } = JSON.parse(res.body);
    assert.equal(message, 'this function expects a JSON body');
  });

  test('it should error if content-type is not json', async () => {
    const event = { httpMethod: 'POST', body: '{}', headers: {} } as unknown as APIGatewayProxyEvent;

    const res = await handler(event);
    assert(res, 'should have a response');
    assert.equal(res.statusCode, 400, 'statusCode should be HTTP_BAD_REQUEST');
    const { message } = JSON.parse(res.body);
    assert.equal(message, 'this function expects a JSON body');
  });

  test('it should error if invalid body is sent', async () => {
    const event = {
      httpMethod: 'POST',
      body: 'abracadabra',
      headers: {
        'content-type': 'application/json'
      }
    } as unknown as APIGatewayProxyEvent;

    const res = await handler(event);
    assert(res, 'should have a response');
    assert.equal(res.statusCode, 400, 'statusCode should be HTTP_BAD_REQUEST');
    const { message } = JSON.parse(res.body);
    assert(message.startsWith('invalid json body:'));
  });

  test('it should error if a invalid client is sent', async () => {
    const event = { httpMethod: 'POST', body: '{}', headers } as unknown as APIGatewayProxyEvent;

    try {
      await handler(event);
    } catch (err) {
      assert.equal(err.message, 'fullName is required');
    }
  })
})
