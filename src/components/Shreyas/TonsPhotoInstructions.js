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
                <div className="tons-page-container">
                    <div>
                        <ol className="bullet-point-container" type="1">
                            <li className="bullet-point">Make sure you're in a dim lit room</li>
                            <li className="bullet-point">Switch to the front camera on your phone</li>
                            <li className="bullet-point">Open your mouth as wide as possible and try to keep the tongue down</li>
                            <li className="bullet-point">Place the phone front camera facing the inside of your mouth and take a picture with flash</li>
                        </ol>
                    </div>
                    <p className="bullet-point">In order for the model to correctly analyse your mouth sample, the tonsils must be clearly visible</p>
                    <p className="bullet-point">Example picture of what should be produced can be seen below</p>
                    <div className="image-container">
                        <img src={exampleImg} alt="Example picture" />
                    </div>
                    <div className="btn-container">
                        <Link to="/shreyas/shreyas">
                            <button className="tons-page-button"> Continue </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default TonsPhotoInstructions;