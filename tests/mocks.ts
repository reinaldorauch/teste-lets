import { faker } from '@faker-js/faker/locale/pt_BR';
import { Client } from '@app/clients/entity/client.entity.js';
import { EmailContact } from '@app/clients/entity/email-contact.entity.js';
import { PhoneContact } from '@app/clients/entity/phone-contact.entity.js';
import { StreetAddress } from '@app/clients/entity/street-address.entity.js';
import { validCountries, validStates } from '@app/lib/br.js';
import { randomUUID } from 'node:crypto';

export const clientMock: () => Client = () => ({
  active: true,
  clientId: randomUUID(),
  contactList: [faker.datatype.boolean() ? emailContactMock() : phoneContactMock()],
  birthDate: faker.date.birthdate().toISOString().split('T')[0],
  fullName: faker.person.fullName(),
  addresses: [addressMock()]
})

export const emailContactMock: () => EmailContact = () => ({
  email: faker.internet.email(),
  primary: faker.datatype.boolean()
});

export const phoneContactMock: () => PhoneContact = () => ({
  phone: faker.phone.number({ style: 'international' }).substring(1),
  primary: faker.datatype.boolean()
})

export const addressMock: () => StreetAddress = () => {
  const secondLine: string = faker.lorem.words({ min: 0, max: 5 });

  return {
    city: faker.location.city(),
    country: faker.helpers.arrayElement(validCountries),
    firstLine: faker.lorem.words(5),
    ...(secondLine ? { secondLine } : {}),
    label: faker.lorem.word(),
    state: faker.helpers.arrayElement(validStates),
    zipCode: faker.string.numeric(8)
  }
} 
