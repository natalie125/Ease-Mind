import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../App/App.css";
import "../Lanre/dipstik.css";
import Header from "../Header/Header";
import DipstickTimer from "./DipstikTimer";

class DipstikInstructions extends Component {
	render() {
		return (
			<div className="Lanre">
				<Header />
				<h1>Welcome to dipstik</h1>
				<div>
					<div className="instructions-container">
                        <h3 className="instructions-title">Important Note</h3>
                        <div className="important-note-container">
                            <p className="important-note"> This app is only to be used as a proof of concept. <br />
                                All advice or diagnosis given in this app should not be taken as medical advice. <br />
                                If you are concerned about any part of your health, please get in contact with
                                your GP or a qualified medical professional for further advice.
                                This app is not intended to treat, diagnose, or cur any conditions. 
                                {/* From Urinox app */}
                                The app material is provided for informational and educational purposes alone. Please 
                                seek your doctor's advice before making any clinical inference or decision. 
                                Use this app as a reference to record your activity.
                            </p>
                        </div>


                        <h3 className="instructions-title">Instructions</h3>
                        <div>
                            <p className="instructions">
                                1. Make sure you have collected your urine sample. <br />
                                2. Dip your dipstick in the urine sample for 5 seconds.<br />
                                3. Click the start timer button when you are ready.<br />
                                4. When the timer is finished, take a picture of the dipstick.<br />
                                5. Hit send and wait for your results.</p>
                        </div>
                        
                    
					</div>
                    <div className="start-button-container">
                        <Link to="/dipstik-home/dipstik-timer">
                            <button className="start-button"> Start </button>
                        </Link>
                    </div>

                    

					<Link to="/home">
						<button> Back </button>
					</Link>

				</div>
			</div>
		);
	}
}

export default DipstikInstructions;