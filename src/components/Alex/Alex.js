import React, { Component } from "react";
import { Link } from "react-router-dom";
import WebcamStreamCapture from "../Webcam";

import "../App/App.css";

class Alex extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1>Alex's app</h1>
				</header>
				<body className="App-body">
					<WebcamStreamCapture />
					<Link to="/home">
						<button> Back </button>
					</Link>
				</body>
			</div>
		);
	}
}

export default Alex;
