import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

function ShowTrees(props) {
	const navigate = useNavigate();
	const location = useLocation();
	const user_email = sessionStorage.getItem("email").substring(1, sessionStorage.getItem("email").length - 1);

	const [owner, setOwner] = useState(user_email);
	const [owned_trees, setOwnedTrees] = useState({
													ids: [],
													names: [],
													owners:[]
												});

	// methods for receiving data from the Flask app
	// get data from the tree table
	const getTree = async (url_input, tree_data) => {
		// check if email is admin@gmail.com, if so pull ALL TREES
		let data = {
			ids: [],
			names: [],
			owners:[]
		};
		if (user_email == "admin@gmail.com") {
			data = await axios.get(url_input, {params: {}});
		}
		else {
			data = await axios.get(url_input, {params: tree_data});
		}
		setOwnedTrees(data.data);
	}

	// function for generating a table from the JSON response
	const generateTable = (response) => {
		let table = []
		let rows = []
		
		if(response.ids == undefined) {
			return;
		}
		// Outer loop to create rows (one row for each id + 1 for the headers)
		for (let i = -1; i < response.ids.length; i++) {
			let columns = []

			// Inner loop to create columns (one column for each unique key in the table)
			for (let j = -1; j <= Object.keys(response).length; j++) {
				// if we're on the first row (headers)
				if(i == -1) {
					if(j == -1) {
						// we're on the first column
						columns.push(<td>{"IDs"}</td>)
					}
					else if(j < Object.keys(response).length) {
						if(Object.keys(response)[j] != "ids") {
							columns.push(<td>{Object.keys(response)[j]}</td>)
						}
					}
					else {
						// on the last column, empty cell
						columns.push(<td></td>)
					}
				}
				else {
					if(j == -1) {
						// we're on the first column
						columns.push(<td>{response.ids[i]}</td>)
					}
					else if(j < Object.keys(response).length) {
						// we're not on the first or last column
						if(Object.keys(response)[j] != "ids") {
							columns.push(<td>{response[Object.keys(response)[j]][i]}</td>)
						}
					}
					else {
						columns.push(<td>
										<Link to='/canopy/canopy_edit_tree/' 
										state={{ id: response.ids[i] }}>
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

	useEffect(() => {
		getTree(BASEURL + "canopy/tree/prod", {owner: owner})
	}, []);

	return (
		<div className="App">
			<header className="App-header-primary">
				<h1>Trees Owned by: {owner}</h1>
			</header>

			<p>Owned Trees:</p>

			<div>
				<table border="1" className="canopy-table">
					{generateTable(owned_trees)}
				</table>
			</div>

			<br/>

			<div>
				<button onClick={() => {
					navigate('/canopy/canopy_new_tree');
				}}> 
					Add New Tree
				</button>
			</div>

			<br/>

			<div>
				<button onClick={() => {
					navigate('/canopy/');
				}}> 
					Back 
				</button>
			</div>
		</div>
	);
}

export default ShowTrees;
