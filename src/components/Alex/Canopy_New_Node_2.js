import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import "../App/App.css";
import Dropdown from "./Dropdown";
import "./Canopy.css"

var baseurl = "http://localhost:5000/canopy/";
	if(window.location.href.includes("localhost")) {
		baseurl = "http://localhost:5000/canopy/";
	}
	else {
		baseurl = "https://d23bykmxle9vsv.cloudfront.net/";
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

function Canopy_New_Node_2(props) {
	const navigate = useNavigate();
	const location = useLocation();

	// state definitions
	const [id, setID] = useState();
	const [name, setName] = useState(location.state?.name);
	const [dob, setDOB] = useState(location.state?.dob);
	const [ethnicity, setEthnicity] = useState(location.state?.ethnicity);
	const [json_data, setJSONData] = useState({});
	const [patients, setPatients] = useState([]);
	const [potential_parents, setPotentialParents] = useState([]);
	const [selected_parents, setSelectedParents] = useState([]);
	const [potential_children, setPotentialChildren] = useState([]);
	const [selected_children, setSelectedChildren] = useState([]);
	const [selected_conditions, setSelectedConditions] = useState(location.state?.selected_conditions);

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

	// create a new patient with name, dob, ethnicity, parents, children, and conditions
	const postPatient = async (url_input, patient_data) => {
		const post_response = await axios.post(url_input, null, {params: patient_data});	// should return the patient's ID
		const new_patient_id = post_response.data;
		linkPatientCondition(baseurl + "patient_condition/prod", {patient_id: new_patient_id, condition_id: "", conditions: selected_conditions, clear_conditions: true});
		linkParentChild(baseurl + "parent_child/prod", {patient_id: new_patient_id, parent_id: "", child_id: "", parents: selected_parents, children: selected_children, clear_parents: true, clear_children: true});
	}

	useEffect(() => {
		getTreePatients(baseurl + "tree_nodes/prod", { id: location.state?.tree_id });
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
					<br /><br />

					<label>
						DOB: {dob}
					</label>
					<br /><br />

					<label>
						Ethnicity: {ethnicity}
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
				</form>

				<div>
					<button onClick={() => {
						postPatient(baseurl + "patient/prod", {name: name, dob: dob, ethnicity: ethnicity, tree_id: location.state?.tree_id })
						alert("New Patient: " + name + " Added!")
						navigate(-2);
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

export default Canopy_New_Node_2;
