import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

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
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

// This component is used to take pictures
// pictures are stored in the imageSrc variable after taking it
// Not sure what to do after picture is stored in the imageSrc variable
function WebcamCapture(props) {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [flash, setFlash] = useState(false);
  const [frontFacing, setFrontFacing] = React.useState(true);
  const [serverResponse, setServerResponse] = React.useState(null);
  const navigate = useNavigate();
  // get the json from the memory
  const tokenJSON = sessionStorage.getItem('token');
  // pass endpoint in as a props to the component whichever endpoint you want to send the image to.
  // if in doubt how to do that please refer to shreyas.js
  // if no context is provided it will send to /upload endpoint
  // eslint-disable-next-line
  let context = props.context || 'upload';
  context = context.toString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // get the specific token string
    const { token } = tokenJSON.data;
    formData.append('image', imageSrc);
    await axios(BASEURL + context, {
      method: 'post',
      data: formData,
      headers: {
        // add authorization header
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        setServerResponse(response.data.msg);
      })
      .catch((error) => {
        throw error;
        // TODO: Use error page.
      });
  };

  // takes pictures without flash
  const handleTakePicture = () => {
    setImageSrc(webcamRef.current.getScreenshot());
  };

  // takes pictures with flash
  const handleTakePictureWithFlash = () => {
    setFlash(true);
    setTimeout(() => {
      setImageSrc(webcamRef.current.getScreenshot());
      setFlash(false);
    }, 1000);
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
  let cameraWidth = Math.round(size.width * 0.8);
  let cameraHeight = Math.round(size.height * 0.5);

  // This code attempts for the dimensions of the camera to be in a 1:1 aspect ratio, by taking the previous measurements of the size of the screen.
  // Takes the smaller of the two calcs of width and height, to ensure it will fit on the screen.
  let minValue = cameraWidth;

  if (cameraHeight < minValue) {
    minValue = cameraHeight;
    cameraWidth = minValue;
  } else {
    cameraHeight = minValue;
  }

  let cameraConstraints;
  if (frontFacing) {
    const x = 'user';
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
      facingMode: { exact: 'environment' },
    };
  }

  const tonsOutcome = (_serverResponse) => {
    if (_serverResponse === 0) navigate('/shreyas/tonsillitis_outcome_1', { replace: true });
    else navigate('/shreyas/tonsillitis_outcome_2', { replace: true });
  };

  // two buttons, one for taking pictures with flash and one for without
  return (
    <>
      <div className="cam-horizontal-container">
        <div style={{ width: '80%', paddingRight: '5px' }}>
          <Webcam
            className="webcam"
            videoConstraints={cameraConstraints}
            ref={webcamRef}
            style={{ width: '100%' }}
          />
        </div>
        <div
          style={{
            width: '20%',
            paddingLeft: '5px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <button type="button" className="cam-button" onClick={handleTakePicture}>
            Take Picture
          </button>
          <button type="button" className="cam-button" onClick={handleTakePictureWithFlash}>
            Take Picture With Flash
          </button>
          <button type="button" className="cam-button" onClick={switchCameraFacing}>
            Change Camera
          </button>
          <button type="button" className="cam-button" onClick={handleSubmit}>
            Submit Image
          </button>
        </div>
      </div>
      <div>
        {flash && <div className="flash" />}
        {imageSrc && (
          <img src={imageSrc} style={{ width: '100%', borderRadius: '5px' }} alt="Captured" />
        )}
      </div>
      <div>
        {context === 'shreyas' && serverResponse === 0 && tonsOutcome(serverResponse)}
        {context === 'shreyas' && serverResponse === 1 && tonsOutcome(serverResponse)}
      </div>
    </>
  );
}

export default WebcamCapture;
