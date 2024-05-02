import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './AnxietyLevelTest.css';
import { AuthTokenContext } from '../../App';

function AnxietyLevelTest() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [resultMessage, setResultMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useContext(AuthTokenContext);
  const navigate = useNavigate();
  // Fetch anxiety questions
  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch('http://127.0.0.1:5000/EAquestions', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
        const initialAnswers = data.reduce((acc, question) => {
          acc[question.id] = 0;
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
    const score = calculateScore(); // Calculate the score based on answers

    // Determine the level of anxiety based on the score
    let result;
    if (score >= 15) {
      result = 'Severe anxiety';
    } else if (score >= 10) {
      result = 'Moderate anxiety. Further evaluation is recommended.';
    } else if (score >= 5) {
      result = 'Mild anxiety';
    } else {
      result = 'Minimal or no anxiety';
    }

    // Attempt to submit the test score and set the result message
    try {
      const response = await fetch('http://127.0.0.1:5000/submit_etest_result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score }), // Send the score to your backend
      });

      if (response.ok) {
        // If the score was successfully saved, display the result to the user
        setResultMessage(`Your score is ${score}. Level of anxiety: ${result}.`);
      } else {
        // If there was a problem saving the score, notify the user
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
        onClick={() => navigate('/EaseMind')} // Navigate to EaseMind page
      >
        Go Back
      </button>
      <h1>Anxiety Level Test</h1>
      <h2 className="timeframe-note">In the past 2 weeks:</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.id}>
            <label htmlFor={`question-${question.id}`}>{question.text}</label>
            <select
              className="anxietyTestSelect"
              name={question.id.toString()}
              id={`question-${question.id}`}
              value={answers[question.id]}
              onChange={handleSelectChange}
            >
              <option value="0">Not at all</option>
              <option value="1">Several days</option>
              <option value="2">More than half the days</option>
              <option value="3">Nearly every day</option>
            </select>
          </div>
        ))}
        <button type="submit">Submit Test</button>
      </form>
      {resultMessage && <div className="result-display">{resultMessage}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
export default AnxietyLevelTest;

/**
 * Anxiety Level Test based on the Generalised Anxiety Disorder Assessment (GAD-7).
 * This tool is used for screening and measuring the severity of generalized anxiety disorder.
 *
 * Source: "Generalised Anxiety Disorder Assessment (GAD-7)" from Patient.info
 * URL: https://patient.info/doctor/generalised-anxiety-disorder-assessment-gad-7
 */
