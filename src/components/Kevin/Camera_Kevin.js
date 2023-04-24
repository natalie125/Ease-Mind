import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App/App.css";
import "./Kevin.css";


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
  const navigate = useNavigate();
  //pass endpoint in as a props to the component whichever endpoint you want to send the image to.
  //if in doubt how to do that please refer to shreyas.js
  //if no context is provided it will send to /upload endpoint
  let context = props.context || "upload";
  context = context.toString();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", imageSrc);
    const response = await axios(BASEURL + context, {
      method: 'post',
      data: formData,
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        setServerResponse(response.data['msg']);
        setPrediction(response.data['pred']);

      })
      .catch(error => {
        console.error(error);
      });
  }

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
    if (serverResponse > 0.5){
      serverResponse = 1
    }else{
      serverResponse = 0
    }

    sessionStorage.setItem('prediction-skin-cancer',prediction)
    

    if (serverResponse === 0) navigate("/kevin/outcome_negative", { replace: true});
    else navigate("/kevin/outcome_positive", { replace: true});
  }


  //two buttons, one for taking pictures with flash and one for without
  return (
    <>
    <div className="cam-container-kevin">
      <div className="cam-box-kevin">
        <Webcam className = "webcam-kevin" videoConstraints={cameraConstraints} width={cameraWidth} height={cameraHeight} audio={false} ref={webcamRef} />
      </div>
      <div className="gap-camera-kevin"></div>
			{/* <br></br> */}
            <div className="bttn-container-kevin"> 
                <button className="cam-button-kevin" onClick={handleTakePicture}>Take Picture</button>
                <button className="cam-button-kevin" onClick={switchCameraFacing}>Change Camera</button>
                <button className="cam-button-kevin" onClick={handleSubmit}>Submit Image</button>
			    </div>
			</div>
      <p>Captured image can be reviewed below. Note: The most recently captured image using the Take photo button will be sent for analysis. Any other image captured will be deleted.</p>
            <div>
				{imageSrc && (
					<img src={imageSrc} style={{ width: cameraWidth, borderRadius: "5px" }} alt="User's captured image" />
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
