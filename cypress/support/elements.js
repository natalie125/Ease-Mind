export var elements = {


	Login: {
		Email: "[data-cy=loginEmail]",
		Password: "[data-cy=loginPassword]",
		Error_Text: "[data-cy=loginError]",
		Login_Button: "[data-cy=loginBttn]",
		SignUp_Button: "[data-cy=loginSignUpBttn]",
	},
	SignUp: {
		Email: "[data-cy=signUpEmail]",
		Password: "[data-cy=signUpPasswd]",
		Login_Button: "[data-cy=signUpLoginBttn]",
		Error_Text: "[data-cy=signUpError]",
		Create_Account_Button: "[data-cy=signUpBttn]",
	},

	Home: {
		ButtonContainer: "[data-cy=homeBttnContainer]",
		applicationButton: "[data-cy=alexAppLogo]",
		Logout_Button: "[data-cy=logoutBttn]"
	},

	// Paralysis Alanysis elements
	PA: {
		Link:"[data-cy=paralysisAnalysisLink]",
		Logo:"[data-cy=paralysisAnalysisLogo]",

		// Image elements
		Image: {
			Active_Camera:"[data-cy=activeCamera]",
			Take_Pic_Button: "[data-cy=takePicBttn]",
			Switch_Cam_Button: "[data-cy=switchCamBttn]",
			Captured_Image: "[data-cy=capturedImage]",
			Retake_Button: "[data-cy=retakeBttn]",
			Submit_Button: "[data-cy=submitPicBttn]",
		},
		
		// Audio elements
		Voice: {
			Audio_Container: "[data-cy=audioContainer]",
			Start_Button: "[data-cy=startVoiceRecording]",
			Stop_Button: "[data-cy=stopVoiceRecording]",
			Submit_Button: "[data-cy=submitVoiceRecording]",
		}
		



	},
};
