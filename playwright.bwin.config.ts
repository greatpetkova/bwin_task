import {defineConfig, devices, PlaywrightTestConfig} from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from "node:path";
import {exec} from "node:child_process";

// Load environment variables from .env file
dotenv.config({
  path: process.env.ENV_FILE,  // Path to .env file if provided
  override: true,              // Override existing environment variables
});

/**
 * Playwright Test configuration.
 * This config defines the test environment, timeout, retries, reporters, and browser configurations.
 */
const config: PlaywrightTestConfig = {
  // Global timeout for all tests
  globalTimeout: 60 * 60 * 100,  // 1 hour

  // Test execution timeout
  timeout: 10 * 70 * 100,  // 10 minutes 70 seconds for each test

  // Expectation timeout (e.g., for expect(locator).toHaveText())
  expect: {
    timeout: 30 * 1000,  // 30 seconds
  },

  // Parallel test execution and retries for CI
  fullyParallel: false,  // disable running tests in parallel
  forbidOnly: !!process.env.CI,  // Prevent accidental use of test.only in CI
  retries: process.env.CI ? 2 : 0,  // Retry tests on CI only
  workers: 1, //just one worker, can be changed to more for parallel execution

  // Reporter settings
  reporter: [
    ['monocart-reporter', {
      name: "Task Test Report",
      outputFile: './monocart-report/index.html',
      columns: (defaultColumns) => {
        const durationColumn = defaultColumns.find((column) => column.id === 'duration');
        durationColumn.formatter = function (value) {
          if (typeof value === 'number' && value) {
            return `<i>${value.toLocaleString()} ms</i>`;
          }
          return value;
        };

        const titleColumn = defaultColumns.find((column) => column.id === 'title');
        titleColumn.formatter = function (value, rowItem, columnItem, cellNode) {
          const perviousFormatter = this.getFormatter('tree');
          const v = perviousFormatter(value, rowItem, columnItem, cellNode);
          if (rowItem.type === 'step') {
            return `${v}<div style="position:absolute;top:0;right:5px;">✅</div>`;
          }
          return v;
        };

      }
    }]
  ],

  // Shared settings for all the projects below
  use: {
    trace: 'on-first-retry',  // Collect trace when retrying failed tests
  },

  projects: [
    {
      name: 'bwin-web-common-tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.LIVE_URL,
        launchOptions: {
          slowMo: 200,
        },
      },
      testDir: './src/bwin/tests/common',
      testMatch: /.*.spec.ts/,
    },
    {
      name: 'bwin-web-common-tests',
      use: {
        ...devices['Pixel 7'],
        baseURL: process.env.LIVE_URL,
        launchOptions: {
          slowMo: 200,
        },
      },
      testDir: './src/bwin/tests/common',
      testMatch: /.*.spec.ts/,
    },
    {
      name: 'bwin-web-desktop-tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.LIVE_URL,
        launchOptions: {
          slowMo: 200,
        },

      },
      testDir: './src/bwin/tests/desktop',
      testMatch: /.*.spec.ts/,
      retries: 1
    },
    {
      name: 'bwin-web-mobile-tests',
      use: {
        ...devices['Pixel 7'],
        baseURL: process.env.LIVE_URL,
        launchOptions: {
          slowMo: 200,
        },

      },
      testDir: './src/bwin/tests/mobile',
      testMatch: /.*.spec.ts/, //Match spec files
      retries: 1
    },
  ],
};

process.on('exit', () => {
  const reportPath = path.join(__dirname, './monocart-report/index.html');

  // Open the report in the default browser based on the OS
  if (process.platform === 'win32') {
    exec(`start ${reportPath}`);
  } else if (process.platform === 'darwin') {
    exec(`open ${reportPath}`);
  } else {
    exec(`xdg-open ${reportPath}`);
  }
});

export default defineConfig(config);
