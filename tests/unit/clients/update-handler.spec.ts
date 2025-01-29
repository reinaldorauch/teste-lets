import { handler } from "@app/clients/update-handler.js";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { mockClient } from "aws-sdk-client-mock";
import { describe, test, beforeEach } from "node:test";
import { strict as assert } from "node:assert";
import { clientMock } from "@tests/mocks.js";
import { omit } from "@tests/utils.js";

const ddc = mockClient(DynamoDBDocumentClient);

describe('clients > update handler', () => {
  beforeEach(() => {
    ddc.reset();
  })

  test('should fail if httpMehtod is not PUT', async () => {
    const event = { httpMethod: 'DELETE' } as APIGatewayProxyEvent;

    const res = await handler(event);
    assert(res, "should have a response");
    assert.equal(res.statusCode, 400, 'should return HTTP_BAD_REQUEST');
    assert.equal(JSON.parse(res.body).message, 'this function expects PUT method');
  })

  test('should fail if id is not set in pathParams', async () => {
    const event = { httpMethod: 'PUT' } as APIGatewayProxyEvent;

    const res = await handler(event);
    assert(res, 'should have a response');
    assert.equal(res.statusCode, 400, 'should return HTTP_BAD_REQUEST');
    assert.equal(JSON.parse(res.body).message, 'this function expects the {id} path param');
  })

  test('should fail if no body is sent', async () => {
    const event = {
      httpMethod: 'PUT',
      pathParameters: { id: 'dasdsd' }
    } as unknown as APIGatewayProxyEvent;

    const res = await handler(event);
    assert(res, 'should have a response');
    assert.equal(res.statusCode, 400, 'should return HTTP_BAD_REQUEST');
    assert.equal(JSON.parse(res.body).message, 'this function expects a body');
  })

  test('should fail if content-type is not application/json', async () => {
    const event = {
      httpMethod: 'PUT',
      pathParameters: { id: 'dasdsd' },
      body: '{}',
    } as unknown as APIGatewayProxyEvent;

    const res = await handler(event);
    assert(res, 'should have a response');
    assert.equal(res.statusCode, 400, 'should return HTTP_BAD_REQUEST');
    assert.equal(JSON.parse(res.body).message, 'this function expects the body to be a JSON');
  })

  test('should fail if body is invalid json', async () => {
    const event = {
      httpMethod: 'PUT',
      pathParameters: { id: 'dasdsd' },
      headers: { 'content-type': 'application/json' },
      body: 'abracadabra',
    } as unknown as APIGatewayProxyEvent;

    const res = await handler(event);
    assert(res, 'should have a response');
    assert.equal(res.statusCode, 400, 'should return HTTP_BAD_REQUEST');
    const { message } = JSON.parse(res.body);
    assert(message.startsWith('Invalid JSON body:'));
  })

  test('should fail if body is invalid client', async () => {
    const event = {
      httpMethod: 'PUT',
      pathParameters: { id: 'dasdsd' },
      headers: { 'content-type': 'application/json' },
      body: '{}',
    } as unknown as APIGatewayProxyEvent;

    const res = await handler(event);
    assert(res, 'should have a response');
    assert.equal(res.statusCode, 422, 'should return HTTP_UNPROCESSABLE_ENTITY');
    const { message } = JSON.parse(res.body);
    assert.equal(message, 'fullName is required');
  })

  test('should call update command if valid input', async () => {
    const validClient = clientMock();
    const event = {
      httpMethod: 'PUT',
      pathParameters: { id: validClient.clientId },
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(omit(validClient, ['clientId'])),
    } as unknown as APIGatewayProxyEvent;

    const res = await handler(event);
    assert(res, 'should have a response');
    assert.equal(res.statusCode, 200, 'sohuld return HTTP_OK');
    assert.equal(res.body, '', 'should have a empty body');

    assert(ddc.commandCall(0, UpdateCommand), 'should have called UpdateCommand');
  })
})
