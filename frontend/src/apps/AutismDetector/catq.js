import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthTokenContext } from '../../App';
import './Questionnaire.css';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function catq() {
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // For showing one question at a time
  const [testResult, setTestResult] = useState({ score: null, resultMessage: null });
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { token } = useContext(AuthTokenContext);

  const questionnaires = {
    'CAT-Q': [
      {
        id: 1,
        text: 'When I am interacting with someone, I deliberately copy their body language or facial expressions.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 2,
        text: 'I monitor my body language or facial expressions so that I appear relaxed.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 3,
        text: 'I rarely feel the need to put on an act in order to get through a social situation.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 4,
        text: 'I have developed a script to follow in social situations.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 5,
        text: 'I will repeat phrases that I have heard others say in the exact same way that I first heard them.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 6,
        text: 'I adjust my body language or facial expressions so that I appear interested by the person I am interacting with.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 7,
        text: 'In social situations, I feel like I’m ‘performing’ rather than being myself.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 8,
        text: 'In my own social interactions, I use behaviors that I have learned from watching other people interacting.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 9,
        text: 'I always think about the impression I make on other people.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 10,
        text: 'I need the support of other people in order to socialize.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 11,
        text: 'I practice my facial expressions and body language to make sure they look natural.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 12,
        text: 'I don’t feel the need to make eye contact with other people if I don’t want to.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 13,
        text: 'I have to force myself to interact with people when I am in social situations.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 14,
        text: 'I have tried to improve my understanding of social skills by watching other people.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 15,
        text: 'I monitor my body language or facial expressions so that I appear interested by the person I am interacting with.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 16,
        text: 'When in social situations, I try to find ways to avoid interacting with others.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 17,
        text: 'I have researched the rules of social interactions to improve my own social skills.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 18,
        text: 'I am always aware of the impression I make on other people.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 19,
        text: 'I feel free to be myself when I am with other people.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 20,
        text: 'I learn how people use their bodies and faces to interact by watching television or films, or by reading fiction.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 21,
        text: 'I adjust my body language or facial expressions so that I appear relaxed.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 22,
        text: 'When talking to other people, I feel like the conversation flows naturally.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 23,
        text: 'I have spent time learning social skills from television shows and films, and try to use these in my interactions.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 24,
        text: 'In social interactions, I do not pay attention to what my face or body are doing.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
      {
        id: 25,
        text: 'In social situations, I feel like I am pretending to be ‘normal’.',
        options: ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree'],
      },
    ],
  };

  const handleCloseModalAndNavigate = () => {
    setShowModal(false);
    navigate('/autism_instructions/questionnairetype'); // Navigate to the desired URL on modal close
  };

  const handleChange = (id, value) => {
    const normalScoring = {
      'Strongly Disagree': 1,
      Disagree: 2,
      'Somewhat Disagree': 3,
      'Neither Agree nor Disagree': 4,
      'Somewhat Agree': 5,
      Agree: 6,
      'Strongly Agree': 7,
    };

    const reverseScoring = {
      'Strongly Disagree': 7,
      Disagree: 6,
      'Somewhat Disagree': 5,
      'Neither Agree nor Disagree': 4,
      'Somewhat Agree': 3,
      Agree: 2,
      'Strongly Agree': 1,
    };

    // Statements requiring reverse scoring
    const reverseScoreStatements = [3, 12, 19, 22, 24];

    const score = reverseScoreStatements.includes(id)
      ? reverseScoring[value] || null
      : normalScoring[value] || null;

    setAnswers({ ...answers, [id]: score });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure all questions have been answered
    const totalQuestions = questionnaires['CAT-Q'].length;
    const totalAnswers = Object.keys(answers).length;
    if (totalAnswers < totalQuestions) {
      alert('Please answer all questions before submitting.');
      return;
    }

    // Calculate scores using the provided method
    const calculateScore = (statements, useReverse = false) => statements.reduce((acc, statementId) => {
      const score = answers[statementId];
      return acc + (useReverse ? (8 - score) : score);
    }, 0);

    // Calculating individual scores
    const catqtotalScore = Object.values(answers).reduce((acc, value) => acc + value, 0);
    const compensationScore = calculateScore([1, 4, 5, 8, 11, 14, 17, 20, 23]);
    const maskingScore = calculateScore([2, 6, 9, 15, 18, 21], false) + calculateScore([12, 24], true);
    const assimilationScore = calculateScore([7, 10, 13, 16, 25], false) + calculateScore([3, 19, 22], true);

    // Constructing the result message
    const resultMessage = `Your total score is ${catqtotalScore}, which ${catqtotalScore >= 100 ? 'indicates' : 'does not indicate'} significant camouflaging of autistic traits. 
    \nCompensation Score: ${compensationScore} 
    \nMasking Score: ${maskingScore} 
    \nAssimilation Score: ${assimilationScore}
    \n\nA total score of 100 or above suggests that you might be camouflaging autistic traits. This camouflaging can involve different strategies such as compensation, masking, and assimilation to navigate social situations. It's important to consider these scores in the context of personal experiences and, if needed, seek professional advice for a comprehensive understanding.`;

    setTestResult({
      score: catqtotalScore,
      compensationScore,
      maskingScore,
      assimilationScore,
      resultMessage,
    });
    setShowModal(true);

    // Attempt to save the result with updated structure
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.post(
        `${BASEURL}save_result`,
        {
          catqtotalScore,
          compensationScore,
          maskingScore,
          assimilationScore,
        },
        config,
      );
    } catch (error) {
      console.error('Error saving the test result:', error);
    }
  };

  // const handleGoBack = () => navigate(-1);

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

        {/* Render the question based on currentQuestionIndex */}
        <div className={currentQuestionIndex % 2 === 0 ? 'question-container' : 'question-container-lightgreen'}>
          <label htmlFor={`question-${questionnaires['CAT-Q'][currentQuestionIndex].id}`} className="question-label">
            {questionnaires['CAT-Q'][currentQuestionIndex].text}
          </label>
          <select
            id={`question-${questionnaires['CAT-Q'][currentQuestionIndex].id}`}
            className="question-select"
            onChange={(e) => handleChange(questionnaires['CAT-Q'][currentQuestionIndex].id, e.target.value)}
          >
            <option value="">Select an option</option>
            {questionnaires['CAT-Q'][currentQuestionIndex].options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Navigation buttons */}
        {currentQuestionIndex > 0 && (
          <button type="button" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>Previous</button>
        )}
        {currentQuestionIndex < questionnaires['CAT-Q'].length - 1 ? (
          <button type="button" onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>Next</button>
        ) : (
          <button type="submit" className="submit-button">Submit</button>
        )}
      </form>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button
              type="button"
              className="close"
              onClick={handleCloseModalAndNavigate}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="test-completion-header">Test Completed</h2>
            <p>{testResult.resultMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default catq;
