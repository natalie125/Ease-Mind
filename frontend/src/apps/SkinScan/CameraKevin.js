import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SkinScan.css";

let BASEURL = "";
process.env.NODE_ENV === "development"
  ? (BASEURL = process.env.REACT_APP_DEV)
  : (BASEURL = process.env.REACT_APP_PROD);

//This component is used to take pictures
//pictures are stored in the imageSrc variable after taking it
//Not sure what to do after picture is stored in the imageSrc variable
const WebcamCapture = (props) => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [frontFacing, setFrontFacing] = React.useState(true);
  const [serverResponse, setServerResponse] = React.useState(null);
  const [prediction, setPrediction] = React.useState(null);
  const [showSubmission, setShowSubmission] = React.useState(false);
  const navigate = useNavigate();
  const token_JSON = JSON.parse(sessionStorage.getItem("token"));
  //pass endpoint in as a props to the component whichever endpoint you want to send the image to.
  //if in doubt how to do that please refer to shreyas.js
  //if no context is provided it will send to /upload endpoint
  let context = props.context || "upload";
  context = context.toString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    //get the specific token string
    const token = token_JSON.data.token;
    formData.append("image", imageSrc);
    setShowSubmission(true);
    const response = await axios(BASEURL + context, {
      method: "post",
      data: formData,
      headers: {
        //add authorization header
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(response => {
        // console.log(response);
        // console.log(response.data);
        setServerResponse(response.data['msg']); // msg variable: whether user should be routed to positive or negative outcome page.
        setPrediction(response.data['pred']); // Raw prediciton value of ML algorithm on backend
        // Code above gets text from backend response, to be used in next pages seen by user

      })
      .catch(error => {
        // console.log("error with response");
        // console.error(error);
      });
  }

  // set imageSrc variable as captured image by user.
  // Used to send image to backend.
  // Also used to show captured image to user.
  const handleTakePicture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  };

  // Using button to change what camera is being used
  // Should work based on MDN documentation: https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode
  // But I cannot test properly as its running on a laptop.
  const switchCameraFacing = React.useCallback(() => {
    if (frontFacing) {
      setFrontFacing(false);
    }
    else {
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
  };

  // Code below dictates which camera is being used by device
  // Useful for running on mobile applicaton
  var cameraConstraints;
  if (frontFacing) {
    var x = "user";
    cameraConstraints = {
      width: {
        min: cameraWidth,
        max: cameraWidth
      },
      height: {
        min: cameraHeight,
        max: cameraHeight
      },
      facingMode: { x }
    };
  } else {
    cameraConstraints = {
      width: {
        min: cameraWidth,
        max: cameraWidth
      },
      height: {
        min: cameraHeight,
        max: cameraHeight
      },
      facingMode: { exact: "environment" }
    };
  }

  // Following Shreyas' Implementation of rerouting user based on backend reponse

  const skin_outcome = (serverResponse) => {

    // Store the ML Backend Algorithm prediction in SessionStorage, to allow for easy access on outcome page.
    sessionStorage.setItem('prediction-skin-cancer', prediction)
    if (serverResponse === 0) navigate("/skin-scan/outcome_negative", { replace: true });
    else navigate("/skin-scan/outcome_positive", { replace: true });
  }

  const handleRetake = () => {
    setImageSrc(null);
  }

  return (
    <>
      {(showSubmission) ? (
        <div>
          <h3 data-cy="subConfirm"> Image submission being processed</h3>
          <p>Please remain on this page whilst your image is being analysed. Once complete, you will automatically be relocated to your results page.</p>
          <p>Leaving this page will lead to the results of this submission being lost.</p>
        </div>
      ) : (


        <div>

          {(imageSrc) ? (
            <div className="cam-page-kevin">
              <div className="cam-container-kevin">
                <div className="cam-box-kevin">
                  <p> Captured image displayed below:</p>
                  <img src={imageSrc} style={{ width: cameraWidth, borderRadius: "5px" }} alt="User's capture" />
                </div>
                <div className="gap-camera-kevin"></div>
                <div className="bttn-container-kevin">
                  <button className="cam-button-kevin" data-cy="cameraSubmit" disabled={imageSrc === null} onClick={handleSubmit}>Submit Image</button>
                  <button className="cam-button-kevin" data-cy="cameraRetakePhoto" onClick={handleRetake}>Retake Picture</button>
                </div>

              </div>
              <p> Please ensure the image captured is clear and in focus, with the lesion to be analysed positioned in the center of the image.</p>
            </div>

          ) : (
            <div className="cam-page-kevin">
              <div className="cam-container-kevin">
                <div className="cam-box-kevin">
                  <p> Use camera window to capture lesion image:</p>
                  {/* HACK: 0 When route testing, but we don't care about this components function when testing routes, and won't unit test legacy code. */}
                  <Webcam className="webcam-kevin" videoConstraints={cameraConstraints} width={isNaN(cameraWidth) ? 0 : cameraWidth} height={isNaN(cameraHeight) ? 0 : cameraHeight} audio={false} ref={webcamRef} />
                </div>
                <div className="gap-camera-kevin"></div>
                <div className="bttn-container-kevin">
                  <button className="cam-button-kevin" data-cy="cameraTakePhoto" onClick={handleTakePicture}>Take Picture</button>
                  <button className="cam-button-kevin" data-cy="cameraSwitch" onClick={switchCameraFacing}>Change Camera</button>
                </div>
              </div>
            </div>
          )}
        </div>

      )}

      <div>
        {/* Implementation of Skin Cancer tool using shreyas' routing approach */}
        {context === "kevin" && serverResponse === 0 && (
          skin_outcome(serverResponse)
        )}
        {context === "kevin" && serverResponse === 1 && (
          skin_outcome(serverResponse)
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

export default WebcamCapture;
