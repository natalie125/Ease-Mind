/* eslint-disable no-undef */

import { elements } from "../support/elements";

describe("Page Navigation", () => {
	beforeEach(() => {
		cy.visit("http://localhost:3000/");
	});

	describe("When a user that is not logged in tries to navigate to an app from the login page", () => {
		it("Should stay on the login page", () => {
			cy.visit("http://localhost:3000/ramat");
			cy.url().should("eq", "http://localhost:3000/");
		});
	});

	describe("When a user that is not logged in tries to navigate to an app from the sign up page", () => {
		it("Should stay on the login page", () => {
			cy.get(elements.SignUp_Button).click();
			cy.visit("http://localhost:3000/ramat");
			cy.url().should("eq", "http://localhost:3000/signup");
		});
	});

	// TODO: DECIDE WHAT TO DO FOR NAVIGATION BACK TO THE LOGIN OR SIGN UP PAGE
});
