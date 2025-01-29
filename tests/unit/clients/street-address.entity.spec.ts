import { describe, test } from 'node:test';
import { strict as assert } from 'node:assert';
import { StreetAddress } from '@app/clients/entity/street-address.entity.js';
import { omit } from '../../utils.js';

describe("StreetAddress", () => {
  describe(".parseFromJson", () => {
    test("should return a valid StreetAddress object if all valid inputs are given", () => {
      const clientAddress = {
        label: 'Casa',
        firstLine: 'Rua dos Bobos, 0',
        secondLine: 'Limoeiro',
        city: 'São Paulo',
        state: 'SP',
        country: 'BR',
        zipCode: '00000000'
      };

      Object.setPrototypeOf(clientAddress, StreetAddress.prototype);

      const address = StreetAddress.parseFromJson(clientAddress);
      assert.deepEqual(address, clientAddress);
    })

    test("should fail if firstLine is not present", () => {
      const clientAddress = {
        label: 'Casa',
        // Fail to detect typo
        fistLine: 'Rua dos Bobos, 0',
        secondLine: 'Limoeiro',
        city: 'São Paulo',
        state: 'SP',
        country: 'BR',
        zipCode: '00000000'
      };

      try {
        StreetAddress.parseFromJson(clientAddress);
      } catch (err) {
        assert.equal(err.message, 'firstLine is required');
      }
    });

    test("Should fail if label is not preset", () => {
      const clientAddress = {
        // Fail to detect missing label field
        firstLine: 'Rua dos Bobos, 0',
        secondLine: 'Limoeiro',
        city: 'São Paulo',
        state: 'SP',
        country: 'BR',
        zipCode: '00000000'
      };

      try {
        StreetAddress.parseFromJson(clientAddress);
      } catch (err) {
        assert.equal(err.message, 'label is required');
      }
    })

    test("Should pass if secondLine is not preset", () => {
      const clientAddress = {
        label: 'Casa',
        // Fail to detect missing label field
        firstLine: 'Rua dos Bobos, 0',
        secondline: 'Limoeiro',
        city: 'São Paulo',
        state: 'SP',
        country: 'BR',
        zipCode: '00000000'
      };


      const address = StreetAddress.parseFromJson(clientAddress);

      const expectedAddress = { ...omit(clientAddress, ['secondline']), secondLine: undefined };
      Object.setPrototypeOf(expectedAddress, StreetAddress.prototype);
      assert.deepEqual(address, expectedAddress);
    })

    test("Should fail if city is not preset", () => {
      const clientAddress = {
        label: 'Casa',
        firstLine: 'Rua dos Bobos, 0',
        secondLine: 'Limoeiro',
        // Fail to detect missing label city
        cidade: 'São Paulo',
        state: 'SP',
        country: 'BR',
        zipCode: '00000000'
      };

      try {
        StreetAddress.parseFromJson(clientAddress);
      } catch (err) {
        assert.equal(err.message, 'city is required');
      }
    })

    test('should fail if invalid state is present', () => {
      const clientAddress = {
        label: 'Casa',
        firstLine: 'Rua dos Bobos, 0',
        secondLine: 'Limoeiro',
        city: 'São Paulo',
        state: 'RA',
        country: 'BR',
        zipCode: '00000000'
      };

      try {
        StreetAddress.parseFromJson(clientAddress);
      } catch (err) {
        assert.equal(err.message, 'state is not valid and is required');
      }

    })

    test("Should fail if invalid country is preset", () => {
      const clientAddress = {
        label: 'Casa',
        firstLine: 'Rua dos Bobos, 0',
        secondLine: 'Limoeiro',
        city: 'São Paulo',
        state: 'SP',
        country: 'AR',
        zipCode: '00000000'
      };

      try {
        StreetAddress.parseFromJson(clientAddress);
      } catch (err) {
        assert.equal(err.message, 'country is not valid and is required');
      }
    })

    test('it should throw if zipCode is not given', () => {
      const clientAddress = {
        label: 'Casa',
        firstLine: 'Rua dos Bobos, 0',
        secondLine: 'Limoeiro',
        city: 'São Paulo',
        state: 'SP',
        country: 'BR',
        // zipCode: '0000000'
      };

      try {
        StreetAddress.parseFromJson(clientAddress);
      } catch (err) {
        assert.equal(err.message, 'zipCode is required');
      }
    })

    test('it should invalidate zipCode if a string with length different from 8 is given', () => {
      const clientAddress = {
        label: 'Casa',
        firstLine: 'Rua dos Bobos, 0',
        secondLine: 'Limoeiro',
        city: 'São Paulo',
        state: 'SP',
        country: 'BR',
        zipCode: '0000000'
      };

      try {
        StreetAddress.parseFromJson(clientAddress);
      } catch (err) {
        assert.equal(err.message, 'zip code must have 8 number chars');
      }
    })
  })
})
