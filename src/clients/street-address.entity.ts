import { validCountries, validStates } from "../lib/br.js";
import { ParseError } from "../lib/parse.error.js";

export class StreetAddress {
  constructor(
    public label: string,

    public fistLine: string,

    public secondLine: string,

    public zipCode: string,

    public city: string,

    public state: string,

    public country: string,
  ) { }

  static parseFromJson(address: any): StreetAddress {
    let label = address.label?.trim();
    if (!label) throw new ParseError('label is required');

    let firstLine = address.fistLine?.trim();
    if (!firstLine) throw new ParseError('firstLine is required');

    let secondLine = address.secondLine?.trim();

    let zipCode = address.zipCode?.trim();

    if (!zipCode) throw new ParseError('zip code is required');
    if (!/^\d{5}\d{3}$/.test(zipCode)) new ParseError('zip code must have 8 digits');

    let city = address.city?.trim();

    if (!city) throw new ParseError('city is required');

    let state = address.state?.trim();

    if (!validStates.includes(state)) throw new ParseError('state is not valid and is required');

    let country = address.country?.trim();

    if (validCountries.includes(country)) throw new ParseError('country is not valid and is required');

    return new StreetAddress(label, firstLine, secondLine, zipCode, city, state, country);
  }
}
