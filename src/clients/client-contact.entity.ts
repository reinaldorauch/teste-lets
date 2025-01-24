import { ParseError } from '../lib/parse.error';
import { PhoneContact } from './phone-contact.entity';
import { EmailContact } from './email-contact.entity';

export abstract class ClientContact {
  constructor(
    public primary: boolean,
  ) { }
}
