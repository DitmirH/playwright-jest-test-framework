import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

/**
 * Load environment variables from .env file.
 * This provides REQRES_API_KEY and REQRES_PUBLIC_KEY to API tests
 * without hardcoding secrets in the codebase.
 */
dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * Playwright configuration supporting two test projects:
 *
 *  1. "ui"  – Browser-based tests against SauceDemo (Chromium).
 *  2. "api" – HTTP-only tests against the ReqRes API (no browser needed).
 *
 * This dual-project setup lets us run `npx playwright test` to execute
 * everything, or `--project=ui` / `--project=api` to run selectively.
 */
export default defineConfig({
  /* Run test files in parallel for fast regression feedback */
  fullyParallel: true,

  /* Prevent .only from leaking into CI pipelines */
  forbidOnly: !!process.env.CI,

  /* Retry failed tests on CI to absorb transient network flakiness */
  retries: process.env.CI ? 2 : 0,

  /* Limit workers on CI to avoid resource contention */
  workers: process.env.CI ? 1 : undefined,

  /**
   * Reporter configuration:
   * - 'list' prints live results to the terminal (total / passed / failed).
   * - 'html' generates a rich, browsable report.
   */
  reporter: [["list"], ["html", { open: "never" }]],

  /* Global test timeout – 30 seconds keeps tests fast */
  timeout: 30_000,

  /* ── Test projects ─────────────────────────────────────────────── */
  projects: [
    /* ── UI Project ── */
    {
      name: "ui",
      testDir: "./tests/ui",
      use: {
        baseURL: process.env.UI_BASE_URL ?? "https://www.saucedemo.com",

        /* Run headless by default for speed; use --headed to debug */
        headless: true,

        screenshot: "only-on-failure",
        video: "retain-on-failure",
        trace: "on-first-retry",

        /* Timeout for individual browser actions (click, fill, etc.) */
        actionTimeout: 10_000,

        /* 500ms delay between actions so you can watch tests run slowly */
        launchOptions: { slowMo: 500 },

        /* Browser: Chromium (Desktop Chrome) */
        ...devices["Desktop Chrome"],
      },
    },

    /* ── API Project ── */
    {
      name: "api",
      testDir: "./tests/api",
      use: {
        /* Base URL for the ReqRes API */
        baseURL: "https://reqres.in",

        /**
         * Set the Manage API key globally for all API requests.
         * Most API tests use admin CRUD endpoints that require this key.
         * Auth tests override this header per-request when needed.
         */
        extraHTTPHeaders: {
          "x-api-key": process.env.REQRES_API_KEY ?? "",
        },
      },
    },
  ],
});
