import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './DailyQ.css';
import { AuthTokenContext } from '../../App';

function DailyQuestions() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { token } = useContext(AuthTokenContext);
  const navigate = useNavigate();
  const recognitionRef = React.useRef(null);

  const speechRecognitionAvailable = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    setIsLastQuestion(currentQuestionIndex === 10);

    const fetchQuestion = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/dailyquestion/${currentQuestionIndex}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentQuestion(data);
        } else {
          setError('Failed to fetch the question. Please try again later.');
        }
      } catch (fetchError) {
        setError('An error occurred while fetching the question.');
      }
    };

    fetchQuestion();
  }, [currentQuestionIndex, token]);

  useEffect(() => {
    // Initialize SpeechRecognition
    if (speechRecognitionAvailable) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-GB';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        setAnswer(speechToText);
      };

      recognition.onend = () => {
        setIsRecording(false); // Automatically stop recording when speech ends
      };

      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };
    }
  }, [speechRecognitionAvailable]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleNext = () => {
    const newAnswer = { question_id: currentQuestion.id, answer };
    setAnswers((prev) => [...prev, newAnswer]);
    setAnswer('');

    if (currentQuestionIndex < 10) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  function resetComponentState() {
    setCurrentQuestion(null);
    setAnswer('');
    setAnswers([]);
    setError('');
    setCurrentQuestionIndex(1);
    setIsLastQuestion(false);
    setIsRecording(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalAnswers = [...answers, { question_id: currentQuestion.id, answer }];

    try {
      const response = await fetch('http://127.0.0.1:5000/submit_dailyanswers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answers: finalAnswers,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert(`Your answers have been submitted. ${responseData.crisis_status === 'Yes' ? 'If you are in crisis, please seek help immediately. call Samaritans. Hours: Available 24 hours. 116 123.' : 'Thank you! Have a nice day.'}`);
        resetComponentState();
        navigate('/EaseMind');
      } else {
        setError('Failed to submit the answers. Please try again later.');
      }
    } catch (submissionError) {
      setError('An error occurred while submitting your answers.');
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!currentQuestion) {
    return <div>Loading question...</div>;
  }

  return (
    <div className="daily-questions-container">
      <button type="button" className="GoBackButton" onClick={() => navigate('/EaseMind')}>
        Go Back
      </button>
      <h2>{currentQuestion.question_text}</h2>
      <form onSubmit={handleSubmit}>
        <textarea value={answer} onChange={handleAnswerChange} placeholder="Your answer here" />
        <button type="button" onClick={toggleRecording} disabled={!speechRecognitionAvailable}>
          {isRecording ? 'Stop Record' : 'Dictate Answer'}
        </button>
        {!speechRecognitionAvailable && <p>Speech to text is not available in your browser.</p>}
        {isLastQuestion
          ? <button type="submit">Submit Answers</button>
          : <button type="button" onClick={handleNext}>Next Question</button>}
      </form>
    </div>
  );
}

export default DailyQuestions;
