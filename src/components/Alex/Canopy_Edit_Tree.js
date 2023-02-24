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

class Canopy_Edit_Tree extends Component {
	// form methods
	constructor(props) {
		super(props);
		this.state = {
		  tree_id: 1,
		  name: "tree's name",
		  owner: "owner's email",
		  new_name: "new tree name",
		  new_owner: "new owner's email",
		  tree_nodes_id: 1,
		  patient_node_of_id: 1
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

	// methods for receiving data from the Flask app
	// get data from the tree table
	getTree = (url_input, tree_data) => {
		axios.get(url_input, {params: tree_data})
		.then(function (response) {
			alert(JSON.stringify(response.data))
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

	// methods for getting the relationships between entities, starting from their id
	// get nodes of a tree
	getTreeNodes = (url_input, tree_data) => {
		axios.get(url_input, {params: tree_data})
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

	render() {
		return (
			<div className="App">
				<header className="App-header-primary">
					<h1>Edit Tree Details</h1>
				</header>
				<div>
					<form>
						<label>
							Tree ID:
							<input
							name="tree_id"
							type="number"
							value={this.state.tree_id}
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
							Owner:
							<input
							name="owner"
							type="text"
							value={this.state.owner}
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
							New Owner:
							<input
							name="new_owner"
							type="text"
							value={this.state.new_owner}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							Tree ID to check nodes / link with:
							<input
							name="tree_nodes_id"
							type="number"
							value={this.state.tree_nodes_id}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							Link with this Patient ID:
							<input
							name="patient_node_of_id"
							type="number"
							value={this.state.patient_node_of_id}
							onChange={this.handleInputChange} />
						</label>
					</form>

					<div>
						<button onClick={() => {this.postTree(baseurl + "tree/prod", {id: this.state.tree_id, name: this.state.name, owner: this.state.owner})}}>POST tree at: {baseurl}</button>
					</div>	

					<div>
						<button onClick={() => {this.putTree(baseurl + "tree/prod", {id: this.state.tree_id, name: this.state.name, owner: this.state.owner, new_name: this.state.new_name, new_owner: this.state.new_owner})}}>PUT tree at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.deleteTree(baseurl + "tree/prod", {id: this.state.tree_id, name: this.state.name, owner: this.state.owner})}}>DELETE tree at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.getTreeNodes(baseurl + "tree_nodes/prod", {id: this.state.tree_nodes_id})}}>Get nodes of tree at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.linkTreePatient(baseurl + "tree_patient/prod", {tree_id: this.state.tree_nodes_id, patient_id: this.state.patient_node_of_id})}}>Link tree and patient at: {baseurl}</button>
					</div>

					<Link to="/canopy">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Canopy_Edit_Tree;
