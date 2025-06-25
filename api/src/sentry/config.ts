// config.ts
import { config } from 'dotenv';
config();

export const SENTRY_DSN = process.env.SENTRY_DSN;
export const NODE_ENV = process.env.NODE_ENV;
export const TRACES_SAMPLE_RATE = parseFloat(
  process.env.TRACES_SAMPLE_RATE || '1.0',
);
export const PROFILES_SAMPLE_RATE = parseFloat(
  process.env.PROFILES_SAMPLE_RATE || '1.0',
);
export const SENTRY_ENABLED = process.env.SENTRY_ENABLED === 'true';
