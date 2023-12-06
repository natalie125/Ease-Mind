import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

class ViewPatient extends Component {
	// form methods
	constructor(props) {
		super(props);
		this.state = {
		  patient_id: 1,
		  name: "patient name",
		  dob: "YYYY-MM-DD",
		  ethnicity: "patient ethnicity"
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
	
	render() {
		return (
			<div className="App">
				<header className="App-header-primary">
					<h1>View Patient</h1>
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
					</form>

					<div>
						<button onClick={() => {this.getPatient(BASEURL + "canopy/patient/prod", {id: this.state.patient_id, name: this.state.name, dob: this.state.dob, ethnicity: this.state.ethnicity})}}>GET patient at: {BASEURL}</button>
					</div>

					<Link to="/canopy">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default ViewPatient;
