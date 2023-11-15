import React from "react";
import close from "../../images/close.png"
import "../../components/App/App.css";


const InfoPanel = (props) => {

	return (
		<div className = "paralysis-info-panel">
            <div style={{width: "100%", height: "10%", padding:"2%", justifyContent: "right", display: "flex"}}>
                <button className="paralysis-close-button" onClick={() => {props.visible(false)}}>
                    <img style={{height: "80%"}} src={close} alt="Close" aria-label="Close" />
                </button>
            </div>

            <h1>What is Paralysis Analysis?</h1>

            <div style={{padding: "10%"}}>
                <p style={{color: "red", paddingBottom: "5%"}}><strong>Note:</strong> This is just a prototype. Any diagnosis given should not be relied on. If you are worried you are having a stroke, call 999 < strong>immediately</strong>.</p>
                <p>Paralysis Analysis is an application that aims to determine if a user is showing signs of a stroke. It focuses on two common symptoms of stroke: facial droop and slurring of speech. </p>
                <p>You will need to take a picture of your face and a recording of your voice (a prompt is provided), then submit them. This will be stored temporarily and deleted after use.</p>
                <p>Your face and voice will be analysed for symptoms of stroke and a prediction of stroke is provided based on this analysis.</p>
                <p>This application uses two AI models to determine the probability that you are experiencing a stroke. One model has been trained on images of perople with facial droop and the other has been trained on audido recordings of individuals with dysarthria (slurred speech).</p>
            </div>


				
		</div>
	);
};

export default InfoPanel;
