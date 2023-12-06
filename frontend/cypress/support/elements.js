const elements = {
  Login: {
    Email: '[data-cy=loginEmail]',
    Password: '[data-cy=loginPassword]',
    Error_Text: '[data-cy=loginError]',
    Login_Button: '[data-cy=loginBtn]',
    SignUp_Button: '[data-cy=loginSignUpBttn]',
  },
  SignUp: {
    Email: '[data-cy=signUpEmail]',
    Password: '[data-cy=signUpPasswd]',
    Login_Button: '[data-cy=signUpLoginBtn]',
    Error_Text: '[data-cy=signUpError]',
    Create_Account_Button: '[data-cy=signUpBttn]',
  },

  Home: {
    ButtonContainer: '[data-cy=homeBtnContainer]',
    applicationButton: '[data-cy=alexAppLogo]',
    Logout_Button: '[data-cy=logoutBtn]',
    shreyasAppLogo: '[data-cy=shreyasAppLogo]',
    lanreAppLogo: '[data-cy=lanreAppLogo]',
    ramatAppLogo: '[data-cy=paralysisAnalysisLogo]',
    kevinAppLogo: '[data-cy=kevinAppLogo]',
    alexAppLogo: '[data-cy=alexAppLogo]',
  },
  KevinApp: {
    instructionsPrev: '[data-cy=instructionsPrev]',
    instructionsNext: '[data-cy=instructionsNext]',
    instructionsContinue: '[data-cy=instructionsContinue]',
    cameraTakePhoto: '[data-cy=cameraTakePhoto]',
    cameraRetakePhoto: '[data-cy=cameraRetakePhoto]',
    cameraSwitch: '[data-cy=cameraSwitch]',
    cameraSubmit: '[data-cy=cameraSubmit]',
    indexContinue: '[data-cy=indexContinue]',
    checkbox: '[data-cy=instructionsCheckbox]',
    subConfirm: '[data-cy=subConfirm]',
  },

  // Paralysis Alanysis elements
  PA: {
    Link: '[data-cy=paralysisAnalysisLink]',
    Logo: '[data-cy=paralysisAnalysisLogo]',

    // Image elements
    Image: {
      Active_Camera: '[data-cy=activeCamera]',
      Take_Pic_Button: '[data-cy=takePicBttn]',
      Switch_Cam_Button: '[data-cy=switchCamBttn]',
      Captured_Image: '[data-cy=capturedImage]',
      Retake_Button: '[data-cy=retakeBttn]',
      Submit_Button: '[data-cy=submitPicBttn]',
    },

    // Audio elements
    Voice: {
      Audio_Container: '[data-cy=audioContainer]',
      Start_Button: '[data-cy=startVoiceRecording]',
      Stop_Button: '[data-cy=stopVoiceRecording]',
      Submit_Button: '[data-cy=submitVoiceRecording]',
    },

  },
};

export default elements;
