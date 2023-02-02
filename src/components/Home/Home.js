import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../App/App.css";

class Home extends Component {
	getEC2 = () => {
		var config = {
			method: "get",
			url: "https://ec2-3-249-104-153.eu-west-1.compute.amazonaws.com/",
			headers: {},
		};

		axios(config)
			.then(function (response) {
				console.log(JSON.stringify(response.data));
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	render() {
		return (
			// TODO: Need to create page that will present app options in nicer way.
			<div className="App">
				<header className="App-header">
					<h1>Home</h1>
				</header>
				<body className="login-form">

					<div className = "btn-row">
					<Link to="/alex">
						<button className="btn-choice">Alex's App</button>
					</Link>
					<Link to="/alex">
						<button className="btn-choice">Kevins's App</button>
					</Link>
					<Link to="/alex">
						<button className="btn-choice">Lanre's App</button>
					</Link>
					</div>

					<div className = "btn-row">
					<Link to="/alex">
						<button className="btn-choice">Shreyas' App</button>
					</Link>
					<Link to="/alex">
						<button className="btn-choice">Ramat's App</button>
					</Link>
					</div>
					
					<button onClick={this.getEC2}> Get EC2 </button>
				</body>
			</div>
		);
	}
}

export default Home;
