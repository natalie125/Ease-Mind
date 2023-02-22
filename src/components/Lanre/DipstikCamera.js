import React, { Component } from "react";
import { Link } from "react-router-dom";
import LanreWebcamCapture from "./lanre_camera";
import "../App/App.css";

import Header from "../Header/Header";
import DipstickTimer from "./DipstikTimer";

class DipstikCamera extends Component {
	render() {
		return (
			<div className="Lanre">
				<Header />
				<h1>Lanre's app</h1>
				<div>
					<div className="webcam-capture-holder">
						<p>Webcam capture below (to use flash please brighten your screen)</p>
						<LanreWebcamCapture />
						
					</div>
					<Link to="/dipstik-home/dipstik-timer">
						<button> Back </button>
					</Link>
					<Link to="/dipstik-home/dipstik-timer/dipstik-camera/dipstik-results">
						<button> Results </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default DipstikCamera;