import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowsRotate, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import * as cvstfjs from "@microsoft/customvision-tfjs";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

//This component is used to take pictures
//pictures are stored in the imageSrc variable after taking it
const DipstikCamera = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageSent, setImageSent] = useState(false);
  // eslint-disable-next-line
  const [backFacing, setBackFacing] = useState(true);
  const [dipstickDetected , setDipstickDetected ] = useState(0);
  const [cameraWorking , setCameraWorking ] = useState(true);
	let navigate = useNavigate();

  //get the json from the memory
	const token_JSON = sessionStorage.getItem("token");

  let context = 'lanre'; 
  context = context.toString();


// Handle what happens when image is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    //get the specific token string
		const token = token_JSON.data.token;

    formData.append("image", imageSrc);
    formData.append("email", sessionStorage.getItem("email"));
    setImageSent(true);
    const response = await axios(BASEURL + context,{
      method: "post",
      data: formData,
      headers: {
        // "Access-Control-Allow-Origin": "*",
        //add authorization header
				Authorization: "Bearer " + token,
				"Content-Type": "multipart/form-data",
      },
    })
    .then(response => {
      console.log(response);
      console.log(response.data);
      
      // save results in session storage
      sessionStorage.setItem("bilirubin",response.data.bilirubin);
      sessionStorage.setItem("blood", response.data.blood);
      sessionStorage.setItem("glucose", response.data.glucose);
      sessionStorage.setItem("ketones", response.data.ketones);
      sessionStorage.setItem("leukocytes", response.data.leukocytes);
      sessionStorage.setItem("nitrite", response.data.nitrite);
      sessionStorage.setItem("ph", response.data.ph);
      sessionStorage.setItem("protein", response.data.protein);
      sessionStorage.setItem("specific_gravity", response.data.specific_gravity);
      sessionStorage.setItem("urobilinogen", response.data.urobilinogen);

      if(response != null) {
        navigate("/dipstik/dipstik-results")
      }
    })
    .catch(error=> {
      console.error(error);
    });
    console.log(response);
  }


//takes pictures without flash
  const handleTakePicture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    detectDipstick();
    console.log(window.location.href)
  };

//resets picture source and retakes picture
const handleRetakePicture = () => {
  setImageSrc(null);
  setDipstickDetected(0);
};


// dipstick object detection model
const detectDipstick = async () => {
  let model = new cvstfjs.ObjectDetectionModel();
  // load the tensorflow  model hosted on aws s3
  await model.loadModelAsync('https://dipstick-model.s3.eu-west-2.amazonaws.com/model.json');
  const image = document.getElementById('image');
  const result = await model.executeAsync(image);
  console.log("*************Detecting Dipstick in image*************");
  console.log(result);

  if (result[1][0] > 0.5) {
    setDipstickDetected(1);

  }else{
    setDipstickDetected(-1);
  }
};


//**************************************************************** 
  // COMBINED
  // 	Trying to do the dimensions stuff.
	// Rounded to floats to ensure dimensions used here make sense, only issue I see right now
  const windowSize = useWindowSize();
  var cameraHeight = Math.round(windowSize.height);
  var cameraWidth = Math.round(windowSize.width);

	// This code attempts for the dimensions of the camera to be in a 1:1 aspect ratio, by taking the previous measurements of the size of the screen.
	// Takes the smaller of the two calcs of width and height, to ensure it will fit on the screen.
	var minValue = cameraWidth;

  if (cameraWidth > 400){
    cameraWidth = 400;
  }

  if (cameraHeight > 719) {
    cameraHeight = 719;
  }

  if (cameraHeight < minValue){
      minValue = cameraHeight;
      cameraWidth = minValue;
  }else{
      // cameraHeight = cameraHeight;
      cameraWidth = cameraWidth * 0.9;
  };

	var cameraConstraints;

  // show back camera first
	if (backFacing) {
    cameraConstraints = {
			width: {
				// min: cameraWidth,
				// max: cameraWidth,
			},
			height: {
				// min: cameraHeight,
				// max: cameraHeight,
			},
			facingMode: { exact: "environment" },
		};	
	} else {
    var x = "user";
		cameraConstraints = {
			width: {
				// min: cameraWidth,
				// max: cameraWidth,
			},
			height: {
				// min: cameraHeight,
				// max: cameraHeight,
			},
			facingMode: { x },
		};
	}

  // console.log(cameraConstraints)
  // console.log(cameraHeight)
 
// Checks if webcam is working
  useEffect(() => {
    const interval = setInterval(() => {
      if (webcamRef.current && webcamRef.current.video) {
        if (webcamRef.current.video.readyState === 4) {
          setCameraWorking(true);
        } else {
          setCameraWorking(false);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

// // // COMBINED END
// // //****************************************************************

  return (
    <>

    {/* Show camera */}
    <div>

    {!imageSrc && imageSent === false &&  (
			<>
        {/* Display message if camera not working */}
        <div className="camera-container">
          <div className="overlay-ancestor">
            <Webcam className="lanre-webcam" videoConstraints={cameraConstraints} ref={webcamRef} marginWidth={"0px"} screenshotQuality="1" />
            
            {cameraWorking && ( 
              <>
              <div className="camera-overlay" id="camera-overlay"></div>
              <div className="camera-buttons-container">
                <p className="camera-instructions">Fit the dipstick within the guides</p>
                <button onClick={handleTakePicture} className="camera-button"></button>
              </div>
              </>
            )}
          </div>
        </div>

        
      </> 
		)}

    {/* SHOW A MESSAGE IS THE CAMERA DOES NOT LOAD */}
    {!cameraWorking && ( 
          <h4> Failed to load camera. <br/><br/> Please refresh your browser! <br/> <br/>
          Please ensure you are on a mobile device!
          </h4>
        )}
    </div>

    {/* Show the taken image */}
      <div>
        {imageSrc && imageSent === false && (
          <>
            <div className="taken-pic-container">
              <div>
                {/* <p className="detecting-dipstick-message"> Detecting dipstick....</p> */}
              </div>
              <img id="image" src={imageSrc} width={minValue} alt="Captured Dipstick" />
              <div className="taken-pic-buttons-overlay-container">
                {/* Show a message that dipstick is being detected */}
                {dipstickDetected === 0 && (
                  <p className="detecting-dipstick-message"> Detecting dipstick... </p>)}

                {dipstickDetected === 1 && (
                  <p className="detecting-dipstick-message success"> Dipstick detected </p>)}

                {dipstickDetected === -1 && (
                  <p className="detecting-dipstick-message failure"> Dipstick not detected </p>)}


                {/* SEND BUTTON */}
                <div>
                  <button onClick={handleRetakePicture} className="camera-button"><FontAwesomeIcon icon={faArrowsRotate} className="camera-icon"/></button>

                  {dipstickDetected === 1 && (
                  <button onClick={handleSubmit} className="camera-button"><FontAwesomeIcon icon={faPaperPlane} className="camera-icon"/></button>)}
                </div>

              </div>
            </div>
          </>
        )}
      </div>

      {/* Show a message that results are being processed */}
      <div>
        {imageSrc && imageSent === true  && (
          <div>
            <div className="loader-container">
              <h2 className="processing-results-text"> Processing your results...</h2>
              <div className="spinner"></div>
            </div>
          </div>
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

export default DipstikCamera;
