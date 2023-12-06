import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

class ViewCondition extends Component {
	// form methods
	constructor(props) {
		super(props);
		this.state = {
		  condition_id: 1,
		  name: "condition name",
		  hereditary: true
		};
	
		this.handleInputChange = this.handleInputChange.bind(this);
	  }
	
	handleInputChange(event) {
	const target = event.target;
	const value = target.type === 'checkbox' ? target.checked : target.value;
	const name = target.name;

	this.setState({
		[name]: value
	});
	}

	// get data from the health condition table
	getCondition = (url_input, condition_data) => {
		axios.get(url_input, {params: condition_data})
		.then(function (response) {
			alert(JSON.stringify(response.data))
		})
		.catch(function (error) {
			alert(error);
		}) 
	}

	// get afflicted (condition_of) a health condition
	getConditionPatients = (url_input, condition_data) => {
		axios.get(url_input, {params: condition_data})
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
					<h1>View Health Condition Information</h1>
				</header>
				<div>
					<form>
						<label>
							Condition ID:
							<input
							name="condition_id"
							type="number"
							value={this.state.condition_id}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
							Condition Name:
							<input
							name="name"
							type="text"
							value={this.state.name}
							onChange={this.handleInputChange} />
						</label>
						<br />
						<label>
						Hereditary:
						<input
							name="hereditary"
							type="checkbox"
							checked={this.state.hereditary}
							onChange={this.handleInputChange} />
						</label>
					</form>

					<div>
						<button onClick={() => {this.getCondition(BASEURL + "canopy/condition/prod", {id: this.state.condition_id, name: this.state.name, hereditary: this.state.hereditary})}}>GET health condition at: {BASEURL}</button>
					</div>

					<Link to="/home">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default ViewCondition;
