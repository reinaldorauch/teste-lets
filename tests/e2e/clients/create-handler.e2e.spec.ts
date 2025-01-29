import { beforeEach, describe, test } from 'node:test';
import { strict as assert } from 'node:assert';
import { handler } from '@app/clients/create-handler.js';
import { clientMock } from '../../mocks.js';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { cleanDb, listClients } from '../db.js';
import { omit } from '../../utils.js';

describe('clients > create function', () => {
  beforeEach(async () => {
    await cleanDb();
  });

  test('should create a valid client in the database', async () => {
    const newClient = clientMock();

    const event = {
      httpMethod: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(omit(newClient, ['clientId'])),
    } as unknown as APIGatewayProxyEvent;

    const res = await handler(event);

    assert(res, 'should be a valid response');
    assert.equal(res.statusCode, 201, 'statusCode should be HTTP_CREATED');
    assert.equal(res.headers['content-type'], 'application/json', 'content type should be a json');
    const createdClient = JSON.parse(res.body);

    assert(createdClient.clientId, 'should have clientId');
    const foundClients = await listClients();

    assert(
      foundClients.find(({ clientId }) => clientId == createdClient.clientId),
      'should have this client on table'
    );
  })
})
