import { generateEmailVerificationToken, verifyEmailVerificationToken } from './email-verification-token.util';

describe('Email Verification Token Utils', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, EMAIL_VERIFICATION_SECRET: 'test-secret-key' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('generateEmailVerificationToken', () => {
    it('should generate a token with customerId', () => {
      const customerId = 'customer123';
      const token = generateEmailVerificationToken(customerId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token).toContain('.');
    });

    it('should generate different tokens for same customerId due to nonce', () => {
      const customerId = 'customer123';
      const token1 = generateEmailVerificationToken(customerId);
      const token2 = generateEmailVerificationToken(customerId);

      expect(token1).not.toBe(token2);
    });

    it('should accept custom expiration days', () => {
      const customerId = 'customer123';
      const token = generateEmailVerificationToken(customerId, 7);

      expect(token).toBeDefined();
    });
  });

  describe('verifyEmailVerificationToken', () => {
    it('should verify a valid token', () => {
      const customerId = 'customer123';
      const token = generateEmailVerificationToken(customerId);

      const verifiedCustomerId = verifyEmailVerificationToken(token);

      expect(verifiedCustomerId).toBe(customerId);
    });

    it('should throw error for invalid signature', () => {
      const customerId = 'customer123';
      const token = generateEmailVerificationToken(customerId);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';

      expect(() => verifyEmailVerificationToken(tamperedToken)).toThrow('Invalid signature');
    });

    it('should throw error for expired token', () => {
      const customerId = 'customer123';
      const token = generateEmailVerificationToken(customerId, 0);

      jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 100000);

      expect(() => verifyEmailVerificationToken(token)).toThrow('Token expired');
    });

    it('should throw error for malformed token', () => {
      expect(() => verifyEmailVerificationToken('invalid-token')).toThrow();
    });

    it('should verify token generated with different expiration days', () => {
      const customerId = 'customer456';
      const token = generateEmailVerificationToken(customerId, 7);

      const verifiedCustomerId = verifyEmailVerificationToken(token);

      expect(verifiedCustomerId).toBe(customerId);
    });
  });
});
