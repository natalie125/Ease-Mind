import React, { useState, useRef, useEffect } from "react";
import Camera from "./Camera";
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
					"Access-Control-Allow-Origin": "*",
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

	return (
		<>
			<div className="cam-horizontal-container">
				{!showAudio && (
					<>
						<div className="tons-page-camera-container">
							<div className="webcam-capture-holder">
								<p style={{ textAlign: "center", marginBottom: "20px" }}>
									Webcam capture below (to use flash please brighten your screen)
								</p>
								<Camera
									endpoint="ramat/image"
									returnImage={setImage}
									returnFinished={setShowAudio}
								/>
							</div>
						</div>
					</>
				)}
				{showAudio && !audio && (
					<>
						<div className="tons-page-camera-container">
							<AudioRecorder returnAudio={setAudio} returnFinished={submitAll} />
						</div>
					</>
				)}
				{serverResponse && (
					<>
						<div className="tons-page-camera-container">
							<p>Response: {serverResponse}</p>
							<button onClick={restart}>Restart</button>
						</div>
					</>
				)}
			</div>
		</>
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
