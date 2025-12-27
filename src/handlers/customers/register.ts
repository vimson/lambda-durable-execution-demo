import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { ulid } from 'ulid';

import globalMiddleWare from '../../shared/middlewares/global.middleware';
import { HttpEvent } from '../../shared/types/shared';
import { sanitizedEmail } from '../../shared/utils/common-utils';

const client = new LambdaClient({});

type RegisterInput = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

const postHandler = async (event: HttpEvent<RegisterInput>) => {
  const { body } = event;

  // For durable functions, use qualified ARN with $LATEST or version number
  const functionArn = `${process.env.REGISTER_WORKFLOW_FUNCTION_ARN}:$LATEST`;
  const command = new InvokeCommand({
    FunctionName: functionArn, // Must be qualified ARN for durable functions with $LATEST or version number
    InvocationType: 'Event', // Use 'Event' for asynchronous execution
    Payload: JSON.stringify({ ...body }),
    DurableExecutionName: `user-registration-${sanitizedEmail(body.email)}-${ulid()}`,
  });

  await client.send(command);

  return {
    statusCode: 201,
    body: JSON.stringify({ message: 'Customer Created' }),
  };
};

export const handler = globalMiddleWare(postHandler, { handlerType: 'httpPost' });
