import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../App/App.css";
import Header from "../Header/Header";

var baseurl = "http://localhost:5000/canopy/";
	if(window.location.href.includes("localhost")) {
		baseurl = "http://localhost:5000/canopy/";
	}
	else {
		baseurl = "https://d23bykmxle9vsv.cloudfront.net/";
	}

class Canopy extends Component {
	// for querying the backend
	getBackend = (http_method, url_input, request_headers) => {
		var config = {
			method: http_method,
			url: url_input,
			headers: request_headers,
		};

		axios(config)
			.then(function (response) {
				alert(response.data);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	render() {
		return (
			<div className="App">
				<Header />
				<h1>Welcome To Canopy!</h1>
				<div>
					<div>
						<Link to="/canopy/canopy_show_trees">
							<button> Go to show trees </button>
						</Link>
					</div>

					<div>
						<Link to="/home">
							<button> Back </button>
						</Link>
					</div>
				</div>
			</div>
		);
	}
}

export default Canopy;
