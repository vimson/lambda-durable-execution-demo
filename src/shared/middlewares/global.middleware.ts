import { Logger, LogLevel } from '@aws-lambda-powertools/logger';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import type { MiddyfiedHandler } from '@middy/core';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { Context } from 'aws-lambda';

type MiddlewareOptions = {
  handlerType?: 'httpGet' | 'httpPost' | 'httpPatch' | 'httpDelete';
  schema?: unknown;
};

function getServiceName() {
  return `${process.env.SERVICE_NAME}-${process.env.NODE_ENV}`;
}

export const logger = new Logger({
  serviceName: getServiceName(),
  logLevel: LogLevel.INFO,
});

const globalMiddleWare = <TEvent = unknown, TResult = unknown, TContext extends Context = Context>(
  handler: (event: TEvent, context: TContext) => Promise<TResult>,
  options?: MiddlewareOptions
): MiddyfiedHandler<TEvent, TResult, Error, TContext> => {
  const handlerType = options?.handlerType ?? 'httpPost';

  const middifiedHandler = middy<TEvent, TResult, Error, TContext>({ timeoutEarlyInMillis: 0 });
  if (['httpPost', 'httpPatch'].includes(handlerType)) {
    middifiedHandler.use(httpJsonBodyParser({}));
  }

  return middifiedHandler.use(injectLambdaContext(logger, { logEvent: true })).handler(handler);
};

export default globalMiddleWare;
