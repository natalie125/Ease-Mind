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

// methods for updating data in the Flask app
// update information in the tree table
function putTree(url_input, tree_data) {
	axios.put(url_input, null, {params: tree_data})
	.then(function (response) {
		alert(response.data)
	})
	.catch(function (error) {
		alert(error);
	}) 
}

// methods for deleting data in the Flask app
// delete a tree record
function deleteTree(url_input, tree_data) {
	axios.delete(url_input, {params: tree_data})
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
	const [name, setName] = useState("Tree's Name");
	const [owner, setOwner] = useState("Tree's Owner");
	const [new_name, setNewName] = useState("Tree's New Name");
	const [json_data, setJSONData] = useState({});
	const [owned_nodes, setOwnedNodes] = useState({ids:[], names:[], dobs:[], ethnicities:[], conditions:[]});

	// get data from the tree table
	const getTree = async (url_input, tree_data) => {
		const {data} = await axios.get(url_input, {params: tree_data});
		// alert(JSON.stringify(data));
		setJSONData(data);
		setName(data.names[0]);
		setOwner(data.owners[0]);
	}

	// get data of the tree's nodes
	const getTreeNodes = async (url_input, tree_data) => {
		const {data} = await axios.get(url_input, {params: tree_data});
		// alert(JSON.stringify(data));
		setOwnedNodes(data);
	}

	// get data of a patient's condition
	// get health conditions of a patient
	const getPatientConditions = async (url_input, patient_data) => {
		const {data} = await axios.get(url_input, {params: patient_data});
		// alert(JSON.stringify(data));
		return data;
	}

	useEffect(() => {
		getTree(baseurl + "tree/prod", { id:location.state?.id });
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
						Owner: { owner }
					</h3>
					<br /><br />
				</form>

				<div>
					<button onClick={() => {putTree(baseurl + "tree/prod", {id: id, name: name, owner: owner, new_name: new_name})}}>PUT tree at: {baseurl}</button>
				</div>

				<div>
					<button onClick={() => {deleteTree(baseurl + "tree/prod", {id: id, name: name, owner: owner})}}>DELETE tree at: {baseurl}</button>
				</div>

				<Link to="/canopy">
					<button> Back </button>
				</Link>
			</div>
		</div>
	);
}

export default Canopy_Edit_Node;
