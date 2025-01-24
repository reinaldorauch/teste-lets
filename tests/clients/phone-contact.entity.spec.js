import { PhoneContact } from "@/clients/phone-contact.entity";
import { ParseError } from "@/lib/";
import { strict as assert } from 'node:assert';
import { describe } from 'node:test';
describe('PhoneContact.parseFromJson', () => {
    it('should error when no phone key is given', () => {
        const testRecord = { primary: true };
        try {
            const c = PhoneContact.parseFromJson(testRecord);
        }
        catch (err) {
            assert(err instanceof ParseError, 'error should be a ParseError instance');
            assert(err.message.includes('phone is required'), 'error message should include "phone is required" message');
        }
    });
});
