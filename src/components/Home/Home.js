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
	getBackend = () => {
		var config = {
			method: "get",
			url: "https://d23bykmxle9vsv.cloudfront.net/",
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
				<Header />
				<h1>Home</h1>
				<div data-cy="homeBttnContainer" className="btn-container">
					<div className="btn-row">
						<Link className="link" to="/alex">
							<img className="btn-choice" src={canopy_logo} alt="Logo" />
							{/* <button className="btn-choice" >Alex's App</button> */}
						</Link>

						<Link className="link" to="/kevin">
							<img className="btn-choice" src={skinscan_logo} alt="Logo" />
							{/* <button className="btn-choice" >Kevin's App</button> */}
						</Link>

						<Link className="link" to="/lanre">
							<img className="btn-choice" src={dipstik_logo} alt="Logo" />
							{/* <button className="btn-choice" >Lanre's App</button> */}
						</Link>
						<Link className="link" to="/ramat">
							<img className="btn-choice" src={stroke_logo} alt="Logo" />
							{/* <button className="btn-choice" >Ramat's App</button> */}
						</Link>
						<Link className="link" to="/shreyas">
							<img className="btn-choice" src={tonsilitis_detector_logo} alt="Logo" />
							{/* <button className="btn-choice" >Shreyas' App</button> */}
						</Link>
						{/* <button onClick={this.getBackend}> Get Backend </button> */}
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
