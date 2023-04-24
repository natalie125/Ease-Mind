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
                        <h2> Iteration 2</h2>
                        <h3> Outcome - Negative</h3>
                        <p> Based on the photo submitted, there is a low likelihood that it is a malignant skin lesion</p>
                        <p> If you have any doubts about this recommendation, please seek medical advice.</p>
                    </div>
					
				</div>

			</div>
		);
	}
}

export default Kevin;
