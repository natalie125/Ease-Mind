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
					<div>
						<p>Leukocytes</p>
						<p> RESULT e.g. negative</p>
					</div>
					<div>
						<p>Nitrite</p>
						<p> RESULT e.g. Trace</p>
					</div>
					<div>
						<p>Urobilinogen</p>
						<p> RESULT</p>
					</div>
					<div>
						<p>Protein</p>
						<p>RESULT</p>
					</div>
					<div>
						<p>pH</p>
						<p> RESULT</p>
					</div>
					<div>
						<p>Blood</p>
						<p> RESULT</p>
					</div>
					<div>
						<p>Specific Gravity</p>
						<p> RESULT</p>
					</div>
					<div>
						<p>Ketones</p>
						<p> RESULT</p>
					</div>
					<div>
						<p>Bilirubin</p>
						<p> RESULT</p>
					</div>
					<div>
						<p>Glucose</p>
						<p> RESULT</p>
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