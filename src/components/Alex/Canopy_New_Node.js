import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import "../App/App.css";
import Dropdown from "./Dropdown";
import "./Canopy.css"

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

	// convert YYYY-MM-DD to int
	const convertDateToInt = (date_string) => {
		// younger is when the date is smaller
		let year = date_string.substring(0, 4);
		let month = date_string.substring(5, 7);
		let days = date_string.substring(8, 10);
		return parseInt(year + month + days);
	}

	// function to read DOB input boxes, returns true only if it passes the checks
	// expects something like YYYY-MM-DD or YYYY/MM/DD
	const checkDateFormat = (input) => {
		const current = new Date();
		const date = `${current.getFullYear()}-${('0' + (current.getMonth()+1)).slice(-2)}-${('0' + (current.getDate())).slice(-2)}`;
		// console.log(date);
		if(input.length != date.length) {
			// this length check is here to catch cases such as 2000-2-2 or 10-02-02
			console.log("date wrong length");
			return false;
		}
		if(input.charAt(4) != '-') {
			// checks the 5th character for a '-' or '/' character
			console.log("missing - or / on 5th character");
			return false;
		}
		if(input.charAt(7) != '-') {
			// checks the 8th character for a '-' or '/'
			console.log("missing - or / on 8th character");
			return false;
		}
		let year = input.substring(0, 4);
		if(isNaN(year)) {	// if year is NOT a number, pass the if condition and fail the check
			// check if the first 4 characters, which should be the year, is a number
			console.log("year place isn't a number");
			return false;
		}
		year = parseInt(year);
		if(year <= 0) {
			// 0 and negative check for year
			console.log("year is 0 or negative");
			return false;
		}
		let month = input.substring(5, 7);
		if(isNaN(month)) {
			// check if the 6th to 7th characters is a number
			console.log("month place isn't a number");
			return false;
		}
		month = parseInt(month);
		if(month > 12 || month <= 0) {
			// check if the month is greater than 12 (final month is december) or less than 0
			console.log("month place too large (max 12) or small (min 0)");
			return false;
		}
		let days = input.substring(8, 10);
		if(isNaN(days)) {
			// check if the 9th to 10th characters are numbers
			console.log("days place isn't a number");
			return false;
		}
		days = parseInt(days);
		if(days <= 0) {
			// 0 and negative check for days
			console.log("day is 0 or negative");
			return false;
		}
		// complex day checking based on month (and potentially year)
		// months with 31 days
		if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
			if(days > 31) {
				console.log("day is too large for month with 31 days");
				return false;
			}
		}
		// months with 30 days
		if(month == 4 || month == 6 || month == 9 || month == 11) {
			if(days > 30) {
				console.log("day is too large for month with 30 days");
				return false;
			}
		}
		// check feb (month == 2) and thus leap years
		if(month == 2) {
			if(days > 29) {
				console.log("day too large for feb (>29)");
				return false;
			}
			if(days == 29) {	// if the day is very specifically feb 29th, it is only valid on leap years
				if(year % 4 != 0) {
					console.log("29th feb but not leap year (% 4 failed)");
					return false;
				}
				// % 4 has passed
				if(year % 100 == 0 && year % 400 != 0) {	// specifically on years where % 100 passes but % 400 fails they are no longer leap years
					console.log("29th feb but not a leap year (% 100 passed, but % 400 failed)");
					return false;
				}
			}
		}
		if(convertDateToInt(date) < convertDateToInt(input)) {	// the current date is smaller than the input
			// the input is greater, and thus in the future
			console.log("date is in the future")
			return false;
		}
		return true;
	}

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
						DOB (Format:YYYY-MM-DD): {} 
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
					<Dropdown
						isSearchable
						isMulti
						placeHolder="Select..."
						initialValues={selected_conditions}
						options={conditions}
						onChange={(value) => { setSelectedConditions(value) }}
					/>
					<br /><br />
				</form>

				<div>
					<button onClick={() => {
						if(checkDateFormat(dob)) {
							navigate('/canopy/canopy_new_node_2/', {state:{ tree_id: location.state?.tree_id, name: name, dob: dob, ethnicity: ethnicity, selected_conditions: selected_conditions }})
						}
						else {
							alert("DOB format invalid!")
						}
					}}>
						Proceed to Choosing Parents, Children, and Spouses
					</button>
				</div>

				<br />

				<button onClick={() => {
					navigate('/canopy/canopy_edit_tree/', {state:{ id: location.state?.tree_id }})
				}}> 
					Back 
				</button>
			</div>
		</div>
	);
}

export default Canopy_New_Node;
