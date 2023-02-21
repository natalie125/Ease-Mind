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

class Canopy_View_Patient extends Component {
	// get data from the patient table
	getPatient = (url_input, patient_data) => {
		axios.get(url_input, {params: patient_data})
		.then(function (response) {
			alert(response.data)
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

	// get trees of a patient
	getPatientTrees = (url_input, patient_data) => {
		axios.get(url_input, {params: patient_data})
		.then(function (response) {
			alert(response.data)
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

	// get children of a parent
	getParentChildren = (url_input, parent_data) => {
		axios.get(url_input, {params: parent_data})
		.then(function (response) {
			alert(response.data)
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

	// get parents of a child
	getChildParents = (url_input, child_data) => {
		axios.get(url_input, {params: child_data})
		.then(function (response) {
			alert(response.data)
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

	// get health conditions of a patient
	getPatientConditions = (url_input, patient_data) => {
		axios.get(url_input, {params: patient_data})
		.then(function (response) {
			alert(response.data)
		})
		.catch(function (error) {
			alert(error);
		}) 
	}
	
	render() {
		var test_patient_params = {
			id: 1,
			name: "test_patient",
			dob: "2000-01-01",
			ethnicity: "test_ethnicity",
			new_name: "replace_patient",
			new_dob: "2002-01-01",
			new_ethnicity: "replace_ethnicity"
		}

		var test_child_params = {
			id: 2,
			name: "replace_patient",
			dob: "2002-01-01",
			ethnicity: "replace_ethnicity",
		}

		var test_tree_patient_params = {
			tree_id: 1,
			patient_id: 1
		}

		var test_parent_child_params = {
			parent_id: 1,
			child_id: 2
		}
		
		var test_patient_condition_params = {
			patient_id: 1,
			condition_id: 1
		}

		return (
			<div className="App">
				<header className="App-header-primary">
					<h1>Alex's app</h1>
				</header>
				<div>
					<div>
						<p>Second nested page</p>
					</div>

					<div>
						<button onClick={() => {this.getPatient(baseurl + "patient/prod", test_patient_params)}}>GET patient at: {baseurl}</button>
					</div>

					<Link to="/home">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Canopy_View_Patient;
