import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App/App.css";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

//This component is used to take pictures
//pictures are stored in the imageSrc variable after taking it
const Camera = (props) => {
	const webcamRef = useRef(null);
	const [imageSrc, setImageSrc] = useState(null);
	const [flash, setFlash] = useState(false);
	const [frontFacing, setFrontFacing] = React.useState(true);
	const [serverResponse, setServerResponse] = React.useState(null);

	//takes pictures without flash
	const handleTakePicture = () => {
		const imageSrc = webcamRef.current.getScreenshot();
		setImageSrc(imageSrc);
		props.returnImage(imageSrc);
	};

	//takes pictures with flash
	const handleTakePictureWithFlash = () => {
		setFlash(true);
		setTimeout(() => {
			const imageSrc = webcamRef.current.getScreenshot();
			setImageSrc(imageSrc);
			props.returnImage(imageSrc);
			setFlash(false);
		}, 1000);
	};

	//takes pictures without flash
	const handleRetakePicture = () => {
		setImageSrc(null);
	};

	//takes pictures without flash
	const handleNext = () => {
		props.returnFinished(true);
	};

	// Using button to change what camera is being used
	// Should work based on MDN documentation: https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode
	// But I cannot test properly as its running on a laptop.
	const switchCameraFacing = React.useCallback(() => {
		if (frontFacing) {
			setFrontFacing(false);
		} else {
			setFrontFacing(true);
		}
	}, [frontFacing]);

	// Trying to do the dimensions stuff.
	// Rounded to floats to ensure dimensions used here make sense, only issue I see right now - the videos will record in different format each time.
	const size = useWindowSize();
	var cameraWidth = Math.round(size.width * 0.8);
	var cameraHeight = Math.round(size.height * 0.5);

	// This code attempts for the dimensions of the camera to be in a 1:1 aspect ratio, by taking the previous measurements of the size of the screen.
	// Takes the smaller of the two calcs of width and height, to ensure it will fit on the screen.
	var minValue = cameraWidth;

	if (cameraHeight < minValue) {
		minValue = cameraHeight;
		cameraWidth = minValue;
	} else {
		cameraHeight = minValue;
	}

	var cameraConstraints;
	if (frontFacing) {
		var x = "user";
		cameraConstraints = {
			width: {
				min: cameraWidth,
				max: cameraWidth,
			},
			height: {
				min: cameraHeight,
				max: cameraHeight,
			},
			facingMode: { x },
		};
	} else {
		cameraConstraints = {
			width: {
				min: cameraWidth,
				max: cameraWidth,
			},
			height: {
				min: cameraHeight,
				max: cameraHeight,
			},
			facingMode: { exact: "environment" },
		};
	}

	//two buttons, one for taking pictures with flash and one for without
	return (
		<>
			<div className="cam-horizontal-container">
				{!imageSrc && (
					<>
						<div style={{ width: "80%", paddingRight: "5px" }}>
							<Webcam
								className="webcam"
								videoConstraints={cameraConstraints}
								ref={webcamRef}
								style={{ width: "100%" }}
							/>
						</div>
						<div className="cam-button-container">
							<button className="cam-button" onClick={handleTakePicture}>
								Take Picture
							</button>
							<button className="cam-button" onClick={handleTakePictureWithFlash}>
								Take Picture With Flash
							</button>
							<button className="cam-button" onClick={switchCameraFacing}>
								Change Camera
							</button>
						</div>
					</>
				)}
				{imageSrc && (
					<>
						<div style={{ width: "80%", paddingRight: "5px" }}>
							<img src={imageSrc} style={{ width: "100%", borderRadius: "5px" }} alt="Captured" />
						</div>
						<div className="cam-button-container">
							<button className="cam-button" onClick={handleRetakePicture}>
								Retake Picture
							</button>
							<button className="cam-button" onClick={handleNext}>
								Next
							</button>
						</div>
					</>
				)}
			</div>
			<div>{flash && <div className="flash" />}</div>
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

export default Camera;
