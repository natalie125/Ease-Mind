import React, { Component } from "react";
import { Link } from "react-router-dom";
import ImageAudio from "./ImageAudio";
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
					<ImageAudio />
					<p>response message: {this.state.responseMessage}</p>
					<Link to="/home">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Ramat;
