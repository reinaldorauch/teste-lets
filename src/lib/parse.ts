import { ParseError } from "./parse.error.js";

export const parseInteger = (maybeNumber: string | number, def = 0): number => {
  const num = +(maybeNumber ?? def);
  return Number.isNaN(num) ? def : num;
}

export const parseOptionalString = <T extends Record<string, unknown>>(obj: T, field: keyof T): string | undefined => {
  if (!obj[field]) {
    return undefined;
  }

  if (typeof obj[field] !== 'string') {
    throw new ParseError(`${field.toString()} must be a string`);
  }

  const returnVal = obj[field].trim();

  if (!returnVal) {
    return undefined;
  }

  return returnVal;
}

export const parseString = <T extends Record<string, unknown>>(obj: T, field: keyof T): string => {
  if (!obj[field]) {
    throw new ParseError(`${field.toString()} is required`);
  }

  if (typeof obj[field] !== 'string') {
    throw new ParseError(`${field.toString()} must be a string`);
  }

  const returnVal = obj[field].trim();

  if (!returnVal) {
    throw new ParseError(`${field.toString()} is required`);
  }

  return returnVal;
}

export const parseBool = <T extends Record<string, unknown>>(obj: T, field: keyof T): boolean => {
  if (typeof obj[field] !== 'boolean') {
    throw new ParseError(`${field.toString()} is not a boolean`);
  }
  return obj[field];
}

export const parseBirthDate = (val: string): string => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    throw new ParseError('birthDate must have the format YYYY-MM-DD');
  }

  const now = new Date().toISOString().split('T')[0];
  if (val >= now) {
    throw new ParseError('birthDate date is greater than now');
  }

  return val;
}

export const parseEmail = (maybeEmail: string): string => {
  if (!/^.*@.*\.\w*$/.test(maybeEmail)) {
    throw new ParseError("email must have the format: username@hostname.tld");
  }

  return maybeEmail;
}

export const parseArray = <T extends Record<string, unknown>, U>(obj: T, field: keyof T, fn: (val: T) => U): U[] => {
  if (!Array.isArray(obj[field])) {
    throw new ParseError(`${field.toString()} must be a list`);
  }

  if (!obj[field].length) {
    throw new ParseError(`${field.toString()} must have at least one item`);
  }

  return obj[field].map(fn);
}
