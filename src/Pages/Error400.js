import React, { Component } from "react";

import "../components/App/App.css";

class Error400 extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header-primary">
					<h1>400 Error</h1>
				</header>
				<body className="App-body">
					<p>Bad HTTP Request</p>
				</body>
			</div>
		);
	}
}

export default Error400;
