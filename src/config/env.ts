import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  ENV: process.env.ENV ?? 'dev',
  BASE_URL: requireEnv('BASE_URL'),
  API_BASE_URL: requireEnv('API_BASE_URL'),
  ADMIN_EMAIL: requireEnv('ADMIN_EMAIL'),
  ADMIN_PASSWORD: requireEnv('ADMIN_PASSWORD'),
  API_TOKEN: process.env.API_TOKEN ?? '',
} as const;

export type Env = typeof env;
