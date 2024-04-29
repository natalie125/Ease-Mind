// TextClassification.js
import React, { useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AuthTokenContext } from '../../../../App';
import {
  buttonStyle, containerStyle, inputContainerStyle, inputStyle,
} from '../../styles/Styles';
import './TextClassification.css';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function TextClassification() {
  const { token } = useContext(AuthTokenContext);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await fetch(`${BASEURL}/api/chat/history`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Assuming JWT for auth
          },
        });
        const data = await response.json();
        if (response.ok) {
          setMessages(data.messages); // Assuming the backend sends back an array of messages
        } else {
          throw new Error(data.error || 'Failed to fetch chat history');
        }
      } catch (error) {
        setFeedbackMessage(error.toString());
      }
    };

    getMessages();
  }, [token]); // Token is a dependency if it might change over time

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) {
      setFeedbackMessage('Please enter some text to chat.');
      return;
    }

    try {
      const response = await fetch(`${BASEURL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.ok) {
        // The response structure here must match what the backend sends.
        // Append the new message with a unique key and the received classification
        setMessages([...messages, {
          id: uuidv4(),
          text,
          classification: data.classification,
        }]);
        setText(''); // Clear the text input after sending
        setFeedbackMessage('Message sent successfully.');
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      setFeedbackMessage(error.toString());
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={inputContainerStyle}>
        <textarea
          id="messageInput"
          name="text"
          value={text}
          onChange={handleChange}
          placeholder="Enter your message"
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Send Message</button>
      </form>
      <div>
        {messages.map((msg) => (
          <div key={msg.id} className={msg.user ? 'user-message' : 'response-message'}>
            {msg.text}
            {' '}
            {msg.classification && (
              <em>
                (Classification:
                {msg.classification}
                , Confidence:
                {msg.confidence.toFixed(2)}
                )
              </em>
            )}
          </div>
        ))}
      </div>
      {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
    </div>
  );
}
export default TextClassification;
