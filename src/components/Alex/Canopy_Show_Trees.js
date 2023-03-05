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

class Canopy_Show_Trees extends Component {
	// form methods
	constructor(props) {
		super(props);
		this.state = {
		  owner: "new@gmail.com",
		  owned_trees: {
				ids: [],
				names: [],
				owners: []
			}
		};
		
		this.getTree(baseurl + "tree/prod", {owner: this.state.owner})
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
		.then(response => {
			// alert(JSON.stringify(response.data));
			this.setState({
				owned_trees: response.data
			});
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

	// function for generating a table from the JSON response
	generateTable = (response) => {
		let table = []
		let rows = []
		
		// Outer loop to create rows (one row for each id + 1 for the headers)
		for (let i = -1; i < response.ids.length; i++) {
			let columns = []

			// Inner loop to create columns (one column for each unique key in the table)
			for (let j = 0; j <= Object.keys(response).length; j++) {
				// if we're on the first row (headers)
				if(i == -1) {
					// we're not on the last column (button column)
					if(j < Object.keys(response).length) {
						columns.push(<td>{Object.keys(response)[j]}</td>)
					}
					else {
						columns.push(<td></td>)
					}
				}
				else {
					// we're not on the last column (button column)
					if(j < Object.keys(response).length) {
						columns.push(<td>{response[Object.keys(response)[j]][i]}</td>)
					}
					else {
						columns.push(<td>
										<Link to='/canopy/canopy_edit_tree/' 
										state={{ id: response[Object.keys(response)[0]][i] }}>
													<button> Edit </button>
										</Link>
									</td>)
					}
				}
			}

			// Create the parent and add the children
			rows.push(<tr>{columns}</tr>)
		}

		table.push(<tbody>{rows}</tbody>)

		return table
	}

	render() {
		console.log(this.state)
		
		return (
			<div className="App">
				<header className="App-header-primary">
					<h1>Trees Owned by: {this.state.owner}</h1>
				</header>

				<p>Owned Trees:</p>

				<table border="1">
					{this.generateTable(this.state.owned_trees)}
				</table>

				<div>
					<Link to="/canopy">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Canopy_Show_Trees;
