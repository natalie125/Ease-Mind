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

	// methods for getting the relationships between entities, starting from their id
	// get nodes of a tree
	getTreeNodes = (url_input, tree_data) => {
		axios.get(url_input, {params: tree_data})
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
		var test_tree_params = {
			id: 1,
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
		var test_child_params = {
			id: 2,
			name: "replace_patient",
			dob: "2002-01-01",
			ethnicity: "replace_ethnicity",
		}
		var test_condition_params = {
			id: 1,
			name: "test_condition",
			hereditary: false,
			new_name: "replace_patient",
			new_hereditary: true
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

					<br></br>

					{/* GET buttons that retreieve relationships */}
					<div>
						<button onClick={() => {this.getTreeNodes(baseurl + "tree_nodes/prod", test_tree_params)}}>Get nodes of tree at: {baseurl}</button>
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
						<button onClick={() => {this.getConditionPatients(baseurl + "condition_patients/prod", test_condition_params)}}>Get patients of condition at: {baseurl}</button>
					</div>

					<br></br>

					{/* PUT buttons that link entities */}
					<div>
						<button onClick={() => {this.linkTreePatient(baseurl + "tree_patient/prod", test_tree_patient_params)}}>Link tree and patient at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.linkParentChild(baseurl + "parent_child/prod", test_parent_child_params)}}>Link parent and child at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.linkPatientCondition(baseurl + "patient_condition/prod", test_patient_condition_params)}}>Link patient and health condition at: {baseurl}</button>
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
