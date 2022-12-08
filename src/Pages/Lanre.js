import React, { Component } from "react";
import { Link } from "react-router-dom";
import WebcamStreamCapture from "../Component/Webcam";

import "../App.css";

class Lanre extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1>Lanre's app</h1>
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

export default Lanre;
