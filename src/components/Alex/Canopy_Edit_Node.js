import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import "../App/App.css";
import Dropdown from "./Dropdown";

var baseurl = "http://localhost:5000/canopy/";
	if(window.location.href.includes("localhost")) {
		baseurl = "http://localhost:5000/canopy/";
	}
	else {
		baseurl = "https://d23bykmxle9vsv.cloudfront.net/";
	}

// update information in the patient table
function putPatient(url_input, patient_data) {
	axios.put(url_input, null, {params: patient_data})
	.then(function (response) {
		console.log(response.data)
	})
	.catch(function (error) {
		console.log(error)
	}) 
}

// delete a patient record
function deletePatient(url_input, patient_data) {
	axios.delete(url_input, {params: patient_data})
	.then(function (response) {
		console.log(response.data)
	})
	.catch(function (error) {
		console.log(error)
	}) 
}

// link patient with parents and children
function linkParentChild(url_input, parent_child_data) {
	axios.put(url_input, JSON.stringify(parent_child_data), {headers: {'Content-Type': 'application/json'}})
	.then(function (response) {
		console.log(response.data)
	})
	.catch(function (error) {
		console.log(error)
	}) 
}

// link patient with health condition
function linkPatientCondition(url_input, patient_condition_data) {
	axios.put(url_input, JSON.stringify(patient_condition_data), {headers: {'Content-Type': 'application/json'}})
	.then(function (response) {
		console.log(response.data)
	})
	.catch(function (error) {
		console.log(error);
	}) 
}

function Canopy_Edit_Node(props) {
	const navigate = useNavigate();
	const location = useLocation();

	// state definitions
	const [id, setID] = useState(location.state?.id);
	const [name, setName] = useState("Patient's Name");
	const [dob, setDOB] = useState("YYYY-MM-DD");
	const [ethnicity, setEthnicity] = useState("Patient's Ethnicity");
	const [tree_id, setTreeID] = useState(location.state?.tree_id);
	const [new_name, setNewName] = useState("Patient's New Name");
	const [new_dob, setNewDOB] = useState("YYYY-MM-DD");
	const [new_ethnicity, setNewEthnicity] = useState("Patient's New Ethnicity");
	const [json_data, setJSONData] = useState({});
	const [patients, setPatients] = useState([]);
	const [potential_parents, setPotentialParents] = useState([]);
	const [selected_parents, setSelectedParents] = useState([]);
	const [potential_children, setPotentialChildren] = useState([]);
	const [selected_children, setSelectedChildren] = useState([]);
	const [conditions, setConditions] = useState([]);
	const [selected_conditions, setSelectedConditions] = useState([]);

	// convert YYYY-MM-DD to int
	const convertDateToInt = (date_string) => {
		// younger is when the date is smaller
		let year = date_string.substring(0, 4);
		let month = date_string.substring(5, 7);
		let days = date_string.substring(8, 10);
		return parseInt(year + month + days);
	}

	// get data of the specific patient
	const getPatient = async (url_input, patient_data) => {
		const {data} = await axios.get(url_input, {params: patient_data});
		// alert(JSON.stringify(data));
		setJSONData(data);
		setName(data.names[0])
		setDOB(data.dobs[0])
		setEthnicity(data.ethnicities[0])
		// also initialise the text fields
		setNewName(data.names[0])
		setNewDOB(data.dobs[0])
		setNewEthnicity(data.ethnicities[0])
	}

	// get data of all patients of this tree
	const getTreePatients = async (url_input, tree_data) => {
		const {data} = await axios.get(url_input, {params: tree_data});
		// alert(JSON.stringify(data));
		setPatients(data);
		// create potential parents and children
		const new_potential_parents = [];
		const new_potential_children = [];
		// create NaN value for parent
		for(let i = 0; i < data.ids.length; i++) {
			// run the loop for every single node returned
			const patient_entry = {id: data.ids[i], label: data.names[i]};
			// check if the DOB is less than the DOB of the current patient
			if(convertDateToInt(data.dobs[i]) < convertDateToInt(dob)) {
				new_potential_parents.push(patient_entry);
			}
			// else it would make them a child
			else if(convertDateToInt(data.dobs[i]) > convertDateToInt(dob)){
				new_potential_children.push(patient_entry);
			}
		}
		setPotentialParents(new_potential_parents);
		setPotentialChildren(new_potential_children);
	}

	// get the initial parents of the patient
	const getPatientParents = async (url_input, patient_data) => {
		const {data} = await axios.get(url_input, {params: patient_data})
		// alert(JSON.stringify(data));
		const initial_parents = [];
		for(let i = 0; i < data.ids.length; i++) {
			// run the loop once for every id in the ids array
			const parent_entry = {id: data.ids[i], label: data.names[i]};
			initial_parents.push(parent_entry);
		}
		setSelectedParents(initial_parents);
	}

	// get the initial children of the patient
	const getPatientChildren = async (url_input, patient_data) => {
		const {data} = await axios.get(url_input, {params: patient_data})
		// alert(JSON.stringify(data));
		const initial_children = [];
		for(let i = 0; i < data.ids.length; i++) {
			// run the loop once for every id in the ids array
			const child_entry = {id: data.ids[i], label: data.names[i]};
			initial_children.push(child_entry);
		}
		setSelectedChildren(initial_children);
	}

	// get all conditions from the health condition table
	const getCondition = async (url_input, condition_data) => {
		const {data} = await axios.get(url_input, {params: condition_data});
		// alert(JSON.stringify(data));
		const new_conditions = [];
		for(let i = 0; i < data.ids.length; i++) {
			// run the loop once for every id in the ids array
			const condition_entry = {id: data.ids[i], label: data.names[i]};
			new_conditions.push(condition_entry);
		}
		setConditions(new_conditions);
	}

	// get health conditions of a patient
	const getPatientConditions = async (url_input, patient_data) => {
		const {data} = await axios.get(url_input, {params: patient_data})
		// alert(JSON.stringify(data));
		const initial_conditions = [];
		for(let i = 0; i < data.ids.length; i++) {
			// run the loop once for every id in the ids array
			const condition_entry = {id: data.ids[i], label: data.names[i]};
			initial_conditions.push(condition_entry);
		}
		setSelectedConditions(initial_conditions);
	}

	useEffect(() => {
		getPatient(baseurl + "patient/prod", { id: location.state?.id });
		getTreePatients(baseurl + "tree_nodes/prod", { id: location.state?.tree_id });
		getCondition(baseurl + "condition/prod", {});
		getPatientConditions(baseurl + "patient_conditions/prod", { id: location.state?.id });
		getPatientParents(baseurl + "child_parents/prod", { id: location.state?.id });
		getPatientChildren(baseurl + "parent_children/prod", { id: location.state?.id });
	}, [dob]);
	// array at the end are state variables that these async methods change and NEED TO BE RERENDERED FOR when they eventually complete
	
	return (
		<div className="App">
			<header className="App-header-primary">
				<h1>Edit Patient Information</h1>
			</header>
			<div>
				<form>
					<h3>
						Patient ID: { id }
					</h3>
					<br />
					
					<h3>
						Name: { name }
					</h3>
					<label>
						New Name:
						<input
						name="new_name"
						type="text"
						value={new_name}
						onChange={e => setNewName(e.target.value)} />
					</label>
					<br /><br />

					<h3>
						Date Of Birth: { dob }
					</h3>
					<label>
						New DOB:
						<input
						name="new_dob"
						type="text"
						value={new_dob}
						onChange={e => setNewDOB(e.target.value)} />
					</label>
					<br /><br />

					<h3>
						Ethnicity: { ethnicity }
					</h3>
					<label>
						New Ethnicity:
						<input
						name="new_ethnicity"
						type="text"
						value={new_ethnicity}
						onChange={e => setNewEthnicity(e.target.value)} />
					</label>
					<br /><br />

					<label>
						Parents:
					</label>
					<div>
						<Dropdown
							isSearchable
							isMulti
							placeHolder="Select..."
							initialValues={selected_parents}
							options={potential_parents}
							onChange={(value) => { setSelectedParents(value) }}
						/>
					</div>
					<br /><br />

					<label>
						Children:
					</label>
					<div>
						<Dropdown
							isSearchable
							isMulti
							placeHolder="Select..."
							initialValues={selected_children}
							options={potential_children}
							onChange={(value) => { setSelectedChildren(value) }}
						/>
					</div>
					<br /><br />
					
					<label>
						Health Conditions:
					</label>
					<div>
						<Dropdown
							isSearchable
							isMulti
							placeHolder="Select..."
							initialValues={selected_conditions}
							options={conditions}
							onChange={(value) => { setSelectedConditions(value) }}
						/>
					</div>
					<br /><br />
				</form>

				<div>
					<button onClick={() => {
						putPatient(baseurl + "patient/prod", {id: id, name: name, dob: dob, ethnicity: ethnicity, new_name: new_name, new_dob: new_dob, new_ethnicity: new_ethnicity})
						linkPatientCondition(baseurl + "patient_condition/prod", {patient_id: id, condition_id: "", conditions: selected_conditions, clear_conditions: true})
						linkParentChild(baseurl + "parent_child/prod", {patient_id: id, parent_id: "", child_id: "", parents: selected_parents, children: selected_children, clear_parents: true, clear_children: true})
						alert("Patient Details Saved!")
					}}>
						Save Patient Details
					</button>
				</div>

				<br />

				<div>
					<button onClick={() => {
						deletePatient(baseurl + "patient/prod", {id: id, name: name, dob: dob, ethnicity: ethnicity})
						alert("Patient Record ID: " + id + " Deleted!")
						navigate(-1);
					}}>
						Delete Patient Record
					</button>
				</div>

				<br />

				<button onClick={() => {
					navigate(-1);
				}}> 
					Back 
				</button>
			</div>
		</div>
	);
}

export default Canopy_Edit_Node;
