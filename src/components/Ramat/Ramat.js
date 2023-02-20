import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FormData from "form-data";

// import WebcamStreamCapture from "../Webcam";

import Header from "../Header/Header";

import "../App/App.css";

class Ramat extends Component {
	postPicture = async (image) => {
		let BASEURL = "";
		process.env.NODE_ENV === "development"
			? (BASEURL = process.env.REACT_APP_DEV)
			: (BASEURL = process.env.REACT_APP_PROD);

		const testImg = 
		let data = new FormData();
		data.append("image", "test_face.png");
		// e.preventDefault();
		const response = await axios
			.post(BASEURL + "ramat", data, {
				headers: {
					accept: "application/json",
					"Accept-Language": "en-US,en;q=0.8",
					"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
				},
			})
			.then((response) => {
				console.log(response);
				console.log(response.status);

				if (response) {
					console.log("Response received");
				}
				return response;
			});
		console.log(response);
		return response;
	};

	render() {
		return (
			<div className="Ramat">
				<Header />
				<h1>Ramat's app</h1>
				<div className="App-body">
					<button
						className="authentication-button"
						data-cy="ramatPostButton"
						type="submit"
						onClick={async () => {
							await this.postPicture();
						}}
					>
						Post picture
					</button>
					<Link to="/home">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Ramat;
