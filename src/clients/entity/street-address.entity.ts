import { parseOptionalString, parseString } from "@app/lib/parse.js";
import { validCountries, validStates } from "../../lib/br.js";
import { ParseError } from "../../lib/parse.error.js";

export class StreetAddress {
  constructor(
    public label: string,

    public firstLine: string,

    public zipCode: string,

    public city: string,

    public state: string,

    public country: string,

    public secondLine?: string,
  ) { }

  static parseFromJson(address: Record<string, unknown>): StreetAddress {
    const label = parseString(address, 'label');
    const firstLine = parseString(address, 'firstLine');
    const secondLine = parseOptionalString(address, 'secondLine');

    const zipCode = parseString(address, 'zipCode');

    if (!/^\d{8}$/.test(zipCode)) {
      throw new ParseError('zip code must have 8 number chars');
    }

    const city = parseString(address, 'city');
    const state = parseString(address, 'state');

    if (!validStates.includes(state)) {
      throw new ParseError('state is not valid and is required');
    }

    const country = parseString(address, 'country');

    if (!validCountries.includes(country)) {
      throw new ParseError('country is not valid and is required');
    }

    return new StreetAddress(label, firstLine, zipCode, city, state, country, secondLine);
  }
}
