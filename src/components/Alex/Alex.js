import React, { Component } from "react";
import { Link } from "react-router-dom";

import "../App/App.css";
import Header from "../Header";

class Alex extends Component {
	render() {
		return (
			<div className="App">
				<Header />
				<h1>Alex's app</h1>
				<body>
					<div className="webcam-capture-holder">
						<p>Webcam capture below</p>
						<WebcamStreamCapture />
					</div>
					<Link to="/home">
						<button> Back </button>
					</Link>
				</body>
			</div>
		);
	}
}

export default Alex;
