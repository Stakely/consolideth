import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import {
  SENTRY_DSN,
  TRACES_SAMPLE_RATE,
  PROFILES_SAMPLE_RATE,
  SENTRY_ENABLED,
} from './config';

// Initialize Sentry as early as possible
Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [
    // Add our Profiling integration with type cast to resolve version conflicts
    nodeProfilingIntegration() as any,
  ],

  // Add Tracing by setting tracesSampleRate
  // We recommend adjusting this value in production
  tracesSampleRate: TRACES_SAMPLE_RATE,

  // Set sampling rate for profiling
  // This is relative to tracesSampleRate
  profilesSampleRate: PROFILES_SAMPLE_RATE,

  // Enable or disable Sentry based on environment variable
  enabled: SENTRY_ENABLED,
  environment: process.env.NODE_ENV,
});
export { Sentry };
