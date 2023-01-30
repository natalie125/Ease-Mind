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
				<body className="App-body">
					<Link to="/home">
						<button> Back </button>
					</Link>
				</body>
			</div>
		);
	}
}


export default Ramat;
