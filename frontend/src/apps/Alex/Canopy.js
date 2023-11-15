import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import "../../components/App/App.css";
import Header from "../../components/Header/Header";
import "./Canopy.css"

function Canopy(props) {
	const navigate = useNavigate();
	const location = useLocation();
	const user_email = sessionStorage.getItem("email").substring(1, sessionStorage.getItem("email").length - 1);

	const generateShowCondition = () => {
		let button = [];
		if(user_email == "admin@gmail.com") {
			button.push(<div>
							<Link to="/canopy/canopy_show_conditions/">
								<button>
									Show Conditions
								</button>
							</Link>
						</div>);
			button.push(<br/>);
		}
		return button;
	}

	return (
		<div className="App">
			<Header />
			<h1>Welcome To The Canopy App {user_email}!</h1>
			<br/>
			<div>
				<div>
					<Link to="/canopy/canopy_show_trees">
						<button>Show Trees</button>
					</Link>
				</div>

				<br/>

				{generateShowCondition()}

				<div>
					<Link to="/home">
						<button>Back</button>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Canopy;
