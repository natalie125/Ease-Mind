import React, { useState,Component } from "react";
import { Link } from "react-router-dom";
import "../App/App.css";
import "../Lanre/dipstik.css";
import Header from "../Header/Header";
import DipstikTimer from "./DipstikTimer";
import DipstikCamera from "./DipstikCamera";

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

                {instructions <= 1 && (
				<div>
					<div className="instructions-container">
                        <h3 className="instructions-title">Important Note</h3>
                        <div className="important-note-container">
                            <p className="important-note"> This app is only to be used as a proof of concept. <br />
                                All advice or diagnosis given in this app should not be taken as medical advice. <br /><br />
                                If you are concerned about any part of your health, please get in contact with
                                your GP or a qualified medical professional for further advice.
                                This app is not intended to treat, diagnose, or cur any conditions. 
                                {/* From Urinox app */}

                                <br /><br />

                                The app material is provided for informational and educational purposes alone. Please 
                                seek your doctor's advice before making any clinical inference or decision. 
                                Use this app as a reference to record your activity.
                            </p>
                        </div>
                        
                    
					</div>
                    <div className="start-button-container">
                        <button onClick={HandlePreviousInstructions}className="start-button"> Back </button>
                        <button onClick={HandleNextInstructions}className="start-button"> Next </button>

                        <Link to="/dipstik-home/dipstik-timer">
                            <button className="start-button"> Start </button>
                        </Link>
                    </div>

				</div>
                )}

                {instructions == 2 && (
                    <>
                        <h3 className="instructions-title">Instructions 1</h3>
                        <div>
                            <p className="instructions">
                                1. Make sure you have collected your urine sample. <br />
                                2. Dip the dipstick in your urine sample<br/>
                            </p>
                        </div>
                        <button onClick={HandlePreviousInstructions}className="start-button"> Back </button>
                        <button onClick={HandleNextInstructions}className="start-button"> Next </button>
                    </>
                )}

                {instructions == 3 && (
                    <>
                        <h3 className="instructions-title">Instructions 2</h3>
                        <p> 3. Wait</p>
                        <p> Hold the stick horizontally and wait 60 seconds</p>
                        <DipstikTimer />

                        
                        
                        <button onClick={HandlePreviousInstructions}className="start-button"> Back </button>
                        <button onClick={HandleNextInstructions}className="start-button"> Next </button>
                    </>
                )}


                <Link to="/home">
						<button> Back </button>
				</Link>
			</div>
            </>
        );
};

export default DipstikInstructions;