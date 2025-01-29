import { beforeEach, describe, test } from 'node:test';
import { strict as assert } from 'node:assert';
import { handler } from '@app/clients/get-handler.js';
import { clientMock } from '../../mocks.js';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { cleanDb, insertClients, listClients } from '../db.js';
import { omit } from '../../utils.js';
import { Client } from '@app/clients/entity/client.entity.js';

describe('get-handler', () => {
  beforeEach(async () => {
    await cleanDb();
    await insertClients([clientMock()]);
  })
  test('should get the specified client by its id', async () => {
    const [client] = await listClients();

    const event = {
      httpMethod: 'GET',
      pathParameters: {
        id: client.clientId
      }
    } as unknown as APIGatewayProxyEvent;

    const res = await handler(event);
    const foundClient = Client.parseFromJson(JSON.parse(res.body));

    assert.deepEqual(omit(foundClient, ['clientId']), omit(client, ['clientId']));
  })
})




