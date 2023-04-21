import React, { Component } from "react";
import { Link } from "react-router-dom";
import WebcamStreamCapture from "../Webcam";

import WebcamCapture from "../camera/camera";

import "../App/App.css";
import Header from "../Header/Header";

class Kevin extends Component {
	render() {
		return (
			<div className="Kevin">
				<Header />
				<h1>Kevin's app</h1>
				<div className="App-body">
					<div className="results_page">
						<h2> Iteration 1 - Simple Case</h2>
						<h3> Outcome - Positive</h3>
						<p> Based on the photo submitted, there is a high likelihood that it is a malignant skin lesion</p>
						<p> We recommed that you seek medical advice to confirm this outcome, as the application is simply giving a likelihood, rather than a diagnosis.</p>
					</div>
					
				</div>
			</div>
		);
	}
}

export default Kevin;
