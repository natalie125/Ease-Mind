import React from "react";
import "../../components/App/App.css";
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

    // resets the timer
    const handleReset = () => {
        setIsCounting(true);
        setTimeLeft(60);
    }

    // sets a 60 second timer
    const handle60s = () => {
        setTimeLeft(60);
        setIsCounting(true);
    }

    // Set a 120s timer
    // eslint-disable-next-line
    const handle120s = () => {
        setTimeLeft(120);
        setIsCounting(true);
    }


    let navigate = useNavigate();
    
    // Skip button to timer
    function skip() {
        setIsCounting(false);
        navigate("/dipstik/dipstik-camera", { replace: true });
    }

    // redirect to camera when timer is done
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