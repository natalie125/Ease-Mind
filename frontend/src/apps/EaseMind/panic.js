import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './AnxietyLevelTest.css';
import { AuthTokenContext } from '../../App';

function PanicDisorder() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [resultMessage, setResultMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useContext(AuthTokenContext);
  const navigate = useNavigate();
  // Fetch panic disorder questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch('http://127.0.0.1:5000/PDquestions', {
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
        // Set initial answers
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
    const result = score >= 8
    // If score >= 8, there is an indications of panic disorder, vice versa
      ? 'Indications of Panic Disorder are present. Consider seeking a professional evaluation.'
      : 'Indications of Panic Disorder are likely not present. If symptoms persist or worsen, consider seeking professional advice.';

    try {
      const response = await fetch('http://127.0.0.1:5000/submit_PD_result', {
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
      <h1>Social Phobia Inventory Test</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.id}>
            <label htmlFor={`question-${question.id}`}>{question.text}</label>
            <select
              className="SPINTestSelect"
              name={question.id.toString()}
              id={`question-${question.id}`}
              value={answers[question.id]}
              onChange={handleSelectChange}
            >
              <option value="0">No fear or avoidance</option>
              <option value="1">
                {'Occasional fear and/or avoidance but I could usually confront or '
                + 'endure the situation. There was little or no modification of my '
                + 'lifestyle due to this'}
              </option>
              <option value="2">
                {'Noticeable fear and/or avoidance but still manageable. I avoided '
                + 'some situations, but I could confront them with a companion. There '
                + 'was some modification of my lifestyle because of this, but my overall '
                + 'functioning was not impaired.'}
              </option>
              <option value="3">
                {'Extensive avoidance. Substantial modification of my lifestyle was '
                + 'required to accommodate the avoidance, making it difficult to manage '
                + 'usual activities.'}
              </option>
              <option value="4">
                {'Pervasive disabling fear and/or avoidance. Extensive modification in '
                + 'my lifestyle was required such that important tasks were not performed.'}
              </option>
            </select>

          </div>
        ))}
        <button type="submit" className="submitTestButton">Score my Answers</button>
      </form>
      {resultMessage && <div className="result-display">{resultMessage}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default PanicDisorder;
// test from: https://www.gpwebsolutions-host.co.uk/5121b/files/2017/05/UMC-Panic-Disorder-Severity-Scale-PDSS.pdf
// source: https://www.tomwademd.net/documenting-mental-health-treatment-outcomes-with-improving-access-to-
// psychological-therapy-iapt-data-handbook-from-the-nhs/
