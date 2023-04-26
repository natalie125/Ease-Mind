import React, { useState, useRef, useEffect } from "react";
import {default as Camera} from "./ParalysisAnalysisCamera";
import AudioRecorder from "../AudioRecorder";
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
	let [hasMounted, setHasMounted] = useState(false);



	const submitAll = async (blob) => {
		setAudio(blob);
		console.log(blob);
		let file = new File([blob], "test.wav", {
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
			setServerResponse(JSON.stringify(response.data.msg));
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
		const jsonResponse = JSON.parse(serverResponse)
		const droop_prediction = jsonResponse.face_prediction
		const dys_prediction = jsonResponse.voice_prediction
			console.log(jsonResponse[1])

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
		<div className="paralysis-container">

			{!showAudio && (
				<>
				<h2 style={{ marginBottom: "1%" }}>Welcome to Paralysis Analysis</h2>

				<div className="paralysis-split-container">
					<p className="paralysis-text-container">
						Straighten your head as best as you can, keep a neutral expresssion and take a picture.
					</p>
					<Camera endpoint="ramat/image" returnImage={setImage} returnFinished={setShowAudio} />
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
			{serverResponse && (
				<>
					<h2 style={{ paddingTop: "3%", paddingBottom: "3%" }}>{displayMessage}</h2>
					<tr onclick={call999}>
						<td>Phone: 900 300 400</td>
					</tr>

					<button className ="paralysis-button" onClick={restart}>Restart</button>

				</>
				
			)}
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
