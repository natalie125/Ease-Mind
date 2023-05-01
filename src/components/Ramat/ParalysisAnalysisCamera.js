import React, { useState, useRef } from "react";
import {isMobile} from 'react-device-detect';
import Webcam from "react-webcam";
import "../App/App.css";
import "./ParalysisAnalysis.css";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

//This component is used to take pictures
//pictures are stored in the imageSrc variable after taking it
const ParalysisAnalysisCamera = (props) => {
	const webcamRef = useRef(null);
	const [imageSrc, setImageSrc] = useState(null);
	const [frontFacing, setFrontFacing] = React.useState(true);

	//takes pictures without flash
	const handleTakePicture = () => {
		const imageSrc = webcamRef.current.getScreenshot();
		setImageSrc(imageSrc);
		props.returnImage(imageSrc);
	};

	//takes pictures without flash
	const handleRetakePicture = () => {
		setImageSrc(null);
	};

	//takes pictures without flash
	const handleNext = () => {
		props.returnFinished(true);
	};

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

	return (
		<>
			
				{!imageSrc && (
					<>
						<div className="paralysis-cam-container">
							<Webcam
								className="webcam"
								data-cy="activeCamera"
								videoConstraints={cameraConstraints}
								ref={webcamRef}
								style={{ maxWidth: "100%" }}
							/>
						</div>
						<div className="paralysis-cam-button-container">
							<button className="paralysis-cam-button" onClick={handleTakePicture} data-cy="takePicBttn">
								Take Picture
							</button>
							{
								isMobile && 
								<button className="paralysis-cam-button" onClick={switchCameraFacing} data-cy="switchCamBttn">
									Change Camera
								</button>
							}
						</div>
					</>
				)}
				{imageSrc && (
					<>

						<div className="paralysis-cam-container">
							<img src={imageSrc} style={{ borderRadius: "5px" }} alt="Captured face" data-cy="capturedImage" />
						</div>
						<div className="paralysis-cam-button-container">
							<button className="paralysis-cam-button" onClick={handleRetakePicture} data-cy="retakeBttn">
								Retake Picture
							</button>
							<button className="paralysis-cam-button" onClick={handleNext} data-cy="submitPicBttn">
								Next
							</button>
						</div>
					</>
				)}
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

export default ParalysisAnalysisCamera;
