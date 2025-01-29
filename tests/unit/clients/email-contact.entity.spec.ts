import { describe, test } from "node:test";
import { strict as assert } from 'node:assert';
import { EmailContact } from "@app/clients/entity/email-contact.entity.js";

describe('EmailContact', () => {
  describe('#constructor', () => {
    test('it should create a valid EmailContact with valid imput', () => {
      const emailContact = {
        primary: true,
        email: 'example@email.org'
      };

      const newEmailContact = new EmailContact(true, 'example@email.org');

      Object.setPrototypeOf(emailContact, EmailContact.prototype);

      assert.deepEqual(emailContact, newEmailContact);
    })
  })

  describe('.parseFromJson', () => {
    test('it should create a valid EmailContact object with valid input', () => {
      const emailContact = {
        primary: true,
        email: 'example@email.org'
      };

      Object.setPrototypeOf(emailContact, EmailContact.prototype)

      const parsedEmailContact = EmailContact.parseFromJson(emailContact);

      assert.deepEqual(emailContact, parsedEmailContact)
    })

    test('should invalidate if a primary value is not defined', () => {
      const emailContact = {
        email: 'example@email.org'
      };

      try {
        EmailContact.parseFromJson(emailContact);
      } catch (err) {
        assert.equal(err.message, 'primary is not a boolean')
      }
    })

    test('it should invalidate if a value that is not a boolean is set', () => {
      const emailContact = {
        primary: 1,
        email: 'example@email.org'
      };

      try {
        EmailContact.parseFromJson(emailContact);
      } catch (err) {
        assert.equal(err.message, 'primary is not a boolean')
      }
    })

    test('it should invalidate if a email value is not set', () => {
      const emailContact = {
        primary: false
      };

      try {
        EmailContact.parseFromJson(emailContact);
      } catch (err) {
        assert.equal(err.message, 'email is required')
      }
    })

    test('it should invalidate if invalid email is set', () => {
      const emailContact = {
        primary: false,
        email: 123
      }

      try {
        EmailContact.parseFromJson(emailContact);
      } catch (err) {
        assert.equal(err.message, 'email must be a string');
      }
    })

    test('it should invalidate if empty email is set', () => {
      const emailContact = {
        primary: false,
        email: '      '
      }

      try {
        EmailContact.parseFromJson(emailContact);
      } catch (err) {
        assert.equal(err.message, 'email is required');
      }
    })

    test('it should invalidate if empty email is set', () => {
      const emailContact = {
        primary: false,
        email: 'blakjlkajelkaje'
      }

      try {
        EmailContact.parseFromJson(emailContact);
      } catch (err) {
        assert.equal(err.message, 'email must have the format: username@hostname.tld');
      }
    })
  })
})
