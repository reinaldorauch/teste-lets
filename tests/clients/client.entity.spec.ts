import { describe, test } from 'node:test';
import { strict as assert } from 'node:assert';
import { Client } from '@app/clients/client.entity.js';
import { clientMock, emailContactMock, phoneContactMock } from '../mocks.js';
import { omit } from '../utils.js';
import { faker } from '@faker-js/faker/locale/pt_BR';

const ONE_YEAR = 364 * 24 * 60 * 60;

describe('ClientEntity', () => {
  describe('#constructor', () => {
    test('should create when using the constructor', () => {
      const c = clientMock();
      Object.setPrototypeOf(c, Client.prototype);
      const newClient = new Client(c.fullName, c.birthDate, c.addresses, c.contactList);
      assert.deepEqual(c, newClient);
    })
  })
  describe('.parseFromJson', () => {
    test('should error out when fullName is not defined', () => {
      const client = omit(clientMock(), ['fullName']);

      try {
        Client.parseFromJson(client);
      } catch (error) {
        assert.equal(error.message, 'fullName is required');
      }
    })

    test('it should error out when birthDate is after now', () => {
      const now = new Date();
      now.setTime(now.getTime() + ONE_YEAR);
      let nowString = now.toISOString();
      nowString = nowString.substring(0, nowString.indexOf('T'));

      const client: Record<string, unknown> = { ...omit(clientMock(), ['birthDate']), birthDate: nowString };

      try {
        Client.parseFromJson(client);
      } catch (error) {
        assert.equal(error.message, 'birthDate date is greater than now');
      }
    })

    test('it should error when no address is set', () => {
      const client = { ...omit(clientMock(), ['addresses']), addresses: [] };

      try {
        Client.parseFromJson(client);
      } catch (error) {
        assert.equal(error.message, 'addresses must have at least one item');
      }
    })

    test('it should error when a invalid contact is set', () => {
      const client = { ...omit(clientMock(), ['contactList']), contactList: [{}] };

      try {
        Client.parseFromJson(client);
      } catch (error) {
        assert.equal(error.message, 'unindentified contact');
      }
    })

    test('if many contacts are provided as primary, set the first one as primary', () => {
      const client = {
        ...omit(clientMock(), ['contactList']),
        contactList: Array(3).fill(0).map(() =>
          faker.datatype.boolean() ? emailContactMock() : phoneContactMock()
        )
      };

      const primaryIndex = client.contactList.findIndex(v => v.primary);

      const newClient = Client.parseFromJson(client);

      assert.equal(primaryIndex, newClient.contactList.findLastIndex(v => v.primary));
    });
  });
});
