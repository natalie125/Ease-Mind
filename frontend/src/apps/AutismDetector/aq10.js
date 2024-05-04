import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthTokenContext } from '../../App';
import './Questionnaire.css';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function AQ10() {
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question
  const [testResult, setTestResult] = useState({ score: null, resultMessage: null });
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { token } = useContext(AuthTokenContext);

  const questionnaires = {
    'AQ-10': [
      {
        id: 1,
        text: 'I often notice small sounds when others do not.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 2,
        text: 'When I’m reading a story, I find it difficult to work out the characters’ intentions.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 3,
        text: 'I find it easy to read between the lines when someone is talking to me.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 4,
        text: 'I usually concentrate more on the whole picture, rather than the small details.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 5,
        text: 'I know how to tell if someone listening to me is getting bored.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 6,
        text: 'I find it easy to do more than one thing at once.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 7,
        text: 'I find it easy to work out what someone is thinking or feeling just by looking at their face.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 8,
        text: 'If there is an interruption, I can switch back to what I was doing very quickly.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 9,
        text: 'I like to collect information about categories of things.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 10,
        text: 'I find it difficult to work out people’s intentions.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
    ],
  };

  const handleChange = (id, value) => {
    const valueMapping = {
      'Definitely Agree': 1,
      'Slightly Agree': 1,
      'Slightly Disagree': 0,
      'Definitely Disagree': 0,
    };
    setAnswers({ ...answers, [id]: valueMapping[value] || null });
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestionIndex < questionnaires['AQ-10'].length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if all questions have been answered
    const totalQuestions = questionnaires['AQ-10'].length;
    const totalAnswers = Object.keys(answers).length;

    if (totalAnswers < totalQuestions) {
      alert('Please answer all questions before submitting.');
      return; // Exit the function early if not all questions are answered
    }

    const aq10 = Object.values(answers).reduce((acc, value) => acc + value, 0);

    const resultMessage = `Your AQ-10 score is ${aq10}. A score of 6 or higher is indicative of a significant number of autistic traits. This screening suggests that further evaluation by a professional may be beneficial. Remember, this test is not diagnostic.`;

    setTestResult({ score: aq10, resultMessage });
    setShowModal(true);

    try {
      await axios.post(
        `${BASEURL}save_result`,
        { aq10 },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error('Error saving the test result:', error);
    }
  };

  // Function to handle closing the modal and navigating back
  const handleCloseModal = () => {
    setShowModal(false); // First, close the modal
    navigate('/autism_instructions/questionnairetype'); // Then, navigate back to the specified path
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowModal(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="button" className="go-back-button" onClick={() => navigate(-1)}>&larr; Go Back</button>
        {/* Render the current question based on currentQuestionIndex */}
        <div className={currentQuestionIndex % 2 === 0 ? 'question-container' : 'question-container-lightgreen'}>
          <label htmlFor={`question-${questionnaires['AQ-10'][currentQuestionIndex].id}`} className="question-label">
            {questionnaires['AQ-10'][currentQuestionIndex].text}
          </label>
          <select
            id={`question-${questionnaires['AQ-10'][currentQuestionIndex].id}`}
            className="question-select"
            onChange={(e) => handleChange(questionnaires['AQ-10'][currentQuestionIndex].id, e.target.value)}
          >
            <option value="">Select an option</option>
            {questionnaires['AQ-10'][currentQuestionIndex].options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <button type="button" onClick={handlePrev} disabled={currentQuestionIndex === 0}>Previous</button>
        {currentQuestionIndex < questionnaires['AQ-10'].length - 1 ? (
          <button type="button" onClick={handleNext}>Next</button>
        ) : (
          <button type="submit" className="submit-button">Submit</button>
        )}
      </form>

      {showModal && (
        <div className="modal">
          <div className="modal-content" style={{ border: '2px solid darkgreen' }}>
            <button
              type="button"
              className="close"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              &times;
            </button>
            {/* Header */}
            <h2 className="test-completion-header">You have completed the first test!</h2>
            <br />
            {/* Additional instruction */}
            <p>Please finish the next three tests for better evaluation results.</p>
            <p>{testResult.resultMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AQ10;
