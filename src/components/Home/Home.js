import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../App/App.css";
import canopy_logo from '../../images/canopy-logo.png';
import dipstik_logo from '../../images/dipstik-logo.png';
import stroke_logo from '../../images/stroke-logo.png';
import tonsilitis_detector_logo from '../../images/tonsilitis-detector-logo.png';

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
					<div className="btn-row">
						<Link to="/alex">
							<img className="btn-choice" src={canopy_logo} alt="Logo" />
							{/* <button className="btn-choice" >Alex's App</button> */}
						</Link>
						
						<Link to="/kevin">
							<img className="btn-choice" src={canopy_logo} alt="Logo" />
							{/* <button className="btn-choice" >Kevin's App</button> */}
						</Link>

						<Link to="/lanre">
							<img className="btn-choice" src={dipstik_logo} alt="Logo" />
							{/* <button className="btn-choice" >Lanre's App</button> */}
						</Link>
						<Link to="/ramat">
							<img className="btn-choice" src={stroke_logo} alt="Logo" />
							{/* <button className="btn-choice" >Ramat's App</button> */}

						</Link>
						<Link to="/shreyas">
							<img className="btn-choice" src={tonsilitis_detector_logo} alt="Logo" />
							{/* <button className="btn-choice" >Shreyas' App</button> */}
						</Link>
						<button onClick={this.getEC2}> Get EC2 </button>
					</div>
			</div>
		);
	}
}

export default Home;
