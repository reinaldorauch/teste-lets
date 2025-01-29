import { handler } from "@app/clients/get-handler.js";
import { APIGatewayProxyEvent } from "aws-lambda";
import { beforeEach, describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { clientMock } from "@tests/mocks.js";
import { omit } from "@tests/utils.js";

const ddc = mockClient(DynamoDBDocumentClient);

describe('client > get handler', () => {
  beforeEach(() => {
    ddc.reset();
  });
  test('should fail if other than GET method is used', async () => {
    const res = await handler({ httpMethod: 'POST' } as APIGatewayProxyEvent);

    assert(res, 'should have a response');
    assert.equal(res.statusCode, 400, 'should have statusCode for HTTP_BAD_REQUEST');
    const { message } = JSON.parse(res.body);
    assert.equal(message, 'this function expects GET requests');
  })

  test('should fail if no id is provided in path params', async () => {
    const res = await handler({ httpMethod: 'GET' } as APIGatewayProxyEvent);

    assert(res, 'should have a response');
    assert.equal(res.statusCode, 400, 'should have statusCode for HTTP_BAD_REQUEST');
    const { message } = JSON.parse(res.body);
    assert.equal(message, 'this function expects an id pathParam');
  })

  test('should return not found if no client is found', async () => {
    ddc.on(GetCommand).resolves({ Item: undefined });
    const res = await handler({
      httpMethod: 'GET',
      pathParameters: { id: 'haha' }
    } as unknown as APIGatewayProxyEvent);

    assert(res, 'should have a response');
    assert.equal(res.statusCode, 404, 'should have statusCode for HTTP_NOT_FOUND');
    assert(!res.body, 'should not have a body');
  });

  test('should return a client if a valid id is sent', async () => {
    const client = clientMock();

    ddc.on(GetCommand).resolves({ Item: client })

    const res = await handler({
      httpMethod: "GET",
      pathParameters: { id: client.clientId }
    } as unknown as APIGatewayProxyEvent);

    assert(res, 'should have a response');
    assert.equal(res.statusCode, 200, "HTTP_OK");

    assert.deepEqual(omit(client, ['clientId']), JSON.parse(res.body));
  })
});
