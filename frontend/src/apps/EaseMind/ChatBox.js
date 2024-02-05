import React, { useState, useEffect } from 'react';
import './ChatBox.css';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const addMessage = (text) => {
    const newMessage = { id: `${text}-${Date.now()}`, text };
    setMessages([...messages, newMessage]);
  };

  useEffect(() => {
    const initialQuestion = 'Hi! How can I help you?';
    addMessage(initialQuestion);
  }, []);

  const predefinedOptions = [
    { text: 'Advice for anxiety', id: 1 },
    { text: 'Problems with sleeping', id: 2 },
    { text: 'What triggers anxiety?', id: 3 },
  ];

  const sendMessage = (event) => {
    event.preventDefault();
    if (input.trim() !== '') {
      addMessage(input);
      setInput('');
    }
  };

  const sendPredefinedMessage = (text) => {
    addMessage(text);
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
            <button type="button" onClick={toggleMinimize}>
              {isMinimized ? '▲' : '▼'}
            </button>
            <button type="button" onClick={() => setIsOpen(false)}>&times;</button>
          </div>
        </div>
        {!isMinimized && (
          <div className="chatContent">
            {' '}
            {/* This div was missing its closing tag */}
            <div className="chatBoxMessages">
              {messages.map((message) => (
                <div key={message.id} className="message">
                  {message.text}
                </div>
              ))}
              {messages.length === 1 && predefinedOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => sendPredefinedMessage(option.text)}
                  className="predefinedOptionButton"
                >
                  {option.text}
                </button>
              ))}
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
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBox;
