const getFromEnv = (name: string): string => {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Missing ${name} variable`);
  }
  return val;
};

export const stringFromEnv = (name: string) => (): string => getFromEnv(name);

export const intFromEnv = (name: string) => (): number =>
  parseInt(getFromEnv(name), 10);

export const boolFromEnv = (name: string) => (): boolean =>
  getFromEnv(name).toLowerCase() === 'true';

export const stringArrayFromEnv = (name: string) => (): string[] =>
  getFromEnv(name)
    .split(',')
    .map((str) => str.trim())
    .filter((str) => str);

export const isOffline = boolFromEnv('IS_OFFLINE');

export const getCustomerTableName = stringFromEnv('CUSTOMERS_TABLE_NAME');

export const getTransactionsTableName = stringFromEnv(
  'TRANSACTIONS_TABLE_NAME'
);
