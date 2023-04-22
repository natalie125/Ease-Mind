import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Kevin.css";

const instructions_body = [
    "Firstly, identify the lesion that you would like to identify. Whilst you are already checking, we would recommend that you attempt to self-assess your body for any other lesions that fit under the following criteria: ADD ABCDE RULES HERE IN TABLE FORMAT, MAYBE IMAGE aswell",
    "Next, take your device of choice and attempt to capture good image.",
    "Here, assess the image that you have taken, and consider if the following could be improved before submission. Take as many attempts as needed in order to get a clear image.",
    "Once submitted, please remain on the page, you should receive a response within [seconds] seconds and you will then be redirected to a page with your outcome.",
  ];

const instructions_heading = [
  "Instruction 1 - Find Lesion on body",
  "Instruction 2 - Capture Photo of lesion",
  "Instruction 3 - Ensure Image is of High quality*",
  "Instruction 4 - Submit and await results.",
];


const Instructions = () => {
const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [isChecked,setIsChecked] = useState(false);

  const next = () => {
    if (index < instructions_body.length - 1) {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };


  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };


  const handleContinue = () => {
    // Once all instructions have been displayed on screen, navigate user to photo taking screen.
    navigate("/kevin/take_photo", { replace: true });
  };

  return (
    <div className="instructions-kevin">
    <h3> {instructions_heading[index]}</h3>
    <p>{instructions_body[index]}</p>

    <b>Instruction count: {index + 1} / {instructions_heading.length} </b>
    {(index === instructions_body.length - 1) ? (
    <div>
      <div className="checkbox-row-kevin">
        <label className="checkbox-label-kevin">
        <input type="checkbox" onClick={handleCheckboxChange}/>
        I have read and understood the disclaimer. I understand that team LARKS are not liable for any damages caused by diagnosis received.
        </label>
      </div>
      <button className="instructions-button-kevin" onClick={prev} >Previous</button>
      <button className="instructions-button-kevin" onClick={handleContinue} disabled={!isChecked} >Continue</button>
      
    </div>
    ) : (
      <div>
        <button className="instructions-button-kevin" onClick={prev} disabled={index === 0} >Previous</button>
        <button className="instructions-button-kevin" onClick={next}>Next</button>
      </div>
    
    )}
    </div>
  )
};

export default Instructions;