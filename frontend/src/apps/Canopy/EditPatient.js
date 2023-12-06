import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

class EditPatient extends Component {
	// form methods
	constructor(props) {
		super(props);
		this.state = {
		  patient_id: 1,
		  name: "patient's name",
		  dob: "YYYY-MM-DD",
		  ethnicity: "patient's ethnicity",
		  new_name: "new patient name",
		  new_dob: "YYYY-MM-DD",
		  new_ethnicity: "new patient's ethnicity",
		  tree_nodes_id: 1,
		  patient_node_of_id: 1,
		  parent_id: 1,
		  child_id: 2,
		  patient_conditions_id: 1,
		  condition_patients_id: 1
		};
	
		this.handleInputChange = this.handleInputChange.bind(this);
	  }
	
	handleInputChange(event) {
	const target = event.target;
	const value = target.value;
	const name = target.name;

	this.setState({
		[name]: value
	});
	}

	// get data from the patient table
	getPatient = (url_input, patient_data) => {
		axios.get(url_input, {params: patient_data})
		.then(function (response) {
			alert(JSON.stringify(response.data))
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
			alert(JSON.stringify(response.data))
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

	// get children of a parent
	getParentChildren = (url_input, parent_data) => {
		axios.get(url_input, {params: parent_data})
		.then(function (response) {
			alert(JSON.stringify(response.data))
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

	// get parents of a child
	getChildParents = (url_input, child_data) => {
		axios.get(url_input, {params: child_data})
		.then(function (response) {
			alert(JSON.stringify(response.data))
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

	// get health conditions of a patient
	getPatientConditions = (url_input, patient_data) => {
		axios.get(url_input, {params: patient_data})
		.then(function (response) {
			alert(JSON.stringify(response.data))
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
		return (
			<div className="App">
				<header className="App-header-primary">
					<h1>Edit Patient Information</h1>
				</header>
				<div>
					<form>
						<label>
							Patient ID:
							<input
							name="patient_id"
							type="number"
							value={this.state.patient_id}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							Name:
							<input
							name="name"
							type="text"
							value={this.state.name}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							Date Of Birth:
							<input
							name="dob"
							type="text"
							value={this.state.dob}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							Ethnicity:
							<input
							name="ethnicity"
							type="text"
							value={this.state.ethnicity}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							New Name:
							<input
							name="new_name"
							type="text"
							value={this.state.new_name}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							New DOB:
							<input
							name="new_dob"
							type="text"
							value={this.state.new_dob}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							New Ethnicity:
							<input
							name="new_ethnicity"
							type="text"
							value={this.state.new_ethnicity}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							Patient ID to check trees of:
							<input
							name="patient_node_of_id"
							type="number"
							value={this.state.patient_node_of_id}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							Tree ID to link with:
							<input
							name="tree_nodes_id"
							type="number"
							value={this.state.tree_nodes_id}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							Parent's ID to link or read children of:
							<input
							name="parent_id"
							type="number"
							value={this.state.parent_id}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							Child's ID to link or read parents of:
							<input
							name="child_id"
							type="number"
							value={this.state.child_id}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							Patient ID to check conditions of:
							<input
							name="patient_conditions_id"
							type="number"
							value={this.state.patient_conditions_id}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							Condition ID to link to:
							<input
							name="condition_patients_id"
							type="number"
							value={this.state.condition_patients_id}
							onChange={this.handleInputChange} />
						</label>
					</form>

					<div>
						<button onClick={() => {this.postPatient(BASEURL + "canopy/patient/prod", {id: this.state.patient_id, name: this.state.name, dob: this.state.dob, ethnicity: this.state.ethnicity})}}>POST patient at: {BASEURL}</button>
					</div>

					<div>
						<button onClick={() => {this.putPatient(BASEURL + "canopy/patient/prod", {id: this.state.patient_id, name: this.state.name, dob: this.state.dob, ethnicity: this.state.ethnicity, new_name: this.state.new_name, new_dob: this.state.new_dob, new_ethnicity: this.state.new_ethnicity})}}>PUT patient at: {BASEURL}</button>
					</div>

					<div>
						<button onClick={() => {this.deletePatient(BASEURL + "canopy/patient/prod", {id: this.state.patient_id, name: this.state.name, dob: this.state.dob, ethnicity: this.state.ethnicity})}}>DELETE patient at: {BASEURL}</button>
					</div>

					<div>
						<button onClick={() => {this.getPatientTrees(BASEURL + "canopy/patient_trees/prod", {id: this.state.patient_node_of_id})}}>Get trees of patient at: {BASEURL}</button>
					</div>

					<div>
						<button onClick={() => {this.getParentChildren(BASEURL + "canopy/parent_children/prod", {id: this.state.parent_id})}}>Get children of parent at: {BASEURL}</button>
					</div>

					<div>
						<button onClick={() => {this.getChildParents(BASEURL + "canopy/child_parents/prod", {id: this.state.child_id})}}>Get parents of child at: {BASEURL}</button>
					</div>

					<div>
						<button onClick={() => {this.getPatientConditions(BASEURL + "canopy/patient_conditions/prod", {id: this.state.patient_conditions_id})}}>Get conditions of patient at: {BASEURL}</button>
					</div>

					<div>
						<button onClick={() => {this.linkTreePatient(BASEURL + "canopy/tree_patient/prod", {tree_id: this.state.tree_nodes_id, patient_id: this.state.patient_node_of_id})}}>Link tree and patient at: {BASEURL}</button>
					</div>

					<div>
						<button onClick={() => {this.linkParentChild(BASEURL + "canopy/parent_child/prod", {parent_id: this.state.parent_id, child_id: this.state.child_id})}}>Link parent and child at: {BASEURL}</button>
					</div>

					<div>
						<button onClick={() => {this.linkPatientCondition(BASEURL + "canopy/patient_condition/prod", {patient_id: this.state.patient_conditions_id, condition_id: this.state.condition_patients_id})}}>Link patient and health condition at: {BASEURL}</button>
					</div>

					<Link to="/home">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default EditPatient;
