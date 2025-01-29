import { handler } from "@app/clients/delete-handler.js";
import { test, describe, beforeEach } from "node:test"
import { strict as assert } from "node:assert";
import { APIGatewayProxyEvent } from "aws-lambda";
import { mockClient } from "aws-sdk-client-mock";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";

const ddc = mockClient(DynamoDBDocumentClient);

describe('delete-handler', () => {
  beforeEach(() => {
    ddc.reset();
  });

  test('should fail if non DELETE method is used', async () => {
    const event = { httpMethod: 'GET' };
    try {
      await handler(event as APIGatewayProxyEvent);
    } catch (err) {
      assert.equal(err.message, 'this function expects DELETE method');
    }
  });

  test('should fail if no id is given in path param', async () => {
    const event = { httpMethod: 'DELETE' } as APIGatewayProxyEvent;
    try {
      await handler(event);
    } catch (err) {
      assert.equal(err.message, 'this function expects the {id} path param');
    }
  })

  test('it should send the DeleteCommand for db client', async () => {
    const id = randomUUID().toString();
    const event = {
      httpMethod: 'DELETE',
      pathParameters: { id }
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(event);

    assert(result, 'should be a result');
    assert.equal(result.statusCode, 200, 'should return HTTP_OK');

    const command = ddc.commandCall(0, DeleteCommand);
    assert(command, 'should have been a Delete Command');
    assert.equal(command.firstArg.input.Key.clientId, id, 'should be sent with the given id');
  });
});
