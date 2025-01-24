import { ParseError } from "../lib/parse.error";
import { ClientContact } from "./client-contact.entity";

export class PhoneContact extends ClientContact {
  constructor(
    primary: boolean,
    public phone: string
  ) {
    super(primary)
  }

  static parseFromJson(contact: any): PhoneContact {
    let primary = contact.primary;

    if (![true, false].includes(primary)) throw new ParseError('primary is not a boolean');

    let phone = contact.phone?.trim();
    if (!phone) throw new ParseError('phone is required');
    if (!/^\d*$/.test(phone)) throw new ParseError('phone is invalid, must contain only numbers');

    return new PhoneContact(primary, phone);
  }
}
