import React, { Component } from "react";
import "../App/App.css";
import Header from "../Header/Header";



class Kevin extends Component {
	;
	render() {
		const prediction = sessionStorage.getItem('prediction-skin-cancer')
		return (
			<div className="Kevin">
				<Header />
				<h1>Skin Scan</h1>
				<div className="App-body">
					<div className="results_page">
						<h2> Image Analysis Results</h2>
						<h3> Outcome - Positive</h3>
						<h4> Prediction Probability: {prediction}</h4>
						<p> Based on the photo submitted, our Machine Learning Algorithm predicts that there is a high likelihood that the image submitted is a malignant skin lesion</p>
						<p> This result was calculated based on the information our Machine Learning Algorithm was trained, from which it has deduced that this image may contain a malignant skin cancer.</p>
						<p> Please do not use this information as an alternative to professional diagnosis. If you have any doubts about your health and/or well-being, please visit a medical professional. </p>
						

						
					</div>
					
				</div>
			</div>
		);
	}
}

export default Kevin;
