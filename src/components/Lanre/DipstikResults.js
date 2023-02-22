import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../App/App.css";

import Header from "../Header/Header";
import DipstickTimer from "./DipstikTimer";

class DipstikResults extends Component {
	render() {
		return (
			<div className="dipstik-results">
				<Header />
				<h1>Dipstik Results</h1>
				<div>
					<div className="webcam-capture-holder">
						<p>Webcam capture below (to use flash please brighten your screen)</p>
					</div>

					<Link to="/dipstik-home/dipstik-timer/dipstik-camera">
						<button> Back </button>
					</Link>

					<Link to="/dipstik/dipstik-home/dipstik-timer/dipstik-results">
						<button> Results </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default DipstikResults;