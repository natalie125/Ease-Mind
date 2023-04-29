import React, { Component } from "react";
import Instructions from "./Instructions_Component";

import "../App/App.css";
import "./Kevin.css";
import Header from "../Header/Header";

    


class Kevin extends Component {

    

	render() {
		return (
			<div className="Kevin">
				<Header />
				<h1 className="h1_kevin">Skin Scan</h1>
				<div className="App-body">
					<div className="landing_page_kevin">
						<h2 > Instructions:</h2>
						<p>
                            Please read the following instructions carefully, in order to correctly utilise this application.
                        </p>
                        <Instructions/>
					</div>
				</div>
			</div>
		);
	}
}

export default Kevin;