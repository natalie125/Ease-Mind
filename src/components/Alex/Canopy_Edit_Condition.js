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
	// form methods
	constructor(props) {
		super(props);
		this.state = {
		  condition_id: 1,
		  name: "condition name",
		  hereditary: true,
		  new_name: "new condition name",
		  new_hereditary: true,
		  condition_patients_id: 1,
		  patient_conditions_id: 1
		};
	
		this.handleInputChange = this.handleInputChange.bind(this);
	  }
	
	handleInputChange(event) {
	const target = event.target;
	const value = target.type === 'checkbox' ? target.checked : target.value;
	const name = target.name;

	this.setState({
		[name]: value
	});
	}

	// get data from the health condition table
	getCondition = (url_input, condition_data) => {
		axios.get(url_input, {params: condition_data})
		.then(function (response) {
			alert(JSON.stringify(response.data))
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
			alert(JSON.stringify(response.data))
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
			// id: 1,
			// name: "test_condition",
			// hereditary: false,
			// new_name: "replace_patient",
			// new_hereditary: true
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
					<form>
						<label>
							Condition ID:
							<input
							name="condition_id"
							type="number"
							value={this.state.condition_id}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							Condition Name:
							<input
							name="name"
							type="text"
							value={this.state.name}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
						Hereditary:
						<input
							name="hereditary"
							type="checkbox"
							checked={this.state.hereditary}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							New Condition Name:
							<input
							name="new_name"
							type="text"
							value={this.state.new_name}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
						New Hereditary Value:
						<input
							name="new_hereditary"
							type="checkbox"
							checked={this.state.new_hereditary}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							Condition ID to link or check patients of:
							<input
							name="condition_patients_id"
							type="number"
							value={this.state.condition_patients_id}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							Patient ID to link to:
							<input
							name="patient_conditions_id"
							type="number"
							value={this.state.patient_conditions_id}
							onChange={this.handleInputChange} />
						</label>
					</form>

					<div>
						<button onClick={() => {this.postCondition(baseurl + "condition/prod", {id: this.state.condition_id, name: this.state.name, hereditary: this.state.hereditary})}}>POST health condition at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.putCondition(baseurl + "condition/prod", {id: this.state.condition_id, name: this.state.name, hereditary: this.state.hereditary, new_name: this.state.new_name, new_hereditary: this.state.new_hereditary})}}>PUT health condition at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.deleteCondition(baseurl + "condition/prod", {id: this.state.condition_id, name: this.state.name, hereditary: this.state.hereditary})}}>DELETE health condition at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.getConditionPatients(baseurl + "condition_patients/prod", {id: this.state.condition_patients_id})}}>Get patients of condition at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.linkPatientCondition(baseurl + "patient_condition/prod", {condition_id: this.state.condition_patients_id, patient_id: this.state.patient_conditions_id})}}>Link patient and health condition at: {baseurl}</button>
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
