import { SendTemplatedEmailCommand, SESClient } from '@aws-sdk/client-ses';

import { CustomerInput } from '../../handlers/customers/register-workflow';
import { updateCustomer } from '../repositories/customer.repo';
import { generateEmailVerificationToken } from '../utils/email-verification-token.util';

export async function sendVerificationEmail(customer: CustomerInput, callbackId: string) {
  if (!customer.id) {
    throw new Error('Customer ID is required to send verification email');
  }

  const verificationToken = generateEmailVerificationToken(customer.id, 2); // Token valid for 2 days

  const ses = new SESClient({ region: process.env.AWS_REGION });
  const command = new SendTemplatedEmailCommand({
    Source: process.env.FROM_EMAIL,
    Destination: {
      ToAddresses: [customer.email],
    },
    Template: 'VerificationEmail',
    TemplateData: JSON.stringify({
      name: customer.firstName,
      email: customer.email,
      verificationUrl: `${process.env.API_URL}/verify?token=${verificationToken}`,
    }),
  });
  await ses.send(command);

  await updateCustomer({
    id: customer.id,
    callbackId,
    status: 'VERIFICATION_EMAIL_SENT',
  });

  return { customerId: customer.id, callbackId, status: 'VERIFICATION_EMAIL_SENT' };
}
