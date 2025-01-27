import { validCountries, validStates } from "../lib/br.js";
import { ParseError } from "../lib/parse.error.js";

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

  static parseFromJson(address: any): StreetAddress {
    let label = address.label?.trim();
    if (!label) {
      throw new ParseError('label is required');
    }

    let firstLine = address.firstLine?.trim();
    if (!firstLine) {
      throw new ParseError('firstLine is required');
    }

    let secondLine = address.secondLine?.trim();

    let zipCode = address.zipCode?.trim();

    if (!zipCode) {
      throw new ParseError('zip code is required');
    }
    if (!/^\d{8}$/.test(zipCode)) {
      throw new ParseError('zip code must have 8 number chars');
    }

    let city = address.city?.trim();

    if (!city) {
      throw new ParseError('city is required');
    }

    let state = address.state?.trim();

    if (!validStates.includes(state)) {
      throw new ParseError('state is not valid and is required');
    }

    let country = address.country?.trim();

    if (!validCountries.includes(country)) {
      throw new ParseError('country is not valid and is required');
    }

    return new StreetAddress(label, firstLine, zipCode, city, state, country, secondLine);
  }
}
