import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import "./Canopy.css"

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

function ShowConditions(props) {
	const navigate = useNavigate();
	const location = useLocation();

	const [conditions, setConditions] = useState({
													ids: [],
													names: [],
													'hereditary?':[],
													male_parents: [],
													female_parents: [],
													male_grandparents: [],
													female_grandparents: []
												});

	// methods for receiving data from the Flask app
	// get data from the conditions table
	const getConditions = async (url_input, condition_data) => {
		// check if email is admin@gmail.com, if so pull ALL TREES
		let data = {
			ids: [],
			names: [],
			'hereditary?':[],
			male_parents: [],
			female_parents: [],
			male_grandparents: [],
			female_grandparents: []
		};
		data = await axios.get(url_input, {params: {}});
		// console.log(data);
		setConditions(data.data);
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
							if(Object.keys(response)[j] == "hereditarys") {	// catch when we're naming a column hereditarys in the 1st row
								columns.push(<td>hereditary?</td>)	// name it hereditary? instead
							}
							else {	// generic key name
								columns.push(<td>{Object.keys(response)[j]}</td>)
							}
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
							columns.push(<td>{String(response[Object.keys(response)[j]][i])}</td>)
						}
					}
					else {
						columns.push(<td>
										<Link to='/canopy/canopy_edit_condition/' 
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
		getConditions(BASEURL + "canopy/condition/prod", {})
	}, []);

	return (
		<div className="App">
			<header className="App-header-primary">
				<h1>Show Health Conditions</h1>
			</header>

			<div>
				<table border="1" className="canopy-table">
					{generateTable(conditions)}
				</table>
			</div>

			<br/>

			<Link to="/canopy/canopy_new_condition/">
				<button>
					Add New Condition
				</button>
			</Link>

			<br/><br/>

			<button onClick={() => {
				navigate('/canopy/');
			}}> 
				Back 
			</button>
		</div>
	);
}

export default ShowConditions;
