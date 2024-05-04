import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthTokenContext } from '../../App';
import './Questionnaire.css';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function Autismspectrumquotient() {
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testResult, setTestResult] = useState({ score: null, resultMessage: null });
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { token } = useContext(AuthTokenContext);

  const questionnaires = {
    'Autism Spectrum Quotient': [
      {
        id: 1,
        text: 'I prefer to do things with others rather than on my own.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 2,
        text: 'I prefer to do things the same way over and over again.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 3,
        text: 'If I try to imagine something, I find it very easy to create a picture in my mind.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 4,
        text: 'I frequently get so strongly absorbed in one thing that I lose sight of other things.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 5,
        text: 'I often notice small sounds when others do not.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 6,
        text: 'I usually notice car number plates or similar strings of information.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 7,
        text: 'Other people frequently tell me that what Ive said is impolite, even though I think it is polite.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 8,
        text: 'When Im reading a story, I can easily imagine what the characters might look like.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 9,
        text: 'I am fascinated by dates.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 10,
        text: 'In a social group, I can easily keep track of several different peoples conversations.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 11,
        text: 'I find social situations easy.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 12,
        text: 'I tend to notice details that others do not.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 13,
        text: 'I would rather go to a library than a party.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 14,
        text: 'I find making up stories easy.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 15,
        text: 'I find myself drawn more strongly to people than to things.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 16,
        text: 'I tend to have very strong interests which I get upset about if I cant pursue.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 17,
        text: 'I enjoy social chit-chat.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 18,
        text: 'When I talk, it isnt always easy for others to get a word in edgeways.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 19,
        text: 'I am fascinated by numbers.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 20,
        text: 'When Im reading a story, I find it difficult to work out the characters intentions.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 21,
        text: 'I dont particularly enjoy reading fiction.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 22,
        text: 'I find it hard to make new friends.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 23,
        text: 'I notice patterns in things all the time.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 24,
        text: 'I would rather go to the theatre than a museum.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 25,
        text: 'It does not upset me if my daily routine is disturbed.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 26,
        text: 'I frequently find that I dont know how to keep a conversation going.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 27,
        text: 'I find it easy to read between the lines when someone is talking to me.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 28,
        text: 'I usually concentrate more on the whole picture, rather than the small details.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 29,
        text: 'I am not very good at remembering phone numbers.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 30,
        text: 'I dont usually notice small changes in a situation, or a persons appearance.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 31,
        text: 'I know how to tell if someone listening to me is getting bored.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 32,
        text: 'I find it easy to do more than one thing at once.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 33,
        text: 'When I talk on the phone, Im not sure when its my turn to speak.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 34,
        text: 'I enjoy doing things spontaneously.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 35,
        text: 'I am often the last to understand the point of a joke.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 36,
        text: 'I find it easy to work out what someone is thinking or feeling just by looking at their face.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 37,
        text: 'If there is an interruption, I can switch back to what I was doing very quickly.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 38,
        text: 'I am good at social chit-chat.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 39,
        text: 'People often tell me that I keep going on and on about the same thing.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 40,
        text: 'When I was young, I used to enjoy playing games involving pretending with other children.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 41,
        text: 'I like to collect information about categories of things.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 42,
        text: 'I find it difficult to imagine what it would be like to be someone else.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 43,
        text: 'I like to plan any activities I participate in carefully.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 44,
        text: 'I enjoy social occasions.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 45,
        text: 'I find it difficult to work out people\'s intentions.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 46,
        text: 'New situations make me anxious.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 47,
        text: 'I enjoy meeting new people.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 48,
        text: 'I am a good diplomat.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 49,
        text: 'I am not very good at remembering people\'s date of birth.',
        options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'],
      },
      {
        id: 50,
        text: 'I find it very easy to play games with children that involve pretending.',
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

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/autism_instructions/questionnairetype'); // Navigate back to the specified path
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if all questions have been answered
    const totalQuestions = questionnaires['Autism Spectrum Quotient'].length;
    const totalAnswers = Object.keys(answers).length;

    if (totalAnswers < totalQuestions) {
      alert('Please answer all questions before submitting.');
      return; // Exit the function early if not all questions are answered
    }

    const aq = Object.values(answers).reduce((acc, value) => acc + value, 0);

    let resultMessage = `Your total score is ${aq}. `;
    if (aq >= 32) {
      resultMessage += 'This score indicates a high likelihood of autistic traits, with 79.3% of autistic individuals scoring 32 or higher. ';
    } else if (aq >= 26) {
      // eslint-disable-next-line
      resultMessage += 'This score suggests possible autistic traits, as any scores of 26 or greater indicate the presence of autistic traits; the higher the score, the more autistic traits you have.';
    } else {
      resultMessage += 'This score is below the common threshold for autistic traits, indicating you likely do not have them.';
    }
    // eslint-disable-next-line
    resultMessage += 'The AQ is particularly sensitive in distinguishing between autistic and non-autistic adult females, as 92.3% of autistic females scored 32 or higher.';
    // eslint-disable-next-line
    resultMessage += 'The AQ doesn’t really offer much insight into specific autistic traits, as it only outputs a single score.';
    // eslint-disable-next-line
    resultMessage += 'Furthermore, no single test is conclusive, and not every autistic person necessarily scores above the defined threshold on each test. If you score low on the AQ but still think you could be autistic, try taking a few other autism tests.';

    setTestResult({ score: aq, resultMessage });
    setShowModal(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.post(
        `${BASEURL}save_result`,
        { aq },
        config,
      );
    } catch (error) {
      // eslint-disable-next-line
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
        <button type="button" className="go-back-button" onClick={() => navigate(-1)}>
          &larr; Go Back
        </button>

        <div
          key={questionnaires['Autism Spectrum Quotient'][currentQuestionIndex].id}
          className={currentQuestionIndex % 2 === 0 ? 'question-container' : 'question-container-lightgreen'}
        >
          <label
            htmlFor={`question-${questionnaires['Autism Spectrum Quotient'][currentQuestionIndex].id}`}
            className="question-label"
          >
            {questionnaires['Autism Spectrum Quotient'][currentQuestionIndex].text}
          </label>
          <select
            id={`question-${questionnaires['Autism Spectrum Quotient'][currentQuestionIndex].id}`}
            className="question-select"
            onChange={(e) => handleChange(questionnaires['Autism Spectrum Quotient'][currentQuestionIndex].id, e.target.value)}
          >
            <option value="">Select an option</option>
            {questionnaires['Autism Spectrum Quotient'][currentQuestionIndex].options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {currentQuestionIndex > 0 && (
          <button type="button" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>
            Previous
          </button>
        )}
        {currentQuestionIndex < questionnaires['Autism Spectrum Quotient'].length - 1 ? (
          <button type="button" onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>
            Next
          </button>
        ) : (
          <button type="submit" className="submit-button">
            Submit
          </button>
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
            <h2 className="test-completion-header">You have completed the Second test!</h2>
            <br />
            <p>Please finish the next two tests for better evaluation results.</p>
            <p>{testResult.resultMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Autismspectrumquotient;
