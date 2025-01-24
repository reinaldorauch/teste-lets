export class StreetAddress {
  label: string;

  fistLine: string;

  secondLine: string;

  zipCode: string;

  city: string;

  state: string;

  country: string;

  static parseFromJson(address: any): StreetAddress {

  }
}
