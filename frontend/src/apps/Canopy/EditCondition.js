import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import "./Canopy.css"

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

function EditCondition(props) {
	const navigate = useNavigate();
	const location = useLocation();

	// state definitions
	const [id, setID] = useState(location.state?.id);
	const [name, setName] = useState("Condition's Name");
	const [hereditary, setHereditary] = useState(false);
	const [disease_id, setDiseaseID] = useState("SNOMED Disease ID");
	const [fh_condition_id, setFHConditionID] = useState("SNOMED FH Condition ID");
	const [fh_condition_name, setFHConditionName] = useState("SNOMED FH Condition Name");
	const [male_parent, setMaleParent] = useState(0);
	const [female_parent, setFemaleParent] = useState(0);
	const [male_grandparent, setMaleGrandparent] = useState(0);
	const [female_grandparent, setFemaleGrandparent] = useState(0);
	
	const [new_name, setNewName] = useState("Condition's New Name");
	const [new_hereditary, setNewHereditary] = useState(false);
	const [new_disease_id, setNewDiseaseID] = useState("New SNOMED Disease ID");
	const [new_fh_condition_id, setNewFHConditionID] = useState("New SNOMED FH Condition ID");
	const [new_fh_condition_name, setNewFHConditionName] = useState("New SNOMED FH Condition Name");
	const [new_male_parent, setNewMaleParent] = useState(0);
	const [new_female_parent, setNewFemaleParent] = useState(0);
	const [new_male_grandparent, setNewMaleGrandparent] = useState(0);
	const [new_female_grandparent, setNewFemaleGrandparent] = useState(0);

	const [json_data, setJSONData] = useState({});

	// get data of the specific patient
	const getCondition = async (url_input, condition_data) => {
		const {data} = await axios.get(url_input, {params: condition_data});
		// alert(JSON.stringify(data));
		setJSONData(data);
		setName(data.names[0])
		setHereditary(data.hereditarys[0])
		setDiseaseID(data.disease_ids[0])
		setFHConditionID(data.fh_condition_ids[0])
		setFHConditionName(data.fh_condition_names[0])
		setMaleParent(data.male_parents[0])
		setFemaleParent(data.female_parents[0])
		setMaleGrandparent(data.male_grandparents[0])
		setFemaleGrandparent(data.female_grandparents[0])

		// also initialise the input fields
		setNewName(data.names[0])
		setNewHereditary(data.hereditarys[0])
		setNewDiseaseID(data.disease_ids[0])
		setNewFHConditionID(data.fh_condition_ids[0])
		setNewFHConditionName(data.fh_condition_names[0])
		setNewMaleParent(data.male_parents[0])
		setNewFemaleParent(data.female_parents[0])
		setNewMaleGrandparent(data.male_grandparents[0])
		setNewFemaleGrandparent(data.female_grandparents[0])
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
		getCondition(BASEURL + "canopy/condition/prod", { id: location.state?.id });
	}, []);
		
	return (
		<div className="App">
			<header className="App-header-primary">
				<h1>Edit Health Condition Information</h1>
			</header>
			<div>
				<form>
					<h3>
						Condition Internal ID: { id }
					</h3>
					<br />
					
					<h3>
						SNOMED Disease Name: { name }
					</h3>
					<label>
						New SNOMED Disease Name:
						<input
						name="new_name"
						type="text"
						value={new_name}
						onChange={e => setNewName(e.target.value)} />
					</label>
					<br />

					<h3>
						SNOMED Disease ID: { disease_id }
					</h3>
					<label>
						New SNOMED Disease ID:
						<input
						name="new_disease_id"
						type="text"
						value={new_disease_id}
						onChange={e => setNewDiseaseID(e.target.value)} />
					</label>
					<br />


					<h3>
						SNOMED FH Condition Name: { fh_condition_name }
					</h3>
					<label>
						New SNOMED FH Condition Name:
						<input
						name="new_fh_condition_name"
						type="text"
						value={new_fh_condition_name}
						onChange={e => setNewFHConditionName(e.target.value)} />
					</label>
					<br />

					<h3>
						SNOMED FH Condition ID: { fh_condition_id }
					</h3>
					<label>
						New SNOMED FH Condition ID:
						<input
						id="new_fh_condition_id"
						type="text"
						value={new_fh_condition_id}
						onChange={e => setNewFHConditionID(e.target.value)} />
					</label>
					<br />

					<h3>
						Hereditary Value: { hereditary.toString() }
					</h3>
					<label>
						New Hereditary Value:
						<input
						name="new_hereditary"
						type="checkbox"
						checked={new_hereditary}
						onChange={e => setNewHereditary(e.target.checked)} />
					</label>
					<br />

					<h3>
						Male Parent Value: { male_parent }
					</h3>
					<label>
						New Male Parent weight when calculating FH condition:
					<input
						name="new_male_parent"
						type="number"
						value={new_male_parent}
						max="1"
						min="0"
						onChange={e => setNewMaleParent(e.target.value)} />
					</label>
					<br />

					<h3>
						Female Parent Value: { female_parent }
					</h3>
					<label>
						New Female Parent weight when calculating FH condition:
					<input
						name="new_female_parent"
						type="number"
						value={new_female_parent}
						max="1"
						min="0"
						onChange={e => setNewFemaleParent(e.target.value)} />
					</label>
					<br />

					<h3>
						Male Grandparent Value: { male_grandparent }
					</h3>
					<label>
						New Male Grandparent weight when calculating FH condition:
					<input
						name="new_male_grandparent"
						type="number"
						value={new_male_grandparent}
						max="1"
						min="0"
						onChange={e => setNewMaleGrandparent(e.target.value)} />
					</label>
					<br />

					<h3>
						Female Grandparent Value: { female_grandparent }
					</h3>
					<label>
						New Female Grandparent weight when calculating FH condition:
					<input
						name="new_female_grandparent"
						type="number"
						value={new_female_grandparent}
						max="1"
						min="0"
						onChange={e => setNewFemaleGrandparent(e.target.value)} />
					</label>
				</form>

				<div>
					<button onClick={() => {
						putCondition(BASEURL + "canopy/condition/prod", {	id: id, name: name, hereditary: hereditary, disease_id: disease_id, 
																			fh_condition_id: fh_condition_id, fh_condition_name: fh_condition_name, 
																			male_parent: male_parent, female_parent: female_parent, male_grandparent: male_grandparent, 
																			female_grandparent: female_grandparent, new_name: new_name, new_disease_id: new_disease_id, 
																			new_fh_condition_id: new_fh_condition_id, new_fh_condition_name: new_fh_condition_name,
																			new_hereditary: new_hereditary, new_male_parent: new_male_parent, new_female_parent: new_female_parent,
																			new_male_grandparent: new_male_grandparent, new_female_grandparent: new_female_grandparent });
						alert("Condition Details Saved!");
						navigate(0);
					}}>
						Save Condition Details
					</button>
				</div>

				<br />

				<div>
					<button onClick={() => {
						deleteCondition(BASEURL + "canopy/condition/prod", {id: id})
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

export default EditCondition;
