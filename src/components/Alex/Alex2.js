import React, { Component } from "react";
import { Link } from "react-router-dom";

import "../App/App.css";

class Alex extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header-primary">
					<h1>Alex's app</h1>
				</header>
				<body>
					<div>
						<p>Second nested page</p>
					</div>
					<Link to="/home">
						<button> Back </button>
					</Link>
				</body>
			</div>
		);
	}
}

export default Alex;
