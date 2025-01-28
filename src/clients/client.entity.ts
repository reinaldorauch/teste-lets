import { StreetAddress } from "./street-address.entity.js";

import { ClientContact } from "./client-contact.entity.js";
import { ParseError } from "../lib/parse.error.js";
import { EmailContact } from "./email-contact.entity.js";
import { PhoneContact } from "./phone-contact.entity.js";
import { parseArray, parseBirthDate, parseString } from "@app/lib/parse.js";
import { randomUUID } from "node:crypto";

export class Client {
  clientId: string;
  active: boolean = true;

  constructor(
    public fullName: string,

    public birthDate: string,

    public addresses: StreetAddress[],

    public contactList: ClientContact[],
  ) { }

  static parseFromJson(json: Record<string, unknown>): Client {
    const fullName = parseString(json, 'fullName');

    const birthDate = parseBirthDate(parseString(json, 'birthDate'));

    const addresses = parseArray(json, 'addresses', StreetAddress.parseFromJson);

    let contactList: ClientContact[] = parseArray(json, 'contactList', (v) => {
      if (v.email) {
        return EmailContact.parseFromJson(v);
      }
      if (v.phone) {
        return PhoneContact.parseFromJson(v);
      }

      throw new ParseError('unindentified contact');
    });

    // Making only one contact primary
    contactList = contactList.reduce(({ found, list }, item) => {
      if (!found && item.primary) {
        found = true;
        list.push(item);
      } else {
        item.primary = false;
        list.push(item);
      }

      return { found, list };
    }, { found: false, list: [] as ClientContact[] }).list;

    return new Client(fullName, birthDate, addresses, contactList);
  }

  static createFromJson(obj: Record<string, unknown>): Client {
    const newClient = Client.parseFromJson(obj);
    newClient.clientId = randomUUID();
    return newClient;
  }
}
