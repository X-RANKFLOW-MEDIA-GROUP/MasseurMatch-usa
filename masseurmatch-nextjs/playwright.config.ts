import { defineConfig } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT || process.env.PORT || 3100);

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "on-first-retry",
  },
  webServer: {
    command: `npm run start -- -p ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
