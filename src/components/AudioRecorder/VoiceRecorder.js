import Recorder from "recorder-js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CantinaBand3 from "./CantinaBand3.wav";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

const VoiceRecorder = (props) => {
	const [isRecording, setIsRecording] = useState(false);
	const [audioBlob, setAudioBlob] = useState(null);

	const audioContext = new (window.AudioContext || window.webkitAudioContext)();

	const recorder = new Recorder(
		audioContext
		// An array of 255 Numbers
		// You can use this to visualize the audio stream
		// If you use react, check out react-wave-stream
		//onAnalysed: (data) => console.log(data),
	);

	navigator.mediaDevices
		.getUserMedia({ audio: true })
		.then((stream) => recorder.init(stream))
		.catch((err) => console.log("Uh oh... unable to get stream...", err));

	const startRecording = () => {
		recorder
			.start()
			.then(() => {
				setIsRecording(true);
			})
			.catch((e) => {
				console.error(e);
			});
	};

	const stopRecording = () => {
		// buffer is an AudioBuffer
		recorder
			.stop()
			.then(({ buffer, blob }) => {
				console.log(blob);

				setIsRecording(false);
				setAudioBlob(blob);
				console.log(buffer);
				download();
			})
			.catch((e) => {
				console.error(e);
			});
	};

	const download = () => {
		addAudioElement();
		//Recorder.download(audioBlob, "my-audio-file"); // downloads a .wav file
	};

	const addAudioElement = async () => {
		// remove existing audio component
		if (document.body.contains(document.getElementById("recording"))) {
			document.body.removeChild(document.getElementById("recording"));
		}

		// create new audio component
		const url = URL.createObjectURL(audioBlob);
		const audio = document.createElement("audio");

		audio.setAttribute("id", "recording");
		audio.src = url;
		audio.controls = true;

		document.body.appendChild(audio);
	};

	const doWhatever = () => {
		setAudioBlob(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		let metadata = {
			type: audioBlob.type,
		};
		let file = new File([audioBlob], "test.wav", metadata);

		var formData = new FormData();
		formData.append("audio", file);
		try {
			const response = await axios.post(BASEURL + props.context, formData, {
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-Type": "multipart/form-data",
				},
			});
			console.log(response);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<button onClick={startRecording}>Start recording</button>
			<button onClick={stopRecording}>Stop recording</button>
			<button onClick={doWhatever}>whatever</button>
			<button onClick={handleSubmit}>Send recording</button>
		</div>
	);
};

export default VoiceRecorder;
