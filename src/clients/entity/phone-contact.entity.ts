import { parseBool, parseString } from "@app/lib/parse.js";
import { ParseError } from "../../lib/parse.error.js";
import { ClientContact } from "./client-contact.entity.js";

export class PhoneContact extends ClientContact {
  constructor(
    primary: boolean,
    public phone: string
  ) {
    super(primary)
  }

  static parseFromJson(contact: Record<string, unknown>): PhoneContact {
    const primary = parseBool(contact, 'primary');

    const phone = parseString(contact, 'phone');

    if (!/^\d*$/.test(phone)) {
      throw new ParseError('phone is invalid, must contain only numbers');
    }

    return new PhoneContact(primary, phone);
  }
}
