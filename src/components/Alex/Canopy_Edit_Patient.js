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

class Canopy_Edit_Patient extends Component {
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

	// create a new patient
	postPatient = (url_input, patient_data) => {
		axios.post(url_input, null, {params: patient_data})
		.then(function (response) {
			alert(response.data)
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

	// update information in the patient table
	putPatient = (url_input, patient_data) => {
		axios.put(url_input, null, {params: patient_data})
		.then(function (response) {
			alert(response.data)
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

	// delete a patient record
	deletePatient = (url_input, patient_data) => {
		axios.delete(url_input, {params: patient_data})
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

	// methods for linking entities with relationships
	// link tree with patient
	linkTreePatient = (url_input, tree_patient_data) => {
		axios.put(url_input, null, {params: tree_patient_data})
		.then(function (response) {
			alert(response.data)
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

	// link parent patient with child patient
	linkParentChild = (url_input, parent_child_data) => {
		axios.put(url_input, null, {params: parent_child_data})
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
					<h1>Edit Patient Information</h1>
				</header>
				<div>
					<div>
						<p>edit patient information here</p>
					</div>

					<div>
						<button onClick={() => {this.postPatient(baseurl + "patient/prod", test_patient_params)}}>POST patient at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.putPatient(baseurl + "patient/prod", test_patient_params)}}>PUT patient at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.deletePatient(baseurl + "patient/prod", test_patient_params)}}>DELETE patient at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.getPatientTrees(baseurl + "patient_trees/prod", test_patient_params)}}>Get trees of patient at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.getParentChildren(baseurl + "parent_children/prod", test_patient_params)}}>Get children of parent at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.getChildParents(baseurl + "child_parents/prod", test_child_params)}}>Get parents of child at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.getPatientConditions(baseurl + "patient_conditions/prod", test_patient_params)}}>Get conditions of patient at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.linkTreePatient(baseurl + "tree_patient/prod", test_tree_patient_params)}}>Link tree and patient at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.linkParentChild(baseurl + "parent_child/prod", test_parent_child_params)}}>Link parent and child at: {baseurl}</button>
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

export default Canopy_Edit_Patient;
