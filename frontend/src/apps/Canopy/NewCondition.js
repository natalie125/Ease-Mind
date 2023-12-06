import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import "./Canopy.css"

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

function NewCondition(props) {
	const navigate = useNavigate();
	const location = useLocation();

	const [name, setName] = useState("Condition Name");
	const [hereditary, setHereditary] = useState(false);
	const [disease_id, setDiseaseID] = useState("SNOMED Disease ID");
	const [fh_condition_id, setFHConditionID] = useState("SNOMED FH Condition ID");
	const [fh_condition_name, setFHConditionName] = useState("SNOMED FH Condition Name");
	const [male_parent, setMaleParent] = useState(0);
	const [female_parent, setFemaleParent] = useState(0);
	const [male_grandparent, setMaleGrandparent] = useState(0);
	const [female_grandparent, setFemaleGrandparent] = useState(0);

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
						SNOMED Disease Name:
						<input
						name="name"
						type="text"
						value={name}
						onChange={e => setName(e.target.value)} />
					</label>
					<br />

					<label>
						SNOMED Disease ID:
						<input
						name="disease_id"
						type="text"
						value={disease_id}
						onChange={e => setDiseaseID(e.target.value)} />
					</label>
					<br />

					<label>
						SNOMED FH Condition Name:
						<input
						name="fh_condition_name"
						type="text"
						value={fh_condition_name}
						onChange={e => setFHConditionName(e.target.value)} />
					</label>
					<br />

					<label>
						SNOMED FH Condition ID:
						<input
						name="fh_condition_id"
						type="text"
						value={fh_condition_id}
						onChange={e => setFHConditionID(e.target.value)} />
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
					<br />

					<label>
						Male Parent weight when calculating FH condition:
					<input
						name="male_parent"
						type="number"
						value={male_parent}
						max="1"
						min="0"
						onChange={e => setMaleParent(e.target.value)} />
					</label>
					<br />

					<label>
						Female Parent weight when calculating FH condition:
					<input
						name="female_parent"
						type="number"
						value={female_parent}
						max="1"
						min="0"
						onChange={e => setFemaleParent(e.target.value)} />
					</label>
					<br />

					<label>
						Male Grandparent weight when calculating FH condition:
					<input
						name="male_grandparent"
						type="number"
						value={male_grandparent}
						max="1"
						min="0"
						onChange={e => setMaleGrandparent(e.target.value)} />
					</label>
					<br />

					<label>
						Female Grandparent weight when calculating FH condition:
					<input
						name="female_grandparent"
						type="number"
						value={female_grandparent}
						max="1"
						min="0"
						onChange={e => setFemaleGrandparent(e.target.value)} />
					</label>
				</form>

				<div>
					<button onClick={() => {
						postCondition(BASEURL + "canopy/condition/prod", {	name: name, hereditary: hereditary, disease_id: disease_id, 
																			fh_condition_id: fh_condition_id, fh_condition_name: fh_condition_name, 
																			male_parent: male_parent, female_parent: female_parent, male_grandparent: male_grandparent, 
																			female_grandparent: female_grandparent })
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

export default NewCondition;
