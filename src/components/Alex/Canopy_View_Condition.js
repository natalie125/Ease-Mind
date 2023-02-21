import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../App/App.css";

var baseurl = "http://localhost:5000/canopy/";
	if(window.location.href.includes("localhost")) {
		baseurl = "http://localhost:5000/canopy/";
	}
	else {
		baseurl = "https://d23bykmxle9vsv.cloudfront.net/";
	}

class Canopy_View_Condition extends Component {
	// get data from the health condition table
	getCondition = (url_input, condition_data) => {
		axios.get(url_input, {params: condition_data})
		.then(function (response) {
			alert(response.data)
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

	// get afflicted (condition_of) a health condition
	getConditionPatients = (url_input, condition_data) => {
		axios.get(url_input, {params: condition_data})
		.then(function (response) {
			alert(response.data)
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

	render() {
		var test_condition_params = {
			id: 1,
			name: "test_condition",
			hereditary: false,
			new_name: "replace_patient",
			new_hereditary: true
		}
		
		var test_patient_condition_params = {
			patient_id: 1,
			condition_id: 1
		}
		
		return (
			<div className="App">
				<header className="App-header-primary">
					<h1>View Health Condition Information</h1>
				</header>
				<div>
					<div>
						<p>view condition information here</p>
					</div>

					<div>
						<button onClick={() => {this.getCondition(baseurl + "condition/prod", test_condition_params)}}>GET health condition at: {baseurl}</button>
					</div>

					<Link to="/home">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Canopy_View_Condition;
