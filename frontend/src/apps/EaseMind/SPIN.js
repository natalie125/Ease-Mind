import React, { useState, useEffect, useContext } from 'react';
import './AnxietyLevelTest.css';
import { AuthTokenContext } from '../../App';

function SocialPhobiaInventoryTest() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [resultMessage, setResultMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useContext(AuthTokenContext);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch('http://127.0.0.1:5000/SPINquestions', {
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
    const score = calculateScore();
    const result = score >= 19
      ? 'Social Phobia likely present. Consider seeking a professional evaluation.'
      : 'Social Phobia likely not present. If symptoms persist, consider professional advice.';

    try {
      const response = await fetch('http://127.0.0.1:5000/submit_SPIN_result', {
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
              <option value="0">Not at all</option>
              <option value="1">A little bit</option>
              <option value="2">Somewhat</option>
              <option value="3">Very much</option>
              <option value="4">Extremely</option>
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

export default SocialPhobiaInventoryTest;
// https://psychology-tools.com/test/spinc
// https://www.tomwademd.net/documenting-mental-health-treatment-outcomes-with-improving-access-to-psychological-therapy-iapt-data-handbook-from-the-nhs/
