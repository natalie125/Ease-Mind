/* eslint-disable no-undef */

import elements from '../../support/elements';

describe('Page Navigation', () => {
  beforeEach(() => {
    cy.visit('https://d28hkjxjjxob5p.cloudfront.net/');
  });

  describe('When a user that is not logged in tries to navigate to an app from the login page', () => {
    it('Should stay on the login page', () => {
      cy.request({ url: 'https://d28hkjxjjxob5p.cloudfront.net/ramat', failOnStatusCode: false });
      cy.get(elements.Login.Email);
    });
  });

  describe('When a user that is not logged in tries to navigate to an app from the sign up page', () => {
    it('Should stay on the sign up page', () => {
      cy.get(elements.Login.SignUp_Button).click();
      cy.request({ url: 'https://d28hkjxjjxob5p.cloudfront.net/ramat', failOnStatusCode: false });
      cy.get(elements.SignUp.Email);
    });
  });

  // TODO: DECIDE WHAT TO DO FOR NAVIGATION BACK TO THE LOGIN OR SIGN UP PAGE
});
