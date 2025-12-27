import { LambdaClient, SendDurableExecutionCallbackSuccessCommand } from '@aws-sdk/client-lambda';

import { getCustomerbyId } from '../../domain/repositories/customer.repo';
import { verifyEmailVerificationToken } from '../../domain/utils/email-verification-token.util';
import globalMiddleWare, { logger } from '../../shared/middlewares/global.middleware';
import { HttpEvent, Options } from '../../shared/types/shared';
import { buildResponse } from '../../shared/utils/common-utils';

const client = new LambdaClient({});

const verifyEmailHandler = async (event: HttpEvent<undefined>) => {
  const { queryStringParameters = {} } = event;
  const { token } = queryStringParameters as Options;
  const customerId = verifyEmailVerificationToken(token);

  const customer = await getCustomerbyId(customerId);
  if (!customer) {
    logger.warn('Customer not found for email verification', { customerId });
    return buildResponse(404, { message: 'Customer Not Found' });
  }

  try {
    const command = new SendDurableExecutionCallbackSuccessCommand({
      CallbackId: customer.callbackId,
      Result: JSON.stringify({ customerId: customerId, emailVerified: true, timestamp: Date.now() }),
    });
    await client.send(command);
  } catch (error) {
    logger.error('Error sending durable execution callback success:', { error });
    return buildResponse(500, { message: 'Internal Server Error' });
  }

  return buildResponse(200, { message: 'Email Verified' });
};

export const handler = globalMiddleWare(verifyEmailHandler, { handlerType: 'httpGet' });
