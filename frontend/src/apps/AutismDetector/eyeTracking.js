import React, {
  useRef, useEffect, useContext, useState,
} from 'react';
import axios from 'axios';
import { AuthTokenContext } from '../../App';

// Determine the base URL depending on the environment
const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

const useCameraStream = () => {
  const videoRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
    const setupCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);

          recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              setRecordedChunks((prev) => [...prev, event.data]);
            }
          };
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    };

    setupCameraStream();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    videoRef, mediaRecorder, isRecording, setIsRecording, recordedChunks, setRecordedChunks,
  };
};

function EyeTracking() {
  const { token } = useContext(AuthTokenContext);
  const {
    videoRef,
    mediaRecorder,
    isRecording,
    setIsRecording,
    recordedChunks,
    setRecordedChunks,
  } = useCameraStream();
  const [predictionResult, setPredictionResult] = useState('');
  const [timer, setTimer] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  const handleRecording = () => {
    setIsRecording(true);
    setRecordedChunks([]);
    mediaRecorder.start();
    setTimer(0);
    const interval = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime < 19) {
          return prevTime + 1;
        }
        clearInterval(interval);
        stopRecording();
        setShowOptions(true);
        return 20; // Stop the timer at 20 seconds
      });
    }, 1000);
  };

  const sendVideoDataToBackend = async () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const formData = new FormData();
    formData.append('video', blob);
    try {
      const response = await axios.post(`${BASEURL}/api/eye-tracking-data`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.prediction) {
        setPredictionResult(response.data.prediction);
      }
    } catch (error) {
      console.error('Error sending video data:', error.response ? error.response.data : error.message);
    }
    setShowOptions(false);
  };

  return (
    <div style={{
      padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#F5F5F5',
    }}
    >
      <div style={{
        marginBottom: '10px', padding: '10px', backgroundColor: '#C68B77', color: 'white',
      }}
      >
        <p>Please look at the camera for a minimum of 20 seconds.</p>
        <br />
        <p>Please make sure the lighting is good and there is no one other than yourself in the frame.</p>
        <br />
        <p>Press &quot;Start Recording&quot; when ready. The timer will stop at 20 seconds and your feedback will be displayed below.</p>
      </div>
      <video ref={videoRef} style={{ width: '640px', height: '480px', border: '5px solid #C68B77' }} controls autoPlay muted />
      <br />
      <button
        type="button"
        onClick={handleRecording}
        disabled={isRecording}
        style={{
          margin: '5px', padding: '10px 20px', backgroundColor: '#C68B77', color: 'white', border: 'none', cursor: 'pointer',
        }}
      >
        Start Recording
      </button>
      <div style={{ color: '#C68B77', fontWeight: 'bold', fontSize: '20px' }}>
        Timer:
        {timer}
        seconds
      </div>
      {showOptions && (
        <div>
          <button
            type="button"
            onClick={sendVideoDataToBackend}
            style={{
              margin: '5px', padding: '10px 20px', backgroundColor: '#C68B77', color: 'white', border: 'none', cursor: 'pointer',
            }}
          >
            Track
          </button>
          <button
            type="button"
            onClick={handleRecording}
            style={{
              margin: '5px', padding: '10px 20px', backgroundColor: '#C68B77', color: 'white', border: 'none', cursor: 'pointer',
            }}
          >
            Retake Video
          </button>
        </div>
      )}
      {predictionResult && (
        <div style={{
          marginTop: '10px', padding: '10px', backgroundColor: '#C68B77', color: 'white',
        }}
        >
          <strong>
            Prediction Result:
          </strong>
          {predictionResult}
        </div>
      )}
    </div>
  );
}

export default EyeTracking;
