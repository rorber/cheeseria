import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve('./', 'tests', '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Run tests in files in parallel */
  fullyParallel: true,
  outputDir: './playwright-videos',
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
        // ...devices['iPhone SE'],
      },
    },
  ],
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['list', { printSteps: true }]],
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  testDir: './tests/specs',
  /* Maximum time one test can run for. */
  timeout: 360 * 1000,
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.WEB_URL,
    trace: 'retain-on-failure',
    video: 'on',
  },
  /* Opt out of parallel tests locally. */
  workers: process.env.CI ? 2 : undefined,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
};

export default config;
