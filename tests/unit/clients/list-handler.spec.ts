import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { clientMock } from "../../mocks.js";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, test } from "node:test";
import { strict as assert } from 'node:assert';
import { handler } from "@app/clients/list-handler.js";
import { APIGatewayProxyEvent } from "aws-lambda";

describe('list-handler', () => {
  const ddc = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddc.reset();
  });

  test('it should list some clients', async () => {
    const Items = [clientMock(), clientMock(), clientMock()];
    ddc.on(ScanCommand).resolves({ Items, Count: Items.length })
    const res = await handler({ httpMethod: 'GET' } as unknown as APIGatewayProxyEvent);

    assert(res, 'list-handler should have a response');
    assert.equal(res.statusCode, 200, 'should respond with HTTP_OK');
    const data = JSON.parse(res.body);

    assert.deepEqual(data, { found: Items.length, clients: Items });
  });

  test('it should fail if GET is not used', async () => {
    const res = await handler({ httpMethod: 'DELETE' } as APIGatewayProxyEvent);

    assert(res, 'should have a response');
    assert.equal(res.statusCode, 400, 'should return HTTP_BAD_REQUEST');
    const { message } = JSON.parse(res.body);
    assert.equal(message, 'this function expects HTTP GET method');
  })

  test('it should return empty list of clients if no client is in table', async () => {
    ddc.on(ScanCommand).resolves({ Items: undefined, Count: 0 });
    const res = await handler({ httpMethod: 'GET' } as APIGatewayProxyEvent);

    assert(res, 'should have a response');
    assert.equal(res.statusCode, 200, 'should return HTTP_OK');
    assert.deepEqual(JSON.parse(res.body), { found: 0, clients: [] });

  })
});
