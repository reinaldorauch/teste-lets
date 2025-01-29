import { test, describe, beforeEach } from "node:test";
import { strict as assert } from "node:assert";
import { cleanDb, insertClients, listClients } from "../db.js";
import { clientMock } from "@tests/mocks.js";
import { handler } from "@app/clients/delete-handler.js";
import { APIGatewayProxyEvent } from "aws-lambda";

describe('clients > delete handler', () => {
  beforeEach(async () => {
    await cleanDb();
    await insertClients([clientMock(), clientMock()])
  })
  test('it should delete a client from the table', async () => {
    const [, beforeClient] = await listClients();

    const event = {
      httpMethod: 'DELETE',
      pathParameters: { id: beforeClient.clientId }
    } as unknown as APIGatewayProxyEvent;

    const res = await handler(event);

    assert(res, 'should be a response');
    assert.equal(res.statusCode, 200, 'should be HTTP_OK');

    const afterClients = await listClients();
    assert.equal(afterClients.length, 1, 'should be only one client left');
    assert.notEqual(
      afterClients[0].clientId,
      beforeClient.clientId,
      'the client left should not be the one deleted'
    );
  });
})
