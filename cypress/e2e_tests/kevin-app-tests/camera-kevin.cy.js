// The purpose of this test suite is to ensure that the controls implemented within the camera user interface work as intended.
// The following features are tested:

// User is only able to submit image if a photo has been captured.
//  Hence submit button locked if take photo not pressed, unlocked once photo captured
// On submission, submission confirmation message is shown to user.
// After [x] seconds, the user is routed to outcome screen.


/* eslint-disable no-undef */


import { elements } from "../../support/elements";
import { registeredUser } from "../../support/users";


describe("Camera functionality testing", () => {
    
    function navigateToTakePhoto(){
        cy.get(elements.Home.kevinAppLogo).click();
        cy.get(elements.KevinApp.indexContinue).click()
        cy.get(elements.KevinApp.instructionsNext).click();
        cy.get(elements.KevinApp.instructionsNext).click();
        cy.get(elements.KevinApp.instructionsNext).click();
        cy.get(elements.KevinApp.checkbox).click();
        cy.get(elements.KevinApp.instructionsContinue).click();
        cy.url().should("eq","http://localhost:3000/kevin/take_photo")
    }

    beforeEach(() => {
        sessionStorage.clear()
        cy.visit("http://localhost:3000/");
        cy.get(elements.Login.Email).type(registeredUser.email);
		cy.get(elements.Login.Password).type(registeredUser.password);
		cy.get(elements.Login.Login_Button).click();
    })


    describe("Submit button should work as expected", () => {
        it("Should be disabled if the user has not yet captured an image", () => {
            navigateToTakePhoto();
            cy.get(elements.KevinApp.cameraSubmit).should('be.disabled');
        })

        it("Should be enabled once the user captures a photo", () => {
            navigateToTakePhoto();
            cy.get(elements.KevinApp.cameraSubmit).should('be.disabled');
            cy.get(elements.KevinApp.cameraTakePhoto).click();
            cy.get(elements.KevinApp.cameraSubmit).should('not.be.disabled');
        })

        
    })

    describe("Submission process should work as expected", () => { 
        it("Should show the user different elements on page once successfully submitting", () => {
            navigateToTakePhoto();
            cy.get(elements.KevinApp.cameraTakePhoto).click();
            cy.get(elements.KevinApp.cameraSubmit).should('not.be.disabled');
            cy.get(elements.KevinApp.cameraSubmit).click();
            cy.get(elements.KevinApp.subConfirm).should('be.visible');
        })

        it("Should redirect user to outcome page after some time has passed, 10 seconds in test to be safe.", () => {
            navigateToTakePhoto();
            cy.get(elements.KevinApp.cameraTakePhoto).click();
            cy.get(elements.KevinApp.cameraSubmit).click();
            cy.get(elements.KevinApp.subConfirm).should('be.visible');
            // 20 second wait time to allow for ML backend to respond, and routing to take place
            cy.wait(20000);
            // URL after rerouting should be part of the kevin/outcome routes
            cy.url().should("contain","kevin/outcome")
        })
    })


})