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

class Canopy_Edit_Condition extends Component {
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

	// create a new health condition
	postCondition = (url_input, condition_data) => {
		axios.post(url_input, null, {params: condition_data})
		.then(function (response) {
			alert(response.data)
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

	// update information in the health condition table
	putCondition = (url_input, condition_data) => {
		axios.put(url_input, null, {params: condition_data})
		.then(function (response) {
			alert(response.data)
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

	// delete a health condition record
	deleteCondition = (url_input, condition_data) => {
		axios.delete(url_input, {params: condition_data})
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

	// link patient with health condition
	linkPatientCondition = (url_input, patient_condition_data) => {
		axios.put(url_input, null, {params: patient_condition_data})
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
					<h1>Edit Health Condition Information</h1>
				</header>
				<div>
					<div>
						<p>edit condition here</p>
					</div>

					<div>
						<button onClick={() => {this.postCondition(baseurl + "condition/prod", test_condition_params)}}>POST health condition at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.putCondition(baseurl + "condition/prod", test_condition_params)}}>PUT health condition at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.deleteCondition(baseurl + "condition/prod", test_condition_params)}}>DELETE health condition at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.getConditionPatients(baseurl + "condition_patients/prod", test_condition_params)}}>Get patients of condition at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.linkPatientCondition(baseurl + "patient_condition/prod", test_patient_condition_params)}}>Link patient and health condition at: {baseurl}</button>
					</div>

					<Link to="/home">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Canopy_Edit_Condition;
