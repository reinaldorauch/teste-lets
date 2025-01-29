import { parseBool, parseEmail, parseString } from "@app/lib/parse.js";
import { ClientContact } from "./client-contact.entity.js";

export class EmailContact extends ClientContact {
  constructor(
    primary: boolean,
    public email: string,
  ) {
    super(primary);
  }

  static parseFromJson(contact: Record<string, unknown>): ClientContact {
    const primary = parseBool(contact, 'primary');

    const email = parseEmail(parseString(contact, 'email'));

    return new EmailContact(primary, email);
  }
}
