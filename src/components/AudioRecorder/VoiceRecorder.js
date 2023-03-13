import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CantinaBand3 from "./CantinaBand3.wav";
import * as FFmpeg from "@ffmpeg/ffmpeg";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

const VoiceRecorder = (props) => {
	const [voiceRecording, setVoiceRecording] = useState(null);

	const recorderControls = useAudioRecorder();

	const addAudioElement = async (blob) => {
		// remove existing audio component
		if (document.body.contains(document.getElementById("recording"))) {
			document.body.removeChild(document.getElementById("recording"));
		}

		// convert webm blob to wav blob
		const wavBlob = new Blob([blob], { type: "audio/wav" });

		const url = URL.createObjectURL(wavBlob);
		const audio = document.createElement("audio");

		audio.setAttribute("id", "recording");
		audio.src = url;
		audio.controls = true;

		setVoiceRecording(wavBlob);
		console.log("Types");
		console.log(wavBlob.type);
		console.log(typeof wavBlob);
		console.log(blob.type);
		console.log(typeof blob);
		console.log("-------------");
		document.body.appendChild(audio);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		let metadata = {
			type: voiceRecording.type,
		};
		let file = new File([voiceRecording], "test.wav", metadata);

		// var reader = new FileReader();
		// console.log(typeof voiceRecording);
		// reader.onload = async function (event) {
		// 	var fd = {};
		// 	fd["audio"] = event.target.result;
		// 	try {
		// 		const response = await axios.postForm(BASEURL + props.context, {
		// 			file: file,
		// 			headers: {
		// 				"Access-Control-Allow-Origin": "*",
		// 				"Content-Type": "multipart/form-data",
		// 			},
		// 		});
		// 		console.log(response);
		// 	} catch (error) {
		// 		console.error(error);
		// 	}
		// };
		// reader.readAsDataURL(file);

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
			<AudioRecorder
				onRecordingComplete={(blob) => addAudioElement(blob)}
				recorderControls={recorderControls}
			/>
			<button onClick={recorderControls.stopRecording}>Stop recording</button>
			<button onClick={handleSubmit}>Send recording</button>
		</div>
	);
};

export default VoiceRecorder;
