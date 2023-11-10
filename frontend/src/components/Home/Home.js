import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../App/App.css";
import canopy_logo from "../../images/canopy-logo.png";
import dipstik_logo from "../../images/dipstik-logo.png";
import paralysis_analysis_logo from "../../images/paralysis-analysis-logo.png";
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
			// TODO: Need to create page that will present app options in nicer way.

			<div className="Home">
				<Header hideHome={true} />

				<h1 className="homepage-title">Home</h1>
				<div data-cy="homeBttnContainer" className="btn-container">
					<div className="btn-row">
						<Link className="link" to="/canopy">
							<img
								data-cy="alexAppLogo"
								className="homepage-button"
								src={canopy_logo}
								alt="Canopy_App_Alex"
							/>
						</Link>

						<Link className="link" to="/kevin">
							<img data-cy="kevinAppLogo" className="homepage-button" src={skinscan_logo} alt="Skin-Scan_App_Kevin" />
						</Link>

						<Link className="link" to="/dipstik">
							<img data-cy="lanreAppLogo" className="homepage-button" src={dipstik_logo} alt="Dipstik_App_Lanre" />
						</Link>

						<Link className="link" to="/ramat" data-cy="paralysisAnalysisLink"
>
							<img
								className="homepage-button"
								src={paralysis_analysis_logo}
								alt="Stroke_App_Ramat"
								data-cy="paralysisAnalysisLogo"
							/>
						</Link>

						<Link className="link" to="/shreyas/tonsillitis_instructions">
							<img data-cy="shreyasAppLogo" className="homepage-button" src={tonsilitis_detector_logo} alt="Tonsilitis_App_Shreyas" />
						</Link>
						{/* <button onClick={this.getEC2}> Get EC2 </button> */}
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
