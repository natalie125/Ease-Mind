import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthTokenContext } from '../../App';
import './Questionnaire.css';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function raadsR() {
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question
  const [testResult, setTestResult] = useState({ score: null, resultMessage: null });
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { token } = useContext(AuthTokenContext);

  const handleCloseModalAndNavigate = () => {
    setShowModal(false);
    navigate('/autism_instructions/questionnairetype');
  };

  const questionnaires = {
    'RAADS-R': [
      {
        id: 1,
        text: 'I am a sympathetic person.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 2,
        text: 'I often use words and phrases from movies and television in conversations.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 3,
        text: 'I am often surprised when others tell me I have been rude.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 4,
        text: 'Sometimes I talk too loudly or too softly, and I am not aware of it.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 5,
        text: 'I often dont know how to act in social situations.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 6,
        text: 'I can put myself in other peoples shoes.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 7,
        text: 'I have a hard time figuring out what some phrases mean, like you are the apple of my eye.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 8,
        text: 'I only like to talk to people who share my special interests.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 9,
        text: 'I focus on details rather than the overall idea.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 10,
        text: 'I always notice how food feels in my mouth. This is more important to me than how it tastes.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 11,
        text: 'I miss my best friends or family when we are apart for a long time.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 12,
        text: 'Sometimes I offend others by saying what I am thinking, even if I dont mean to.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 13,
        text: 'I only like to think and talk about a few things that interest me.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 14,
        text: 'Id rather go out to eat in a restaurant by myself than with someone I know.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 15,
        text: 'I cannot imagine what it would be like to be someone else.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 16,
        text: 'I have been told that I am clumsy or uncoordinated.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 17,
        text: 'Others consider me odd or different.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 18,
        text: 'I understand when friends need to be comforted.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 19,
        text: 'I am very sensitive to the way my clothes feel when I touch them. How they feel is more important to me than how they look.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 20,
        text: 'I like to copy the way certain people speak and act. It helps me appear more normal.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 21,
        text: 'It can be very intimidating for me to talk to more than one person at the same time.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 22,
        text: 'I have to act normal to please other people and make them like me.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 23,
        text: 'Meeting new people is usually easy for me.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 24,
        text: 'I get highly confused when someone interrupts me when I am talking about something I am very interested in.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 25,
        text: 'It is difficult for me to understand how other people are feeling when we are talking',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 26,
        text: 'I like having a conversation with several people, for instance around a dinner table, at school or at work.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 27,
        text: 'I take things too literally, so I often miss what people are trying to say.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 28,
        text: 'It is very difficult for me to understand when someone is embarrassed or jealous.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 29,
        text: 'Some ordinary textures that do not bother others feel very offensive when they touch my skin.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 30,
        text: 'I get extremely upset when the way I like to do things is suddenly changed.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 31,
        text: 'I have never wanted or needed to have what other people call an intimate relationship.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 32,
        text: 'It is difficult for me to start and stop a conversation. I need to keep going until I am finished.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 33,
        text: 'I speak with a normal rhythm.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 34,
        text: 'The same sound, color or texture can suddenly change from very sensitive to very dull.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 35,
        text: 'The phrase Ive got you under my skin makes me uncomfortable.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 36,
        text: 'Sometimes the sound of a word or a high-pitched noise can be painful to my ears.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 37,
        text: 'I am an understanding type of person.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 38,
        text: 'I do not connect with characters in movies and cannot feel what they feel.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 39,
        text: 'I cannot tell when someone is flirting with me.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 40,
        text: 'I can see in my mind in exact detail things that I am interested in.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 41,
        text: 'I keep lists of things that interest me, even when they have no practical use (for example sports statistics, train schedules, calendar dates, historical facts and dates).',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 42,
        text: 'When I feel overwhelmed by my senses, I have to isolate myself to shut them down.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 43,
        text: 'I like to talk things over with my friends.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 44,
        text: 'I cannot tell if someone is interested or bored with what I am saying.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 45,
        text: 'It can be very hard to read someones face, hand and body movements when they are talking.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 46,
        text: 'The same thing (like clothes or temperatures) can feel very different to me at different times.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 47,
        text: 'I feel very comfortable with dating or being in social situations with others.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 48,
        text: 'I try to be as helpful as I can when other people tell me their personal problems.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 49,
        text: 'I have been told that I have an unusual voice (for example flat, monotone, childish, or high-pitched).',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 50,
        text: 'Sometimes a thought or a subject gets stuck in my mind and I have to talk about it even if no one is interested.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 51,
        text: 'I do certain things with my hands over and over again (like flapping, twirling sticks or strings, waving things by my eyes).',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 52,
        text: 'I have never been interested in what most of the people I know consider interesting.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 53,
        text: 'I am considered a compassionate type of person.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 54,
        text: 'I get along with other people by following a set of specific rules that help me look normal.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 55,
        text: 'It is very difficult for me to work and function in groups.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 56,
        text: 'When I am talking to someone, it is hard to change the subject. If the other person does so, I can get very upset and confused.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 57,
        text: 'Sometimes I have to cover my ears to block out painful noises (like vacuum cleaners or people talking too much or too loudly).',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 58,
        text: 'I can chat and make small talk with people.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 59,
        text: 'Sometimes things that should feel painful are not (for instance when I hurt myself or burn my hand on the stove).',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 60,
        text: 'When talking to someone, I have a hard time telling when it is my turn to talk or to listen.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 61,
        text: 'I am considered a loner by those who know me best.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 62,
        text: 'I usually speak in a normal tone.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 63,
        text: 'I like things to be exactly the same day after day and even small changes in my routines upset me.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 64,
        text: 'How to make and keep friends is a mystery to me.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 65,
        text: 'I know how to tell if someone listening to me is getting bored.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 66,
        text: 'I have been told that I play with my fingers, hair or objects like a little kid.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 67,
        text: 'I am more interested in the big picture than the details.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 68,
        text: 'I have a hard time guessing peoples feelings by their facial expressions.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 69,
        text: 'It is often hard for me to see things from the perspective of others.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 70,
        text: 'I get very upset when the way I like to do things is suddenly changed.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 71,
        text: 'I can tell if someone is masking their true emotions.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 72,
        text: 'I have to repeat certain body movements (like flapping my hands, tapping or touching things) over and over again.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 73,
        text: 'I dont like to meet new people.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 74,
        text: 'I have a hard time making friends.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 75,
        text: 'I can usually appreciate the other persons viewpoint, even if I dont agree with it.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 76,
        text: 'I am more sensitive than most people to sounds, lights, colors, or temperatures.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 77,
        text: 'It is very difficult for me to understand jokes, satire, or sarcasm.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 78,
        text: 'I sometimes have a hard time planning my day so that I can get to do all the things I want to do.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 79,
        text: 'It is hard for me to understand what people mean when they say hes a smooth operator or shes a tough cookie.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
      {
        id: 80,
        text: 'I do not usually share my feelings.',
        options: ['True now and when I was young', 'True only now', 'True only when I was younger than 16', 'Never true'],
      },
    ],
  };

  // Updated to handle both standard and normative question scoring
  const normativeQuestions = [1, 6, 11, 18, 23, 26, 33, 37, 43, 47, 48, 53, 58, 62, 68, 72, 77]; // IDs of normative questions

  // Function to determine if a question is normative
  const isNormative = (id) => normativeQuestions.includes(id);

  // Updates the answer in state, accounting for normative question scoring
  const handleChange = (id, value) => {
    const standardValueMapping = {
      'True now and when I was young': 3,
      'True only now': 2,
      'True only when I was younger than 16': 1,
      'Never true': 0,
    };

    const normativeValueMapping = {
      'True now and when I was young': 0,
      'True only now': 1,
      'True only when I was younger than 16': 2,
      'Never true': 3,
    };

    const score = isNormative(id) ? normativeValueMapping[value] : standardValueMapping[value];
    setAnswers({ ...answers, [id]: score });
  };

  // Calculate total and subscale scores
  const calculateScores = () => {
    let raadsrScore = 0;
    const subscaleScores = {
      language: 0,
      socialRelatedness: 0,
      sensoryMotor: 0,
      circumscribedInterests: 0,
    };

    // Define which questions belong to each subscale
    const subscaleQuestionMapping = {
      language: [2, 7, 15, 27, 35, 58, 66], // Already provided
      socialRelatedness: [1, 3, 5, 6, 8, 11, 12, 14, 17, 18, 20, 21, 22, 23, 25, 26, 28, 31, 37, 38, 39, 43, 44, 45, 47, 48, 53, 54, 55, 60, 61, 64, 68, 69, 72, 76, 77, 79, 80],
      sensoryMotor: [4, 10, 16, 19, 29, 33, 34, 36, 42, 46, 49, 51, 57, 59, 62, 65, 67, 71, 73, 74],
      circumscribedInterests: [9, 13, 24, 30, 32, 40, 41, 50, 52, 56, 63, 70, 75, 78],
    };

    // Calculate scores
    Object.entries(answers).forEach(([id, score]) => {
      raadsrScore += score;
      Object.keys(subscaleScores).forEach((subscale) => {
        if (subscaleQuestionMapping[subscale].includes(Number(id))) {
          subscaleScores[subscale] += score;
        }
      });
    });

    // Validate subscale scores do not exceed maximum
    subscaleScores.language = Math.min(subscaleScores.language, 21);
    subscaleScores.socialRelatedness = Math.min(subscaleScores.socialRelatedness, 117);
    subscaleScores.sensoryMotor = Math.min(subscaleScores.sensoryMotor, 60);
    subscaleScores.circumscribedInterests = Math.min(subscaleScores.circumscribedInterests, 42);

    return { raadsrScore, subscaleScores };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if all questions have been answered
    const unansweredQuestions = questionnaires['RAADS-R'].filter((q) => answers[q.id] === undefined);
    if (unansweredQuestions.length > 0) {
      const unansweredText = unansweredQuestions.map((q) => `Question ${q.id}: "${q.text}"`).join('\n');
      alert(`Please answer all questions before submitting. Unanswered questions:\n${unansweredText}`);
      return; // Exit the function early if not all questions are answered
    }

    // Calculate total and subscale scores
    const { raadsrScore, subscaleScores } = calculateScores();

    // Interpretation of total and subscale scores for result message
    const interpretations = {
      language: subscaleScores.language >= 4 ? 'Language-related symptoms are notably present.' : 'Language-related symptoms are within typical limits.',
      socialRelatedness: subscaleScores.socialRelatedness >= 31 ? 'Social relatedness concerns are significantly evident.' : 'Social relatedness concerns are within typical limits.',
      sensoryMotor: subscaleScores.sensoryMotor >= 16 ? 'Sensory-motor symptoms are notably present.' : 'Sensory-motor symptoms are within typical limits.',
      circumscribedInterests: subscaleScores.circumscribedInterests >= 15 ? 'Circumscribed interests are significantly evident.' : 'Circumscribed interests are within typical limits.',
    };

    const detailedResults = Object.entries(subscaleScores).map(([subscale, score]) => {
      const threshold = {
        language: 4, socialRelatedness: 31, sensoryMotor: 16, circumscribedInterests: 15,
      }[subscale];
      return `${subscale.charAt(0).toUpperCase() + subscale.slice(1)}: ${score} (Threshold for concern: ${threshold}, ${interpretations[subscale]})`;
    }).join('\n');

    // Construct result message
    const likelihoodMessage = raadsrScore >= 65 ? 'You are likely autistic.' : 'You are unlikely to be autistic, but further evaluation may be beneficial if concerns persist.';
    const resultMessage = `Based on your total score of ${raadsrScore}, ${likelihoodMessage}\nSubscale scores are as follows:\n${detailedResults}\n\nPlease consult a professional for an accurate assessment, especially if your scores closely approach or exceed any thresholds.`;

    setTestResult({ score: raadsrScore, resultMessage });
    setShowModal(true);

    // Save the results with an API call
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      console.log({
        raadsrScore,
        language: subscaleScores.language,
        socialRelatedness: subscaleScores.socialRelatedness,
        sensoryMotor: subscaleScores.sensoryMotor,
        circumscribedInterests: subscaleScores.circumscribedInterests,
      });
      await axios.post(`${BASEURL}save_result`, {
        raadsrScore,
        language: subscaleScores.language,
        socialRelatedness: subscaleScores.socialRelatedness,
        sensoryMotor: subscaleScores.sensoryMotor,
        circumscribedInterests: subscaleScores.circumscribedInterests,
      }, config);
    } catch (error) {
      console.error('Error saving the test result:', error);
      alert('There was an error saving your results. Please try again.');
    }
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

        {/* Render only the current question */}
        {questionnaires['RAADS-R'].slice(currentQuestionIndex, currentQuestionIndex + 1).map((question) => (
          <div key={question.id} className={currentQuestionIndex % 2 === 0 ? 'question-container' : 'question-container-lightgreen'}>
            <label htmlFor={`question-${question.id}`} className="question-label">
              {question.text}
            </label>
            <select
              id={`question-${question.id}`}
              className="question-select"
              onChange={(e) => handleChange(question.id, e.target.value)}
            >
              <option value="">Select an option</option>
              {question.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}

        <div className="navigation-buttons">
          {currentQuestionIndex > 0 && (
            <button type="button" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>Previous</button>
          )}
          {currentQuestionIndex < questionnaires['RAADS-R'].length - 1 ? (
            <button type="button" onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>Next</button>
          ) : (
            <button type="submit" className="submit-button">Submit</button>
          )}
        </div>
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
            <h2 className="test-completion-header">You have completed the test!</h2>
            <p>{testResult.resultMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default raadsR;
