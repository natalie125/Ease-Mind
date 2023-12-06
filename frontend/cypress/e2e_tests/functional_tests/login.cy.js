/* eslint-disable no-undef */

import elements from '../../support/elements';
import { registeredUser } from '../../support/users';

describe('Log In', () => {
  beforeEach(() => {
    sessionStorage.clear(); // as login functionality is being tested, assume fresh user after each test.
    cy.visit('/login');
  });

  describe('When the Sign Up button is clicked', () => {
    it('Should redirect to the sign up page', () => {
      cy.get(elements.Login.SignUp_Button).click();
      cy.url().should('eq', 'http://localhost:3000/signup');
    });
  });

  describe('Data Validation', () => {
    describe('When the user enters no input and tries to log in', () => {
      it('Should stay on the log in page', () => {
        cy.get(elements.Login.Login_Button).click();
        cy.get(elements.Login.Email);
      });
      it('Should give an error message', () => {
        cy.get(elements.Login.Login_Button).click();
        cy.get(elements.Login.Error_Text).should('be.visible'); // Assert that error text is visible
        cy.get(elements.Login.Error_Text).should(
          'have.text',
          'Please enter a username and password',
        ); // Assert that the correct text is displayed
      });
    });
  });

  describe('User Enters Invalid Login Details', () => {
    it('Should remain on the login page', () => {
      cy.get(elements.Login.Email).type('wrongemail@email.com');
      cy.get(elements.Login.Password).type('WrongPassword');
      cy.get(elements.Login.Login_Button).click();
      cy.get(elements.Login.Error_Text).should('be.visible'); // Assert that error text is visible
      cy.get(elements.Login.Error_Text).should(
        'have.text',
        'Your username or password is incorrect. Please try again.',
      ); // Assert that the correct text is displayed
      cy.url().should('eq', 'http://localhost:3000/home'); // explain why this is wanted
    });
  });

  describe('User Enters Valid Login Details and is taken to the home page', () => {
    it('Should be taken to the home page', () => {
      cy.get(elements.Login.Email).type(registeredUser.email);
      cy.get(elements.Login.Password).type(registeredUser.password);

      cy.get(elements.Login.Login_Button).click();
      cy.get(elements.Home.applicationButton).should('be.visible');
      cy.url().should('eq', 'http://localhost:3000/home');
    });
  });
});
