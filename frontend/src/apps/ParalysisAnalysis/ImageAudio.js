import React, { useState, useEffect } from "react";
import {default as Camera} from "./ParalysisAnalysisCamera";
import AudioRecorder from "../../components/AudioRecorder/AudioRecorder";
import {SpinnerCircularFixed} from "spinners-react";
import InfoPanel from "./InfoPanel";
import axios from "axios";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

//This component is used to take pictures
//pictures are stored in the imageSrc variable after taking it
const ImageAudio = (props) => {
	const [image, setImage] = useState(null);
	const [showAudio, setShowAudio] = useState(false);
	const [audio, setAudio] = useState(false);
	const [serverResponse, setServerResponse] = React.useState(null);
	const [displayMessage, setDisplayMessage] = React.useState(null);
	const [showInfoPanel, setShowInfoPanel] = React.useState(true);
	let [hasMounted, setHasMounted] = useState(false);



	const submitAll = async (blob) => {
		setAudio(blob);
		console.log(blob);
		let file = new File([blob], "voice.wav", {
			type: "audio/wav",
		});

		var formData = new FormData();
		formData.append("audio", file);
		formData.append("image", image);

		try {
			const response = await axios.post(BASEURL + "ramat", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			console.log(response);
			setServerResponse(response);
		} catch (error) {
			console.error(error);
		}
	};

	const restart = () => {
		setServerResponse(null);
		setImage(null);
		setShowAudio(false);
		setAudio(null);
	};

	const call999 = () => {
		window.open('tel:+447846054321');
	}

	const getDisplayMessage = async () => {
		const jsonResponse = JSON.stringify(serverResponse.data.msg)
		const face_prediction = Math.trunc(JSON.stringify(serverResponse.data.msg.face_prediction) / 0.01)
		const speech_prediction = Math.trunc(JSON.stringify(serverResponse.data.msg.speech_prediction) / 0.01)

		if(serverResponse.status === 422){
			console.log(jsonResponse)
			console.log()
			if(serverResponse.data.msg === "multiple faces detected"){
				setDisplayMessage("Multiple faces have been detected in your picture. Please take and submit a photo of one face.")
			}else if(serverResponse.data.msg === "no face detected"){
				setDisplayMessage("No face was detected in your submitted image. Please try again. Ensure you are in a well-lit environment when taking your picture.")
			}else if(serverResponse.data.msg === "face unclear"){
				setDisplayMessage("The submitted image was unclear. Please try again. Ensure you are in a well-lit environment when taking your picture.")
			}else{
				setDisplayMessage("The server could not process your request. Please try again.")
			}

			return
		}else if(serverResponse.status === 500){
			setDisplayMessage("A server error has occurred. Please try again.")

			return
		}else if(serverResponse.status === 200){

			if(face_prediction < 30 && speech_prediction < 30){
				setDisplayMessage("You are not displaying any signs of facial droop or slurring.")
			}else{
				setDisplayMessage(<><p>You seem to be displaying symptoms of a stroke. Call 999 immediately! </p> <p> Facial palsy (droop) likelihood: {face_prediction}%</p> <p> Dysarthria (slurred speech) likelihood: {speech_prediction}%</p></>)
				await setTimeout(5000);
				call999()
			}
		}else{
			setDisplayMessage("An issue has occurred. Please try again.")
		}


		
	}

	useEffect(() => {
		if (hasMounted && serverResponse !== null) {
			getDisplayMessage()
		} else {
			setHasMounted(true);
		}
	}, [serverResponse]);


	return (
		<div className = "paralysis-container">
			{showInfoPanel && (
				<div style={{height: "100%", width: "100%", justifyContent: "center", alignItems: "center", display: "flex"}}>
					<div className="paralysis-layered-container paralysis-overlay"/>
					<InfoPanel visible={setShowInfoPanel}/>
				</div>
			)}
			<div className="paralysis-layered-container paralysis-component-container ">

				{!showAudio && (
					<>
					<h2 style={{ marginTop: "1%" }}>Welcome to Paralysis Analysis</h2>

					<button className="paralysis-info-button" onClick={() => {setShowInfoPanel(true)}}>
						What is Paralysis Analysis?
					</button>

					<div className="paralysis-split-container">
						<li><span style={{ verticalAlign: "center" }}><p className="paralysis-text-container">
							Straighten your head as best as you can, keep a neutral expresssion and take a picture.
						</p></span></li>
						<li><span style={{ verticalAlign: "top" }}><Camera endpoint="ramat/image" returnImage={setImage} returnFinished={setShowAudio} /></span></li>
					</div>
					</>
				)}
				{showAudio && !audio && (
					<>
						<p style={{ paddingTop: "3%", }}>Record yourself saying the following prompt and submit when ready:</p>
						<p>
							<em>The quick brown fox jumps over the lazy dog</em>
						</p>
						<AudioRecorder returnAudio={setAudio} returnFinished={submitAll} />
					</>
				)}
				{showAudio && audio && !serverResponse && (
					<div className = "paralysis-loader-container">
						<SpinnerCircularFixed
							color="#0B603E"
							size={"90%"}
							enabled={true}
							aria-label="Audio Spinner"
							data-testid="loader"
						/>
					</div>
				)}
				{serverResponse && (
					<>
						<h2 style={{ padding: "2%"}}>{displayMessage}</h2>
						<a href="tel:+447846054321">
							Call Emergency Services
						</a>

						<div className="paralysis-symptoms-container">
							<p>Symptoms of a stroke include:</p>
							<li>A sudden headache</li>
							<li>A sudden weakness or numbness in your arms, legs or face, particularly on one side of your body</li>
							<li>Sudden difficulty speaking or understanding speech</li>
							<li>Sudden confusion</li>
							<li>Sudden trouble walking, dizziness, loss of balance or lack of coordination</li>
							<li>Sudden trouble seeing out of one or both eyes</li>
							<li>Sudden severe headache with no known cause</li>
							<p style={{marginTop: "5%"}}>If you are displaying <strong>even one of these symptoms</strong>, call emergency services immediately</p>
							<p>For more information see the CDC website</p>
						</div>
						<button className ="paralysis-button" style={{width: "80%", fontSize: "90%"}} onClick={restart}>Restart</button>

					</>
					
				)}
			</div>
		</div>
	);
};

export default ImageAudio;
