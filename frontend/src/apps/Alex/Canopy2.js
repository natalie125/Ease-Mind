import React, { Component } from "react";
import { Link } from "react-router-dom";

class Canopy2 extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header-primary">
					<h1>Alex's app</h1>
				</header>
				<div>
					<div>
						<p>Second nested page</p>
					</div>
					<Link to="/home">
						<button> Back </button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Canopy2;
