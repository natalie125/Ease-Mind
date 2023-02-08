import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../App/App.css";
import canopy_logo from "../../images/canopy-logo.png";
import dipstik_logo from "../../images/dipstik-logo.png";
import stroke_logo from "../../images/stroke-logo.png";
import tonsilitis_detector_logo from "../../images/tonsilitis-detector-logo.png";
import skinscan_logo from "../../images/skinscan_logo.png";
import Header from "../Header/Header";

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
			// TODO: Need to create page that will present app options in nicer way.
			
			<div className="App">
			<Header />
			<h1>Home</h1>
			<div className="btn-container">
				<div className="btn-row">
					<Link className="link" to="/alex">
						<img className="btn-choice" src={canopy_logo} alt="Canopy_App_Alex" />
						{/* <button className="btn-choice" >Alex's App</button> */}
					</Link>

					<Link className="link" to="/kevin">
						<img className="btn-choice" src={skinscan_logo} alt="Skin-Scan_App_Kevin" />
						{/* <button className="btn-choice" >Kevin's App</button> */}
					</Link>

					<Link className="link" to="/lanre">
						<img className="btn-choice" src={dipstik_logo} alt="Dipstik_App_Lanre" />
						{/* <button className="btn-choice" >Lanre's App</button> */}
					</Link>
					<Link className="link" to="/ramat">
						<img className="btn-choice" src={stroke_logo} alt="Stroke_App_Ramat" />
						{/* <button className="btn-choice" >Ramat's App</button> */}
					</Link>
					<Link className="link" to="/shreyas">
						<img className="btn-choice" src={tonsilitis_detector_logo} alt="Tonsilitis_App_Shreyas" />
						{/* <button className="btn-choice" >Shreyas' App</button> */}
					</Link>
					{/* <button onClick={this.getEC2}> Get EC2 </button> */}
				</div>
			</div>
		</div>
		);
	}
}

export default Home;
