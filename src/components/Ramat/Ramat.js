import React, { Component } from "react";
import { Link } from "react-router-dom";
// import WebcamStreamCapture from "../Webcam";

import "../App/App.css";

class Ramat extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1>Ramat's app</h1>
				</header>
				<div className="App-body">
					<Link to="/home">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Ramat;
