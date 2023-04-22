import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import WebcamStreamCapture from "../Webcam";

import WebcamCapture from "../camera/camera";

import "../App/App.css";
import "./Kevin.css";
import Header from "../Header/Header";

// const [is,setIs] = false;
// const handleCheckboxChange = (event) => {
//     setIs(event.target.checked);}


class Kevin extends Component {	
	render() {
		
		return (
			<div className="Kevin">
				<Header />
				<h1 className="h1_kevin">Kevin's app</h1>
				<div className="App-body">
					<div className="landing_page_kevin">

						<h2 className="h2_kevin"> Iteration 1 - Simple Case</h2>

						<h3 className="h3_kevin"> Disclaimer:</h3>
						<p>
							This Skin Cancer identification application has been developed as a prototype only, to demonstrate the potential application of Computer Aided Diagnosis (CAD).
						</p>
						<p>
							This application should not be used primarily as a diagnosis device.
						</p>
						<p>
							If you have any doubts regarding your personal health, please visit a medical professional to receive a diagnosis.
						</p>
						{/* <label for="checkid">
							<input id="checkid"  type="checkbox" value="test" onChange={handleCheckboxChange} />
							I have read and understood the disclaimer. I understand that team LARKS are not liable for any damages caused by diagnosis received. 
						</label> */}

						<Link to="/kevin/instructions">
							<button> Continue </button>
						</Link>



					{/* <p style={{ textAlign: "center", marginBottom: "20px" }}> Webcam Capture </p>
							<WebcamCapture context="kevin"/> */}
						<Link to="/home">
							<button> Back </button>
						</Link>
					
					</div>
				</div>
			</div>
		);
	}
}

export default Kevin;