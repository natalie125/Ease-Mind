const { defineConfig } = require("cypress");

module.exports = defineConfig({
	defaultCommandTimeout: 5000,
	viewportWidth: 1000,
	viewportHeight: 600,
	// Command timeout overridden for E2E tests
	e2e: {
		defaultCommandTimeout: 10000,
		specPattern: "cypress/functional_tests/*.cy.{js,jsx,ts,tsx}",
		baseUrl: "http://localhost:3000",
	},
});
