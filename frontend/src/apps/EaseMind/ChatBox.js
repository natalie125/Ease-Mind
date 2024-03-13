import React, { useState, useEffect } from 'react';
import './ChatBox.css';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isChattingWithAI, setIsChattingWithAI] = useState(false);
  const initialOptions = [
    { text: 'General enquiry', id: 1 },
    { text: 'Advice based on anxiety level', id: 2 },
    { text: 'Chat with AI', id: 3 },
  ];
  const [currentOptions, setCurrentOptions] = useState(initialOptions);

  const optionAfterInitial = [
    { text: 'Advice for anxiety', id: 4 },
    { text: 'Problems with sleeping', id: 5 },
    { text: 'What triggers anxiety?', id: 6 },
  ];

  const optionsAfterAnxiety = [
    { text: 'Panic disorder', id: 7 },
    { text: 'Phobias', id: 8 },
    { text: 'Post-traumatic stress disorder (PTSD)', id: 9 },
    { text: 'Social anxiety', id: 10 },
    { text: 'Not sure', id: 11 },
  ];

  const optionsAfterSpecificAnxiety = [
    { text: 'Yes', id: 12 },
    { text: 'No', id: 13 },
  ];

  const optionsAfterSleepHelp = [
    { text: 'Yes, I need more help with sleeping problems', id: 14 },
    { text: 'No, I don\'t need more help with sleeping problems', id: 15 },
  ];

  const addMessage = (text) => {
    const newMessage = { id: `${text}-${Date.now()}`, text };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  useEffect(() => {
    setCurrentOptions(initialOptions);
    addMessage('Hi! How can I help you today?');
  }, []);

  const sendMessage = async (event) => {
    event.preventDefault();
    const userMessage = input.trim();

    if (userMessage !== '') {
      const newMessage = { id: `user-${Date.now()}`, text: userMessage, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput('');

      if (isChattingWithAI) {
        try {
          const response = await fetch('http://127.0.0.1:5000/aichat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          const aiResponse = { id: `ai-${Date.now()}`, text: data.response, sender: 'ai' };
          setMessages((prevMessages) => [...prevMessages, aiResponse]);
        } catch (error) {
          console.error('Failed to fetch AI response:', error);
          const errorMessage = { id: `error-${Date.now()}`, text: 'Sorry, something went wrong.', sender: 'system' };
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
      }
    }
  };

  const askIfMoreQuestions = () => {
    // Add a message asking if the user has more questions
    addMessage('Do you have any other questions?');
    // Set a brief timeout to allow the user to read the message before showing the options
    setTimeout(() => {
      setCurrentOptions(optionsAfterSpecificAnxiety);
    }, 1000); // Adjust the timeout duration as needed
  };

  const askIfMoreQuestionsForSleep = () => {
    // Add a custom message related to sleep advice follow-up
    addMessage('Do you need more help with sleeping problems?');
    // Set a brief timeout to allow the user to read the message before showing the options
    setTimeout(() => {
      setCurrentOptions(optionsAfterSleepHelp);
    }, 1000); // Adjust the timeout duration as needed
  };

  const sendPredefinedMessage = (option) => {
    addMessage(option.text);
    if (option.id === 1) {
      setCurrentOptions(optionAfterInitial);
    } else if (option.id === 2) {
      // Implement the logic for "Advice based on anxiety level"
    } else if (option.id === 3) {
      setIsChattingWithAI(true);
      setCurrentOptions([]);
    } else if (option.id === 4) {
      const anxietyExplanation = 'Anxiety is a feeling of unease, such as worry or fear, that can be mild or severe. '
        + '\n\nEveryone has feelings of anxiety at some point in their life. For example, you may feel worried and anxious about sitting an exam, '
        + 'or having a medical test or job interview. During times like these, feeling anxious can be perfectly normal. '
        + '\n\nBut some people find it hard to control their worries. Their feelings of anxiety are more constant and can often affect their daily lives. '
        + '\n\nAnxiety is the main symptom of several conditions, including: '
        + '\n1. panic disorder '
        + '\n2. phobias, such as agoraphobia or claustrophobia '
        + '\n3. post-traumatic stress disorder (PTSD) '
        + '\n4. social anxiety disorder (social phobia) '
        + '\nPlease choose the following option to get advice for different anxiety.';
      addMessage(anxietyExplanation);
      setCurrentOptions(optionsAfterAnxiety);
    } else if (option.id === 5) {
      const sleepAdvice = 'If you\'re having problems sleeping, you might: '
      + '\n- be more likely to feel anxious, depressed, or suicidal'
      + '\n- be more likely to have psychotic episodes – poor sleep can trigger mania, psychosis, or paranoia, or make existing symptoms worse'
      + '\n- feel lonely or isolated – for example, if you don\'t have the energy to see people or they don\'t seem to understand'
      + '\n- struggle to concentrate, or make plans and decisions'
      + '\n- feel irritable or not have energy to do things'
      + '\n- have problems with day to day life – for example, at work or with family and friends'
      + '\n- be more affected by other health problems, including mental health problems.'
      + '\n\nHere is some advice to fall asleep faster. Please click on the following link: https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-to-fall-asleep-faster-and-sleep-better/';
      addMessage(sleepAdvice);
      askIfMoreQuestionsForSleep();
      setCurrentOptions(optionsAfterSpecificAnxiety);
    } else if (option.id === 6) {
      const anxietyTriggersMessage = 'Everyone\'s experience of anxiety is different, so it\'s hard to know exactly what causes anxiety problems. There are probably lots of factors involved.'
        + '\n\nThe following link covers some things which make anxiety problems more likely to happen:'
        + '\n1. past or childhood experiences'
        + '\n2. your current life situation'
        + '\n3. physical and mental health problems'
        + '\n4. drugs and medication'
        + '\nlink: https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety-and-panic-attacks/causes/';
      addMessage(anxietyTriggersMessage);
      askIfMoreQuestions();
      setCurrentOptions(optionsAfterSpecificAnxiety);
    } else if (option.id === 7) {
      const panicDisorderMessage = 'Everyone experiences feelings of anxiety and panic at certain times. It\'s a natural response to stressful or dangerous situations.'
        + '\n\nBut someone with panic disorder has feelings of anxiety, stress and panic regularly and at any time, often for no apparent reason. What to do during a panic attack:'
        + '\n- stay where you are, if possible'
        + '\n- breathe slowly and deeply'
        + '\n- remind yourself that the attack will pass'
        + '\n- focus on positive, peaceful and relaxing images'
        + '\n- remember it\'s not life threatening';
      addMessage(panicDisorderMessage);
      askIfMoreQuestions();
      setCurrentOptions(optionsAfterSpecificAnxiety);
    } else if (option.id === 8) {
      const phobiaMessage = 'Phobias are more pronounced than fears. They develop when a person has an exaggerated or unrealistic sense of danger about a situation or object.'
        + '\n\nIf a phobia becomes very severe, a person may organise their life around avoiding the thing that\'s causing them anxiety. As well as restricting their day-to-day life, it can also cause a lot of distress. Most phobias can be treated successfully.'
        + '\n\nSimple phobias can be treated through gradual exposure to the object, animal, place or situation that causes fear and anxiety. This is known as desensitisation or self-exposure therapy.'
        + '\n\nYou could try these methods with the help of a professional or as part of a self-help programme.'
        + '\n\nTreating complex phobias often takes longer and involves talking therapies, such as:'
        + '\n- counselling'
        + '\n- psychotherapy'
        + '\n- cognitive behavioural therapy'
        + '\nMedication may be prescribed to help with anxiety caused by certain phobias.'
        + '\n\nMedicines that may be used include:'
        + '\n- antidepressants'
        + '\n- tranquillisers'
        + '\n- beta blockers';
      addMessage(phobiaMessage);
      askIfMoreQuestions();
      setCurrentOptions(optionsAfterSpecificAnxiety);
    } else if (option.id === 9) {
      const ptsdMessage = 'Someone with PTSD often relives the traumatic event through nightmares and flashbacks, and may experience feelings of isolation, irritability and guilt.'
        + '\n\nThey may also have problems sleeping, such as insomnia, and find concentrating difficult.'
        + '\n\nThese symptoms are often severe and persistent enough to have a significant impact on the person\'s day-to-day life. PTSD can be successfully treated, even when it develops many years after a traumatic event.'
        + '\n\nTreatment depends on the severity of symptoms and how soon they occur after the traumatic event.'
        + '\n\nAny of the following treatment options may be recommended:'
        + '\n- watchful waiting – monitoring your symptoms to see whether they improve or get worse without treatment'
        + '\n- antidepressants – such as paroxetine or sertraline'
        + '\n- talking therapies – such as trauma-focused cognitive behavioural therapy (CBT) or eye movement desensitisation and reprocessing (EMDR)';
      addMessage(ptsdMessage);
      setCurrentOptions(optionsAfterSpecificAnxiety);
    } else if (option.id === 10) {
      const socialAnxietyMessage = 'It\'s a common problem that usually starts during the teenage years. It can be very distressing and have a big impact on your life.'
        + '\n\nFor some people it gets better as they get older. But for many people it does not go away on its own without treatment.'
        + '\n\nIt\'s important to get help if you are having symptoms. There are treatments that can help you manage it. Self-help can help reduce social anxiety and you might find it a useful first step before trying other treatments.'
        + '\n\nThe following tips may help:'
        + '\n- try to understand more about your anxiety – by thinking about or writing down what goes through your mind and how you behave in certain social situations, it can help to keep a diary'
        + '\n- try some relaxation techniques, such as breathing exercises for stress'
        + '\n- break down challenging situations into smaller parts and work on feeling more relaxed with each part'
        + '\n- try to focus on what people are saying rather than just assuming the worst.';
      addMessage(socialAnxietyMessage);
      askIfMoreQuestions();
      setCurrentOptions(optionsAfterSpecificAnxiety);
    } else if (option.id === 11) {
      const notSureMessage = 'These are the links that give you the symptoms of different types of anxiety:'
        + '\n1. Panic disorder: https://www.nhs.uk/mental-health/conditions/panic-disorder/'
        + '\n2. Phobias: https://www.nhs.uk/mental-health/conditions/phobias/overview/'
        + '\n3. PTSD: https://www.nhs.uk/mental-health/conditions/post-traumatic-stress-disorder-ptsd/overview/'
        + '\n4. Social anxiety: https://www.nhs.uk/mental-health/conditions/social-anxiety/';
      addMessage(notSureMessage);
      setCurrentOptions(optionsAfterAnxiety);
    } else if (option.id === 12) {
      setCurrentOptions(optionAfterInitial);
    } else if (option.id === 13) {
      addMessage('Have a good day!');
      setTimeout(() => {
        setCurrentOptions(initialOptions);
        addMessage('Hi! How can I help you today?');
      }, 1500);
    } else if (option.id === 14) {
      // If the user needs more help with sleeping problems
      const moreSleepAdvice = 'Here is some advice to fall asleep faster. Please click on the following link: https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-to-fall-asleep-faster-and-sleep-better/';
      addMessage(moreSleepAdvice);
      askIfMoreQuestions(); // Ask if the user has any other questions after providing the additional advice
    } else if (option.id === 15) {
      // If the user does not need more help with sleeping problems
      askIfMoreQuestions(); // Directly ask if the user has more questions, potentially leading to different topics
    } else {
      setCurrentOptions([]);
    }
  };

  const endAIChatSession = () => {
    setIsChattingWithAI(false);
    addMessage('AI chat session ended. How can I help you now?');
    setCurrentOptions(initialOptions); // Reset to initial options
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) return null;

  return (
    <div className={`chatBoxContainer ${isMinimized ? 'minimized' : ''}`}>
      <div className="chatBox">
        <div className="chatBoxHeader">
          <span>Chat</span>
          <div>
            <button type="button" onClick={toggleMinimize}>{isMinimized ? '▲' : '▼'}</button>
            <button type="button" onClick={() => setIsOpen(false)}>&times;</button>
          </div>
        </div>
        {!isMinimized && (
          <div className="chatContent">
            <div className="chatBoxMessages">
              {messages.map((message) => (
                <div key={message.id} className="message">{message.text}</div>
              ))}
              <div className="optionsContainer">
                {currentOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => sendPredefinedMessage(option)}
                    type="button" // Explicitly setting the button type
                    className="optionButton"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
            <form className="chatBoxInput" onSubmit={sendMessage}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit">Send</button>
            </form>
            {isChattingWithAI && (
              <button type="button" onClick={endAIChatSession} className="endChatButton">
                End Chat with AI
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBox;
// https://www.nhs.uk/mental-health/conditions/generalised-anxiety-disorder/overview/#:~:text=Anxiety%20is%20a%20feeling%20of,medical%20test%20or%20job%20interview.
