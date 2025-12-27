import { GetItemCommand, PutItemCommand, UpdateItemCommand, UpdateItemInput } from 'dynamodb-toolbox';
import { ulid } from 'ulid';

import { Customer, customerEntity } from '../../infrastructure/database/dynamodb/entities/customer';
import { logger } from '../../shared/middlewares/global.middleware';

export async function createCustomer(customer: Partial<Customer>) {
  const id = ulid();

  const putItem: Customer = {
    PK: `CUSTOMER`,
    SK: `ID#${id}`,

    GSI1PK: `CUSTOMER`,
    GSI1SK: `EMAIL#${customer.email}`,

    id,
    email: customer.email!,
    firstName: customer.firstName!,
    lastName: customer.lastName!,
    passwordHash: customer.passwordHash!,

    createtAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (customer.callbackId) {
    putItem.callbackId = customer.callbackId;
  }

  try {
    await customerEntity.build(PutItemCommand).item(putItem).send();
    return id;
  } catch (error: unknown) {
    logger.error('Error creating customer:', { error });
    throw error;
  }
}

export async function updateCustomer(data: Partial<Customer>) {
  const updateItem: UpdateItemInput<typeof customerEntity> = {
    PK: `CUSTOMER`,
    SK: `ID#${data.id}`,

    status: data.status,
    updatedAt: new Date().toISOString(),
  };

  if (data.callbackId) {
    updateItem.callbackId = data.callbackId;
  }
  if (data.status) {
    updateItem.status = data.status;
  }

  await customerEntity.build(UpdateItemCommand).item(updateItem).send();
}

export async function getCustomerbyId(customerId: string) {
  const { Item } = await customerEntity
    .build(GetItemCommand)
    .key({
      PK: `CUSTOMER`,
      SK: `ID#${customerId}`,
    })
    .send();
  return Item ? (Item as unknown as Customer) : null;
}
