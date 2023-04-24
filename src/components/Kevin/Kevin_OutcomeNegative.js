import React, { Component } from "react";
import "../App/App.css";
import Header from "../Header/Header";
import Webcam from "react-webcam";

class Kevin extends Component {
	render() {
		const prediction = sessionStorage.getItem('prediction-skin-cancer')
		return (
			<div className="Kevin">
				<Header />
				<h1>Kevin's app</h1>
				<div className="App-body">
                    <div className="results_page">
                        <h2> Iteration 2</h2>
                        <h3> Outcome - Negative</h3>
						<h4> Prediction probabiltiy: {prediction}</h4>
                        <p> Based on the photo submitted, there is a low likelihood that it is a malignant skin lesion</p>
                        <p> If you have any doubts about this recommendation, please seek medical advice.</p>
                    </div>
					
				</div>

			</div>
		);
	}
}

export default Kevin;
