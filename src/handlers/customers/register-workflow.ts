import { DurableContext, withDurableExecution } from '@aws/durable-execution-sdk-js';

import { createCustomer, updateCustomer } from '../../domain/repositories/customer.repo';
import { sendVerificationEmail } from '../../domain/services/customer.service';
import { logger } from '../../shared/middlewares/global.middleware';

export type CustomerInput = {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

async function customerRegisterWorkflow(input: CustomerInput, context: DurableContext) {
  logger.trace('Starting customer registration workflow', { input });

  logger.trace('Step 1: Create customer record');
  const customerCreatedStep = await context.step('create-customer-record', async () => {
    const customerId = await createCustomer({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      passwordHash: input.password, // In real scenarios, hash the password before storing
      status: 'REGISTERED',
      createtAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { customerId };
  });

  logger.trace('Step 2: Send Email Verification Email');
  const emailVerificationStep = await context.waitForCallback(
    'send-email-verification',
    async (callbackId) => {
      await sendVerificationEmail({ id: customerCreatedStep.customerId, ...input }, callbackId);
    },
    {
      timeout: { seconds: 172800 },
    }
  );

  logger.trace('Step 3: Mark Email Verified and Send Welcome Email');
  await context.step('send-welcome-email', async () => {
    await updateCustomer({ id: customerCreatedStep.customerId, status: 'EMAIL_VERIFIED' });
    logger.trace('Customer registration workflow completed successfully', { emailVerificationStep });
    return {
      customerId: customerCreatedStep.customerId,
      registrationStatus: 'Successful',
    };
  });
}

export const handler = withDurableExecution(customerRegisterWorkflow);
