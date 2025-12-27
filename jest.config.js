export const setupFiles = ['<rootDir>/jest.setup.js'];
export const testMatch = ['**/*.test.{js,ts}'];
export const transform = {
  '^.+\\.[jt]s$': ['@swc/jest'],
};
export const moduleNameMapper = {
  // Handle module aliases (this will be automatically configured for you soon)
  '^@/(.*)$': '<rootDir>/src/$1',

  '^__mocks__/(.*)$': '<rootDir>/__mocks__/$1',
};
export const clearMocks = true;
export const verbose = true;
export const collectCoverageFrom = ['./src/**/*.{js,ts}', '!src/handler.ts', '!**/*.d.ts', '!**/node_modules/**'];
export const coverageThreshold = {
  global: {
    branches: 30,
    functions: 30,
    lines: 30,
    statements: 30,
  },
};
export const testPathIgnorePatterns = ['<rootDir>/node_modules/', '<rootDir>/.serverless/'];
