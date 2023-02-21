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

class Canopy_View_Tree extends Component {
	// methods for receiving data from the Flask app
	// get data from the tree table
	getTree = (url_input, tree_data) => {
		axios.get(url_input, {params: tree_data})
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
			alert(response.data)
		})
		.catch(function (error) {
			alert(error);
		}) 
	}
	
	render() {
		var test_tree_params = {
			id: 1,
			name: "test_tree",
			owner: "test@gmail.com",
			new_name: "replaced_tree",
			new_owner: "replaced@gmail.com"
		}

		var test_tree_patient_params = {
			tree_id: 1,
			patient_id: 1
		}

		return (
			<div className="App">
				<header className="App-header-primary">
					<h1>View Tree Details</h1>
				</header>
				<div>
					<div>
						<p>tree details appear here</p>
					</div>

					<div>
						<button onClick={() => {this.getTree(baseurl + "tree/prod", test_tree_params)}}>GET tree at: {baseurl}</button>
					</div>	

					<Link to="/home">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Canopy_View_Tree;
