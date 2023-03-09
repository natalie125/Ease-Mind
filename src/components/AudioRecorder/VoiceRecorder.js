import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import React, { useState, useEffect } from "react";
import axios from "axios";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

const VoiceRecorder = (props) => {
	const [voiceRecording, setVoiceRecording] = useState(null);

	const recorderControls = useAudioRecorder();

	const addAudioElement = async (blob) => {
		if (document.body.contains(document.getElementById("recording"))) {
			document.body.removeChild(document.getElementById("recording"));
		}

		const url = URL.createObjectURL(blob);
		const audio = document.createElement("audio");

		audio.setAttribute("id", "recording");
		audio.src = url;
		audio.controls = true;

		const wavBlob = new Blob([blob], { type: "audio/wav" });

		setVoiceRecording(wavBlob);
		console.log(wavBlob.type);
		document.body.appendChild(audio);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		var reader = new FileReader();

		console.log(typeof voiceRecording);

		reader.onload = async function (event) {
			var fd = {};
			fd["audio"] = event.target.result;
			try {
				const response = await axios(BASEURL + props.context, {
					method: "post",
					data: fd,
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
		reader.readAsDataURL(voiceRecording);

		// formData.append("image", blob);
		// try {
		// 	const response = await axios(BASEURL + props.context, {
		// 		method: "post",
		// 		data: formData,
		// 		headers: {
		// 			"Access-Control-Allow-Origin": "*",
		// 			"Content-Type": "audio/wav",
		// 		},
		// 	});
		// 	console.log(response);
		// } catch (error) {
		// 	console.error(error);
		// }
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
