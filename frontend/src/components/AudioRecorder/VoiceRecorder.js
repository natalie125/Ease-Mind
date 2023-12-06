import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import React, { useState, useEffect } from 'react';
import { SpinnerRoundFilled } from 'spinners-react';
import mic from '../../images/mic.png';
import '../../apps/ParalysisAnalysis/ParalysisAnalysis.css';

function VoiceRecorder(props) {
  let audio = document.querySelector('audio');

  const isEdge = navigator.userAgent.indexOf('Edge') !== -1
    && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const [hasMounted, setHasMounted] = useState(false);
  const [microphone, setMicrophone] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(null);

  const captureMicrophone = (callback) => {
    if (microphone) {
      callback(microphone);
      return;
    }

    if (typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
      // eslint-disable-next-line
      alert('This browser does not supports WebRTC getUserMedia API.');

      if (navigator.getUserMedia) {
        // eslint-disable-next-line
        alert('This browser seems supporting deprecated getUserMedia API.');
      }
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: isEdge
          ? true
          : {
            echoCancellation: false,
          },
      })
      .then((_mic) => {
        callback(_mic);
      })
      .catch(() => {
        // TODO: Use error page here.
        // eslint-disable-next-line
        alert('Unable to capture your microphone. Please check console logs.');
      });
  };

  const addAudioElement = (src) => {
    audio = document.querySelector('audio');
    const newAudio = document.createElement('audio');
    newAudio.controls = true;

    if (src) {
      newAudio.src = src;
    }

    const { parentNode } = audio;
    parentNode.innerHTML = '';
    parentNode.appendChild(newAudio);

    audio = newAudio;
  };

  const stopRecordingCallback = () => {
    addAudioElement(URL.createObjectURL(recorder.getBlob()));
    setTimeout(() => {
      if (!audio.paused) return;

      setTimeout(() => {
        if (!audio.paused) return;
        audio.play();
      }, 1000);

      audio.play();
    }, 300);

    audio.play();
  };

  const initRecorder = () => {
    if (!microphone) {
      captureMicrophone((_mic) => {
        setMicrophone(_mic);

        if (isSafari) {
          addAudioElement();

          audio.muted = true;
          audio.srcObject = microphone;
        }
      });
    }
  };

  // initialise the microphone on the first render
  useEffect(() => {
    initRecorder();
  }, []);
  /// //////////////////////////////////////////////
  // Button functions

  const startRecording = () => {
    addAudioElement();
    audio.muted = true;
    audio.srcObject = microphone;

    const options = {
      type: 'audio',
      mimeType: 'audio/wav',
      recorderType: StereoAudioRecorder,
      numberOfAudioChannels: isEdge ? 1 : 2,
      checkForInactiveTracks: true,
      bufferSize: 16384,
    };

    if (isSafari || isEdge) {
      options.recorderType = StereoAudioRecorder;
    }

    if (isSafari) {
      options.sampleRate = 44100;
      options.bufferSize = 4096;
      options.numberOfAudioChannels = 2;
    }

    if (recorder) {
      recorder.destroy();
      setRecorder(null);
    }

    setRecorder(new RecordRTC(microphone, options));
    setIsRecording(true);
  };

  // start recording every time the state of the microphone changes
  useEffect(() => {
    if (hasMounted) {
      recorder.startRecording();
    } else {
      setHasMounted(true);
    }
  }, [recorder]);

  const stopRecording = () => {
    setIsRecording(false);
    recorder.stopRecording(stopRecordingCallback);
  };

  const stopMicrophone = () => {
    if (microphone) {
      microphone.stop();
      setMicrophone(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // props.returnAudio();
    // eslint-disable-next-line
    props.returnFinished(recorder.getBlob());

    stopMicrophone();
  };

  return (
    <div className="paralysis-mic-container" data-cy="audioContainer">
      <div className="paralysis-mic-status-container">
        <img src={mic} className="paralysis-mic-img" alt="Microphone" />
        <div className="paralysis-layered-container paralysis-component-container {">
          <SpinnerRoundFilled
            color="#0B603E"
            size="100%"
            enabled={isRecording}
            aria-label="Audio Spinner"
            data-testid="loader"
            style={{ minWidth: '90%' }}
          />
        </div>
      </div>
      <div className="paralysis-mic-button-container">
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0"
        />

        <button
          id="btn-start-recording"
          className="paralysis-mic-button"
          onClick={startRecording}
          disabled={isRecording}
          data-cy="startVoiceRecording"
          type="button"
        >
          Start Recording
        </button>
        <button
          id="btn-stop-recording"
          className="paralysis-mic-button"
          onClick={stopRecording}
          disabled={!isRecording}
          data-cy="stopVoiceRecording"
          type="button"
        >
          Stop Recording
        </button>

        <button
          id="btn-submit"
          type="button"
          className="paralysis-mic-button"
          onClick={handleSubmit}
          disabled={isRecording !== false}
          data-cy="submitVoiceRecording"

        >
          Submit
        </button>
      </div>

      <div className="paralysis-audio">
        {/* eslint-disable-next-line */}
        <audio controls autoPlay playsInline />
      </div>
    </div>
  );
}

export default VoiceRecorder;
