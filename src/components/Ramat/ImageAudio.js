import React, { useState, useRef, useEffect } from "react";
import {default as Camera} from "./ParalysisAnalysisCamera";
import AudioRecorder from "../AudioRecorder";
import {SpinnerCircularFixed} from "spinners-react";
import InfoPanel from "./InfoPanel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App/App.css";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

//This component is used to take pictures
//pictures are stored in the imageSrc variable after taking it
const ImageAudio = (props) => {
	const webcamRef = useRef(null);
	const [image, setImage] = useState(null);
	const [showAudio, setShowAudio] = useState(false);
	const [audio, setAudio] = useState(false);
	const [serverResponse, setServerResponse] = React.useState(null);
	const [displayMessage, setDisplayMessage] = React.useState(null);
	const [showInfoPanel, setShowInfoPanel] = React.useState(true);
	let [hasMounted, setHasMounted] = useState(false);



	const submitAll = async (blob) => {
		setAudio(blob);
		console.log(blob);
		let file = new File([blob], "voice.wav", {
			type: "audio/wav",
		});

		var formData = new FormData();
		formData.append("audio", file);
		formData.append("image", image);

		try {
			const response = await axios.post(BASEURL + "ramat", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			console.log(response);
			setServerResponse(response);
		} catch (error) {
			console.error(error);
		}
	};

	const restart = () => {
		setServerResponse(null);
		setImage(null);
		setShowAudio(false);
		setAudio(null);
	};

	const call999 = () => {
		window.open('tel:+447846054321');
	}

	const getDisplayMessage = () => {
		const jsonResponse = JSON.stringify(serverResponse.data.msg)
		const droop_prediction = jsonResponse.face_prediction
		const dys_prediction = jsonResponse.voice_prediction
		console.log(serverResponse)
		console.log(jsonResponse)
		console.log(droop_prediction)
		console.log("-------------------------------")

		if(serverResponse.status === 422){
			setDisplayMessage(jsonResponse)
			return
		}

		setDisplayMessage(jsonResponse)
		return

		if(droop_prediction === "no droop" && dys_prediction < 75){
			setDisplayMessage("You are not displaying any signs of facial droop or slurring.")
		}else if(droop_prediction === "droop" && dys_prediction < 75){
			setDisplayMessage("Uh oh, you seem to be displaying a symptom of stroke with a certainty of 56%. Call 999 immediately!")
			call999()
		}else if(droop_prediction === "no_droop" && dys_prediction > 75){
			setDisplayMessage("Uh oh, you seem to be displaying a symptom of stroke with a certainty of 90%. Call 999 immediately!")
			call999()
		}else if(droop_prediction === "droop" && dys_prediction > 75){
			setDisplayMessage("Uh oh, you seem to be displaying two symptom of stroke with a certainty of 50%. Call 999 immediately!")
			call999()
		}
	}

	useEffect(() => {
		if (hasMounted && serverResponse !== null) {
			getDisplayMessage()
		} else {
			setHasMounted(true);
		}
	}, [serverResponse]);


	return (
		<div className = "paralysis-container">
			{showInfoPanel && (
				<div style={{height: "100%", width: "100%", justifyContent: "center", alignItems: "center", display: "flex"}}>
					<div className="paralysis-layered-container paralysis-overlay"/>
					<InfoPanel visible={setShowInfoPanel}/>
				</div>
			)}
			<div className="paralysis-layered-container paralysis-component-container ">

				{!showAudio && (
					<>
					<h2 style={{ marginTop: "1%" }}>Welcome to Paralysis Analysis</h2>

					<button className="paralysis-info-button" onClick={() => {setShowInfoPanel(true)}}>
						What is Paralysis Analysis?
					</button>

					<div className="paralysis-split-container">
						<li><span style={{ verticalAlign: "center" }}><p className="paralysis-text-container">
							Straighten your head as best as you can, keep a neutral expresssion and take a picture.
						</p></span></li>
						<li><span style={{ verticalAlign: "top" }}><Camera endpoint="ramat/image" returnImage={setImage} returnFinished={setShowAudio} /></span></li>
					</div>
					</>
				)}
				{showAudio && !audio && (
					<>
						<p style={{ paddingTop: "3%", }}>Record yourself saying the following prompt and submit when ready:</p>
						<p>
							<em>The quick brown fox jumps over the lazy dog</em>
						</p>
						<AudioRecorder returnAudio={setAudio} returnFinished={submitAll} />
					</>
				)}
				{showAudio && audio && !serverResponse && (
					<div className = "paralysis-loader-container">
						<SpinnerCircularFixed
							color="#0B603E"
							size={"90%"}
							enabled={true}
							aria-label="Audio Spinner"
							data-testid="loader"
						/>
					</div>
				)}
				{serverResponse && (
					<>
						<h2 style={{ paddingTop: "3%", paddingBottom: "3%" }}>{displayMessage}</h2>
						<a href="tel:+447846054321">
							Call Emergency Services
						</a>

						<div className="paralysis-symptoms-container">
							<p>Symptoms of a stroke include:</p>
							<li>A sudden headache</li>
							<li>A sudden weakness or numbness in your arms, legs or face, particularly on one side of your body</li>
							<li>Sudden difficulty speaking or understanding speech</li>
							<li>Sudden confusion</li>
							<li>Sudden trouble walking, dizziness, loss of balance or lack of coordination</li>
							<li>Sudden trouble seeing out of one or both eyes</li>
							<li>Sudden severe headache with no known cause</li>
							<p style={{marginTop: "5%"}}>If you are displaying <strong>even one of these symptoms</strong>, call emergency services immediately</p>
							<p>For more information see the CDC website</p>
						</div>
						<button className ="paralysis-button" style={{width: "80%", fontSize: "90%"}} onClick={restart}>Restart</button>

					</>
					
				)}
			</div>
		</div>
	);
};

// Found at:
// https://usehooks.com/useWindowSize/
function useWindowSize() {
	// Initialize state with undefined width/height so server and client renders match
	// Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
	const [windowSize, setWindowSize] = React.useState({
		width: undefined,
		height: undefined,
	});
	React.useEffect(() => {
		// Handler to call on window resize
		function handleResize() {
			// Set window width/height to state
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}
		// Add event listener
		window.addEventListener("resize", handleResize);
		// Call handler right away so state gets updated with initial window size
		handleResize();
		// Remove event listener on cleanup
		return () => window.removeEventListener("resize", handleResize);
	}, []); // Empty array ensures that effect is only run on mount
	return windowSize;
}

export default ImageAudio;
