import type { Config } from "jest";

/** Format date as dd-mm-yyyy-hh-mm-ss for report filenames (no colons – invalid in artifact paths) */
function reportTimestamp(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${dd}-${mm}-${yyyy}-${hh}-${min}-${ss}`;
}

/**
 * Jest configuration for API automation tests (Jest + Axios).
 *
 * Uses ts-jest so TypeScript tests run without a separate compile step.
 * Only files inside the root-level /api-tests directory are picked up.
 * UI tests are handled separately by Playwright.
 */
const config: Config = {
  /* Use ts-jest to transpile TypeScript on the fly */
  preset: "ts-jest",

  /* Run in Node (not jsdom) – these are pure HTTP / API tests */
  testEnvironment: "node",

  /* Only match test files inside the api-tests directory */
  roots: ["<rootDir>/api-tests"],

  /* Standard Jest naming convention */
  testMatch: ["**/*.test.ts"],

  /* Load .env before tests so REQRES_API_KEY is available */
  setupFiles: ["<rootDir>/api-tests/setup.ts"],

  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "API Test Report",
        outputPath: `api-tests/reports/jest-report-${reportTimestamp()}.html`,
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],

  /* Network calls to reqres.in can be slow – give them breathing room */
  testTimeout: 15_000,

  /* Show every individual test name in the output */
  verbose: true,
};

export default config;
