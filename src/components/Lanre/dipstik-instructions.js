import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../App/App.css";
import "../Lanre/Lanre.css";
import Header from "../Header/Header";
import DipstickTimer from "./Timer";

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
                        <button className="start-button"> Start </button>
                    </div>

                    

					<Link to="/lanre">
						<button> Back </button>
					</Link>

				</div>
			</div>
		);
	}
}

export default DipstikInstructions;