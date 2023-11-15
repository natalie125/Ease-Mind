import React, { Component } from "react";

class Error400 extends Component {
	render() {
		return (
			<div className="App">
				<h1>400 Error</h1>
				<body className="App-body">
					<p>Bad HTTP Request</p>
				</body>
			</div>
		);
	}
}

export default Error400;
