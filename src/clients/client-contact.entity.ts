import { ParseError } from '../lib/parse.error';
import { PhoneContact } from './phone-contact.entity';
import { EmailContact } from './email-contact.entity';

export abstract class ClientContact {
  primary: boolean

  static parseFromJson(contact: any): ClientContact {
    if (![true, false].includes(contact.primary)) throw new ParseError('primary is not a boolean');
    if (contact.phone) return PhoneContact.parseFromJson(contact);
    if (contact.email) return EmailContact.parseFromJson(contact);
    throw new ParseError('invalid contact');
  }
}
