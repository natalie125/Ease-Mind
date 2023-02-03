import React, { Component } from "react";
import { Link } from "react-router-dom";
// import WebcamStreamCapture from "../Webcam";

import "../App/App.css";
import Header from "../Header";

class Ramat extends Component {
	render() {
		return (
			<div className="App">
				<Header />
				<h1>Ramat's app</h1>
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
