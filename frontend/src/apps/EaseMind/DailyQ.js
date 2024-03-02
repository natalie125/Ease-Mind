import React, { useState, useEffect, useContext } from 'react';
import './AnxietyLevelTest.css';
import { AuthTokenContext } from '../../App';

function DailyQuestions() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1); // Assuming question IDs are sequential and start from 1
  const { token } = useContext(AuthTokenContext); // If authentication is required

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/dailyquestion/${currentQuestionIndex}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include this header only if your API requires authentication
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

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/submit_dailyanswer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Assuming your API requires authentication
        },
        body: JSON.stringify({
          question_id: currentQuestion.id, // No change here, as shorthand doesn't apply
          answer, // ES6 object shorthand used here
        }),
      });

      if (response.ok) {
        setAnswer(''); // Clear the answer field for the next question
        setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to the next question
      } else {
        setError('Failed to submit the answer. Please try again later.');
      }
    } catch (submissionError) {
      setError('An error occurred while submitting your answer.');
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
      <h2>{currentQuestion.question_text}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleAnswerChange}
          placeholder="Your answer here"
        />
        <button type="submit">Submit Answer</button>
      </form>
    </div>
  );
}

export default DailyQuestions;
