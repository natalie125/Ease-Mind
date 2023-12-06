/* eslint-disable no-undef */

import elements from '../../support/elements';
import { registeredUser } from '../../support/users';

describe('Paralysis Analysis', () => {
  before(() => {
    sessionStorage.clear(); // assume fresh user
    cy.visit('/login');

    cy.get(elements.Login.Email).type(registeredUser.email);
    cy.get(elements.Login.Password).type(registeredUser.password);

    cy.get(elements.Login.Login_Button).click();
    cy.get(elements.PA.Link).click();

    // wait for the camera to load, timeout after 10 seconds
    cy.get(elements.PA.Image.Active_Camera, { timeout: 10000 }).should('be.visible');
  });

  describe('Camera', () => {
    describe('When app is accessed through desktop', () => {
      it("Should not display the 'Change Camera' button", () => {
        cy.get(elements.PA.Image.Switch_Cam_Button).should('not.exist');
      });

      // TO BE TESTED: case where user is on mobile
    });

    describe('When a picture is taken', () => {
      it('Should display the image taken', () => {
        cy.get(elements.PA.Image.Captured_Image).should('not.exist');
        cy.get(elements.PA.Image.Take_Pic_Button).click();
        cy.get(elements.PA.Image.Captured_Image).should('be.visible');
      });

      it('Should allow the user to retake the picture', () => {
        cy.get(elements.PA.Image.Retake_Button).click();
        cy.get(elements.PA.Image.Captured_Image).should('not.exist');
        cy.get(elements.PA.Image.Active_Camera).should('be.visible');
        cy.get(elements.PA.Image.Take_Pic_Button).click();
      });

      it('Should allow the user to retake the picture', () => {
        cy.get(elements.PA.Image.Retake_Button).click();
        cy.get(elements.PA.Image.Captured_Image).should('not.exist');
        cy.get(elements.PA.Image.Active_Camera).should('be.visible');
        cy.get(elements.PA.Image.Take_Pic_Button).click();
      });

      it('Should allow the user to submit the picture', () => {
        cy.get(elements.PA.Image.Submit_Button).click();
        cy.get(elements.PA.Image.Captured_Image).should('not.exist');
        cy.get(elements.PA.Voice.Audio_Container).should('be.visible');
      });
    });
  });

  describe('Voice Recording', () => {
    describe('When recorder first loads', () => {
      it("Should only have the 'Start Recording' button enabled", () => {
        cy.get(elements.PA.Voice.Start_Button).should('not.be.disabled');
        cy.get(elements.PA.Voice.Stop_Button).should('be.disabled');
        cy.get(elements.PA.Voice.Submit_Button).should('be.disabled');
      });
    });

    it('Should allow user to start recording', () => {
      cy.get(elements.PA.Voice.Start_Button).click();

      cy.get(elements.PA.Voice.Start_Button).should('be.disabled');
      cy.get(elements.PA.Voice.Stop_Button).should('not.be.disabled');
      cy.get(elements.PA.Voice.Submit_Button).should('be.disabled');
    });

    it('Should allow user to stop recording', () => {
      cy.get(elements.PA.Voice.Stop_Button).click();

      cy.get(elements.PA.Voice.Start_Button).should('not.be.disabled');
      cy.get(elements.PA.Voice.Stop_Button).should('be.disabled');
      cy.get(elements.PA.Voice.Submit_Button).should('not.be.disabled');
    });
  });
});
