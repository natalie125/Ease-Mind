import React, { Component } from "react";
import { Link } from "react-router-dom";
import LanreWebcamCapture from "../Lanre/lanre_camera";
import "../App/App.css";
import { useState, useRef, useEffect } from 'react';

import Header from "../Header/Header";


const getPadTime = (time) => time.toString().padStart(2,'0');

// Working Timer
export default function DipstickTimer() {
    const [timeLeft, setTimeLeft] = useState( 2 * 60) 
    const [isCounting, setIsCounting] = useState(false) 

    const minutes = getPadTime(Math.floor(timeLeft / 60));
    const seconds = getPadTime(timeLeft - minutes * 60)

    useEffect(() => {
        const interval = setInterval(() => {
            isCounting && setTimeLeft ((timeLeft) => (timeLeft > 1 ? timeLeft - 1 : 0))
        }, 1000);
        return() => {
            clearInterval(interval);
        };
    },[isCounting])

    const handleStart = () => {
        setIsCounting(true);
    }

    const handleStop = () => {
        setIsCounting(false);
    }

    const handleReset = () => {
        setIsCounting(false);
        setTimeLeft(0);
    }

    const handle60s = () => {
        setTimeLeft(60);
        setIsCounting(true);
    }

    const handle120s = () => {
        setTimeLeft(120);
        setIsCounting(false);
    }


    return (
        <div>
            {/* <CountDown seconds={seconds} /> */}
            <p>Here</p>
            <div className="timer"> 
                <span>{minutes}</span>:
                <span>{seconds}</span>
            </div>

            <div className="buttons">
                {!isCounting ?
                (<button onClick={handleStart}>Start</button>)
                :
                (<button onClick={handleStop}>Stop</button>)}
                
                <button onClick={handleReset}>Reset</button>
                <button onClick={handle60s}>60s</button>
                <button onClick={handle120s}>120s</button>


            </div>
            

        </div>
            
        
    )
}