/* eslint-disable no-undef */

import { elements } from "../../support/elements";
import { unregisteredUser, registeredUser } from "../../support/users";
import { getRandomEmail } from "../../support/functions";

describe("Log In", () => {
	beforeEach(() => {
		cy.window().then((win) => {
			win.sessionStorage.clear();
		});

		cy.visit("/");
		cy.get(elements.Login.SignUp_Button).click();
	});

	it("Should allow the user to navigate to the login page", () => {
		cy.get(elements.SignUp.Login_Button).click();
		cy.url().should("eq", "http://localhost:3000/login");
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
				cy.get(elements.SignUp.Email).type(unregisteredUser.email);
				cy.get(elements.SignUp.Password).type(unregisteredUser.invalidPassword);
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
		describe("When the user already has an account", () => {
			beforeEach(() => {
				cy.get(elements.SignUp.Email).type(registeredUser.email);
				cy.get(elements.SignUp.Password).type(registeredUser.incorrectPassword);
			});
			it("Should stay on the sign up page", () => {
				cy.get(elements.SignUp.Create_Account_Button).click();
				cy.url().should("eq", "http://localhost:3000/signup");
			});
			it("Should display an appropriate error message", () => {
				cy.get(elements.SignUp.Create_Account_Button).click();
				cy.get(elements.SignUp.Error_Text).should("be.visible"); // Assert that error text is visible
				cy.get(elements.SignUp.Error_Text).should(
					"have.text",
					"A user with this email already exists."
				); //Assert that the correct text is displayed
			});
		});

		describe("Succesful Account Creation", () => {
			describe("When a user tries to sign up with valid details", () => {
				it("Should create a new account", () => {
					const newUserEmail = getRandomEmail().toString();
					cy.get(elements.SignUp.Email).type(newUserEmail);
					cy.get(elements.SignUp.Password).type(unregisteredUser.password);

					cy.get(elements.SignUp.Create_Account_Button).click();

					//Account created, user should now be able to log in
					cy.get(elements.Login.Email).type(newUserEmail);
					cy.get(elements.Login.Password).type(unregisteredUser.password);
					cy.get(elements.Login.Login_Button).click();

					cy.url().should("eq", "http://localhost:3000/home");
					cy.get(elements.Home.ButtonContainer);
				});
			});
		});
	});
});
