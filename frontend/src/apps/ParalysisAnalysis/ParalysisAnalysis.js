import React, { Component } from "react";
import ImageAudio from "./ImageAudio";

class ParalysisAnalysis extends Component {
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
			<div className="App-body">
				<ImageAudio />
			</div>
		);
	}
}

export default ParalysisAnalysis;
