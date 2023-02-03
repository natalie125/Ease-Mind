import React, { Component } from "react";

import "../components/App/App.css";

import Header from "../components/Header/Header";

class Error400 extends Component {
	render() {
		return (
			<div className="App">
				<Header />
				<h1>400 Error</h1>
				<body className="App-body">
					<p>Bad HTTP Request</p>
				</body>
			</div>
		);
	}
}

export default Error400;
