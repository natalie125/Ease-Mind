import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Dropdown from "./Dropdown";
import "./Canopy.css"

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

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

function EditNode(props) {
	const navigate = useNavigate();
	const location = useLocation();

	// state definitions
	const [id, setID] = useState(location.state?.id);
	const [name, setName] = useState("Patient's Name");
	const [dob, setDOB] = useState("YYYY-MM-DD");
	const [dod, setDOD] = useState("YYYY-MM-DD");
	const [gender, setGender] = useState("male");
	const [genders, setGenders] = useState([{id: 1, label: "male"}, {id: 2, label: "female"}]);
	const [ethnicity, setEthnicity] = useState("Patient's Ethnicity");
	const [tree_id, setTreeID] = useState(location.state?.tree_id);
	const [new_name, setNewName] = useState("Patient's New Name");
	const [new_dob, setNewDOB] = useState("YYYY-MM-DD");
	const [new_dod, setNewDOD] = useState("YYYY-MM-DD");
	const [new_gender, setNewGender] = useState("male");
	const [new_ethnicity, setNewEthnicity] = useState("Patient's New Ethnicity");
	const [json_data, setJSONData] = useState({});
	const [patients, setPatients] = useState([]);
	const [potential_parents, setPotentialParents] = useState([]);
	const [selected_parents, setSelectedParents] = useState([]);
	const [potential_children, setPotentialChildren] = useState([]);
	const [selected_children, setSelectedChildren] = useState([]);
	const [potential_spouses, setPotentialSpouses] = useState([]);
	const [selected_spouses, setSelectedSpouses] = useState([]);
	const [conditions, setConditions] = useState([]);
	const [selected_conditions, setSelectedConditions] = useState([]);
	const [fh_conditions, setFHConditions] = useState([]);
	const [has_fh_conditions, setHasFHConditions] = useState(false);
	const [only_node, setOnlyNode] = useState(true);

	// convert YYYY-MM-DD to int
	const convertDateToInt = (date_string) => {
		// younger is when the date is smaller
		let year = date_string.substring(0, 4);
		let month = date_string.substring(5, 7);
		let days = date_string.substring(8, 10);
		return parseInt(year + month + days);
	}

	// function to read DOB input boxes, returns true only if it passes the checks
	// expects something like YYYY-MM-DD or YYYY/MM/DD
	const checkDateFormat = (input, input_name) => {
		const current = new Date();
		const date = `${current.getFullYear()}-${('0' + (current.getMonth()+1)).slice(-2)}-${('0' + (current.getDate())).slice(-2)}`;
		// console.log(date);
		if(input_name == "DOD") {
			if(input == undefined) {
				return true;
			}
			if(input.length == 0 || input == "None") {
				return true;
			}
		}
		if(input.length != date.length) {
			// this length check is here to catch cases such as 2000-2-2 or 10-02-02
			alert(input_name + " is the wrong length");
			return false;
		}
		if(input.charAt(4) != '-' && input.charAt(4) != '/') {
			// checks the 5th character for a '-' or '/' character
			alert(input_name + " missing '-' or '/' on 5th character");
			return false;
		}
		if(input.charAt(7) != '-' && input.chartAt(7) != '/') {
			// checks the 8th character for a '-' or '/'
			alert(input_name + " missing '-' or '/' on 8th character");
			return false;
		}
		let year = input.substring(0, 4);
		if(isNaN(year)) {	// if year is NOT a number, pass the if condition and fail the check
			// check if the first 4 characters, which should be the year, is a number
			alert(input_name + " year place isn't a number");
			return false;
		}
		year = parseInt(year);
		if(year <= 0) {
			// 0 and negative check for year
			alert(input_name + " year is 0 or negative");
			return false;
		}
		let month = input.substring(5, 7);
		if(isNaN(month)) {
			// check if the 6th to 7th characters is a number
			alert(input_name + " month place isn't a number");
			return false;
		}
		month = parseInt(month);
		if(month > 12 || month <= 0) {
			// check if the month is greater than 12 (final month is december) or less than 0
			alert(input_name + " month place too large (max 12) or small (min 0)");
			return false;
		}
		let days = input.substring(8, 10);
		if(isNaN(days)) {
			// check if the 9th to 10th characters are numbers
			alert(input_name + " days place isn't a number");
			return false;
		}
		days = parseInt(days);
		if(days <= 0) {
			// 0 and negative check for days
			alert(input_name + " day is 0 or negative");
			return false;
		}
		// complex day checking based on month (and potentially year)
		// months with 31 days
		if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
			if(days > 31) {
				alert(input_name + " day is too large for month with 31 days");
				return false;
			}
		}
		// months with 30 days
		if(month == 4 || month == 6 || month == 9 || month == 11) {
			if(days > 30) {
				alert(input_name + " day is too large for month with 30 days");
				return false;
			}
		}
		// check feb (month == 2) and thus leap years
		if(month == 2) {
			if(days > 29) {
				alert(input_name + " day too large for feb (>29)");
				return false;
			}
			if(days == 29) {	// if the day is very specifically feb 29th, it is only valid on leap years
				if(year % 4 != 0) {
					alert(input_name + " 29th feb but not leap year"); // (% 4 failed)
					return false;
				}
				// % 4 has passed
				if(year % 100 == 0 && year % 400 != 0) {	// specifically on years where % 100 passes but % 400 fails they are no longer leap years
					alert(input_name + " 29th feb but not a leap year"); // (% 100 passed, but % 400 failed)
					return false;
				}
			}
		}
		if(convertDateToInt(date) < convertDateToInt(input)) {	// the current date is smaller than the input
			// the input is greater, and thus in the future
			alert(input_name + " is in the future")
			return false;
		}
		return true;
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

		// finally return true if all passed
		return true;
	}

	// check date validity of node's DOB versus their children and parents
	const checkDOBValidity = () => {

		// convert new_date to int
		let date = convertDateToInt(new_dob);
		console.log("date is: " + date);

		// using the currently entered DOB, check against the DOB of parents and children
		// check all selected children
		console.log("selected_children: ");
		console.log(selected_children);
		for(let i = 0; i < selected_children.length; i++) {
			// the date is more than that of the child being checked
			if(date > convertDateToInt(selected_children[i].dob)) {
				alert("DOB is less than that of selected children!");
				return false;
			}
		}

		// check all selected parents
		console.log("selected_parents: ");
		console.log(selected_parents);
		for(let j = 0; j < selected_parents.length; j++) {
			// the date is less than that of the parent being checked
			if(date < convertDateToInt(selected_parents[j].dob)) {
				alert("DOB is more than that of selected parents!");
				return false;
			}
		}

		// finally return true if all passed
		return true;
	}

	// get data of the specific patient
	const getPatient = async (url_input, patient_data) => {
		const {data} = await axios.get(url_input, {params: patient_data});
		// alert(JSON.stringify(data));
		setJSONData(data);
		setName(data.names[0])
		setDOB(data.dobs[0])
		setDOD(data.dods[0])
		setGender(data.genders[0])
		setEthnicity(data.ethnicities[0])
		// also initialise the text fields
		setNewName(data.names[0])
		setNewDOB(data.dobs[0])
		setNewDOD(data.dods[0])
		setNewGender({id: 1, label: data.genders[0]})
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
		const new_potential_spouses = [];
		for(let i = 0; i < data.ids.length; i++) {
			// run the loop for every single node returned
			// if even one node is returned, the node being added isn't the sole node of the tree
			// thus we need to change the value of only_node
			setOnlyNode(false);
			const patient_entry = {id: data.ids[i], label: data.names[i], dob: data.dobs[i]};
			// console.log("patient entry " + i + " is: ");
			// console.log(patient_entry);
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

	// get the initial parents of the patient
	const getPatientParents = async (url_input, patient_data) => {
		const {data} = await axios.get(url_input, {params: patient_data})
		// alert(JSON.stringify(data));
		const initial_parents = [];
		for(let i = 0; i < data.ids.length; i++) {
			// run the loop once for every id in the ids array
			const parent_entry = {id: data.ids[i], label: data.names[i], dob: data.dobs[i]};
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
			const child_entry = {id: data.ids[i], label: data.names[i], dob: data.dobs[i]};
			initial_children.push(child_entry);
		}
		setSelectedChildren(initial_children);
	}

	// get the initial spouses of the patient
	const getPatientSpouses = async (url_input, patient_data) => {
		const {data} = await axios.get(url_input, {params: patient_data})
		// alert(JSON.stringify(data));
		const initial_spouses = [];
		for(let i = 0; i < data.ids.length; i++) {
			// run the loop once for every id in the ids array
			const spouse_entry = {id: data.ids[i], label: data.names[i], dob: data.dobs[i]};
			initial_spouses.push(spouse_entry);
		}
		setSelectedSpouses(initial_spouses);
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

	// get health conditions of a patient
	const getPatientFHConditions = async (url_input, patient_data) => {
		const {data} = await axios.get(url_input, {params: patient_data});
		// alert(JSON.stringify(data));
		setFHConditions(data);
		if(data.fh_condition_ids.length == 0) {
			setHasFHConditions(false);
		}
		else {
			setHasFHConditions(true);
		}
	}

	// function for generating a table from the JSON response
	// specifically from the fh_conditions of a patient
	const generateTable = (response) => {
		let table = []
		let rows = []
		
		// Outer loop to create rows (one row for each id + 1 for the headers)
		for (let i = -1; i < response.fh_condition_ids.length; i++) {
			let columns = []

			// Inner loop to create columns (one column for each unique key in the table)
			for (let j = 0; j <= Object.keys(response).length; j++) {
				// if we're on the first row (headers)
				if(i == -1) {
					if(j == 0) {
						// we're on the first column
						columns.push(<td>{"Family History Condition IDs"}</td>)
					}
					else if(j == 1) {
						// we're on the first column
						columns.push(<td>{"Family History Condition Names"}</td>)
					}
					else if(j < Object.keys(response).length) {
						if(Object.keys(response)[j] != "fh_condition_ids" && Object.keys(response)[j] != "fh_condition_names") {
							columns.push(<td>{Object.keys(response)[j]}</td>)
						}
					}
				}
				else {
					if(j == 0) {
						// we're on the first column
						columns.push(<td>{response.fh_condition_ids[i]}</td>)
					}
					else if(j == 1) {
						// we're on the first column
						columns.push(<td>{response.fh_condition_names[i]}</td>)
					}
					else if(j < Object.keys(response).length) {
						// we're not on the first or second
						if(Object.keys(response)[j] != "fh_condition_ids" && Object.keys(response)[j] != "fh_condition_names") {
							columns.push(<td>{response[Object.keys(response)[j]][i]}</td>)
						}
					}
				}
			}

			// Create the parent and add the children
			rows.push(<tr>{columns}</tr>)
		}

		table.push(<tbody>{rows}</tbody>)

		return table
	}

	useEffect(() => {
		getPatient(BASEURL + "canopy/patient/prod", { id: location.state?.id });
		getTreePatients(BASEURL + "canopy/tree_nodes/prod", { id: location.state?.tree_id });
		getCondition(BASEURL + "canopy/condition/prod", {});
		getPatientConditions(BASEURL + "canopy/patient_conditions/prod", { id: location.state?.id });
		getPatientFHConditions(BASEURL + "canopy/patient_fh_conditions/prod", { id: location.state?.id });
		getPatientParents(BASEURL + "canopy/child_parents/prod", { id: location.state?.id });
		getPatientChildren(BASEURL + "canopy/parent_children/prod", { id: location.state?.id });
		getPatientSpouses(BASEURL + "canopy/patient_spouses/prod", { id: location.state?.id });
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
						New Name: {}
						<input
						name="new_name"
						type="text"
						value={new_name}
						onChange={e => setNewName(e.target.value)} />
					</label>
					<br />

					<h3>
						Date Of Birth: { dob }
					</h3>
					<label>
						New DOB (Format:YYYY-MM-DD): {}
						<input
						name="new_dob"
						type="text"
						value={new_dob}
						onChange={e => setNewDOB(e.target.value)} />
					</label>
					<br />

					<h3>
						Date Of Death: { dod }
					</h3>
					<label>
						New DOD (Format:YYYY-MM-DD): {} 
						<input
						name="new_dod"
						type="text"
						value={new_dod}
						onChange={e => setNewDOD(e.target.value)} />
					</label>
					<br />

					<h3>
						Gender: { gender }
					</h3>
					<label>
						New Gender:
					</label>
					<Dropdown
						placeHolder="Select..."
						initialValues={new_gender}
						options={genders}
						onChange={(value) => { setNewGender(value) }}
					/>
					<br />

					<h3>
						Ethnicity: { ethnicity }
					</h3>
					<label>
						New Ethnicity: {}
						<input
						name="new_ethnicity"
						type="text"
						value={new_ethnicity}
						onChange={e => setNewEthnicity(e.target.value)} />
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
					<br />
					
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
					<br />
				</form>

				<div>
					{has_fh_conditions && (
						<>
							<label>
								Family History Conditions:
							</label>
							<div>
								<table border="1" className="canopy-table">
									{generateTable(fh_conditions)}
								</table>
							</div>
						</>
					)}

					<button onClick={() => {
						let validity = checkDateFormat(new_dob, "DOB") && checkDateFormat(new_dod, "DOD") && checkRelationshipValidity() && checkDOBValidity();
						// dates are valid
						if(validity) {
							// dod is blank, don't check
							if(new_dod == undefined || new_dod == "None") {
							
							} else if(convertDateToInt(new_dob) > convertDateToInt(new_dod)) {
								// dod is not blank, check it's not behind the DOB
								alert("New DOB should be before the New DOD of the patient");
								validity = false;
							}
						}
						console.log("validity after DOB, DOD check and relationship check: " + validity);
						if(validity) {
							putPatient(BASEURL + "canopy/patient/prod", {id: id, name: name, dob: dob, dod: dod, gender: gender, ethnicity: ethnicity, new_name: new_name, new_dob: new_dob, new_dod: new_dod, new_gender: new_gender.label, new_ethnicity: new_ethnicity})
							linkPatientCondition(BASEURL + "canopy/patient_condition/prod", {patient_id: id, condition_id: "", conditions: selected_conditions, clear_conditions: true})
							linkParentChild(BASEURL + "canopy/parent_child/prod", {patient_id: id, parent_id: "", child_id: "", parents: selected_parents, children: selected_children, clear_parents: true, clear_children: true})
							linkPatientSpouse(BASEURL + "canopy/patient_spouse/prod", {patient_id: id, spouse_id: "", spouse_of_id: "", spouses: selected_spouses, spouse_of: [], clear_spouses: true, clear_spouse_of: true})
							alert("Patient Details Saved!")
							navigate(0)
						}
					}}>
						Save Patient Details
					</button>
				</div>

				<br />

				<div>
					<button onClick={() => {
						deletePatient(BASEURL + "canopy/patient/prod", {id: id, name: name, dob: dob, dod: dod, gender: gender, ethnicity: ethnicity})
						alert("Patient Record ID: " + id + " Deleted!")
						navigate('/canopy/canopy_edit_trees/');
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

export default EditNode;
