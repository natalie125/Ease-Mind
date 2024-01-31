import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function Chatbot() {
  const [input, setInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: uuidv4(), text: 'Hello, how can I help you today?', sender: 'bot' },
  ]);
  const [showChat, setShowChat] = useState(true);

  const initialQuestions = [
    'Understanding Autism',
    'Diagnosis',
    'Support and Resources',
    'Treatment',
  ];

  const autismQuestions = [
    'What is autism?',
    'Can you explain the different levels of autism severity?',
    'What are the early signs of autism in children?',
    'How does autism affect communication skills?',
    'What are the sensory sensitivities commonly associated with autism?',
  ];

  const messageContainerStyle = {
    backgroundColor: '#E5E4E2',
    padding: '5px 10px',
    margin: '5px',
    borderRadius: '5px',
  };

  const button1 = {
    border: '2px solid black', // Change border to black
    borderRadius: '5px', // Adjust border radius as needed
    padding: '5px 15px',
    margin: '5px 0', // Add margin to separate each button vertically
    display: 'block', // Display each button as a block element
  };

  const handleSubmit = (message) => {
    let botResponse;
    let followUpOptions = [];

    if (
      autismQuestions.includes(message)
      || message === 'What causes Autism?'
      || message === 'Can you explain the different levels of autism severity?'
    ) {
      if (message === 'What is autism?') {
        botResponse = `Autism, or Autism Spectrum Disorder (ASD), is a complex developmental disorder 
          that affects communication, behavior, and social interaction in varying degrees. It's called 
          a "spectrum" disorder because it affects individuals differently and to varying extents. The 
          symptoms and characteristics of autism can present themselves in a wide variety of combinations, 
          from mild to severe.`;

        // Adding follow-up options
        followUpOptions = [
          { id: uuidv4(), text: 'What causes Autism?', sender: 'bot-option' },
          {
            id: uuidv4(),
            text: 'Can you explain the different levels of autism severity?',
            sender: 'bot-option',
          },
        ];
      } else if (message === 'What causes Autism?') {
        botResponse = `The exact cause of autism is not known, but it's believed to be caused by a combination 
          of genetic and environmental factors. Research suggests that there are several different genes 
          involved in autism, and it may be triggered by certain environmental factors. Some of these factors 
          may include:
          - Genetic Factors: Many different genes appear to be involved in autism spectrum disorder. For some 
          children, autism can be associated with a genetic disorder, such as Rett syndrome or fragile X syndrome. 
          In other cases, genetic mutations may increase the risk of autism spectrum disorder.
          - Environmental Factors: Researchers are also looking at whether factors like viral infections, medications 
          or complications during pregnancy, or air pollutants play a role in triggering autism spectrum disorder.
          - Brain Biology: Differences in certain areas of the brain and the way the brain communicates may contribute 
          to symptoms of autism.
          - Risk Factors: These can include aspects like having a sibling with ASD, having older parents, certain 
          genetic conditions, very low birth weight, and metabolic imbalances.`;

        // Add a follow-up message
        followUpOptions.push(
          {
            id: uuidv4(),
            text: 'Hope this helps you. Is there anything else I can help you with?',
            sender: 'bot',
          },
          { id: uuidv4(), text: 'Yes', sender: 'bot-option' },
          { id: uuidv4(), text: 'No', sender: 'bot-option' },
        );
      } else {
        botResponse = `ans ${autismQuestions.indexOf(message) + 1}`;
      }

      // Remove any existing follow-up options and add new ones
      setChatMessages((prevMessages) => [
        ...prevMessages.filter((msg) => msg.sender !== 'bot-option' && !followUpOptions.some((option) => option.text === msg.text)),
        { id: uuidv4(), text: message, sender: 'user' },
        { id: uuidv4(), text: botResponse, sender: 'bot' },
        ...followUpOptions,
      ]);
    } else if (message === 'Yes' || message === 'No') {
      if (message === 'Yes') {
        // User chose 'Yes', show autismQuestions
        const options = initialQuestions.map((question) => ({
          id: uuidv4(),
          text: question,
          sender: 'bot-option',
        }));
        setChatMessages((prevMessages) => [
          ...prevMessages.filter((msg) => msg.sender !== 'bot-option' && msg.text !== 'Yes'), // Remove 'Yes' from chat
          { id: uuidv4(), text: 'Yes', sender: 'user' },
          ...options,
        ]);
      } else {
        // User chose 'No', you can customize the response as needed
        setChatMessages([
          ...chatMessages.filter((msg) => msg.sender !== 'bot-option'),
          { id: uuidv4(), text: 'No', sender: 'user' },
          {
            id: uuidv4(),
            text: 'Thank you for using the chatbot. Have a great day!',
            sender: 'bot',
          },
        ]);
        // Optionally, you can close the chat here by setting setShowChat(false);
      }
    } else {
      // Handle other user messages
      let otherBotResponse;
      switch (message) {
        case 'Understanding Autism':
          setChatMessages((prevMessages) => [
            ...prevMessages,
            { id: uuidv4(), text: message, sender: 'user' },
            { id: uuidv4(), text: 'Please choose a question:', sender: 'bot' },
            ...autismQuestions.map((question) => ({
              id: uuidv4(),
              text: question,
              sender: 'bot-option',
            })),
          ]);
          return;
        case 'Support and Resources':
          otherBotResponse = 'Ok, here is support';
          break;
        case 'Treatment':
          otherBotResponse = 'Ok, here is treatment';
          break;
        default:
          otherBotResponse = 'Ok, here is diagnosis';
          break;
      }

      // Update chat messages
      if (otherBotResponse) {
        setChatMessages([
          ...chatMessages,
          { id: uuidv4(), text: message, sender: 'user' },
          { id: uuidv4(), text: otherBotResponse, sender: 'bot' },
        ]);
      } else {
        setChatMessages([
          ...chatMessages,
          { id: uuidv4(), text: message, sender: 'user' },
        ]);
      }
    }
  };

  const handleClose = () => {
    setShowChat(false);
  };

  const renderOptions = () => {
    if (chatMessages.length === 1) {
      return initialQuestions.map((question) => (
        <button1 key={question} style={button1} type="button1" onClick={() => handleSubmit(question)}>
          {question}
        </button1>
      ));
    }
    const lastMessage = chatMessages[chatMessages.length - 1];

    if (lastMessage?.sender === 'user' && lastMessage.text === 'Yes') {
      return initialQuestions.map((question) => (
        <button1 key={question} style={button1} type="button1" onClick={() => handleSubmit(question)}>
          {question}
        </button1>
      ));
    }

    const options = chatMessages.filter((msg) => msg.sender === 'bot-option');
    // Ensure that 'Yes' and 'No' buttons are displayed only once
    if (options.length > 0 && options[0].text !== 'Yes' && options[0].text !== 'No') {
      return options.map((msg) => (
        <button1 key={msg.id} type="button1" style={button1} onClick={() => handleSubmit(msg.text)}>
          {msg.text}
        </button1>
      ));
    }

    return null;
  };

  const chatbotHeaderStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: '5px 10px',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#f3f3f3',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
  };

  const titleStyle = {
    fontWeight: 'bold',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  };

  const chatbotStyle = {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    width: '250px',
    height: '400px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '10px',
    zIndex: 5,
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxSizing: 'border-box',
  };

  const inputStyle = {
    flexGrow: 0,
    padding: '5px',
    marginRight: '5px',
    width: 'calc(100% - 90px)',
  };

  return (
    showChat && (
      <div style={chatbotStyle}>
        <div style={chatbotHeaderStyle}>
          <span style={titleStyle}>Chatbot</span>
          <button1 type="button1" onClick={handleClose} style={closeButtonStyle}>
            X
          </button1>
        </div>
        <div style={{ overflowY: 'auto', flexGrow: 1 }}>
          {chatMessages.map((msg) => {
            if (msg.sender === 'bot-option') {
              return (
                <button1
                  key={msg.id}
                  type="button1"
                  onClick={() => handleSubmit(msg.text)}
                  style={button1}
                >
                  {msg.text}
                </button1>
              );
            }
            return (
              <div key={msg.id} style={messageContainerStyle}>
                <p style={msg.sender === 'bot' ? { color: 'blue' } : { color: 'green' }}>
                  {msg.text}
                </p>
              </div>
            );
          })}
          {renderOptions()}
        </div>
        <div style={{ display: 'flex' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={inputStyle}
            disabled
          />
          <button1 type="button1" style={button1} onClick={() => handleSubmit(input)}>
            Send
          </button1>
        </div>
      </div>
    )
  );
}

export default Chatbot;
