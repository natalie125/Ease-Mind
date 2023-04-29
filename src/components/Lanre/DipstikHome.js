import React, { useState, Component } from "react";
import "../App/App.css";
import "../Lanre/dipstik.css";
import Header from "../Header/Header";
import DipstikTimer from "./DipstikTimer";

const DipstikInstructions = () =>  {
        const [instructions, setInstructions] = useState(1);

        // Handle What happends when 
        const HandleNextInstructions = () => {
            if (instructions >= 3) {
                setInstructions(3);
            } else {
                setInstructions(instructions+1);
            }
        };

        const HandlePreviousInstructions = () => {
            if (instructions <= 0) {
                setInstructions(1);
            } else {
                setInstructions(instructions-1);
            }
            
        };


        
		return (
            <>
			<div className="Lanre">
				<Header />
				<h1>Welcome to dipstik</h1>

                <div className="instructions-container">
                {instructions <= 1 && (
				<>
                        <h3 className="instructions-title">Disclaimer!</h3>

                        <div className="instructions-content">
                            <p className="disclaimer"> This app is only to be used as a proof of concept
                                not intended to treat, diagnose, or cure any conditions. All advice or diagnosis
                                given in this app should not be taken as medical advice. 
                                
                                <br /><br />
                                <b> If you are concerned about any part of your health, please get in contact with
                                your GP or a qualified medical professional for further advice. </b>
                                <br />

                                <br />
                                To collect your diagnosis, an image of your urine will be sent 
                                to the backend for processing, however this diagnosis will not be saved anywhere in the backend. 

                                <br /> <br />
                                By clicking "Continue", you agree to the  above conditions.
                            </p>
                    
					    </div>
                    <div className="instructions-button-container">
                        {/* <button onClick={HandlePreviousInstructions}className="start-button"> Back </button> */}
                        <button onClick={HandleNextInstructions}className="instructions-button"> Continue </button>
                    </div>

				</>
                )}

                {instructions == 2 && (
                    <>
                        <h3 className="instructions-title">Instructions</h3>

                        <div className="instructions-content">
                            <p className="instructions">
                                1. Make sure you have collected your urine sample. <br />
                                2. Dip the dipstick in your urine sample.<br/>
                                3. Remove the dipstick. <br />
                                4. Hold the stick horizontally and wait 60 seconds. <br />
                                5. Ensure you have good lighting! <br />
                                6. Take a picture of the urine dipstick. <br />
                                7. Ensure you take the image from directly above the dipstick! <br />
                                8. Get your diagnosis! <br/>
                            </p>
                        </div>

                        <div className="instructions-button-container">
                            <button onClick={HandlePreviousInstructions} className="instructions-button"> Back </button>
                            <button onClick={HandleNextInstructions} className="instructions-button"> Next </button>
                        </div>
                    </>
                )}

                {instructions == 3 && (
                    <>
                        <h3 className="instructions-title">Wait 60 seconds!</h3>
                        <div className="instructions-content">
                            <p className="instructions">
                                Dip your dipstick and hold it horizontally! <br/>
                                Start the 60 second timer!
                                Camera will open up when timer is over!
                            </p>
                            <DipstikTimer />
                        </div>
                        
                        <div className="instructions-button-container">
                            <button onClick={HandlePreviousInstructions} className="instructions-button"> Back </button>
                        </div>
                        {/* <button onClick={HandlePreviousInstructions}className="start-button"> Back </button> */}
                        {/* <button onClick={HandleNextInstructions}className="start-button"> Next </button> */}
                    </>
                )}
                </div>


                {/* <Link to="/home">
						<button> Back </button>
				</Link> */}
			</div>
            </>
        );
};

export default DipstikInstructions;