import type { Config } from "jest";

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Module paths
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  // Test match patterns
  testMatch: ["**/__tests__/**/*.{ts,tsx}", "**/*.{test,spec}.{ts,tsx}"],

  // Coverage configuration - Enterprise Grade (80% minimum)
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "src/**/*.{js,jsx,ts,tsx}",
    "pages/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!**/dist/**",
    "!**/build/**",
    "!**/*.config.{js,ts,mjs}",
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Coverage reporters
  coverageReporters: ["json", "lcov", "text", "text-summary", "html"],

  // Transform configuration
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
        },
      },
    ],
  },

  // Ignore patterns
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/out/",
    "<rootDir>/dashboard-vite/",
  ],

  // Module file extensions
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Verbose output
  verbose: true,
};

export default config;
