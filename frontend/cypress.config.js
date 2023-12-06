import { defineConfig } from 'cypress';

export default defineConfig({
  defaultCommandTimeout: 5000,
  viewportWidth: 1000,
  viewportHeight: 600,
  // Command timeout overridden for E2E tests
  e2e: {
    defaultCommandTimeout: 10000,
    specPattern: 'cypress/e2e_tests/*/*.cy.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:3000',
  },
  failOnStatusCode: false,
});
