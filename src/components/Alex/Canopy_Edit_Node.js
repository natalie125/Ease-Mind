import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

import "../App/App.css";

var baseurl = "http://localhost:5000/canopy/";
	if(window.location.href.includes("localhost")) {
		baseurl = "http://localhost:5000/canopy/";
	}
	else {
		baseurl = "https://d23bykmxle9vsv.cloudfront.net/";
	}

// create a new patient
function postPatient(url_input, patient_data) {
	axios.post(url_input, null, {params: patient_data})
	.then(function (response) {
		alert(response.data)
	})
	.catch(function (error) {
		alert(error);
	}) 
}

// update information in the patient table
function putPatient(url_input, patient_data) {
	axios.put(url_input, null, {params: patient_data})
	.then(function (response) {
		alert(response.data)
	})
	.catch(function (error) {
		alert(error);
	}) 
}

// delete a patient record
function deletePatient(url_input, patient_data) {
	axios.delete(url_input, {params: patient_data})
	.then(function (response) {
		alert(response.data)
	})
	.catch(function (error) {
		alert(error);
	}) 
}

// get trees of a patient
function getPatientTrees(url_input, patient_data) {
	axios.get(url_input, {params: patient_data})
	.then(function (response) {
		alert(JSON.stringify(response.data))
	})
	.catch(function (error) {
		alert(error);
	}) 
}

// get children of a parent
function getParentChildren(url_input, parent_data) {
	axios.get(url_input, {params: parent_data})
	.then(function (response) {
		alert(JSON.stringify(response.data))
	})
	.catch(function (error) {
		alert(error);
	}) 
}

// get parents of a child
function getChildParents(url_input, child_data) {
	axios.get(url_input, {params: child_data})
	.then(function (response) {
		alert(JSON.stringify(response.data))
	})
	.catch(function (error) {
		alert(error);
	}) 
}

// get health conditions of a patient
function getPatientConditions(url_input, patient_data) {
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
function linkTreePatient(url_input, tree_patient_data) {
	axios.put(url_input, null, {params: tree_patient_data})
	.then(function (response) {
		alert(response.data)
	})
	.catch(function (error) {
		alert(error);
	}) 
}

// link parent patient with child patient
function linkParentChild(url_input, parent_child_data) {
	axios.put(url_input, null, {params: parent_child_data})
	.then(function (response) {
		alert(response.data)
	})
	.catch(function (error) {
		alert(error);
	}) 
}

// link patient with health condition
function linkPatientCondition(url_input, patient_condition_data) {
	axios.put(url_input, null, {params: patient_condition_data})
	.then(function (response) {
		alert(response.data)
	})
	.catch(function (error) {
		alert(error);
	}) 
}

function Canopy_Edit_Node(props) {

	const location = useLocation();

	// state definitions
	const [id, setID] = useState(location.state?.id);
	const [name, setName] = useState("Patient's Name");
	const [dob, setDOB] = useState("YYYY-MM-DD");
	const [ethnicity, setEthnicity] = useState("Patient's Ethnicity");
	const [new_name, setNewName] = useState("Patient's New Name");
	const [new_dob, setNewDOB] = useState("YYYY-MM-DD");
	const [new_ethnicity, setNewEthnicity] = useState("Patient's New Ethnicity");
	const [tree_nodes_id, setTreeNodesID] = useState(1);
	const [patient_node_of_id, setPatientNodeOfID] = useState(1);
	const [parent_id, setParentID] = useState(1);
	const [child_id, setChildID] = useState(2);
	const [patient_conditions_id, setPatientsConditionsID] = useState(1);
	const [condition_patients_id, setConditionPatientsID] = useState(1);
	const [json_data, setJSONData] = useState({});

	// get data from the patient table
	const getPatient = async (url_input, patient_data) => {
		const {data} = await axios.get(url_input, {params: patient_data});
		// alert(JSON.stringify(data));
		setJSONData(data);
		setName(data.names[0])
		setDOB(data.dobs[0])
		setEthnicity(data.ethnicities[0])
	}

	useEffect(() => {
		getPatient(baseurl + "patient/prod", { id:location.state?.id });
	}, []);
	
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
						Patient ID to check trees of:
						<input
						name="patient_node_of_id"
						type="number"
						value={patient_node_of_id}
						onChange={e => setPatientNodeOfID(e.target.value)} />
					</label>
					<br /><br />

					<label>
						Parent's ID to link or read children of:
						<input
						name="parent_id"
						type="number"
						value={parent_id}
						onChange={e => setParentID(e.target.value)} />
					</label>
					<br />
					<label>
						Child's ID to link or read parents of:
						<input
						name="child_id"
						type="number"
						value={child_id}
						onChange={e => setChildID(e.target.value)} />
					</label>
					<br /><br />
					
					<label>
						Patient ID to check conditions of:
						<input
						name="patient_conditions_id"
						type="number"
						value={patient_conditions_id}
						onChange={e => setPatientsConditionsID(e.target.value)} />
					</label>
					<br />
					<label>
						Condition ID to link to:
						<input
						name="condition_patients_id"
						type="number"
						value={condition_patients_id}
						onChange={e => setConditionPatientsID(e.target.value)} />
					</label>
					<br /><br />
				</form>

				<div>
					<button onClick={() => {postPatient(baseurl + "patient/prod", {id: id, name: name, dob: dob, ethnicity: ethnicity})}}>POST patient at: {baseurl}</button>
				</div>

				<div>
					<button onClick={() => {putPatient(baseurl + "patient/prod", {id: id, name: name, dob: dob, ethnicity: ethnicity, new_name: new_name, new_dob: new_dob, new_ethnicity: new_ethnicity})}}>PUT patient at: {baseurl}</button>
				</div>

				<div>
					<button onClick={() => {deletePatient(baseurl + "patient/prod", {id: id, name: name, dob: dob, ethnicity: ethnicity})}}>DELETE patient at: {baseurl}</button>
				</div>

				<div>
					<button onClick={() => {getPatientTrees(baseurl + "patient_trees/prod", {id: patient_node_of_id})}}>Get trees of patient at: {baseurl}</button>
				</div>

				<div>
					<button onClick={() => {getParentChildren(baseurl + "parent_children/prod", {id: parent_id})}}>Get children of parent at: {baseurl}</button>
				</div>

				<div>
					<button onClick={() => {getChildParents(baseurl + "child_parents/prod", {id: child_id})}}>Get parents of child at: {baseurl}</button>
				</div>

				<div>
					<button onClick={() => {getPatientConditions(baseurl + "patient_conditions/prod", {id: patient_conditions_id})}}>Get conditions of patient at: {baseurl}</button>
				</div>

				<div>
					<button onClick={() => {linkParentChild(baseurl + "parent_child/prod", {parent_id: parent_id, child_id: child_id})}}>Link parent and child at: {baseurl}</button>
				</div>

				<div>
					<button onClick={() => {linkPatientCondition(baseurl + "patient_condition/prod", {patient_id: patient_conditions_id, condition_id: condition_patients_id})}}>Link patient and health condition at: {baseurl}</button>
				</div>

				<Link to="/canopy">
					<button> Back </button>
				</Link>
			</div>
		</div>
	);
}

export default Canopy_Edit_Node;
