import crypto from 'crypto';

const SECRET = process.env.EMAIL_VERIFICATION_SECRET;

export function generateEmailVerificationToken(customerId: string, days = 1) {
  const payload = {
    customerId,
    exp: Date.now() + 1000 * 60 * 60 * 24 * days, // 24 hours * days
    nonce: crypto.randomBytes(16).toString('hex'),
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');

  const signature = crypto.createHmac('sha256', SECRET).update(payloadBase64).digest('base64url');

  return `${payloadBase64}.${signature}`;
}

export function verifyEmailVerificationToken(token: string) {
  const [payloadBase64, signature] = token.split('.') as [string, string];

  const expectedSignature = crypto.createHmac('sha256', SECRET).update(payloadBase64).digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new Error('Invalid signature');
  }

  const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString());

  if (Date.now() > payload.exp) {
    throw new Error('Token expired');
  }

  return payload.customerId;
}
