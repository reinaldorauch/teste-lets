import { describe, test } from 'node:test';
import { strict as assert } from 'node:assert';

import { PhoneContact } from '@app/clients/entity/phone-contact.entity.js'

describe('PhoneContact', () => {
  describe('.parseFromJson', () => {
    test('should fail if phone is not present', () => {
      const clientPhone = {
        primary: false
      };

      try {
        PhoneContact.parseFromJson(clientPhone);
      } catch (err) {
        assert.equal(err.message, 'phone is required');
      }
    })

    test('should fail if invalid primary value is set', () => {
      const clientPhoneContact = {
        primary: 'truey',
        phone: '1233456675'
      };

      try {
        PhoneContact.parseFromJson(clientPhoneContact);
      } catch (err) {
        assert.equal(err.message, 'primary is not a boolean');
      }
    })

    test('should fail if non-digit chars are passed', () => {
      const clientPhoneContact = {
        primary: false,
        phone: '12255GOLDEN'
      }

      try {
        PhoneContact.parseFromJson(clientPhoneContact);
      } catch (err) {
        assert.equal(err.message, 'phone is invalid, must contain only numbers');
      }
    })

    test('should create valid PhoneContact object with valid data', () => {
      const clientPhoneContact = {
        primary: true,
        phone: '12225123541'
      };


      const phoneContact = PhoneContact.parseFromJson(clientPhoneContact);
      Object.setPrototypeOf(clientPhoneContact, PhoneContact.prototype);
      assert.deepEqual(phoneContact, clientPhoneContact);
    })
  })
})
