import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Table } from 'dynamodb-toolbox';

const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: false,
  convertClassInstanceToMap: false,
};

const unmarshallOptions = {
  wrapNumbers: false,
};

const translateConfig = { marshallOptions, unmarshallOptions };

export const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}), translateConfig);

export default new Table({
  documentClient,
  name: process.env.TABLE_NAME,
  partitionKey: {
    name: 'PK',
    type: 'string',
  },
  sortKey: {
    name: 'SK',
    type: 'string',
  },
  indexes: {
    GSI1: {
      type: 'global',
      partitionKey: {
        name: 'GSI1PK',
        type: 'string',
      },
      sortKey: {
        name: 'GSI1SK',
        type: 'string',
      },
    },
    GSI2: {
      type: 'global',
      partitionKey: {
        name: 'GSI2PK',
        type: 'string',
      },
      sortKey: {
        name: 'GSI2SK',
        type: 'string',
      },
    },
    GSI3: {
      type: 'global',
      partitionKey: {
        name: 'GSI3PK',
        type: 'string',
      },
      sortKey: {
        name: 'GSI3SK',
        type: 'string',
      },
    },
  },
});
