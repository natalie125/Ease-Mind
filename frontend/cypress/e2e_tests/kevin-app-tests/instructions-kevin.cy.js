// The purpose of this test file is to ensure that each functionality of the instructions menu provided to users
// Works as inteded

// Features tested:
// Previous instruction button disabled at index  == 0.
// Continue button locked if checkbox has not been selected.
// Continue button appears once final index is reached.
// Continue button unlocks once checkbox has been selected by the user.
// Upon pressing continue on last screen, user is taken to image capturing page.

/* eslint-disable no-undef */

import elements from '../../support/elements';
import { registeredUser } from '../../support/users';

describe('Layout Testing', () => {
  // Log into application to access home page before each test.
  // Then enter the instructions screen.
  beforeEach(() => {
    sessionStorage.clear();
    cy.visit('http://localhost:3000/');
    cy.get(elements.Login.Email).type(registeredUser.email);
    cy.get(elements.Login.Password).type(registeredUser.password);
    cy.get(elements.Login.Login_Button).click();
    cy.get(elements.Home.kevinAppLogo).click();
    cy.get(elements.KevinApp.indexContinue).click();
  });

  describe("Check functionality of 'Previous' button", () => {
    it("Should Check if the 'Previous' button is disabled", () => {
      cy.url().should('eq', 'http://localhost:3000/kevin/instructions');
      cy.get(elements.KevinApp.instructionsPrev).should('be.disabled');
    });

    it("Should Check if the 'Previous' button is no longer disabled on next page", () => {
      cy.url().should('eq', 'http://localhost:3000/kevin/instructions');
      cy.get(elements.KevinApp.instructionsNext).click();
      cy.get(elements.KevinApp.instructionsPrev).should('not.be.disabled');
    });
  });

  describe("Check functionality of 'Next' button", () => {
    it("Should become the 'Continue' button only on the 4th (last) page, and be disabled", () => {
      cy.url().should('eq', 'http://localhost:3000/kevin/instructions');
      cy.get(elements.KevinApp.instructionsNext).should('be.visible');
      cy.get(elements.KevinApp.instructionsNext).click();
      cy.get(elements.KevinApp.instructionsNext).should('be.visible');
      cy.get(elements.KevinApp.instructionsNext).click();
      cy.get(elements.KevinApp.instructionsNext).should('be.visible');
      cy.get(elements.KevinApp.instructionsNext).click();
      cy.get(elements.KevinApp.instructionsContinue).should('be.visible');
    });
  });

  describe("Check functionality of 'Continue' button", () => {
    it('Should only be enabled, if the checkbox has been pressed', () => {
      cy.url().should('eq', 'http://localhost:3000/kevin/instructions');
      // access final page
      cy.get(elements.KevinApp.instructionsNext).click();
      cy.get(elements.KevinApp.instructionsNext).click();
      cy.get(elements.KevinApp.instructionsNext).click();
      // check to see if continue button there
      cy.get(elements.KevinApp.instructionsContinue).should('be.visible');
      // Check to see if disbled
      cy.get(elements.KevinApp.instructionsContinue).should('be.disabled');
      // Press checkbox
      cy.get(elements.KevinApp.checkbox).click();
      // Check to see if enabled
      cy.get(elements.KevinApp.instructionsContinue).should('not.be.disabled');
      // press checkbox
      cy.get(elements.KevinApp.checkbox).click();
      // press to see if disabled
      cy.get(elements.KevinApp.instructionsContinue).should('be.disabled');
    });
    it('Should route the user to the /take_photo route if pressed once enabled', () => {
      cy.url().should('eq', 'http://localhost:3000/kevin/instructions');
      cy.get(elements.KevinApp.instructionsNext).click();
      cy.get(elements.KevinApp.instructionsNext).click();
      cy.get(elements.KevinApp.instructionsNext).click();
      cy.get(elements.KevinApp.checkbox).click();
      cy.get(elements.KevinApp.instructionsContinue).click();
      cy.url().should('eq', 'http://localhost:3000/kevin/take_photo');
    });
  });
});

// describe("Check second page of instructions 'previous' button is now enabled", () => {
//     cy.url().should("eq", "http://localhost:3000/kevin/instructions");
//     cy.get(elements.KevinApp.instructionsPrev).should('be.disabled');
//     cy.get(elements.KevinApp.instructionsContinue).click();
//     cy.get(elements.KevinApp.instructionsPrev).should('not.be.disabled');
// })
