import React from "react";
import "../App/App.css";
import { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const getPadTime = (time) => time.toString().padStart(2,'0');

// Working Timer
export default function DipstikTimer() {
    const [timeLeft, setTimeLeft] = useState(60) 
    const [isCounting, setIsCounting] = useState(false) 

    const minutes = getPadTime(Math.floor(timeLeft / 60));
    const seconds = getPadTime(timeLeft - minutes * 60);

    useEffect(() => {
        
        const interval = setInterval(() => {
            isCounting && setTimeLeft ((timeLeft) => (timeLeft > 1 ? timeLeft - 1 : 0))
        }, 1000);
        return() => {
            clearInterval(interval);
        };
    },[isCounting])

    const handleReset = () => {
        setIsCounting(true);
        setTimeLeft(60);
    }

    const handle60s = () => {
        setTimeLeft(60);
        setIsCounting(true);
    }

    const handle120s = () => {
        setTimeLeft(120);
        setIsCounting(true);
    }


    let navigate = useNavigate();
    
    function skip() {
        setIsCounting(false);
        navigate("/dipstik/dipstik-camera", { replace: true });
    }


    if (timeLeft === 0 && isCounting){
        navigate("/dipstik/dipstik-camera", { replace: true });
    }


    return (
        <div>

            <div className="timer-container">

                <div className="timer"> 
                    <div className="time">
                        <span>{minutes}:</span>
                        <span>{seconds}</span>
                    </div>
                   
                </div>

                <div className="timer-buttons">
                    <button className="timer-button" onClick={handleReset}>Reset</button>
                    <button className="timer-button timer-start-button" onClick={handle60s}>Start</button>
                    <button className="timer-button" onClick={skip}>Skip</button>
                </div>
                
            </div>


        </div>
    )
}

// source: https://www.youtube.com/watch?v=uxFoo32N8e0