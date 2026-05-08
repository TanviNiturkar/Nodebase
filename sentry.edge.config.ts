// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://1a7e1bc33e349a8c0f0b26564c87b230@o4511196304375808.ingest.de.sentry.io/4511196321808464",


  integrations: [
    Sentry.vercelAIIntegration({
      recordInputs: true, // Whether to record the inputs to the AI calls
      recordOutputs: true, // Whether to record the outputs from the AI calls
    }),
    Sentry.consoleLoggingIntegration({levels:["log","error","warn"]}),
  ],
  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
