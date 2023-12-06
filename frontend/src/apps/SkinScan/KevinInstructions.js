import React, { Component } from "react";
import Instructions from "./InstructionsComponent";
import "./SkinScan.css";

class Kevin extends Component {
	render() {
		return (
			<div className="Kevin">
				<h1 className="h1_kevin">Skin Scan</h1>
					<div className="landing_page_kevin">
						<h2> Instructions:</h2>
						<p>
							Please read the following instructions carefully, in order to
							correctly utilise this application.
						</p>
						<Instructions/>
					</div>
			</div>
		);
	}
}

export default Kevin;