/* eslint-disable no-undef */

import { elements } from "../support/elements";

describe("Log In", () => {
	beforeEach(() => {
		cy.visit("/");
	});

	describe("When the Sign Up button is clicked", () => {
		it("Should redirect to the sign up page", () => {
			cy.get(elements.SignUp_Button).click();
			cy.url().should("eq", "http://localhost:3000/signup");
		});
	});
});
