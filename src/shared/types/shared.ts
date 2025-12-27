/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIGatewayEvent } from 'aws-lambda';

export type LambdaHanderType = 'httpGet' | 'httpPost' | 'httpPatch' | 'eventDriven' | 'httpDelete';

export type Optional<T> = T | null | undefined;

export type Options<T = any> = {
  [key: string]: T;
};

export interface HttpEvent<T> extends Omit<APIGatewayEvent, 'body'> {
  body: T;
}

export type Nullable<T> = T | null | undefined;
