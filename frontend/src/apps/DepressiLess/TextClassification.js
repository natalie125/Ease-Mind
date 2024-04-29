import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthTokenContext } from '../../../../App';
import { buttonStyle, containerStyle, inputContainerStyle, inputStyle } from './styles/Styles';
import './TextClassification.css';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function TextClassification() {
  const { token } = useContext(AuthTokenContext);
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [classificationResult, setClassificationResult] = useState(null);
  const [additionalQuestion, setAdditionalQuestion] = useState('');
  const [additionalAnswer, setAdditionalAnswer] = useState('');

  const questions = [
    "Are there any worries or challenges that you have been facing lately?",
    "Have you noticed any changes in your feelings or behaviors that you would like to share?",
    "What activities or interactions have brought you comfort or distress?",
    "How have you been managing your emotions? What coping strategies have you tried?",
    "Lastly, it is important for us to know: have you had any thoughts of harming yourself or others?"
  ];

  const handleChange = (e) => {
    const newResponses = [...responses];
    newResponses[currentQuestionIndex] = e.target.value;
    setResponses(newResponses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      return;
    }

    // All questions answered, send for classification
    try {
      const response = await fetch(`${BASEURL}/text_classification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: responses.join(' ') }),
      });

      const data = await response.json();
      if (response.ok) {
        setClassificationResult(data);
        setFeedbackMessage('All responses processed successfully.');
        // Check if the classification indicates high risk
        if (data.classification === 'High Risk' && data.confidence > 0.75) { // Adjust threshold as needed
          feedbackMessage += ' We would like to suggest you speak to a professional and check out our online resources.';
          navigate('/OnlineResources'); // Navigate to online resources
        }
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      setFeedbackMessage(error.toString());
    }
  };

  const handleAdditionalQuestionChange = (e) => {
    setAdditionalQuestion(e.target.value);
  };

  const handleAdditionalQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!additionalQuestion) return;
    try {
      const response = await fetch(`${BASEURL}/answer_question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: additionalQuestion }),
      });
      const data = await response.json();
      if (response.ok) {
        setAdditionalAnswer(data.answer);
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
      <h2>Hello, I am here to help you. Can you please provide the answers to these questions?</h2>
      <form onSubmit={handleSubmit} style={inputContainerStyle}>
        <textarea
          id="responseInput"
          name="response"
          value={responses[currentQuestionIndex] || ''}
          onChange={handleChange}
          placeholder={questions[currentQuestionIndex]}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>{currentQuestionIndex < questions.length - 1 ? "Next Question" : "Submit All Answers"}</button>
      </form>
      {classificationResult && (
        <div>
          <p>After processing, we identify that your text shows signs of {classificationResult.classification.toLowerCase()} with a confidence of {classificationResult.confidence.toFixed(2)}.</p>
          <form onSubmit={handleAdditionalQuestionSubmit}>
            <input
              type="text"
              value={additionalQuestion}
              onChange={handleAdditionalQuestionChange}
              placeholder="Have more questions? Ask here:"
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>Get Answer</button>
          </form>
          {additionalAnswer && <div><strong>Answer:</strong> {additionalAnswer}</div>}
        </div>
      )}
      {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
    </div>
  );
}

export default TextClassification;
