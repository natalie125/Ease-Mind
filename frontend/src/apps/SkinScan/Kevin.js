import React, { Component} from "react";
import { Link } from "react-router-dom";

import "./SkinScan.css";

class Kevin extends Component {	
	render() {
		
		return (
			<div className="Kevin">
				<h1 className="h1_kevin">Skin Scan</h1>
				<div className="App-body">
					<div className="landing_page_kevin">

						<h2 className="h2_kevin">Product Disclaimer </h2>

						<h3 className="h3_kevin"> Please read the following information carefully:</h3>
						<p>
							This Skin Cancer identification application has been developed as a prototype only, to demonstrate the potential application of Computer Aided Diagnosis (CAD), and as such should not be used as a replacement to diagnosis received from a medical professional.
						</p>
						<p> This application is able to classify a lesion as either malignant or benign with an accuracy of  81%, when tested on previously unseen data</p>
						<p>
							If you have any doubts regarding your personal health, please visit a medical professional to receive a diagnosis.
						</p>
						<Link to="/home">
							<button className="instructions-button-kevin"> Back </button>
						</Link>

						<Link to="/skin-scan/instructions">
							<button data-cy="indexContinue" className="instructions-button-kevin"> Continue </button>
						</Link>
					
					</div>
				</div>
			</div>
		);
	}
}

export default Kevin;