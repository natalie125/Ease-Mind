/* eslint-disable no-undef */

import elements from '../../support/elements';
import { registeredUser, unregisteredUser } from '../../support/users';

describe('Log In', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.visit('https://d28hkjxjjxob5p.cloudfront.net/');
  });

  describe('When a registered user tries to log in', () => {
    it('Should allow the user to log in', () => {
      cy.get(elements.Login.Email).type(registeredUser.email);
      cy.get(elements.Login.Password).type(registeredUser.password);
      cy.get(elements.Login.Login_Button).click();
      cy.url().should('eq', 'https://d28hkjxjjxob5p.cloudfront.net/home');
    });
  });

  describe('When a registered user tries to log in with the wrong password', () => {
    beforeEach(() => {
      cy.get(elements.Login.Email).type(registeredUser.email);
      cy.get(elements.Login.Password).type(registeredUser.incorrectPassword);
      cy.get(elements.Login.Login_Button).click();
    });
    it('Should stay on the log in page', () => {
      cy.get(elements.Login.Login_Button).click();
      cy.get(elements.Login.Email);
    });
    it('Should give an error message', () => {
      cy.get(elements.Login.Login_Button).click();
      cy.get(elements.Login.Error_Text).should('be.visible'); // Assert that error text is visible
      cy.get(elements.Login.Error_Text).should(
        'have.text',
        'Your username or password is incorrect. Please try again.',
      ); // Assert that the correct error is displayed
    });
  });

  describe('When an unregistered user tries to log in', () => {
    beforeEach(() => {
      cy.get(elements.Login.Email).type(unregisteredUser.email);
      cy.get(elements.Login.Password).type(unregisteredUser.password);
      cy.get(elements.Login.Login_Button).click();
    });
    it('Should stay on the log in page', () => {
      cy.get(elements.Login.Login_Button).click();
      cy.get(elements.Login.Email);
    });
    it('Should give an error message', () => {
      cy.get(elements.Login.Login_Button).click();
      cy.get(elements.Login.Error_Text).should('be.visible'); // Assert that error text is visible
      cy.get(elements.Login.Error_Text).should(
        'have.text',
        'Your username or password is incorrect. Please try again.',
      ); // Assert that the correct error is displayed
    });
  });
});
