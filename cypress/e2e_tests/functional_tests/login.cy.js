/* eslint-disable no-undef */

import { elements } from "../../support/elements";

describe("Log In", () => {
	beforeEach(() => {
		cy.visit("/");
	});

	describe("When the Sign Up button is clicked", () => {
		it("Should redirect to the sign up page", () => {
			cy.get(elements.Login.SignUp_Button).click();
			cy.url().should("eq", "http://localhost:3000/signup");
		});
	});

	describe("Data Validation", () => {
		describe("When the user enters no input and tries to log in", () => {
			it("Should stay on the log in page", () => {
				cy.get(elements.Login.Login_Button).click();
				cy.url().should("eq", "http://localhost:3000/");
			});
			it("Should give an error message", () => {
				cy.get(elements.Login.Login_Button).click();
				cy.get(elements.Login.Error_Text).should("be.visible"); // Assert that error text is visible
				cy.get(elements.Login.Error_Text).should(
					"have.text",
					"Please enter a username and password"
				); //Assert that the correct text is displayed
			});
		});
	});
});
