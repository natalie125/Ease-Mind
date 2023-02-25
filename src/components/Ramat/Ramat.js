import React, { Component } from "react";
import { Link } from "react-router-dom";
import WebcamCapture from "../camera/camera";

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
		console.log("Aaggg");
		console.log(this.state.responseMessage);
		console.log(this.state.responseStatus);
	};

	clickButton = () => {
		console.log("hit me");
		console.log(this.state.responseMessage);
		console.log(this.state.responseStatus);
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
						<button onClick={this.clickButton}>Hit me baby one more time</button>
					</div>
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
