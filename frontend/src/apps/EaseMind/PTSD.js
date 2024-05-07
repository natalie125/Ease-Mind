import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './AnxietyLevelTest.css';
import { AuthTokenContext } from '../../App';

function PTSDTest() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [resultMessage, setResultMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useContext(AuthTokenContext);
  const navigate = useNavigate();
  // Fetch PTSD questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch('http://127.0.0.1:5000/PTSDquestions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
        const initialAnswers = data.reduce((acc, question) => {
          acc[question.id] = 0; // Initialise all answers to '0'
          return acc;
        }, {});
        setAnswers(initialAnswers);
      } else {
        setError('Failed to fetch questions. Please try again later.');
      }
    };

    if (token) {
      fetchQuestions();
    } else {
      setError('Authentication token is not available.');
    }
  }, [token]);

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setAnswers((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const calculateScore = () => Object.values(answers).reduce((total, current) => total + current, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const score = calculateScore();
    const result = score >= 30 // cut-off score of 30 for potential PTSD
      ? 'High level of distress. Consider seeking professional evaluation for PTSD.'
      : 'Distress level is below the typical cut-off for PTSD. If symptoms persist or worsen, consider seeking professional advice.';

    try {
      const response = await fetch('http://127.0.0.1:5000/submit_PTSD_result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score }),
      });

      if (response.ok) {
        setResultMessage(`Your score is ${score}. ${result}`);
      } else {
        setError('Failed to submit test score. Please try again later.');
      }
    } catch (submissionError) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="anxietyLevelTestContainer">
      <button
        type="button"
        className="GoBackButton"
        onClick={() => navigate('/EaseMind_testpage')}
      >
        Go Back
      </button>
      <h1>PTSD (The Impact of Event Scale – Revised (IES-R))</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.id}>
            <label htmlFor={`question-${question.id}`}>{question.text}</label>
            <select
              className="IESRTestSelect"
              name={question.id.toString()}
              id={`question-${question.id}`}
              value={answers[question.id]}
              onChange={handleSelectChange}
            >
              <option value="0">Not at all</option>
              <option value="1">A little bit</option>
              <option value="2">Moderately</option>
              <option value="3">Quite a bit</option>
              <option value="4">Extremely</option>
            </select>
          </div>
        ))}
        <button type="submit" className="submitTestButton">Submit</button>
      </form>
      {resultMessage && <div className="result-display">{resultMessage}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default PTSDTest;
// Test from: https://novopsych.com.au/assessments/diagnosis/the-impact-of-event-scale-revised-ies-r/
