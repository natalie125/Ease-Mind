import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Dropdown from "./Dropdown";
import "./Canopy.css"

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

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

// link patient with spouses
function linkPatientSpouse(url_input, patient_spouse_data) {
	axios.put(url_input, JSON.stringify(patient_spouse_data), {headers: {'Content-Type': 'application/json'}})
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

function NewNode2(props) {
	const navigate = useNavigate();
	const location = useLocation();

	// state definitions
	const [id, setID] = useState();
	const [name, setName] = useState(location.state?.name);
	const [dob, setDOB] = useState(location.state?.dob);
	const [dod, setDOD] = useState(location.state?.dod);
	const [gender, setGender] = useState(location.state?.gender);
	const [ethnicity, setEthnicity] = useState(location.state?.ethnicity);
	const [json_data, setJSONData] = useState({});
	const [patients, setPatients] = useState([]);
	const [potential_parents, setPotentialParents] = useState([]);
	const [selected_parents, setSelectedParents] = useState([]);
	const [potential_children, setPotentialChildren] = useState([]);
	const [selected_children, setSelectedChildren] = useState([]);
	const [potential_spouses, setPotentialSpouses] = useState([]);
	const [selected_spouses, setSelectedSpouses] = useState([]);
	const [selected_conditions, setSelectedConditions] = useState(location.state?.selected_conditions);
	const [only_node, setOnlyNode] = useState(true);

	// convert YYYY-MM-DD to int
	const convertDateToInt = (date_string) => {
		// younger is when the date is smaller
		let year = date_string.substring(0, 4);
		let month = date_string.substring(5, 7);
		let days = date_string.substring(8, 10);
		return parseInt(year + month + days);
	}

	// get data of all patients of this tree
	const getTreePatients = async (url_input, tree_data) => {
		const {data} = await axios.get(url_input, {params: tree_data});
		// alert(JSON.stringify(data));
		setPatients(data);
		// create potential parents and children
		const new_potential_parents = [];
		const new_potential_children = [];
		const new_potential_spouses = [];
		// create NaN value for parent
		for(let i = 0; i < data.ids.length; i++) {
			// run the loop for every single node returned
			// if even one node is returned, the node being added isn't the sole node of the tree
			// thus we need to change the value of only_node
			setOnlyNode(false);
			const patient_entry = {id: data.ids[i], label: data.names[i]};
			// check if the DOB is less than the DOB of the current patient
			if(convertDateToInt(data.dobs[i]) < convertDateToInt(dob)) {
				new_potential_parents.push(patient_entry);
				new_potential_spouses.push(patient_entry);
			}
			// else it would make them a child
			else if(convertDateToInt(data.dobs[i]) > convertDateToInt(dob)){
				new_potential_children.push(patient_entry);
				new_potential_spouses.push(patient_entry);
			}
			// might have the exact same birthdate, check that it's not the patient themselves
			else if(data.names[i] != name) {
				new_potential_spouses.push(patient_entry);
			}
		}
		setPotentialParents(new_potential_parents);
		setPotentialChildren(new_potential_children);
		setPotentialSpouses(new_potential_spouses);
	}

	// create a new patient with name, dob, ethnicity, parents, children, and conditions
	const postPatient = async (url_input, patient_data) => {
		const post_response = await axios.post(url_input, null, {params: patient_data});	// should return the patient's ID
		const new_patient_id = post_response.data;
		console.log(new_patient_id);
		linkPatientCondition(BASEURL + "canopy/patient_condition/prod", {patient_id: new_patient_id, condition_id: "", conditions: selected_conditions, clear_conditions: true});
		linkParentChild(BASEURL + "canopy/parent_child/prod", {patient_id: new_patient_id, parent_id: "", child_id: "", parents: selected_parents, children: selected_children, clear_parents: true, clear_children: true});
		linkPatientSpouse(BASEURL + "canopy/patient_spouse/prod", {patient_id: new_patient_id, spouse_id: "", spouse_of_id: "", spouses: selected_spouses, spouse_of: [], clear_spouses: true, clear_spouse_of: true});
	}

	// check the validity of the node based on its selected relationships
	const checkRelationshipValidity = () => {
		// check for an unconnected node in a tree with multiple nodes already
		// check if the node is not the only one in the tree (i.e there are other nodes in the tree)
		console.log("only_node is: " + only_node);
		if(!only_node) {
			// if there are other nodes, fail the node if there are no connections being made to the tree
			if(selected_children.length + selected_parents.length + selected_spouses.length == 0) {
				alert("Adding a node to the tree with no connections!");
				return false;
			}
		}

		// check if there's a spousal relationship with the node's selected parents or children
		// note: because the parents and children dropdowns are populated mutually exclusively it's implicitly impossible so no need to check
		console.log("selected_spouses:");
		console.log(selected_spouses);
		console.log("selected_parents:");
		console.log(selected_parents);
		console.log("selected_children:");
		console.log(selected_children);
		for(let i = 0; i < selected_spouses.length; i++) {
			// for each of the selected spouses check if it is also contained in the selected parents or children of this node
			// check children first
			for(let j = 0; j < selected_children.length; j++) {
				if(selected_spouses[i].label == selected_children[j].label) {
					alert("Spouses contain a node that is also being added to children!");
					return false;
				}
			}

			// check parents next
			for(let k = 0; k < selected_parents.length; k++) {
				if(selected_spouses[i].label == selected_parents[k].label) {
					alert("Spouses contain a node that is also being added to parents!");
					return false;
				}
			}
		}

		return true;
	}

	useEffect(() => {
		getTreePatients(BASEURL + "canopy/tree_nodes/prod", { id: location.state?.tree_id });
	}, [dob]);
	
	return (
		<div className="App">
			<header className="App-header-primary">
				<h1>Add New Patient to Tree ID { location.state?.tree_id }</h1>
			</header>
			<div>
				<form>
					<label>
						Name: {name}
					</label>
					<br />

					<label>
						DOB: {dob}
					</label>
					<br />

					<label>
						DOD: {dod}
					</label>
					<br />

					<label>
						Gender: {gender}
					</label>
					<br />

					<label>
						Ethnicity: {ethnicity}
					</label>
					<br />

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
					<br />

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
					<br />

					<label>
						Spouses:
					</label>
					<div>
						<Dropdown
							isSearchable
							isMulti
							placeHolder="Select..."
							initialValues={selected_spouses}
							options={potential_spouses}
							onChange={(value) => { setSelectedSpouses(value) }}
						/>
					</div>
				</form>

				<div>
					<button onClick={ async () => {
						let validity = checkRelationshipValidity();
						console.log("validity: " + validity);
						if(validity) {
							postPatient(BASEURL + "canopy/patient/prod", {name: name, dob: dob, dod: dod, gender: gender, ethnicity: ethnicity, tree_id: location.state?.tree_id });
							alert("New Patient: " + name + " Added!");
							navigate(-2);
						}
					}}>
						Add New Patient to Tree { location.state?.tree_id }
					</button>
				</div>

				<br />

				<div>
					<Link to='/canopy/canopy_new_node/' 
						state={{ tree_id: location.state?.tree_id, name: name, dob: dob, ethnicity: ethnicity, selected_conditions: selected_conditions }}>
						<button> 
							Back 
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default NewNode2;
