import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import React, { useState, useEffect } from "react";
import { SpinnerRoundFilled } from "spinners-react";
import mic from "../../images/mic.png";
import "../Ramat/ParalysisAnalysis.css";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

const VoiceRecorder = (props) => {
	var audio = document.querySelector("audio");

	var isEdge =
		navigator.userAgent.indexOf("Edge") !== -1 &&
		(!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
	var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

	let [hasMounted, setHasMounted] = useState(false);
	let [microphone, setMicrophone] = useState(null);
	let [recorder, setRecorder] = useState(null);
	let [isRecording, setIsRecording] = useState(null);

	const captureMicrophone = (callback) => {
		if (microphone) {
			callback(microphone);
			return;
		}

		if (typeof navigator.mediaDevices === "undefined" || !navigator.mediaDevices.getUserMedia) {
			alert("This browser does not supports WebRTC getUserMedia API.");

			if (!!navigator.getUserMedia) {
				alert("This browser seems supporting deprecated getUserMedia API.");
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
			.then(function (mic) {
				callback(mic);
			})
			.catch(function (error) {
				alert("Unable to capture your microphone. Please check console logs.");
				console.error(error);
			});
	};

	const addAudioElement = (src) => {
		audio = document.querySelector("audio");
		var newAudio = document.createElement("audio");
		newAudio.controls = true;

		if (src) {
			newAudio.src = src;
		}

		var parentNode = audio.parentNode;
		parentNode.innerHTML = "";
		parentNode.appendChild(newAudio);

		audio = newAudio;
	};

	const stopRecordingCallback = () => {
		addAudioElement(URL.createObjectURL(recorder.getBlob()));
		setTimeout(function () {
			if (!audio.paused) return;

			setTimeout(function () {
				if (!audio.paused) return;
				audio.play();
			}, 1000);

			audio.play();
		}, 300);

		audio.play();
	};

	const initRecorder = () => {
		if (!microphone) {
			captureMicrophone(function (mic) {
				setMicrophone(mic);

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
	/////////////////////////////////////////////////
	// Button functions

	const startRecording = () => {
		addAudioElement();
		audio.muted = true;
		audio.srcObject = microphone;

		var options = {
			type: "audio",
			mimeType: "audio/wav",
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

		//props.returnAudio();
		props.returnFinished(recorder.getBlob());

		stopMicrophone();
	};

	return (
		<>
			<div className="paralysis-mic-container" data-cy="audioContainer">
				<div className="paralysis-mic-status-container">
					<img src={mic} className="paralysis-mic-img" alt="Microphone" />
					<div className="paralysis-layered-container paralysis-component-container {">
						<SpinnerRoundFilled
							color="#0B603E"
							size={"100%"}
							enabled={isRecording}
							aria-label="Audio Spinner"
							data-testid="loader"
							style={{minWidth: "90%"}}
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
					>
						Start Recording
					</button>
					<button
						id="btn-stop-recording"
						className="paralysis-mic-button"
						onClick={stopRecording}
						disabled={!isRecording}
						data-cy="stopVoiceRecording"
					>
						Stop Recording
					</button>

					<button
						id="btn-submit"
						className="paralysis-mic-button"
						onClick={handleSubmit}
						disabled={isRecording !== false}
						data-cy="submitVoiceRecording"

					>
						Submit
					</button>
				</div>

				<div className="paralysis-audio">
					<audio controls autoPlay playsInline></audio>
				</div>
			</div>
		</>
	);
};

export default VoiceRecorder;
