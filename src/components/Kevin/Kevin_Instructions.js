import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import WebcamStreamCapture from "../Webcam";

import WebcamCapture from "../camera/camera";
import Instructions from "./Instructions_Component";

import "../App/App.css";
import "./Kevin.css";
import Header from "../Header/Header";

    


class Kevin extends Component {

    

	render() {
		return (
			<div className="Kevin">
				<Header />
				<h1 className="h1_kevin">Kevin's app</h1>
				<div className="App-body">
					<div className="landing_page_kevin">

						<h2 className="h2_kevin"> Iteration 2</h2>

						<h3 className="h3_kevin"> Instructions:</h3>
						<p>
                            Please read the following instructions carefully, in order to correctly utilise this application.
                        </p>

                        <Instructions>

                        </Instructions>


                        
						{/* <Link to="/kevin/take_photo">
							<button> Continue </button>
						</Link> */}



					{/* <p style={{ textAlign: "center", marginBottom: "20px" }}> Webcam Capture </p>
							<WebcamCapture context="kevin"/> */}
						<Link to="/home">
							<button> Back </button>
						</Link>
					
					</div>
				</div>
			</div>
		);
	}
}

export default Kevin;