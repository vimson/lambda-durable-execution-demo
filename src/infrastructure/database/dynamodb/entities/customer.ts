import { Entity, InputValue, item, string } from 'dynamodb-toolbox';

import table from '../base-table';

const customerSchema = item({
  PK: string().key().required(),
  SK: string().key().required(),

  GSI1PK: string().required('never'),
  GSI1SK: string().required('never'),
  GSI2PK: string().required('never'),
  GSI2SK: string().required('never'),
  GSI3PK: string().required('never'),
  GSI3SK: string().required('never'),

  id: string(),
  email: string(),

  firstName: string(),
  lastName: string(),

  passwordHash: string().required('never'),

  createtAt: string().required('never'),
  updatedAt: string().required('never'),

  callbackId: string().required('never'), // For durable functions callback tracking

  status: string().required('never'),
});

export const customerEntity = new Entity({
  name: 'Customer',
  table,
  schema: customerSchema,
  computeKey: ({ PK, SK }) => ({
    PK: `${PK}`,
    SK: `${SK}`,
  }),
});

export type Customer = InputValue<typeof customerSchema>;

export type CustomerFields = keyof Customer;
