import React, { useState, useEffect, useContext } from 'react';
import './DailyQ.css';
import { AuthTokenContext } from '../../App';

function DailyQuestions() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const { token } = useContext(AuthTokenContext);

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

  // Adjusted: Moved the definition of resetComponentState before its use
  function resetComponentState() {
    setCurrentQuestion(null);
    setAnswer('');
    setAnswers([]);
    setError('');
    setCurrentQuestionIndex(1);
    setIsLastQuestion(false);
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

      const responseData = await response.json();

      if (response.ok) {
        const message = responseData.crisis_status === 'Yes'
          ? 'Your answers have been submitted. If you are in crisis, call Samaritans. Hours: Available 24 hours. 116 123.'
          : 'Your answers have been submitted. Thank you! Have a nice day.';

        alert(message);

        resetComponentState();
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
      <h2>{currentQuestion.question_text}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleAnswerChange}
          placeholder="Your answer here"
        />
        {isLastQuestion
          ? <button type="submit">Submit Answers</button>
          : <button type="button" onClick={handleNext}>Next Question</button>}
      </form>
    </div>
  );
}

export default DailyQuestions;
