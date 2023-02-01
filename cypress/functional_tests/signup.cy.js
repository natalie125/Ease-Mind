/* eslint-disable no-undef */

import { elements } from "../support/elements";

describe("Log In", () => {
	beforeEach(() => {
		cy.visit("/");
		cy.get(elements.SignUp_Button).click();
	});

	describe("When the 'Back' button is clicked", () => {
		it("Should redirect to the login page", () => {
			cy.get(elements.SignUp.Back_Button).click();
			cy.url().should("eq", "http://localhost:3000/");
		});
	});

	describe("Data Validation", () => {
		describe("When the user enters no input and tries to sign up", () => {
			it("Should stay on the sign up page", () => {
				cy.get(elements.SignUp.Create_Account_Button).click();
				cy.url().should("eq", "http://localhost:3000/signup");
			});
			it("Should give an error message", () => {
				cy.get(elements.SignUp.Create_Account_Button).click();
				cy.get(elements.SignUp.Error_Text).should("be.visible"); // Assert that error text is visible
				cy.get(elements.SignUp.Error_Text).should(
					"have.text",
					"Please enter a valid username or password"
				); //Assert that the correct text is displayed
			});
		});
		describe("When the user enters an invalid password and tries to sign up", () => {
			beforeEach(() => {
				cy.get(elements.SignUp.Email).type("test@email.com");
				cy.get(elements.SignUp.Password).type("Testing123");
			});
			it("Should stay on the log in page", () => {
				cy.get(elements.SignUp.Create_Account_Button).click();
				cy.url().should("eq", "http://localhost:3000/signup");
			});
			it("Should give an error message", () => {
				cy.get(elements.SignUp.Create_Account_Button).click();
				cy.get(elements.SignUp.Error_Text).should("be.visible"); // Assert that error text is visible
				cy.get(elements.SignUp.Error_Text).should(
					"have.text",
					"Please enter a valid username or password"
				); //Assert that the correct text is displayed
			});
		});
		// describe("When the user already has an account", ( ) => {
		// 	it("Should display an appropriate error message", () => {});
		// });
	});
});
