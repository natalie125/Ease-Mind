/* eslint-disable no-undef */

import elements from '../../support/elements';
import { registeredUser } from '../../support/users';

describe('Testing Logout', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.visit('https://d28hkjxjjxob5p.cloudfront.net/');
  });

  describe('Testing Logout Functionality', () => {
    it('Should allow the user to log in and visit the home page, then log out', () => {
      cy.get(elements.Login.Email).type(registeredUser.email);
      cy.get(elements.Login.Password).type(registeredUser.password);
      cy.get(elements.Login.Login_Button).click();
      cy.url().should('eq', 'https://d28hkjxjjxob5p.cloudfront.net/home');
      cy.get(elements.Home.Logout_Button).click();
      cy.url().should('eq', 'https://d28hkjxjjxob5p.cloudfront.net/');
    });
  });
});
