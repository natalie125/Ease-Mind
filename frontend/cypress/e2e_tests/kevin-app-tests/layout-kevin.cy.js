// The purpose of these tests was to ensure that at each resolution tested for Phase 1 of the project -
// my application would display each page as per the design specification, for both horizontal and vertical configurations.
// Resolutions used within these tests are taken from cypress/e2e_tests/functional_tests/layout.cy.js

/* eslint-disable no-undef */

import elements from '../../support/elements';
import { registeredUser } from '../../support/users';

describe('Layout Testing', () => {
  function checkButtonsInstructions() {
    cy.get(elements.KevinApp.instructionsPrev).should('be.leftOf', elements.KevinApp.instructionsNext);
    cy.get(elements.KevinApp.instructionsPrev).should('be.horizontallyAligned', elements.KevinApp.instructionsNext);
  }

  function checkButtonsInstructionsFinal() {
    cy.get(elements.KevinApp.instructionsPrev).should('be.leftOf', elements.KevinApp.instructionsContinue);
    cy.get(elements.KevinApp.instructionsPrev).should('be.horizontallyAligned', elements.KevinApp.instructionsContinue);
  }

  function checkButtonsCameraPortrait() {
    cy.get(elements.KevinApp.cameraSwitch).should('be.rightOf', elements.KevinApp.cameraTakePhoto);
    cy.get(elements.KevinApp.cameraSwitch).should('be.horizontallyAligned', elements.KevinApp.cameraTakePhoto);
  }

  function checkButtonsCameraLandscape() {
    cy.get(elements.KevinApp.cameraSwitch).should('be.below', elements.KevinApp.cameraTakePhoto);
    cy.get(elements.KevinApp.cameraSwitch).should('be.verticallyAligned', elements.KevinApp.cameraTakePhoto);
  }

  // Log into application to access home page before each test.
  beforeEach(() => {
    sessionStorage.clear();
    cy.visit('http://localhost:3000/');
    cy.get(elements.Login.Email).type(registeredUser.email);
    cy.get(elements.Login.Password).type(registeredUser.password);
    cy.get(elements.Login.Login_Button).click();
    cy.get(elements.Home.kevinAppLogo).click();
    cy.get(elements.KevinApp.indexContinue).click();
  });

  describe('Check instructions Page - Not Final + Camera [Landscape Resolutions]', () => {
    it('Should be able to find all the application logos and the logout button on screen', () => {
      // Check the expected instruction buttons are present
      cy.get(elements.KevinApp.instructionsPrev).should('be.visible');
      cy.get(elements.KevinApp.instructionsNext).should('be.visible');
    });

    it('Should check are in expected positions - Viewport Resolution of: 660 x 450', () => {
      cy.viewport(660, 450);
      // Testing logos displayed conform to positons specified by looking at their relative positions to each other
      checkButtonsInstructions();
      // Check camera in this resolution
      cy.visit('http://localhost:3000/kevin/take_photo');
      checkButtonsCameraLandscape();
    });

    it('Should check are in expected positions - Viewport Resolution of: 896 x 414', () => {
      cy.viewport(896, 414);
      // Testing logos displayed conform to positons specified by looking at their relative positions to each other
      checkButtonsInstructions();
      // Check camera in this resolution
      cy.visit('http://localhost:3000/kevin/take_photo');
      checkButtonsCameraLandscape();
    });

    it('Should check are in expected positions - Viewport Resolution of: 800 x 360', () => {
      cy.viewport(800, 360);
      // Testing logos displayed conform to positons specified by looking at their relative positions to each other
      checkButtonsInstructions();
      // Check camera in this resolution
      cy.visit('http://localhost:3000/kevin/take_photo');
      checkButtonsCameraLandscape();
    });
  });

  describe('Check instructions Page - Not Final + Camera [Portrait Resolutions]', () => {
    it('Should be able to find all the application logos and the logout button on screen', () => {
      // Check the expected instruction buttons are present
      cy.get(elements.KevinApp.instructionsPrev).should('be.visible');
      cy.get(elements.KevinApp.instructionsNext).should('be.visible');
    });

    it('Should check are in expected positions - Viewport Resolution of: 660 x 450', () => {
      cy.viewport(450, 660);
      // Testing logos displayed conform to positons specified by looking at their relative positions to each other
      checkButtonsInstructions();
      // Check camera in this resolution
      cy.visit('http://localhost:3000/kevin/take_photo');
      checkButtonsCameraPortrait();
    });

    it('Should check are in expected positions - Viewport Resolution of: 896 x 414', () => {
      cy.viewport(414, 896);
      // Testing logos displayed conform to positons specified by looking at their relative positions to each other
      checkButtonsInstructions();
      // Check camera in this resolution
      cy.visit('http://localhost:3000/kevin/take_photo');
      checkButtonsCameraPortrait();
    });

    it('Should check are in expected positions - Viewport Resolution of: 800 x 360', () => {
      cy.viewport(360, 800);
      // Testing logos displayed conform to positons specified by looking at their relative positions to each other
      checkButtonsInstructions();
      // Check camera in this resolution
      cy.visit('http://localhost:3000/kevin/take_photo');
      checkButtonsCameraPortrait();
    });
  });

  describe('Check instructions Page - Final', () => {
    it('Should be able to find all the application logos and the logout button on screen', () => {
      // Check the expected instruction buttons are present
      cy.get(elements.KevinApp.instructionsPrev).should('be.visible');
      cy.get(elements.KevinApp.instructionsNext).should('be.visible');
    });

    it('Should check are in expected positions - Viewport Resolution of: 660 x 450', () => {
      cy.viewport(450, 660);
      cy.get(elements.KevinApp.instructionsNext).click();
      cy.get(elements.KevinApp.instructionsNext).click();
      cy.get(elements.KevinApp.instructionsNext).click();
      cy.get(elements.KevinApp.instructionsPrev).should('be.visible');
      cy.get(elements.KevinApp.instructionsContinue).should('be.visible');
      checkButtonsInstructionsFinal();
    });

    it('Should check are in expected positions - Viewport Resolution of: 660 x 450', () => {
      cy.viewport(660, 450);
      cy.get(elements.KevinApp.instructionsNext).click();
      cy.get(elements.KevinApp.instructionsNext).click();
      cy.get(elements.KevinApp.instructionsNext).click();
      cy.get(elements.KevinApp.instructionsPrev).should('be.visible');
      cy.get(elements.KevinApp.instructionsContinue).should('be.visible');
      checkButtonsInstructionsFinal();
    });
  });
});
