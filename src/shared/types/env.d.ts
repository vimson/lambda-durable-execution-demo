declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_REGION: string;
      TABLE_NAME: string;
      REGISTER_WORKFLOW_FUNCTION_ARN: string;
      EMAIL_VERIFICATION_SECRET: string;
      FROM_EMAIL: string;
      API_URL: string;
      SERVICE_NAME: string;
      NODE_ENV: 'development' | 'staging' | 'production';
    }
  }
}

export {};
