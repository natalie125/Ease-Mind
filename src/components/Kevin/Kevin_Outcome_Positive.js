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
				<h1>Kevin's app</h1>
				<div className="App-body">
					<div className="results_page">
						<h2> Iteration 2</h2>
						<h3> Outcome - Positive</h3>
						<h4> Prediction Probability: {prediction}</h4>
						<p> Based on the photo submitted, our Machine Learning Algorithm predicts that there is a high likelihood that it is a malignant skin lesion</p>
						<p> </p>
					</div>
					
				</div>
			</div>
		);
	}
}

export default Kevin;
