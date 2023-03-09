import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import "../App/App.css";
import "./Canopy.css"

var baseurl = "http://localhost:5000/canopy/";
	if(window.location.href.includes("localhost")) {
		baseurl = "http://localhost:5000/canopy/";
	}
	else {
		baseurl = "https://d23bykmxle9vsv.cloudfront.net/";
	}

function Canopy_Edit_Condition(props) {
	const navigate = useNavigate();
	const location = useLocation();

	// state definitions
	const [id, setID] = useState(location.state?.id);
	const [name, setName] = useState("Condition's Name");
	const [hereditary, setHereditary] = useState(false);
	const [new_name, setNewName] = useState("Condition's New Name");
	const [new_hereditary, setNewHereditary] = useState(false);
	const [json_data, setJSONData] = useState({});

	// get data of the specific patient
	const getCondition = async (url_input, condition_data) => {
		const {data} = await axios.get(url_input, {params: condition_data});
		// alert(JSON.stringify(data));
		setJSONData(data);
		setName(data.names[0])
		setHereditary(data.hereditarys[0])
		// also initialise the input fields
		setNewName(data.names[0])
		setNewHereditary(data.hereditarys[0])
	}

	// update condition with name and heredtiary value
	const putCondition = async (url_input, condition_data) => {
		const response = await axios.put(url_input, null, {params: condition_data});
		console.log(JSON.stringify(response));
	}

	// delete condition
	const deleteCondition = async (url_input, condition_data) => {
		const response = await axios.delete(url_input, {params: condition_data});
		console.log(JSON.stringify(response));
	}

	useEffect(() => {
		getCondition(baseurl + "condition/prod", { id: location.state?.id });
	}, []);
		
	return (
		<div className="App">
			<header className="App-header-primary">
				<h1>Edit Health Condition Information</h1>
			</header>
			<div>
				<form>
					<h3>
						Condition ID: { id }
					</h3>
					<br />
					
					<h3>
						Conditon Name: { name }
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
						Hereditary Value: { hereditary }
					</h3>
					<label>
						New Hereditary Value:
						<input
						name="new_hereditary"
						type="checkbox"
						checked={new_hereditary}
						onChange={e => setNewHereditary(e.target.checked)} />
					</label>
					<br /><br />
				</form>

				<div>
					<button onClick={() => {
						putCondition(baseurl + "condition/prod", {id: id, name: name, hereditary: hereditary, new_name: new_name, new_hereditary: new_hereditary})
						alert("Condition Details Saved!")
					}}>
						Save Condition Details
					</button>
				</div>

				<br />

				<div>
					<button onClick={() => {
						deleteCondition(baseurl + "condition/prod", {id: id, name: name, hereditary: hereditary})
						alert("Condition Record ID: " + id + " Deleted!")
						navigate(-1);
					}}>
						Delete Condition Record
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

export default Canopy_Edit_Condition;
