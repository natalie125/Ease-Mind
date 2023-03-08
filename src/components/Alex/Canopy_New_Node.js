import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import "../App/App.css";
import Dropdown from "./Dropdown";

var baseurl = "http://localhost:5000/canopy/";
	if(window.location.href.includes("localhost")) {
		baseurl = "http://localhost:5000/canopy/";
	}
	else {
		baseurl = "https://d23bykmxle9vsv.cloudfront.net/";
	}

function Canopy_New_Node(props) {
	const navigate = useNavigate();
	const location = useLocation();

	// state definitions
	const [name, setName] = useState(location.state?.name !== undefined ? location.state?.name : "Patient's Name");
	const [dob, setDOB] = useState(location.state?.dob !== undefined ? location.state?.dob : "YYYY-MM-DD");
	const [ethnicity, setEthnicity] = useState(location.state?.ethnicity !== undefined ? location.state?.ethnicity : "Patient's Ethnicity");
	const [conditions, setConditions] = useState([]);
	const [selected_conditions, setSelectedConditions] = useState(location.state?.selected_conditions !== undefined ? location.state?.selected_conditions : []);

	// get all conditions from the health condition table
	const getCondition = async (url_input, condition_data) => {
		const {data} = await axios.get(url_input, {params: condition_data});
		// alert(JSON.stringify(data));
		const new_conditions = [];
		for(let i = 0; i < data.ids.length; i++) {
			// run the loop once for every id in the ids array
			const condition_entry = {id: data.ids[i], label: data.names[i]};
			new_conditions.push(condition_entry);
		}
		setConditions(new_conditions);
	}

	useEffect(() => {
		getCondition(baseurl + "condition/prod", {});
	}, [dob]);
	
	return (
		<div className="App">
			<header className="App-header-primary">
				<h1>Add New Patient to Tree ID { location.state?.tree_id }</h1>
			</header>
			<div>
				<form>
					<label>
						Name:
						<input
						name="name"
						type="text"
						value={name}
						onChange={e => setName(e.target.value)} />
					</label>
					<br /><br />

					<label>
						DOB:
						<input
						name="dob"
						type="text"
						value={dob}
						onChange={e => setDOB(e.target.value)} />
					</label>
					<br /><br />

					<label>
						Ethnicity:
						<input
						name="ethnicity"
						type="text"
						value={ethnicity}
						onChange={e => setEthnicity(e.target.value)} />
					</label>
					<br /><br />
					
					<label>
						Health Conditions:
					</label>
					<div>
						<Dropdown
							isSearchable
							isMulti
							placeHolder="Select..."
							initialValues={selected_conditions}
							options={conditions}
							onChange={(value) => { setSelectedConditions(value) }}
						/>
					</div>
					<br /><br />
				</form>

				<div>
					<Link to='/canopy/canopy_new_node_2/' 
						state={{ tree_id: location.state?.tree_id, name: name, dob: dob, ethnicity: ethnicity, selected_conditions: selected_conditions }}>
						<button>
							Proceed to Choosing Parents and Children
						</button>
					</Link>
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

export default Canopy_New_Node;
