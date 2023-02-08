/* eslint-disable no-undef */

import { elements } from "../support/elements";

describe("Sign Up", () => {
	beforeEach(() => {
		cy.visit("/");
		sessionStorage.clear();
		cy.get(elements.SignUp_Button).click();
	});

	describe("When the 'Back' button is clicked", () => {
		it("Should redirect to the login page", () => {
			cy.get(elements.SignUp.Back_Button).click();
			cy.url().should("eq", "http://localhost:3000/login");
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
					"Please enter a valid email and password. Passwords need to have minimum 10 characters, uppercase, lowercase and special character."
				); //Assert that the correct text is displayed
			});
		});
		describe("When the user enters an invalid password and tries to sign up", () => {
			beforeEach(() => {
				cy.get(elements.SignUp.Email).type("testWeakPassword@test.com");
				cy.get(elements.SignUp.Password).type("pass");
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
					"Please enter a valid email and password. Passwords need to have minimum 10 characters, uppercase, lowercase and special character."
				); //Assert that the correct text is displayed
			});

			
		});
		
		describe("When a user attempts to register with an already existing account", () => {

			beforeEach(() => {
				cy.get(elements.SignUp.Email).type("admin@gmail.com");
				cy.get(elements.SignUp.Password).type("Password123!");
			});
	
			it("Should display an error message", () => {
				cy.get(elements.SignUp.Create_Account_Button).click();
				cy.get(elements.SignUp.Error_Text).should("be.visible"); // Assert that error text is visible
				cy.get(elements.SignUp.Error_Text).should(
					"have.text",
					"A user with this email already exixts."
				);
			});


			it("Should stay on the sign up page", () => {
				cy.get(elements.SignUp.Create_Account_Button).click();
				cy.get(elements.SignUp.Create_Account_Button).click();
				cy.url().should("eq", "http://localhost:3000/signup");
			});

		});


		
		// describe("When the user already has an account", ( ) => {
		// 	it("Should display an appropriate error message", () => {});
		// });
	});
});
