import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SkinScan.css";

// Instructions corresponding to Instructions headings.
const instructions_body = [
  "Firstly, identify the lesion that you would like to identify. Look for any new or exising moles, or lesions showing signs of assymetry, discolouration, rough borders, a relatively large size. or that may have grown recently.",
  "Next, capture an image of the lesion using the camera shown. To ensure an accurate prediction, ensure the image taken is clear and in focus.",
  "Once captured, assess the image that you have taken before submission. The image will be displayed prior to submission, and the camera controls allow for as many attempts at retaking the image as needed.",
  "Once submitted, please remain on the page, you should receive a response shortly (less than 45 seconds), where you automatically be redirected to the outcome page.",
  ];

  // Instruction headings
const instructions_heading = [
  "Instruction 1 - Find Lesion on body",
  "Instruction 2 - Capture photo of lesion",
  "Instruction 3 - Check captured image",
  "Instruction 4 - Submit and await results",
];


const Instructions = () => {
const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [isChecked,setIsChecked] = useState(false);

  // If next button is pressed, append the instruction index by 1.
  // Only do this if last instruction has not been reached.
  const next = () => {
    if (index < instructions_body.length - 1) {
      setIndex(index + 1);
    }
  };

  // Go back to previous instruction index.
  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  // This checks if the checkbox is checked or not
  // Set the boolean to current state of checkbox
  // Dictates if the continue button is able to be pressed by the user.
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  // navigate the user to image taking page if continue button has been pressed.
  const handleContinue = () => {
    // Once all instructions have been displayed on screen, navigate user to photo taking screen.
    navigate("/skin-scan/take_photo", { replace: true });
  };

  return (
    <div className="instructions-kevin">
      <div className="instructions-container-left">
        <h3> {instructions_heading[index]}</h3>
        <p>{instructions_body[index]}</p>
      </div>
      <div className="gap-instructions-kevin"></div>
      <div className="instructions-container-right">

        {/* Depending on the instruction index, the user is shown a different option of buttons and text on screen */}
        {(index === instructions_body.length - 1) ? (
            <div>
              <div data-cy="instructionsCheckbox" className="checkbox-row-kevin">
                <label className="checkbox-label-kevin">
                <input type="checkbox" onClick={handleCheckboxChange}/>
                I have read and understood the disclaimer. I understand that team LARKS are not liable for any damages caused by diagnosis received.
                </label>
              </div>
                <button className="instructions-button-kevin" data-cy="instructionsPrev" onClick={prev} >Previous</button>
                <button className="instructions-button-kevin" data-cy="instructionsContinue" onClick={handleContinue} disabled={!isChecked} >Continue</button>
            </div>
          ) : (
            <div>
              <button className="instructions-button-kevin" data-cy="instructionsPrev" onClick={prev} disabled={index === 0} >Previous</button>
              <button className="instructions-button-kevin" data-cy="instructionsNext" onClick={next}>Next</button>
            </div>

        )}
        <b>Instruction count: {index + 1} / {instructions_heading.length} </b>
      </div>
    </div>
  )
};

export default Instructions;