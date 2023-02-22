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
		var test_tree_params = {
			// id: 1,
			// name: "new_tree",
			// owner: "new@gmail.com",
			// new_name: "replaced_tree",
			// new_owner: "replaced@gmail.com"
		}

		var test_tree_patient_params = {
			tree_id: 1,
			patient_id: 1
		}
		
		return (
			<div className="App">
				<header className="App-header-primary">
					<h1>Edit Tree Details</h1>
				</header>
				<div>
					<div>
						<p>edit tree details here</p>
					</div>

					<div>
						<button onClick={() => {this.postTree(baseurl + "tree/prod", test_tree_params)}}>POST tree at: {baseurl}</button>
					</div>	

					<div>
						<button onClick={() => {this.putTree(baseurl + "tree/prod", test_tree_params)}}>PUT tree at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.deleteTree(baseurl + "tree/prod", test_tree_params)}}>DELETE tree at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.getTreeNodes(baseurl + "tree_nodes/prod", test_tree_params)}}>Get nodes of tree at: {baseurl}</button>
					</div>

					<div>
						<button onClick={() => {this.linkTreePatient(baseurl + "tree_patient/prod", test_tree_patient_params)}}>Link tree and patient at: {baseurl}</button>
					</div>

					<Link to="/home">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Canopy_Edit_Tree;
