import React, { Component } from "react";
import Home from "../components/Home/Home";

import "../components/App/App.css";
import { Link } from "react-router-dom";

class Error404 extends Component {
	render() {
		return (
			<div>
				<h1>404 Error</h1>
				<h1>Page Not Found</h1>
				<p> Here is the home link:</p>
				<Link to="/home">Home</Link>
			</div>
		);
	}
}

export default Error404;
