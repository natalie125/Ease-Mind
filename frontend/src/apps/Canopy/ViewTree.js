import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

class ViewTree extends Component {
	// form methods
	constructor(props) {
		super(props);
		this.state = {
		  tree_id: 1,
		  name: "tree name",
		  owner: "owner's email"
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
			alert(JSON.stringify(response.data));
			return response.data;
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
	
	render() {
		return (
			<div className="App">
				<header className="App-header-primary">
					<h1>View Tree Details</h1>
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
					</form>

					<div>
						<button onClick={() => {this.getTree(BASEURL + "canopy/tree/prod", {id: this.state.tree_id, name: this.state.name, owner: this.state.owner})}}>GET tree at: {BASEURL}</button>
					</div>

					<Link to="/canopy">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default ViewTree;
