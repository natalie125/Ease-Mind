import RecordRTC, { StereoAudioRecorder, invokeSaveAsDialog } from "recordrtc";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CantinaBand3 from "./CantinaBand3.wav";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

const VoiceRecorder = (props) => {
	const [recorder, setRecorder] = useState(null);
	const [isRecording, setIsRecording] = useState(false);
	const [audioBlob, setAudioBlob] = useState(null);

	const startRecording = async () => {
		setIsRecording(true);
		console.log("1");
		console.log(recorder);

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: false,
				audio: true,
			});
			setRecorder(
				await RecordRTC(stream, {
					type: "audio",
					mimeType: "audio/wav",
					recorderType: StereoAudioRecorder,
				})
			);
			console.log("2");
			console.log(recorder);

			await recorder.startRecording();

			console.log("3");
			console.log(recorder);
		} catch (error) {
			console.log("Uh oh... unable to get stream...", error.stack);
			console.trace();
		}
	};

	const stopRecording = () => {
		// buffer is an AudioBuffer
		recorder.stopRecording(() => {
			let blob = recorder.getBlob();
			recorder.invokeSaveAsDialog(blob);
			setIsRecording(false);
			setAudioBlob(blob);
			console.log(blob);
			download();
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
