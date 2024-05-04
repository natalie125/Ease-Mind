import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import nlp from 'compromise';
import { AuthTokenContext } from '../../App';
import autismHomeVideo from '../../images/autism-game.gif';
// https://giphy.com/stickers/dog-ai-aiandaiko-nGg1AIUNiWmkNdU1PW

// Determine the base URL based on the environment
const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

const synonymsDictionary = {
  // Scenario 1: Meeting a new friend
  hello: ['hi', 'hey', 'greetings', '👋', '😊'],
  party: ['gathering', 'celebration', 'get-together', '🎉'],
  music: ['tunes', 'songs', 'melodies', '🎵'],
  meet: ['encounter', 'come across', 'run into', '🤝'],
  pretty: ['beautiful', 'lovely', 'attractive', '😍'],
  enjoy: ['like', 'delight in', 'appreciate', '😊'],

  // Scenario 2: Friend looks sad
  okay: ['alright', 'fine', 'well', '😌'],
  sad: ['upset', 'unhappy', 'sorrowful', '😢'],
  talk: ['speak', 'chat', 'converse', '💬'],
  help: ['assist', 'aid', 'support', '🆘'],
  listen: ['hear', 'pay attention to', 'heed', '👂'],
  comfort: ['console', 'soothe', 'reassure', '🤗'],

  // Scenario 3: Busy place
  quiet: ['silent', 'hushed', 'peaceful', '🤫'],
  calm: ['relaxed', 'serene', 'tranquil', 'peaceful', '😌'],
  focus: ['concentrate', 'pay attention', 'zero in', '🧐'],

  // Scenario 4: Game changes rules
  learn: ['study', 'understand', 'grasp', '📚'],
  adapt: ['adjust', 'modify', 'accommodate', '🔄'],
  flexible: ['adaptable', 'pliant', 'yielding', '🤸‍♂️', 'versatile', '🧘‍♂️'],

  // Scenario 5: Job interview
  research: ['investigate', 'explore', 'study', '🔍'],
  prepare: ['ready', 'set up', 'organize', '📅'],
  confident: ['assured', 'self-assured', 'bold', '😎'],

  // Scenario 6: Social gathering invitation
  consider: ['contemplate', 'think about', 'ponder', '🤔'],
  socialize: ['mingle', 'interact', 'meet people', '🗣️'],
  polite: ['courteous', 'mannerly', 'civil', '🙇‍♂️'],

  // Scenario 7: Disagreement resolution
  empathize: ['understand', 'sympathize', 'relate to', '😇'],
  compromise: ['meet halfway', 'concede', 'negotiate', '🤝'],

  // Scenario 8: Inclusion
  include: ['incorporate', 'involve', 'welcome', '👭👫👬'],
  kindness: ['compassion', 'benevolence', 'generosity', '❤️'],

  // Scenario 9: Reacting to a coworker's achievement
  congratulate: ['praise', 'commend', 'applaud', '🎊'],
  supportive: ['helpful', 'encouraging', 'nurturing', '🙌'],

  // Scenario 10: Respectful disagreement
  respectful: ['considerate', 'courteous', 'polite', '🎩'],
  constructive: ['productive', 'beneficial', 'useful', '🛠️'],

  // Scenario 11: Offering help
  discreet: ['tactful', 'unobtrusive', 'respectful', '🕵️‍♂️'],
  volunteer: ['offer', 'propose', 'suggest', '🙋‍♂️🙋‍♀️'],

  // Scenario 12: Addressing unequal contribution
  accountability: ['responsibility', 'liability', 'answerability', '🔍'],
  motivate: ['inspire', 'encourage', 'stimulate', '💪'],

  // Scenario 13: Sharing interests
  engage: ['involve', 'participate', 'interact', '🤹‍♂️'],
  mutual: ['shared', 'common', 'joint', '🔄'],

  // Scenario 14: Nonverbal support
  attentive: ['alert', 'watchful', 'observant', '👀'],
  'body language': ['posture', 'gestures', 'physical cues', '🧍‍♂️🧏‍♀️'],

  // Scenario 15: Adapting to change
  strategy: ['plan', 'method', 'approach', '🗺️'],

  // Scenario 16: Sharing personal interests
  curiosity: ['interest', 'inquisitiveness', 'wonder', '🔎'],
  inclusive: ['embracing', 'comprehensive', 'all-encompassing', '🤗'],

  // Scenario 17: Managing sensory overload
  mindfulness: ['awareness', 'consciousness', 'presence of mind', '🧘'],
  'sensory tools': ['stress balls', 'fidget spinners', 'weighted blankets', '🛠️🎮'],
};

const scenarios = [
  {
    id: 1,
    description: 'You meet a new friend at a party. What do you say to start a conversation?',
    correctKeywords: [
      'hi', 'hey', 'hello', 'name', 'party', 'music', 'meet', 'know', 'dress', 'pretty', 'beautiful', 'enjoying',
      'fun', 'great', 'lovely', 'amazing', 'fantastic', 'wonderful', 'exciting', 'cool', 'awesome', 'nice', 'good',
      'enjoy', 'love', 'fabulous', 'excellent', 'interesting', 'fascinating', 'friendly', 'casual', 'positive',
    ],
    inappropriateKeywords: [
      'ugly', 'hate', 'dislike', 'bad', 'awful', 'terrible', 'horrible', 'disgusting', 'lame', 'stupid', 'idiot',
      'dumb', 'silly', 'weird', 'crazy', 'boring', 'nasty', 'rude', 'offensive', 'inappropriate', 'gross', 'negative',
    ],
  },
  {
    id: 2,
    description: 'Your friend looks sad. How do you respond?',
    correctKeywords: [
      'okay', 'everything alright', 'down', 'talk', 'help', 'sad', 'listen', 'mind', 'share', 'support', 'here for you',
      'comfort', 'worry', 'feelings', 'empathy', 'understand', 'caring', 'concerned', 'hug', 'there for you', 'listening',
      'friendship', 'trust', 'open up', 'feel', 'safe', 'secure', 'kind', 'compassionate', 'empathetic', 'attentive',
    ],
    inappropriateKeywords: [
      'overreacting', 'dramatic', 'attention', 'sensitive', 'weak', 'crybaby', 'man up', 'suck it up', 'stop crying',
      'get over it', 'nothing', 'trivial', 'unimportant', 'exaggerating', 'silly', 'stupid', 'ridiculous', 'pathetic',
      'loser', 'drama queen', 'drama king', 'insensitive', 'uncaring', 'dismissive', 'unsupportive',
    ],
  },
  {
    id: 3,
    description: 'You\'re in a busy place with lots of noise and lights. What strategies might you use to feel more comfortable?',
    correctKeywords: [
      'headphones', 'quiet', 'corner', 'break', 'deep breaths', 'focus', 'object', 'music', 'earplugs', 'sunglasses',
      'hat', 'leave', 'calm', 'relaxation', 'techniques', 'visualization', 'sensory toy', 'ask for help', 'sensory-friendly',
      'safe space', 'controlled environment', 'manage sensory input', 'reduce stimulation', 'self-regulation', 'peaceful',
    ],
    inappropriateKeywords: [
      'ignore', 'suppress', 'overreact', 'panic', 'unmanageable', 'overwhelming', 'disruptive', 'distressing', 'intolerable',
      'agitated', 'anxious', 'chaotic', 'disturbing', 'unbearable', 'frustrating', 'uncontrolled', 'painful', 'traumatic',
    ],
  },
  {
    id: 4,
    description: 'A game you\'re playing changes its rules suddenly. How do you adapt to the new rules?',
    correctKeywords: [
      'learn', 'adapt', 'flexible', 'open-minded', 'ask questions', 'understand', 'practice', 'patience', 'try', 'experiment',
      'observe', 'strategy', 'plan', 'change', 'adjust', 'accept', 'new', 'different', 'approach', 'perspective', 'positive',
      'creative', 'innovative', 'resourceful', 'problem-solving', 'analytical', 'solution-oriented', 'optimistic', 'growth mindset',
    ],
    inappropriateKeywords: [
      'give up', 'frustrated', 'angry', 'quit', 'complain', 'blame', 'refuse', 'stubborn', 'rigid', 'unyielding', 'resistant',
      'negative', 'close-minded', 'pessimistic', 'fixed mindset', 'defensive', 'hostile', 'uncooperative', 'unwilling to change',
      'complacent',
    ],
  },
  {
    id: 5,
    description: 'You are at a job interview. How do you prepare for it and handle the interview questions?',
    correctKeywords: [
      'research', 'practice', 'prepare', 'interview', 'job', 'skills', 'experience', 'resume', 'qualifications',
      'professional', 'confident', 'enthusiastic', 'communication', 'dress appropriately', 'timely', 'polite',
      'answer questions', 'ask questions', 'listen', 'emphasize strengths', 'honesty', 'enthusiasm', 'relevant',
      'follow-up', 'thank you', 'follow instructions', 'calm', 'composed', 'positive attitude', 'focused',
    ],
    inappropriateKeywords: [
      'nervous', 'anxious', 'unprepared', 'disorganized', 'late', 'rude', 'disinterested', 'dishonest', 'inconsistent',
      'negative', 'arrogant', 'overconfident', 'rambling', 'unprofessional', 'argumentative', 'disrespectful',
      'inattentive', 'overbearing', 'offensive', 'defensive', 'uncooperative', 'inflexible', 'disruptive', 'sloppy',
      'disheveled', 'inappropriate attire',
    ],
  },
  {
    id: 6,
    description: 'You receive an invitation to a social gathering. How do you decide whether to attend and how to behave at the event?',
    correctKeywords: [
      'consider', 'comfortable', 'interests', 'friends', 'socialize', 'polite', 'accept', 'decline', 'RSVP',
      'dress code', 'observe', 'listen', 'engage', 'small talk', 'interests', 'contribute', 'conversations',
      'graceful exit', 'thank host', 'enjoy', 'moderate', 'balance', 'personal space', 'boundaries',
      'sensory needs', 'prepare', 'plan', 'routine', 'prioritize', 'self-care', 'overstimulated', 'excitement',
    ],
    inappropriateKeywords: [
      'disinterested', 'apathetic', 'indifferent', 'reject', 'rude', 'ignore', 'offensive', 'argumentative',
      'overwhelming', 'intrusive', 'domineering', 'overshare', 'withdraw', 'inconsiderate', 'disruptive',
      'overexcited', 'exhausted', 'unfiltered', 'unpredictable', 'interrupt', 'agitated', 'insensitive',
      'inappropriate', 'awkward', 'unresponsive', 'clingy', 'invasion of personal space', 'rude remarks',
    ],
  },
  {
    id: 7,
    description: 'You are in a disagreement with someone. How do you express your thoughts and resolve conflicts effectively?',
    correctKeywords: [
      'calm', 'listen', 'understand', 'empathize', 'respect', 'communicate', 'express', 'feelings', 'solutions',
      'compromise', 'avoid blaming', 'stay on topic', 'use "I" statements', 'active listening', 'open-minded',
      'fair', 'objective', 'respectful', 'solution-oriented', 'feedback', 'patience', 'neutral', 'ask for a break',
      'emotions', 'control', 'apologize', 'forgive', 'de-escalate', 'communication skills', 'effective', 'collaborative',
    ],
    inappropriateKeywords: [
      'yell', 'shout', 'scream', 'insult', 'blame', 'ignore', 'mock', 'interrupt', 'escalate', 'sulk', 'threaten',
      'ignore feelings', 'dismissive', 'defensive', 'stubborn', 'hostile', 'uncooperative', 'disrespectful',
      'manipulative', 'sarcasm', 'belittle', 'unreasonable', 'personal attacks', 'aggressive', 'resentful', 'grudge',
      'unforgiving', 'vindictive', 'destructive', 'unresolved conflicts',
    ],
  },
  {
    id: 8,
    description: 'You notice someone being excluded from a group activity. How do you respond to make them feel included?',
    correctKeywords: [
      'invite', 'welcome', 'join', 'include', 'participate', 'friendly', 'approach', 'conversation', 'engage',
      'interests', 'share', 'connect', 'support', 'kindness', 'empathy', 'awareness', 'consideration', 'inclusion',
      'teamwork', 'unity', 'community', 'belonging', 'acceptance', 'openness', 'collaboration', 'inclusive',
    ],
    inappropriateKeywords: [
      'ignore', 'exclude', 'ostracize', 'neglect', 'isolate', 'dismiss', 'overlook', 'indifferent', 'apathy',
      'prejudice', 'bias', 'judgment', 'unfriendly', 'cold', 'detached', 'aloof', 'segregate', 'discriminate',
      'clique', 'favoritism', 'rejection', 'unwelcoming', 'insensitive', 'inhospitable', 'divisive',
    ],
  },
  {
    id: 9,
    description: 'A coworker shares a personal achievement with you. How do you react to show genuine interest and support?',
    correctKeywords: [
      'congratulate', 'praise', 'compliment', 'celebrate', 'happy', 'proud', 'interested', 'ask', 'details',
      'supportive', 'enthusiastic', 'encouraging', 'acknowledge', 'recognition', 'appreciation', 'respect',
      'joyful', 'curious', 'positive', 'motivating', 'inspiring', 'commend', 'honor', 'applaud', 'cheer',
    ],
    inappropriateKeywords: [
      'indifferent', 'jealous', 'envious', 'dismissive', 'uninterested', 'sarcasm', 'belittle', 'criticize',
      'ignore', 'neglect', 'downplay', 'minimize', 'underestimate', 'overlook', 'skeptical', 'cynical',
      'disparaging', 'unsupportive', 'cold', 'aloof', 'detached', 'apathetic', 'disdain', 'mock',
    ],
  },
  {
    id: 10,
    description: 'You disagree with a friend’s opinion during a discussion. How do you express your viewpoint respectfully?',
    correctKeywords: [
      'respect', 'listen', 'understand', 'explain', 'perspective', 'civil', 'polite', 'dialogue', 'discussion',
      'considerate', 'open-minded', 'thoughtful', 'reason', 'evidence', 'agree to disagree', 'compromise',
      'constructive', 'feedback', 'non-confrontational', 'empathy', 'courteous', 'tactful', 'diplomatic',
      'balance', 'fairness', 'objective', 'neutral', 'understanding', 'respectful disagreement', 'amicable',
    ],
    inappropriateKeywords: [
      'argue', 'yell', 'insult', 'disrespect', 'dismiss', 'intolerant', 'close-minded', 'aggressive', 'offensive',
      'stubborn', 'confrontational', 'belittle', 'mock', 'ridicule', 'antagonistic', 'hostile', 'escalate',
      'provocative', 'dismissive', 'cynical', 'sarcasm', 'criticize', 'attack', 'defensive', 'judgmental',
    ],
  },
  {
    id: 11,
    description: 'You see someone struggling with their work. How do you offer your help without seeming intrusive?',
    correctKeywords: [
      'offer', 'help', 'support', 'assist', 'kindly', 'gentle', 'ask', 'permission', 'suggest', 'advice',
      'respect', 'boundaries', 'considerate', 'collaborative', 'teamwork', 'resource', 'guide', 'discreet',
      'empathetic', 'understanding', 'non-intrusive', 'volunteer', 'cooperate', 'assistive', 'tactful',
      'sensitive', 'unimposing', 'respectful', 'encouraging', 'motivating', 'constructive', 'solution',
    ],
    inappropriateKeywords: [
      'force', 'impose', 'intrude', 'presume', 'overstep', 'patronize', 'disrespect', 'belittle', 'criticize',
      'ignore', 'neglect', 'dismiss', 'judge', 'embarrass', 'overbearing', 'domineering', 'unsolicited',
      'interfere', 'bother', 'annoy', 'pressure', 'demanding', 'unwelcome', 'inconsiderate', 'dismissive',
    ],
  },
  {
    id: 12,
    description: 'A group project member is not contributing equally. How do you address the issue effectively?',
    correctKeywords: [
      'communicate', 'discussion', 'team meeting', 'express concerns', 'fairness', 'responsibility', 'contribute',
      'collaboration', 'solution', 'support', 'understand', 'challenges', 'help', 'divide tasks', 'reassign',
      'feedback', 'constructive', 'positive', 'inclusive', 'goal', 'objective', 'progress', 'accountability',
      'teamwork', 'motivate', 'encourage', 'problem-solving', 'negotiate', 'compromise', 'understanding',
    ],
    inappropriateKeywords: [
      'blame', 'complain', 'confront', 'accuse', 'ignore', 'neglect', 'gossip', 'resentment', 'anger',
      'frustration', 'dismissive', 'punitive', 'exclusion', 'hostility', 'conflict', 'escalate', 'drama',
      'stubborn', 'uncooperative', 'passive-aggressive', 'defensive', 'withdraw', 'isolate', 'alienate',
    ],
  },
  {
    id: 13,
    description: 'You are at a family gathering, and a relative asks you about your interests. How do you share your interests with them and ask about theirs to keep the conversation going?',
    correctKeywords: [
      'share', 'interests', 'ask', 'listen', 'conversation', 'engage', 'family', 'talk', 'discuss', 'mutual',
      'exchange', 'curious', 'open', 'respectful', 'polite', 'friendly', 'enthusiastic', 'participate',
    ],
    inappropriateKeywords: [
      'ignore', 'dismiss', 'monologue', 'rude', 'uninterested', 'bored', 'disrespectful', 'overwhelm',
    ],
  },
  {
    id: 14,
    description: 'During a team meeting, your colleague gives a presentation. What are some ways you can use nonverbal communication to show your support and understanding of their presentation?',
    correctKeywords: [
      'nod', 'smile', 'eye contact', 'applaud', 'thumbs up', 'attentive', 'listen', 'engage', 'body language',
      'encouraging', 'supportive', 'respectful',
    ],
    inappropriateKeywords: [
      'yawn', 'look away', 'distracted', 'disinterested', 'roll eyes', 'cross arms', 'negative',
    ],
  },
  {
    id: 15,
    description: 'Your daily routine is unexpectedly changed due to an emergency at school or work. How do you cope with this change and adjust to the new schedule?',
    correctKeywords: [
      'adapt', 'flexible', 'plan', 'organize', 'prioritize', 'calm', 'accept', 'adjust', 'strategy', 'cope',
      'support', 'ask for help', 'understanding', 'patience',
    ],
    inappropriateKeywords: [
      'upset', 'resist', 'complain', 'stress', 'panic', 'refuse', 'angry', 'frustrated',
    ],
  },
  {
    id: 16,
    description: 'You have a deep interest in a specific topic and want to share it with a new friend who might not share your enthusiasm. How do you introduce your interest in a way that is engaging for both of you?',
    correctKeywords: [
      'introduce', 'explain', 'share', 'engage', 'enthusiasm', 'listen', 'feedback', 'curiosity', 'inclusive',
      'questions', 'mutual interests', 'respect',
    ],
    inappropriateKeywords: [
      'overwhelm', 'monopolize', 'disregard', 'ignore', 'boredom', 'impose', 'insensitive',
    ],
  },
  {
    id: 17,
    description: 'You are in a new environment that is overwhelming your senses. What steps do you take to make yourself more comfortable and manage sensory overload?',
    correctKeywords: [
      'headphones', 'break', 'quiet place', 'deep breaths', 'focus', 'limit stimuli', 'ask for help', 'self-care',
      'adapt', 'sensory tools', 'plan', 'mindfulness', 'visualization', 'comfort item',
    ],
    inappropriateKeywords: [
      'panic', 'shutdown', 'ignore', 'overreact', 'stress', 'resist', 'avoidance',
    ],
  },
];

function Game() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [responses, setResponses] = useState([]);
  const [score, setScore] = useState(0);
  const [finalFeedback, setFinalFeedback] = useState('');
  const [gameCompleted, setGameCompleted] = useState(false);
  const { token } = useContext(AuthTokenContext);

  // React Router v6 uses useNavigate hook
  const navigate = useNavigate();

  // Define handleGoBack to navigate back
  const handleGoBack = () => navigate(-1);

  const goBackButtonStyle = {
    backgroundColor: '#f0f0f0',
    color: '#C68B77',
    padding: '10px 15px',
    marginTop: '20px',
    marginLeft: '-90%',
    borderRadius: '5px',
    border: '2px solid #C68B77',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const keyframesStyle = `
  @keyframes slideRight {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(700%);
    }
  }
  `;

  const autismHomeVideoStyle = {
    width: '15%', // Adjust the width as needed
    height: '20%', // Adjust the height as needed
    position: 'absolute',
    top: '80%', // Adjust the vertical position as needed
    transform: 'translateY(-50%)',
    animation: 'slideRight 20s linear infinite',
  };

  const darkGreenBoxStyle = {
    backgroundColor: '#C68B77',
    padding: '20px', // Keeps content from touching the edges
    borderRadius: '10px', // Rounds the corners of the box
    color: 'white', // Text color for better contrast
    margin: '20px auto', // Centers the box with auto left and right margins
    maxWidth: '1600px', // Max width for the box
    height: '700px', // Fixed height
    display: 'flex', // Enables Flexbox layout
    flexDirection: 'column', // Stacks children vertically
    justifyContent: 'center', // Centers items vertically
    alignItems: 'center', // Centers items horizontally
  };

  const childStyle = {
    margin: '50px 0', // Example margin, adjust as needed for each child
  };

  const headingStyle = {
    border: '2px solid white', // White border around the heading
    padding: '10px 20px', // Padding inside the border
    borderRadius: '5px', // Optional: Rounds the corners of the border
    textAlign: 'center', // Centers the text within the heading
    width: '100%', // Ensures the heading takes full width of its container
    boxSizing: 'border-box', // Ensures padding and border are included in the width
  };

  // Function to check if a word or its synonyms match any of the correct keywords
  const includesWordOrSynonym = (word, correctKeywords) => correctKeywords.some((keyword) => word === keyword || (synonymsDictionary[keyword] && synonymsDictionary[keyword].includes(word)));

  const calculateAndSetFinalFeedback = () => {
    let feedbackText = 'Thank you for completing the game. Here are your responses, feedback, and sentiment analysis:\n\n';
    responses.forEach((res, index) => {
      feedbackText += `Scenario ${index + 1}: ${res.description}\nResponse: ${res.response}\nFeedback: ${res.feedback}\nSentiment: ${res.sentiment}\n\n`;
    });

    const scorePercentage = (score / scenarios.length) * 100;
    feedbackText += `Overall score: ${score}/${scenarios.length} (${scorePercentage}%).\n`;
    if (scorePercentage >= 80) {
      feedbackText += 'Your responses suggest you have strong social interaction skills.';
    } else if (scorePercentage >= 50) {
      feedbackText += 'Your responses suggest you have good social interaction skills with some areas for improvement.';
    } else {
      feedbackText += 'Your responses suggest you may benefit from further support in social interactions. Consulting with a professional is recommended for a comprehensive assessment.';
    }

    setFinalFeedback(feedbackText);
    setGameCompleted(true);
  };

  const analyzeSentiment = async (userInput) => {
    try {
      const apiResponse = await axios.post(
        `${BASEURL}analyze`,
        { text: userInput },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return apiResponse.data.feedback; // Return the feedback instead of setting state
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return 'Could not analyze sentiment.';
    }
  };

  const handleResponseSubmit = async () => {
    const { id: scenarioId, description, correctKeywords } = scenarios[scenarioIndex];
    const userWords = nlp(response).terms().out('array');
    const correctCount = userWords.filter((word) => includesWordOrSynonym(word, correctKeywords)).length;
    const sentiment = await analyzeSentiment(response);

    const feedbackEmoji = correctCount > 0 ? '😊' : '😕';
    const feedback = `${correctCount > 0 ? 'Correct! You responded appropriately.' : 'This response could be improved. Reflecting on more appropriate keywords could help.'} ${feedbackEmoji}`;
    const newScore = correctCount > 0 ? score + 1 : score;

    // Submit the feedback and score to the server
    axios.post(`${BASEURL}submit_game_feedback`, {
      scenario_id: scenarioId,
      response,
      feedback,
      sentiment,
      score: newScore,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      console.log('Feedback and score sent!');
    }).catch((error) => {
      console.error('Error sending feedback and score:', error);
    });

    setResponses((prevResponses) => [...prevResponses, {
      id: scenarioId,
      description,
      response,
      feedback,
      sentiment,
    }]);
    setScore(newScore);
    setResponse('');

    if (scenarioIndex === scenarios.length - 1) {
      calculateAndSetFinalFeedback();
    } else {
      setScenarioIndex(scenarioIndex + 1);
    }
  };

  // useEffect hook to calculate final feedback once game is completed
  useEffect(() => {
    if (gameCompleted) {
      calculateAndSetFinalFeedback();
    }
  }, [gameCompleted]);

  useEffect(() => {
    if (gameCompleted) {
      calculateAndSetFinalFeedback();
    }
  }, [gameCompleted]);

  // Additional style for the feedback container to make it scrollable
  const feedbackContainerStyle = {
    margin: '20px 0', // Adds some top and bottom margin
    padding: '10px', // Adds padding inside the feedback container
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slightly lighter background for contrast
    borderRadius: '5px', // Rounds the corners
    maxHeight: '500px', // Maximum height before scrolling
    overflowY: 'auto', // Enables vertical scrolling
    width: '100%', // Ensures it fills the container
    boxSizing: 'border-box', // Includes padding in the width calculation
  };

  return (
    <div>
      <style>{keyframesStyle}</style>
      <button type="button" style={goBackButtonStyle} onClick={handleGoBack}>&larr; Go Back</button>
      <div style={darkGreenBoxStyle}>
        <h1 style={headingStyle}>Social Interaction Challenge</h1>
        <h3>Please give a response according to each scenario given and how you would interact in that particular situation.</h3>
        {!gameCompleted ? (
          <>
            <h2 style={childStyle}>
              Score:
              {score}
            </h2>
            <div>
              <h3>{scenarios[scenarioIndex].description}</h3>
              <input type="text" placeholder="Your response" value={response} onChange={(e) => setResponse(e.target.value)} />
              <button type="button" onClick={handleResponseSubmit}>Submit</button>
            </div>
          </>
        ) : (
          <div style={feedbackContainerStyle}>
            <h2 style={childStyle}>Final Feedback</h2>
            <b><pre>{finalFeedback}</pre></b>
          </div>
        )}
      </div>
      <div style={autismHomeVideoStyle} className="video-container">
        <img src={autismHomeVideo} alt="Autism Home" style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}

export default Game;
