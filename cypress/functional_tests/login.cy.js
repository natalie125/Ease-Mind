/* eslint-disable no-undef */

import { elements } from "../support/elements";

describe("Log In", () => {
	beforeEach(() => {
		cy.visit("/");
	});

	describe("When the Log In button is clicked", () => {
		it("Should redirect to the home page", () => {
			cy.get(elements.Login_Button).click();
			cy.url().should("eq", "http://localhost:3000/home");
		});
	});
});
