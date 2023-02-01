/* eslint-disable no-undef */

import { elements } from "../support/elements";

import { registeredUser, unregisteredUser } from "../support/users";

describe("Log In", () => {
	beforeEach(() => {
		cy.visit("https://d28hkjxjjxob5p.cloudfront.net/");
		cy.get(elements.SignUp_Button).click();
	});

	it("Should allow the user to navigate to the login page", () => {
		cy.get(elements.SignUp.Back_Button).click();
		cy.url().should("eq", "https://d28hkjxjjxob5p.cloudfront.net");
	});

	describe("Data Validation", () => {
		describe("When the user enters no input and tries to sign up", () => {
			it("Should stay on the sign up page", () => {
				cy.get(elements.SignUp.Create_Account_Button).click();
				cy.url().should("eq", "https://d28hkjxjjxob5p.cloudfront.net/signup");
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
				cy.get(elements.SignUp.Email).type(unregisteredUser.email);
				cy.get(elements.SignUp.Password).type(unregisteredUser.invalidPassword);
			});
			it("Should stay on the sign up page", () => {
				cy.get(elements.SignUp.Create_Account_Button).click();
				cy.url().should("eq", "https://d28hkjxjjxob5p.cloudfront.net/signup");
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
		describe("When the user already has an account", () => {
			before(() => {
				cy.get(elements.SignUp.Email).type(registeredUser.email);
				cy.get(elements.SignUp.Password).type(registeredUser.password);
			});
			it("Should display an appropriate error message", () => {
				cy.get(elements.SignUp.Create_Account_Button).click();
				cy.get(elements.SignUp.Error_Text).should("be.visible"); // Assert that error text is visible
				cy.get(elements.SignUp.Error_Text).should("have.text", "User already exists"); //Assert that the correct text is displayed
			});
		});
	});

	describe("Succesful Account Creation", () => {
		describe("When a user tries to sign up with valid details", () => {
			it("Should create a new account", () => {
				cy.get(elements.SignUp.Email).type(unregisteredUser.email);
				cy.get(elements.SignUp.Password).type(unregisteredUser.password);

				cy.get(elements.SignUp.Create_Account_Button).click();
				cy.url().should("eq", "https://d28hkjxjjxob5p.cloudfront.net/home");
			});
		});
	});
});
