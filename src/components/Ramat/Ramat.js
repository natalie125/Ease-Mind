import React, { Component } from "react";
import { Link } from "react-router-dom";
import WebcamCapture from "../camera/camera";
import AudioRecorder from "../AudioRecorder";

// import WebcamStreamCapture from "../Webcam";

import Header from "../Header/Header";

import "../App/App.css";

class Ramat extends Component {
	constructor(props) {
		super(props);
		this.state = { responseMessage: "", responseStatus: "" };
		this.getResponse = this.getResponse.bind(this);
	}

	getResponse = (response) => {
		this.setState({
			responseMessage: response.data.msg,
			responseStatus: response.status,
		});
	};

	render() {
		return (
			<div className="Ramat">
				<Header />
				<h1>Ramat's app</h1>
				<div className="App-body">
					<div className="tons-page-camera-container">
						<div className="webcam-capture-holder">
							<p style={{ textAlign: "center", marginBottom: "20px" }}>
								Webcam capture below (to use flash please brighten your screen)
							</p>
							<WebcamCapture context="ramat" returnResponse={this.getResponse} />
						</div>
					</div>
					<p>response message: {this.state.responseMessage}</p>
					<AudioRecorder />
					<Link to="/home">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Ramat;
