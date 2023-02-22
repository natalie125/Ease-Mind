import React, { Component } from "react";
import { Link } from "react-router-dom";
import exampleImg from "./images/example.jpg";
import Header from "../Header/Header";

import "../App/App.css";

//commented code below webcam capture is an example of how to send to '/shreyas' endpoint instead of '/upload' endpoint
class TonsPhotoInstructions extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <h1>Instructions for using the tonsillitis detector</h1>
                <div>
                    <ol>
                        <li>Make sure you're in a dim lit room</li>
                        <li>Switch to the front camera on your phone</li>
                        <li>Open your mouth as wide as possible and try to keep the tongue down</li>
                        <li>Place the phone front camera facing the inside of your mouth and take a picture with flash</li>
                    </ol>
                    <p>In order for the model to correctly analyse your mouth sample, the tonsils must be clearly visible</p>
                    <p>Example picture of what should be produced can be seen below</p>
                    <img src={exampleImg} alt="Example picture" />
                    <Link to="/shreyas/shreyas">
                        <button> Continue </button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default TonsPhotoInstructions;