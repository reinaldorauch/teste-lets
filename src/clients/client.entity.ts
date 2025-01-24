import { StreetAddress } from "./street-address.entity";

import { ClientContact } from "./client-contact.entity";
import { ParseError } from "../lib/parse.error";

export class Client {
  constructor(
    public fullName: string,

    public birthDate: string,

    public active: boolean,

    public addresses: StreetAddress[],

    public contactList: ClientContact[],
  ) { }

  static parseFromJson(json: any): Client {
    let fullName = json.fullName?.trim();

    if (!fullName) throw new ParseError('fullName is not valid');

    let birthDate = json.birthDate?.trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate.trim())) throw new ParseError('birthDate date is not valid');
    const now = new Date().toISOString().split('T')[0];
    if (birthDate >= now) throw new ParseError('birthDate date is greater than now');

    let active = json?.active;
    if (active !== true && active !== false) throw new ParseError('active is not boolean');

    let addresses = (json.addresses || []).map(StreetAddress.parseFromJson);

    if (!addresses.length) throw new ParseError('at least one address is needed');

    let contactList = (json.contactList || []).map(ClientContact.parseFromJson);

    if (!contactList.length) throw new ParseError('at least one contact is needed');

    return new Client(fullName, birthDate, active, addresses, contactList);
  }
}
