import React, { Component } from "react";
import WebcamCapture from "./CameraKevin.js";

class Kevin extends Component {
	render() {
		return (
			<div className="Kevin">
				<h1>Skin Scan</h1>
				<div className="image_page">
					<h2> Image Submission</h2>
					<WebcamCapture context="kevin" />
				</div>
			</div>
		);
	}
}

export default Kevin;
