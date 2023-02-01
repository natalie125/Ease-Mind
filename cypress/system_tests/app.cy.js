/* eslint-disable no-undef */

import { elements } from "../support/elements";

describe("Page Navigation", () => {
	beforeEach(() => {
		cy.visit("https://d28hkjxjjxob5p.cloudfront.net/");
	});

	describe("When a user that is not logged in tries to navigate to an app from the login page", () => {
		it("Should stay on the login page", () => {
			cy.visit("https://d28hkjxjjxob5p.cloudfront.net/ramat");
			cy.url().should("eq", "https://d28hkjxjjxob5p.cloudfront.net/");
		});
	});

	describe("When a user that is not logged in tries to navigate to an app from the sign up page", () => {
		it("Should stay on the login page", () => {
			cy.get(elements.SignUp_Button).click();
			cy.visit("https://d28hkjxjjxob5p.cloudfront.net/ramat");
			cy.url().should("eq", "https://d28hkjxjjxob5p.cloudfront.net/signup");
		});
	});

	// TODO: DECIDE WHAT TO DO FOR NAVIGATION BACK TO THE LOGIN OR SIGN UP PAGE
});
