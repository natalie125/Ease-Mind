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


	//leukocytes
	let leukocytes = sessionStorage.getItem("leukocytes");
	switch(leukocytes) {
		case "neg":
			leukocytes = "Negative";
				break;
		case "trace":
			leukocytes = "Trace";
			break;
		case "+70":
			leukocytes = "Positive";
				break;
		case "++125":
			leukocytes = "Positive";
				break;
		case "+++500":
			leukocytes = "Positive";
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
			nitrite = "Trace";
			break;
		case "positive":
			nitrite = "Positive";
		  	break;
		default:
			nitrite = "Error";
	};

	//urobilinogen
    let urobilinogen = sessionStorage.getItem("urobilinogen");
	switch(urobilinogen) {
		case "0.1":
			urobilinogen = "Normal";
		  	break;
		case "1":
			urobilinogen = "Normal";
			break;
		case "2":
			urobilinogen = "Abnormal";
		  	break;
		case "4":
			urobilinogen = "Abnormal";
		  	break;
		case "8":
			urobilinogen = "Abnormal";
			break;
		default:
			urobilinogen = "Error";
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
			protein = "Positive";
		  	break;
		case "++100":
			protein = "Positive";
		  	break;
		case "+++300":
			protein = "Positve";
			break;
		case "++++1000":
			protein = "Postive";
			break;
		default:
			protein = "Error";
	};
	
	//ph
    let ph = sessionStorage.getItem("ph");
	switch(ph) {
		case "5":
			ph = "Abnormal (5)";
		  	break;
		case "6":
			ph = "Normal";
			break;
		case "6.5":
			ph = "Normal";
		  	break;
		case "7":
			ph = "Normal";
		  	break;
		case "7.5":
			ph = "Normal";
			break;
		case "8":
			ph = "Normal";
			break;
		case "8.5":
			ph = "Abnormal (8.5)";
			break;
		default:
			ph = "Error";
	};

	let blood = sessionStorage.getItem("blood");
	switch(blood) {
		case "neg":
			blood = "Negative";
		  	break;
		case "trace":
			blood = "Trace";
			break;
		case "+25":
			blood = "Positive";
		  	break;
		case "++80":
			blood = "Positive";
		  	break;
		case "+++200":
			blood = "Positive";
			break;
		case "non_hemolysis+10":
			blood = "Non Hemolysed Trace";
			break;
		case "++80_rbc":
			blood = "Positive";
				break;
		default:
			blood = "Error";
	};

	
	//specific gravity
    let specific_gravity = sessionStorage.getItem("specific_gravity");
	switch(specific_gravity) {
		case "1.000":
			specific_gravity = "Abnormal-hydration";
		  	break;
		case "1.005":
			specific_gravity = "Normal";
			break;
		case "1.010":
			specific_gravity = "Normal";
		  	break;
		case "1.015":
			specific_gravity = "Normal";
		  	break;
		case "1.020":
			specific_gravity = "Normal";
			break;
		case "1.025":
			specific_gravity = "Normal-dehydration";
			break;
		case "1.030":
			specific_gravity = "Normal-dehydration";
			break;
		default:
			specific_gravity = "Error";
	};

	//ketones
	let ketones = sessionStorage.getItem("ketones");
	switch(ketones) {
		case "neg":
			ketones = "Negative";
				break;
		case "+5":
			ketones = "Trace";
			break;
		case "+15":
			ketones = "Positive";
				break;
		case "++40":
			ketones = "Positive";
				break;
		case "+++80":
			ketones = "Positive";
			break;
		case "+++160":
			ketones = "Positive";
			break;
		default:
			ketones = "Error";
	};

	let bilirubin = sessionStorage.getItem("bilirubin");
	switch(bilirubin) {
		case "neg":
			bilirubin = "Negative";
		  	break;
		case "+":
			bilirubin = "Positive";
		  	break;
		case "++":
			bilirubin = "Positive";
		  	break;
		case "+++":
			bilirubin = "Positive";
			break;
		default:
			bilirubin = "Error";
	};

    let glucose = sessionStorage.getItem("glucose");
	switch(glucose) {
		case "neg":
			glucose = "Negative";
		  	break;
		case "+100":
			glucose = "Trace";
			break;
		case "+250":
			glucose = "Positive";
		  	break;
		case "++500":
			glucose = "Positive";
		  	break;
		case "+++1000":
			glucose = "Positive";
			break;
		case "++++2000":
			glucose = "Positive";
			break;
		default:
			glucose = "Error";
	};


	



	// Urinary Tract Infection
		// Positive for nitrite or *leukocytes* or red blood cells
		//A negative UTI does not rule out UTI but a positive one strongly suggests infections and a UTI

		let urinary_tract_infection = ""
		if(leukocytes == 'Positive' || nitrite == 'Positive'){
			urinary_tract_infection = "High Risk"
		} else if (leukocytes == 'Positive' || nitrite == 'Negative'){
			urinary_tract_infection = "Medium Risk"
		} else if ((leukocytes == 'Negative' || leukocytes == 'Trace') || nitrite == 'Positive'){
			urinary_tract_infection = "Medium Risk"
		} else if ((leukocytes == 'Negative' || leukocytes == 'Trace') || nitrite == 'Positive'){
			urinary_tract_infection = "Low risk"
		}



	//White blood Cells
		// Leukocyte esterase is a screening test used to detect a substance that suggests there are 
		//white blood cells in the urine. This may mean you have a urinary tract infection. If this 
		//test is positive, the urine should be examined under a microscope for white blood cells 
		//and other signs that point to an infection.
	
		let white_blood_cells = ""
		if(leukocytes == 'Positive'){
			white_blood_cells = "Medium Risk"
		} else if (leukocytes == 'Trace'){
			white_blood_cells = "Low Risk"
		} else if (leukocytes == 'Negative' ){
			white_blood_cells = "Good"
		}

	// Liver Health
		//Bilirubin can be a early sign of liver damage
		//https://medlineplus.gov/lab-tests/bilirubin-in-urine/
		let liver_health = ""
		if(bilirubin == 'Negative' && urobilinogen == 'Normal'){
			liver_health = 'Good'
		}else if(bilirubin == 'Negative' && urobilinogen == 'Abnormal'){
			liver_health = 'Low risk'
		}else if(bilirubin == 'Positive' && urobilinogen == 'Normal'){
			liver_health = 'Low risk'
		} else if(bilirubin == 'Positive' && urobilinogen == 'Abnormal'){
			liver_health = 'Medium Risk'
		}


	//Kidney Health
		//Protein is an important building block in the body. Everyone has protein \
		// in their blood. But it should only be in your blood, not in your urine. 
		//Your kidneys play a role in this process. Healthy kidneys remove waste 
		//products and extra water from your blood, but leave behind the things 
		//your body needs, like protein. When your kidneys are injured, protein 
		//leaks into your urine. Having protein in your urine suggests that your 
		//kidneys’ filtering units are damaged by kidney disease.
		//https://www.kidney.org/sites/default/files/11-10-1815_HBE_PatBro_Urinalysis_v6.pdf
	let kidney_health = ""
	// Every thing positive
	if(protein == 'Positive' && glucose == 'Postive' && ketones == 'Positive' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)") && blood == "Positive" ){
		kidney_health = "Medium risk"
	} 
	// Everything Positive - one thing Trace
	else if(protein == 'Trace' && glucose == 'Positive' && ketones == 'Positive' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)") && blood == "Positive" ) {
		kidney_health = "Low risk"
	}else if(protein == 'Positive' && glucose == 'Trace' && ketones == 'Positive' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)") && blood == "Positive" ) {
		kidney_health = "Low risk"
	}
	else if(protein == 'Positive' && glucose == 'Postive' && ketones == 'Trace' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)") && blood == "Positive" ) {
		kidney_health = "Medium risk"
	}
	else if(protein == 'Positive' && glucose == 'Postive' && ketones == 'Positive' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)") && (blood == "Trace" || blood == "Non Hemolysed Trace") ) {
		kidney_health = "Low risk"
	} 
	// Everything positive - one thing negative 
	else if(protein == 'Negative' && glucose == 'Positive' && ketones == 'Positive' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)") && blood == "Positive" ) {
		kidney_health = "Good"
	}else if(protein == 'Positive' && glucose == 'Negative' && ketones == 'Positive' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)") && blood == "Positive" ) {
		kidney_health = "Good"
	}else if(protein == 'Positive' && glucose == 'Positive' && ketones == 'Negative' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)") && blood == "Positive" ) {
		kidney_health = "Medium risk"
	}else if(protein == 'Postive' && glucose == 'Postive' && ketones == 'Positive' && (ph == "Normal") && blood == "Positive" ) {
		kidney_health = "Medium risk"
	}else if(protein == 'Positive' && glucose == 'Positive' && ketones == 'Positive' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)") && blood == "Negative" ) {
		kidney_health = "Good"
	}
	//everything trace
	else if(protein == 'Trace' && glucose == 'Trace' && ketones == 'Trace' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)") && (blood == "Trace" || blood == "Non Hemolysed Trace") ) {
		kidney_health = "Low risk"
	}
	//everything trace - one thing positive
	else if(protein == 'Positive' && glucose == 'Trace' && ketones == 'Trace' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)" || ph == "Normal" ) && (blood == "Trace" || blood == "Non Hemolysed Trace") ) {
		kidney_health = "Low risk"
	}else if(protein == 'Trace' && glucose == 'Positive' && ketones == 'Trace' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)" || ph == "Normal" ) && (blood == "Trace" || blood == "Non Hemolysed Trace") ) {
		kidney_health = "Low risk"
	}else if(protein == 'Trace' && glucose == 'Trace' && ketones == 'Positive' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)" || ph == "Normal" ) && (blood == "Trace" || blood == "Non Hemolysed Trace") ) {
		kidney_health = "Low risk"
	}else if(protein == 'Trace' && glucose == 'Trace' && ketones == 'Trace' && ph =="Normal"  && (blood == "Trace" || blood == "Non Hemolysed Trace") ) {
		kidney_health = "Low risk"
	}else if(protein == 'Trace' && glucose == 'Trace' && ketones == 'Trace' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)" || ph == "Normal" ) && blood == "Positive" ) {
		kidney_health = "Low risk"
	} 
	//everything trace - one thing negative
	else if(protein == 'Negative' && glucose == 'Trace' && ketones == 'Trace' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)" || ph == "Normal") && (blood == "Trace" || blood == "Non Hemolysed Trace") ) {
		kidney_health = "Good"
	}else if(protein == 'Trace' && glucose == 'Negative' && ketones == 'Trace' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)" || ph == "Normal") && (blood == "Trace" || blood == "Non Hemolysed Trace") ) {
		kidney_health = "Good"
	} else if(protein == 'Trace' && glucose == 'Trace' && ketones == 'Negative' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)" || ph == "Normal") && (blood == "Trace" || blood == "Non Hemolysed Trace") ) {
		kidney_health = "Low risk"
	}else if(protein == 'Trace' && glucose == 'Trace' && ketones == 'Trace' && ph == "Normal" && (blood == "Trace" || blood == "Non Hemolysed Trace") ) {
		kidney_health = "Low risk"
	}else if(protein == 'Trace' && glucose == 'Trace' && ketones == 'Trace' && (ph == "Abnormal (5)" || ph == "Abnormal (8.5)" || ph == "Normal") &&  blood == "Negative") {
		kidney_health = "Good"
	}
	//everything negative
	else if(protein == 'Negative' && glucose == 'Negative' && ketones == 'Negative' &&  ph == "Normal" &&  blood == "Negative") {
		kidney_health = "Good"
	}
	//Everything negative - one thing positive
	else if(protein == 'Positive' && glucose == 'Negative' && ketones == 'Negative' &&  ph == "Normal" &&  blood == "Negative") {
		kidney_health = "Good"
	}else if(protein == 'Negative' && glucose == 'Positive' && ketones == 'Negative' &&  ph == "Normal" &&  blood == "Negative") {
		kidney_health = "Good"
	}else if(protein == 'Negative' && glucose == 'Negative' && ketones == 'Positive' &&  ph == "Normal" &&  blood == "Negative") {
		kidney_health = "Good"
	}else if(protein == 'Negative' && glucose == 'Negative' && ketones == 'Negative' &&  ph == "Abnormal" &&  blood == "Negative") {
		kidney_health = "Good"
	}else if(protein == 'Negative' && glucose == 'Negative' && ketones == 'Negative' &&  ph == "Normal" &&  blood == "Positive") {
		kidney_health = "Good"
	}

	// Everything negative - one thing trace
	else if(protein == 'Trace' && glucose == 'Negative' && ketones == 'Negative' &&  ph == "Normal" &&  blood == "Negative") {
		kidney_health = "Good"
	}else if(protein == 'Negative' && glucose == 'Trace' && ketones == 'Negative' &&  ph == "Normal" &&  blood == "Negative") {
		kidney_health = "Good"
	}else if(protein == 'Negative' && glucose == 'Negative' && ketones == 'Trace' &&  ph == "Normal" &&  blood == "Negative") {
		kidney_health = "Good"
	}else if(protein == 'Negative' && glucose == 'Negative' && ketones == 'Negative' &&  ph == "Normal" &&  blood == "Trace") {
		kidney_health = "Good"
	} else {
		kidney_health = "Good"
	}
	




	// Hydration
		// Specific Gravity
		//https://www.healthline.com/health/urine-specific-gravity#results
		// Specific gravity results above 1.010 can indicate mild dehydration. //The higher the number, the more dehydrated you may be.
		//https://alliedhealth.ceconnection.com/files/UrineDipstickTestingEverythingYouNeedtoKnow-1440776910971.pdf
		//The normal USG ranges from 1.003 to 1.030. USG less than 1.010 
		//is suggestive of relative hydration, and values greater than 1.020 in- dicate relative dehydration.
		let hydration = ""
		if(specific_gravity == 'Abnormal-hydration'){
			hydration = "Excessive Hydration"
		} else if (specific_gravity == 'Normal'){
			hydration = "Optimal"
		} else if (specific_gravity == 'Normal-dehydration'){
			hydration = "Possible dehydration"
		}
	
	
	// pH
		// nor- mal serum pH is 7.4, but the normal urinary pH ranges from 4.5 to 8. Because of normal metabolic activ- ity,
		//the generally accepted normal pH of urine is about 5.5 to 6.5.
		let ph_diagnosis = ""
		if(ph == 'Abnormal (5)'){
			ph_diagnosis = "Acidic"
		} else if ( ph == 'Normal'){
			ph_diagnosis = "Normal"
		}
		else if (ph == 'Abnormal (8.5)'){
			ph_diagnosis = "Alkaline"
		}

	
	// Ketones 
		let ketones_diagnosis = ""
		if(ketones == 'Negative'){
			ketones_diagnosis = "Low Ketosis"
		} else if ( ketones == 'Trace'){
			ketones_diagnosis = "Low Ketosis"
		}
		else if (ketones == 'Positive'){
			ketones_diagnosis = "Ketoacidosis"
		}
	
		let email = sessionStorage.getItem("email");

	return (
		<div className="dipstik-results">
			<Header />
			<h1>Dipstik Results</h1>

			{ email.includes('@dipstik.com') && ( 
				<div>
					<a href="https://forms.office.com/e/dpnjQfcVs3" target="_blank" >Click here to complete User Evaluation Survey</a>
				</div>
			)};

			<div className="results-switcher-container">
				<div className="results-switcher-button-container">
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
								<p>{urinary_tract_infection}</p>
							</div >
							<div className="results-box">
								<p><b>White Blood Cells</b></p>
								<p>{white_blood_cells}</p>
							</div>
							<div className="results-box">
								<p><b>Liver Health</b></p>
								<p>{liver_health}</p>
							</div >
							<div className="results-box">
								<p><b>Kidney Health</b></p>
								<p>{kidney_health}</p>
							</div>
							<div className="results-box">
								<p><b>Hydration:</b></p>
								<p>{hydration}</p>
							</div>
							<div className="results-box">
								<p><b>pH:</b></p>
								<p>{ph_diagnosis}</p>
							</div>
							
							<div className="results-box">
								<p><b>Ketone:</b></p>
								<p>{ketones_diagnosis}</p>
							</div>
						</div>
					)}


					<Link to="/dipstik/dipstik-camera">
						<button> Back </button>
					</Link>

					<Link to="/dipstik/dipstik-results">
						<button> Results </button>
					</Link>
				</div>
		</div>
	);
}

export default DipstikResults;