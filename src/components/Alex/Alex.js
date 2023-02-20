import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../App/App.css";
import Header from "../Header/Header";

let baseurl = ""
if(window.location.href.includes("localhost")) {
	baseurl = "http://localhost:5000/canopy/"
}
else {
	baseurl = "https://d23bykmxle9vsv.cloudfront.net/"
}

class Alex extends Component {
	// for querying the backend
	getBackend = (http_method, url_input, request_headers) => {
		var config = {
			method: http_method,
			url: url_input,
			headers: request_headers,
		};

		axios(config)
			.then(function (response) {
				alert(response.data);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	// methods for receiving data from the Flask app
	// get data from the tree table
	getTree = (url_input, tree_data) => {
		axios.get(url_input, {params: tree_data})
		.then(function (response) {
			alert(response.data)
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

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

	// methods for sending data to the Flask app
	// create a new tree
	postTree = (url_input, tree_data) => {
		axios.post(url_input, null, {params: tree_data})
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

	// methods for updating data in the Flask app
	// update information in the tree table
	putTree = (url_input, tree_data) => {
		axios.put(url_input, null, {params: tree_data})
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

	// methods for deleting data in the Flask app
	// delete a tree record
	deleteTree = (url_input, tree_data) => {
		axios.delete(url_input, {params: tree_data})
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

	render() {
		var test_tree_params = {
			id: 2,
			name: "new_tree",
			owner: "new@gmail.com",
			new_name: "replaced_tree",
			new_owner: "replaced@gmail.com"
		}
		var test_patient_params = {
			id: 1,
			name: "test_patient",
			dob: "2000-01-01",
			ethnicity: "test_ethnicity",
			new_name: "replace_patient",
			new_dob: "2002-01-01",
			new_ethnicity: "replace_ethnicity"
		}
		var test_condition_params = {
			id: 1,
			name: "test_condition",
			hereditary: false,
			new_name: "replace_patient",
			new_hereditary: true
		}

		return (
			<div className="App">
				<Header />
				<h1>Canopy</h1>
				<div>
					<div>
						<Link to="/alex/alex2">
							<button> Go to second page </button>
						</Link>
					</div>

					{/* GET buttons */}
					<div>
						<button onClick={() => {this.getTree(baseurl + "tree/prod", test_tree_params)}}>GET tree at: {baseurl}</button>
					</div>	

					<div>
						<button onClick={() => {this.getPatient(baseurl + "patient/prod", test_patient_params)}}>GET patient at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.getCondition(baseurl + "condition/prod", test_condition_params)}}>GET health condition at: {baseurl}</button>
					</div>

					<br></br>

					{/* POST buttons */}
					<div>
						<button onClick={() => {this.postTree(baseurl + "tree/prod", test_tree_params)}}>POST tree at: {baseurl}</button>
					</div>	

					<div>
						<button onClick={() => {this.postPatient(baseurl + "patient/prod", test_patient_params)}}>POST patient at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.postCondition(baseurl + "condition/prod", test_condition_params)}}>POST health condition at: {baseurl}</button>
					</div>

					<br></br>	

					{/* PUT buttons */}
					<div>
						<button onClick={() => {this.putTree(baseurl + "tree/prod", test_tree_params)}}>PUT tree at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.putPatient(baseurl + "patient/prod", test_patient_params)}}>PUT patient at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.putCondition(baseurl + "condition/prod", test_condition_params)}}>PUT health condition at: {baseurl}</button>
					</div>

					<br></br>

					{/* DELETE buttons */}
					<div>
						<button onClick={() => {this.deleteTree(baseurl + "tree/prod", test_tree_params)}}>DELETE tree at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.deletePatient(baseurl + "patient/prod", test_patient_params)}}>DELETE patient at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.deleteCondition(baseurl + "condition/prod", test_condition_params)}}>DELETE health condition at: {baseurl}</button>
					</div>

					<div>
						<Link to="/home">
							<button> Back </button>
						</Link>
					</div>
				</div>
			</div>
		);
	}
}

export default Alex;
