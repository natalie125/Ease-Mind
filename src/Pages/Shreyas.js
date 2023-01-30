import React, { Component } from "react";
import { Link } from "react-router-dom";
import WebcamStreamCapture from "../components/Webcam";

import "../components/App/App.css";

class Shreyas extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1>Shreyas' app</h1>
				</header>
				<body className="App-body">
					<Link to="/home">
						<button> Back </button>
					</Link>
				</body>
			</div>
		);
	}
}

export default Shreyas;
