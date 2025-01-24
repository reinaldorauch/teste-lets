import { ParseError } from "../lib/parse.error";
import { ClientContact } from "./client-contact.entity";

export class EmailContact extends ClientContact {
  constructor(
    primary: boolean,
    public email: string
  ) {
    super(primary)
  }

  static parseFromJson(contact: any): ClientContact {
    let primary = contact.primary;

    if (![true, false].includes(primary)) throw new ParseError('primary is not a boolean');

    let email = contact.email?.trim();
    if (!email) throw new ParseError('email is required');
    if (!/^.*@.*\.\w*$/.test(email)) throw new ParseError('email is invalid and required');

    return new EmailContact(primary, email);
  }
}
