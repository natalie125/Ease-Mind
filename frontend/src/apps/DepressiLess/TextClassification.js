import React, { useState, useContext } from 'react';
import { AuthTokenContext } from '../../App';
import {
  buttonStyle,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  wrapperStyle,
  chatContainerStyle,
} from './styles/Styles';

// Determine base URL based on environment
const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function TextClassification() {
  const { token } = useContext(AuthTokenContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [additionalQuestion, setAdditionalQuestion] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answeredPredefinedQuestions, setAnsweredPredefinedQuestions] = useState(false);

  const predefinedQuestions = [
    'What is depression?',
    'What are the symptoms of depression?',
    'How is depression treated?',
    'What can I do when I feel overwhelmed?',
    'I feel sad, what can I do to feel better?',
    'How can I deal with loneliness?',
    'What is something I can do to improve my mental well-being?',
    "I don't know how to deal with my emotions, can you help me?",
  ];

  const questions = [
    'Are there any worries or challenges that you have been facing lately?',
    'Have you noticed any changes in your feelings or behaviors that you would like to share?',
    'What activities or interactions have brought you comfort or distress?',
    'How have you been managing your emotions? What coping strategies have you tried?',
    'Lastly, it is important for us to know: have you had any thoughts of harming yourself or others?',
  ];

  const handleChange = (e) => {
    const newResponses = [...responses];
    newResponses[currentQuestionIndex] = e.target.value.trim();
    setResponses(newResponses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      try {
        const response = await fetch(`${BASEURL}/submit_answers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers: responses }),
        });

        const data = await response.json();
        if (response.ok) {
          setFeedbackMessage(data.message);
          setAnsweredPredefinedQuestions(true);
        } else {
          throw new Error(data.error || 'Unknown error occurred');
        }
      } catch (error) {
        setFeedbackMessage(error.toString());
      }
    }
  };

  const handleQuestionClick = async (question) => {
    try {
      const response = await fetch(`${BASEURL}/answer_question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (response.ok) {
        setSelectedQuestion(question);
        setSelectedAnswer(data.answer);
        setFeedbackMessage('');
      } else {
        throw new Error(data.error || 'Failed to get an answer');
      }
    } catch (error) {
      setFeedbackMessage(error.toString());
    }
  };

  const handleAdditionalQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!additionalQuestion.trim()) return;
    try {
      const response = await fetch(`${BASEURL}/answer_question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: additionalQuestion.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        setSelectedQuestion(additionalQuestion.trim());
        setSelectedAnswer(data.answer);
        setFeedbackMessage('');
        setAdditionalQuestion('');
      } else {
        throw new Error(data.error || 'Failed to get an answer');
      }
    } catch (error) {
      setFeedbackMessage(error.toString());
    }
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', gap: '400px' }}>
        <div style={chatContainerStyle}>
          <h2>Answer the following questions:</h2>
          <form onSubmit={handleSubmit} style={inputContainerStyle}>
            <textarea
              id="responseInput"
              name="response"
              value={responses[currentQuestionIndex] || ''}
              onChange={handleChange}
              placeholder={questions[currentQuestionIndex]}
              style={{ ...inputStyle, height: '100px' }}
            />
            <button type="submit" style={buttonStyle}>
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit All Answers'}
            </button>
          </form>
        </div>
        <div style={wrapperStyle}>
          {/* Container for predefined questions */}
          <h2>Click on a question to get the answer:</h2>
          {/* Display predefined questions as buttons */}
          {predefinedQuestions.map((question) => (
            <button
              key={question}
              style={buttonStyle}
              onClick={() => handleQuestionClick(question)}
              type="button"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
      <hr />
      {selectedQuestion && (
        <div>
          <p>
            <strong>Question:</strong>
            {' '}
            {selectedQuestion}
          </p>
          <p>
            <strong>Answer:</strong>
            {' '}
            {selectedAnswer}
          </p>
        </div>
      )}
      <hr />
      {answeredPredefinedQuestions && (
        <div>
          <h2>Ask your own question:</h2>
          <form onSubmit={handleAdditionalQuestionSubmit} style={inputContainerStyle}>
            <input
              type="text"
              value={additionalQuestion}
              onChange={(e) => setAdditionalQuestion(e.target.value)}
              placeholder="Enter your question"
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Ask
            </button>
          </form>
        </div>
      )}
      {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
    </div>
  );
}

export default TextClassification;
