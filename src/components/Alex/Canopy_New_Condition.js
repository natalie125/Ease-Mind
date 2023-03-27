import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import "../App/App.css";
import "./Canopy.css"

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

function Canopy_New_Condition(props) {
	const navigate = useNavigate();
	const location = useLocation();

	const [name, setName] = useState("Condition Name");
	const [hereditary, setHereditary] = useState(false);

	// create a new condition with name and heredtiary value
	const postCondition = async (url_input, condition_data) => {
		const post_response = await axios.post(url_input, null, {params: condition_data});
		console.log(JSON.stringify(post_response));
	}
		
	return (
		<div className="App">
			<header className="App-header-primary">
				<h1>Edit Health Condition Information</h1>
			</header>
			<div>
				<form>
					<label>
						Condition Name:
						<input
						name="name"
						type="text"
						value={name}
						onChange={e => setName(e.target.value)} />
					</label>
					<br />
					<label>
					Hereditary:
					<input
						name="hereditary"
						type="checkbox"
						checked={hereditary}
						onChange={e => setHereditary(e.target.checked)} />
					</label>
				</form>

				<div>
					<button onClick={() => {
						postCondition(BASEURL + "canopy/condition/prod", {name: name, hereditary: hereditary})
						alert("New Condition: " + name + " Added!")
						navigate(-1);
					}}>
						Add New Health Condition
					</button>
				</div>

				<br/>

				<button onClick={() => {
					navigate(-1);
				}}> 
					Back 
				</button>
			</div>
		</div>
	);
}

export default Canopy_New_Condition;
