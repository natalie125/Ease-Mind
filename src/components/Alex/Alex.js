import React, { Component } from "react";
import { Link } from "react-router-dom";

import WebcamStreamCapture from "../Webcam";

import "../App/App.css";
import Header from "../Header/Header";

class Alex extends Component {
	render() {
		return (
			<div className="App">
				<Header />
				<h1>Alex's app</h1>
				<div>
					<div>
						<Link to="/alex/alex2">
							<button> Go to second page </button>
						</Link>
					</div>
					<Link to="/home">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Alex;
