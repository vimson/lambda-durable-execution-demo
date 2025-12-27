/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import dayjs from 'dayjs';

export const buildResponse = (statusCode: number, body: any, additionalHeaders?: Record<string, string>) => {
  const headers = { ...additionalHeaders, 'Content-Type': 'application/json' };
  return {
    statusCode,
    body: typeof body === 'string' ? body : JSON.stringify(body),
    headers,
  };
};

export function parseJson(jsonString: string, returnNullOnError = true) {
  try {
    const parsedJson = JSON.parse(jsonString);
    return parsedJson;
  } catch (error) {
    console.error('Error parsing JSON:', { data: jsonString });
    if (returnNullOnError) {
      return null;
    }
    throw error;
  }
}

export function isEmpty(obj: object | null): boolean {
  if (!obj) {
    return true;
  }
  return Object.keys(obj).length === 0;
}

export function ttl(addDays: number = 7) {
  const ttlDate = dayjs().add(addDays, 'day');
  return Math.floor(ttlDate.toDate().getTime() / 1000);
}

export function excludeItem(arr: string[], itemToExclude: string): string[] {
  return arr.filter((item) => item !== itemToExclude);
}

export function isDefined(value: any) {
  return value !== undefined;
}

export function sanitizedEmail(email: string) {
  return email.replace(/[@.+]/g, '-');
}
