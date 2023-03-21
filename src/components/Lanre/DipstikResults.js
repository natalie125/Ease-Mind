import React, { useState,Component } from "react";
import { Link } from "react-router-dom";
import "../App/App.css";

import Header from "../Header/Header";
import DipstickTimer from "./DipstikTimer";

const DipstikResults = () => {
	const [view, setView] = useState(1);
	const [paramStyling, setParamStyling] = useState("results-button selected");
	const [healthStyling, setHealthStyling] = useState("results-button");


	//Used to Switch the user's view to Parameters 
	const handleSwitchToParameters = () => {
		setView(1);
		setParamStyling("results-button selected");
		setHealthStyling("results-button");
	};

	//Used to switch the user's view to Health Conditions
	const handleSwitchToHealthConditions = () => {
		setView(2);
		setParamStyling("results-button");
		setHealthStyling("results-button selected");
	};

	//Gather results and make it explainable
	let bilirubin = sessionStorage.getItem("bilirubin");
	switch(bilirubin) {
		case "neg":
			bilirubin = "Negative";
		  	break;
		case "+":
			bilirubin = "Small+";
		  	break;
		case "++":
			bilirubin = "Moderate++";
		  	break;
		case "+++":
			bilirubin = "Large+++";
			break;
		default:
			bilirubin = "Error";
	};


    let blood = sessionStorage.getItem("blood");
	switch(blood) {
		case "neg":
			blood = "Negative";
		  	break;
		case "trace":
			blood = "trace";
			break;
		case "+25":
			blood = "Small+";
		  	break;
		case "++80":
			blood = "Moderate++";
		  	break;
		case "+++200":
			blood = "Large+++";
			break;
		case "non_hemolysis+10":
			blood = "Large+++";
			break;
		case "++80_rbc":
			blood = "Moderate++";
				break;
		default:
			blood = "Error";
	};

    let glucose = sessionStorage.getItem("glucose");
	switch(glucose) {
		case "neg":
			glucose = "Negative";
		  	break;
		case "+100":
			glucose = "+100";
			break;
		case "+250":
			glucose = "+250";
		  	break;
		case "++500":
			glucose = "++500";
		  	break;
		case "+++1000":
			glucose = "+++1000";
			break;
		case "++++2000":
			glucose = "++++2000";
			break;
		default:
			glucose = "Error";
	};

	//ketones
    let ketones = sessionStorage.getItem("ketones");
	switch(ketones) {
		case "neg":
			ketones = "Negative";
		  	break;
		case "+5":
			ketones = "trace";
			break;
		case "+15":
			ketones = "Small+";
		  	break;
		case "++40":
			ketones = "Moderate++";
		  	break;
		case "+++80":
			ketones = "Large+++";
			break;
		case "+++160":
			ketones = "Large+++";
			break;
		default:
			ketones = "Error";
	};

	//leukocytes
    let leukocytes = sessionStorage.getItem("leukocytes");
	switch(leukocytes) {
		case "neg":
			leukocytes = "Negative";
		  	break;
		case "trace":
			leukocytes = "trace";
			break;
		case "+70":
			leukocytes = "Small+";
		  	break;
		case "++125":
			leukocytes = "Moderate++";
		  	break;
		case "+++500":
			leukocytes = "Large+++";
			break;
		default:
			leukocytes = "Error";
	};

	//nitrite
    let nitrite = sessionStorage.getItem("nitrite");
	switch(nitrite) {
		case "neg":
			nitrite = "Negative";
		  	break;
		case "trace":
			nitrite = "trace";
			break;
		case "positive":
			nitrite = "Positive";
		  	break;
		default:
			nitrite = "Error";
	};

	//ph
    let ph = sessionStorage.getItem("ph");
	switch(ph) {
		case "5":
			ph = "Negative";
		  	break;
		case "6":
			ph = "Trace";
			break;
		case "6.5":
			ph = "Small";
		  	break;
		case "7":
			ph = "Moderate++";
		  	break;
		case "7.5":
			ph = "Large+++";
			break;
		case "8":
			ph = "Large+++";
			break;
		case "8.5":
			ph = "Large+++";
			break;
		default:
			ph = "Error";
	};

	//protein
    let protein = sessionStorage.getItem("protein");
	switch(protein) {
		case "neg":
			protein = "Negative";
		  	break;
		case "trace":
			protein = "Trace";
			break;
		case "+30":
			protein = "Small";
		  	break;
		case "++100":
			protein = "Moderate++";
		  	break;
		case "+++300":
			protein = "Large+++";
			break;
		case "++++1000":
			protein = "Large+++";
			break;
		default:
			protein = "Error";
	};

	//specific gravity
    let specific_gravity = sessionStorage.getItem("specific_gravity");
	switch(specific_gravity) {
		case "1.000":
			specific_gravity = "Negative";
		  	break;
		case "1.005":
			specific_gravity = "trace";
			break;
		case "1.010":
			specific_gravity = "Small";
		  	break;
		case "1.015":
			specific_gravity = "Moderate++";
		  	break;
		case "1.020":
			specific_gravity = "Large+++";
			break;
		case "1.025":
			specific_gravity = "Large+++";
			break;
		case "1.030":
			specific_gravity = "Large+++";
			break;
		default:
			specific_gravity = "Error";
	};

	//urobilinogen
    let urobilinogen = sessionStorage.getItem("urobilinogen");
	switch(urobilinogen) {
		case "0.1":
			urobilinogen = "Negative";
		  	break;
		case "1":
			urobilinogen = "trace";
			break;
		case "2":
			urobilinogen = "Small+";
		  	break;
		case "4":
			urobilinogen = "Moderate++";
		  	break;
		case "8":
			urobilinogen = "Large+++";
			break;
		default:
			urobilinogen = "Error";
	};


	// Urinary Tract Infection
		// Positive for nitrite or *leukocytes* or red blood cells
		//A negative UTI does not rule out UTI but a positive one strongly suggests infections and a UTI

	//White blood Cells
		// Leukocyte esterase is a screening test used to detect a substance that suggests there are 
		//white blood cells in the urine. This may mean you have a urinary tract infection. If this 
		//test is positive, the urine should be examined under a microscope for white blood cells 
		//and other signs that point to an infection.
	
	// Liver Health
		//Bilirubin can be a early sign of liver damage
		//https://medlineplus.gov/lab-tests/bilirubin-in-urine/

	//Kidney Health
		//Protein is an important building block in the body. Everyone has protein \
		// in their blood. But it should only be in your blood, not in your urine. 
		//Your kidneys play a role in this process. Healthy kidneys remove waste 
		//products and extra water from your blood, but leave behind the things 
		//your body needs, like protein. When your kidneys are injured, protein 
		//leaks into your urine. Having protein in your urine suggests that your 
		//kidneys’ filtering units are damaged by kidney disease.
		//https://www.kidney.org/sites/default/files/11-10-1815_HBE_PatBro_Urinalysis_v6.pdf

	// Hydration
		// Specific Gravity
		//https://www.healthline.com/health/urine-specific-gravity#results
		// Specific gravity results above 1.010 can indicate mild dehydration. //The higher the number, the more dehydrated you may be.

		//https://alliedhealth.ceconnection.com/files/UrineDipstickTestingEverythingYouNeedtoKnow-1440776910971.pdf
		//The normal USG ranges from 1.003 to 1.030. USG less than 1.010 
		//is suggestive of relative hydration, and values greater than 1.020 in- dicate relative dehydration.
		
	// pH
		// nor- mal serum pH is 7.4, but the normal urinary pH ranges from 4.5 to 8. Because of normal metabolic activ- ity,
		//the generally accepted normal pH of urine is about 5.5 to 6.5.

	// Ketone - Uncontrolled Diabetes
		//

	return (
		<div className="dipstik-results">
			<Header />
			<h1>Dipstik Results</h1>

			<div className="results-switcher-container">
				<div className="results-button-container">
					<button onClick={handleSwitchToParameters} className={paramStyling}>By Parameters</button>
					<button onClick={handleSwitchToHealthConditions} className={healthStyling}>By Health Conditions</button>
				</div>
			</div>

				<div>
					{view == 1 && (
					<div className="results-container">
						<div className="results-box">
							<p><b>LEUKOCYTES (LEU):</b></p>
							<p>{leukocytes}</p>
						</div >
						<div className="results-box">
							<p><b>Nitrite (NIT):</b></p>
							<p>{nitrite}</p>
						</div>
						<div className="results-box">
							<p><b>Urobilinogen(URO):</b></p>
							<p>{urobilinogen}</p>
						</div >
						<div className="results-box">
							<p><b>Protein (PRO):</b></p>
							<p>{protein}</p>
						</div>
						<div className="results-box">
							<p><b>pH (pH):</b></p>
							<p>{ph}</p>
						</div>
						<div className="results-box">
							<p><b>Blood (BLO):</b></p>
							<p>{blood}</p>
						</div>
						<div className="results-box">
							<p><b>Specific Gravity (SG):</b></p>
							<p>{specific_gravity}</p>
						</div>
						<div className="results-box">
							<p><b>Ketones (KET):</b></p>
							<p>{ketones}</p>
						</div>
						<div className="results-box">
							<p><b>Bilirubin (BIL):</b></p>
							<p>{bilirubin}</p>
						</div>
						<div className="results-box">
							<p><b>Glucose (GLU):</b></p>
							<p>{glucose}</p>
						</div>
					</div>
					)}

					{view == 2 && (
						<div className="results-container">
							<div className="results-box">
								<p><b>Urinary Tract Infection:</b></p>
								<p>{leukocytes}</p>
							</div >
							<div className="results-box">
								<p><b>White Blood Cells</b></p>
								<p>{nitrite}</p>
							</div>
							<div className="results-box">
								<p><b>Liver Health</b></p>
								<p>{urobilinogen}</p>
							</div >
							<div className="results-box">
								<p><b>Kidney Health</b></p>
								<p>{protein}</p>
							</div>
							<div className="results-box">
								<p><b>Hydration:</b></p>
								<p>{blood}</p>
							</div>
							<div className="results-box">
								<p><b>pH:</b></p>
								<p>{ph}</p>
							</div>
							
							<div className="results-box">
								<p><b>Ketone:</b></p>
								<p>{specific_gravity}</p>
							</div>
						</div>
					)}


					<Link to="/dipstik-home/dipstik-timer/dipstik-camera">
						<button> Back </button>
					</Link>

					<Link to="/dipstik/dipstik-home/dipstik-timer/dipstik-results">
						<button> Results </button>
					</Link>
				</div>
		</div>
	);
}

export default DipstikResults;