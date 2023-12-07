import React from 'react';
import { Webcam as ReactWebcam } from 'react-webcam';

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

export default function Webcam() {
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks],
  );

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm',
    });
    mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = 'react-webcam-stream-capture.webm';
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

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

  const aspectRatio = cameraWidth / cameraHeight;

  const videoConstraints = {
    width: {
      min: cameraWidth,
      max: cameraWidth,
    },
    height: {
      min: cameraHeight,
      max: cameraHeight,
    },
    aspectRatio,

  };

  // className added to webcam to allow edits with css
  return (
    <>
      <ReactWebcam className="webcam" videoConstraints={videoConstraints} width={cameraWidth} height={cameraHeight} audio={false} ref={webcamRef} />
      <div style={{ width: '100%' }}>
        {capturing ? (
          <button type="button" style={{ width: minValue }} onClick={handleStopCaptureClick}>Stop Capture</button>
        ) : (
          <button type="button" style={{ width: minValue }} onClick={handleStartCaptureClick}>Start Capture</button>
        )}
      </div>

      <p>
        the size of the windo is
        {size.height}
        {' '}
        x
        {size.width}
      </p>
      <p>
        camera width =
        {cameraWidth}
        {' '}
        and cameraHeight =
        {cameraHeight}
      </p>
      {recordedChunks.length > 0 && <button type="button" onClick={handleDownload}>Download</button>}
    </>
  );
}
