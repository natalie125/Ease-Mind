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





import RecordRTC, { StereoAudioRecorder, invokeSaveAsDialog } from "recordrtc";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CantinaBand3 from "./CantinaBand3.wav";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

const VoiceRecorder = (props) => {
	var audio = document.querySelector("audio");

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
		console.log("callback");
		addAudioElement(URL.createObjectURL(recorder.getBlob()));

		btnStartRecording.disabled = false;

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

	var isEdge =
		navigator.userAgent.indexOf("Edge") !== -1 &&
		(!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
	var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

	var recorder; // globally accessible
	var microphone;

	const btnStartRecording = () => {
		if (!microphone) {
			captureMicrophone(function (mic) {
				microphone = mic;

				if (isSafari) {
					addAudioElement();

					audio.muted = true;
					audio.srcObject = microphone;

					alert(
						"Please click startRecording button again. First time we tried to access your microphone. Now we will record it."
					);
					return;
				}
			});
			return;
		}

		addAudioElement();

		audio.muted = true;
		audio.srcObject = microphone;

		var options = {
			type: "audio",
			mimeType: "audio/wav",
			numberOfAudioChannels: isEdge ? 1 : 2,
			checkForInactiveTracks: true,
			bufferSize: 16384,
		};

		if (isSafari || isEdge) {
			options.recorderType = StereoAudioRecorder;
		}

		if (navigator.platform && navigator.platform.toString().toLowerCase().indexOf("win") === -1) {
			options.sampleRate = 48000; // or 44100 or remove this line for default
		}

		if (isSafari) {
			options.sampleRate = 44100;
			options.bufferSize = 4096;
			options.numberOfAudioChannels = 2;
		}

		if (recorder) {
			recorder.destroy();
			recorder = null;
		}

		recorder = RecordRTC(microphone, options);

		recorder.startRecording();
	};

	const btnStopRecording = () => {
		console.log("stop recording");
		recorder.stopRecording(stopRecordingCallback);
	};

	const btnReleaseMicrophone = () => {
		if (microphone) {
			microphone.stop();
			microphone = null;
		}

		if (recorder) {
			btnStopRecording();
		}
	};

	const btnDownloadRecording = () => {
		if (!recorder || !recorder.getBlob()) return;

		if (isSafari) {
			recorder.getDataURL(function (dataURL) {
				SaveToDisk(dataURL, getFileName("mp3"));
			});
			return;
		}

		var blob = recorder.getBlob();
		var file = new File([blob], getFileName("mp3"), {
			type: "audio/mp3",
		});
		invokeSaveAsDialog(file);
	};

	function getRandomString() {
		if (
			window.crypto &&
			window.crypto.getRandomValues &&
			navigator.userAgent.indexOf("Safari") === -1
		) {
			var a = window.crypto.getRandomValues(new Uint32Array(3)),
				token = "";
			for (var i = 0, l = a.length; i < l; i++) {
				token += a[i].toString(36);
			}
			return token;
		} else {
			return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, "");
		}
	}

	function getFileName(fileExtension) {
		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth();
		var date = d.getDate();
		return "RecordRTC-" + year + month + date + "-" + getRandomString() + "." + fileExtension;
	}

	function SaveToDisk(fileURL, fileName) {
		// for non-IE
		if (!window.ActiveXObject) {
			var save = document.createElement("a");
			save.href = fileURL;
			save.download = fileName || "unknown";
			save.style = "display:none;opacity:0;color:transparent;";
			(document.body || document.documentElement).appendChild(save);

			if (typeof save.click === "function") {
				save.click();
			} else {
				save.target = "_blank";
				var event = document.createEvent("Event");
				event.initEvent("click", true, true);
				save.dispatchEvent(event);
			}

			(window.URL || window.webkitURL).revokeObjectURL(save.href);
		}

		// for IE
		else if (!!window.ActiveXObject && document.execCommand) {
			var _window = window.open(fileURL, "_blank");
			_window.document.close();
			_window.document.execCommand("SaveAs", true, fileName || fileURL);
			_window.close();
		}
	}

	return (
		<>
			<title>Audio Recording | RecordRTC</title>
			<h1>Simple Audio Recording using RecordRTC</h1>
			<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0" />

			<br />

			<button id="btn-start-recording" onClick={btnStartRecording}>
				Start Recording
			</button>
			<button id="btn-stop-recording" onClick={btnStopRecording}>
				Stop Recording
			</button>
			<button id="btn-release-microphone" onClick={btnReleaseMicrophone}>
				Release Microphone
			</button>
			<button id="btn-download-recording" onClick={btnDownloadRecording}>
				Download
			</button>

			<div>
				<audio controls autoplay playsinline></audio>
			</div>
		</>
	);
};

export default VoiceRecorder;
