// Playwright config for site-kit smoke tests.
//
// Tests run against a local static server hosting the repo root, so each
// test can reference `/dist/components/sa-*.js` and
// `/dist/design-system.css` exactly as a real consumer would. We only
// target Chromium — engine-divergence is not the kit's bug surface.

import { defineConfig, devices } from '@playwright/test';

const PORT = 8155;

export default defineConfig({
  testDir: './tests',
  // Smoke tests should be fast and deterministic. If one is flaky, fix
  // the test rather than retry.
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npx http-server -p ${PORT} --silent`,
    url: `http://127.0.0.1:${PORT}/dist/design-system.css`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
