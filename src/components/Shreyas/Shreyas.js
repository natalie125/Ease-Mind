import React, { Component } from "react";
import { Link } from "react-router-dom";
import WebcamCapture from "../camera/camera";

import Header from "../Header/Header";

import "../App/App.css";

class Shreyas extends Component {
	render() {
		return (
			<div className="App">
				<Header />
				<h1>Shreyas' app</h1>
				<div>
					<div className="webcam-capture-holder">
						<p>Webcam capture below (to use flash please brighten your screen)</p>
						<WebcamCapture />
						
					</div>
					<Link to="/home">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Shreyas;
