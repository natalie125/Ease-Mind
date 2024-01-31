import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import './Questionnaire.css';

function Questionnaire() {
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate(); // Hook for navigation

  const questions = [
    { id: 1, text: 'Do you prefer to focus on the details rather than the overall picture?' },
    { id: 2, text: 'Do you often find social situations confusing?' },
    { id: 3, text: 'Do you find it hard to make small talk with others?' },
    { id: 4, text: 'Are you overly sensitive to sensory stimuli like lights, sounds, or textures?' },
    { id: 5, text: 'Do you often stick to the same routine and get upset with minor changes?' },
    { id: 6, text: 'Do you have intense, highly focused interests in specific subjects?' },
    { id: 7, text: 'Do you find it difficult to understand others\' feelings or viewpoints?' },
    { id: 8, text: 'Do you prefer solitary activities over social ones?' },
    { id: 9, text: 'Are non-verbal cues like facial expressions and body language hard for you to interpret?' },
    { id: 10, text: 'Do you often take things literally and have difficulty understanding sarcasm or jokes?' },
    { id: 11, text: 'Is maintaining eye contact during conversations uncomfortable for you?' },
    { id: 12, text: 'Do you have repetitive movements, such as rocking or hand-flapping, especially under stress?' },
    { id: 13, text: 'Do you often speak in a monotone or have an unusual rhythm when talking?' },
    { id: 14, text: 'Are you unusually sensitive to tastes and textures of foods?' },
    { id: 15, text: 'Do you have difficulty adjusting to changes in routine or environment?' },
    { id: 16, text: 'Do you often not realize when someone is trying to take advantage of you?' },
    { id: 17, text: 'Do you find it challenging to make and maintain friendships?' },
    // Add more questions as needed
  ];

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleGoBack = () => {
    navigate('/autism_instructions'); // Redirect to '/autism_instructions'
  };

  return (
    <form onSubmit={handleSubmit}>
      <button2 type="button2" className="go-back-button" onClick={handleGoBack}>&larr;</button2>
      <div className="instruction-text">
        Please select options for all the questions below.
      </div>
      {questions.map((question, index) => (
        <div key={question.id} className={index % 2 === 0 ? 'question-container' : 'question-container-lightgreen'}>
          <label htmlFor={`question-${question.id}`} className="question-label">
            {question.text}
          </label>
          <select id={`question-${question.id}`} className="question-select" onChange={(e) => handleChange(question.id, e.target.value)}>
            <option value="">Select an option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      ))}
      <button2 type="submit" className="submit-button1">Submit</button2>
    </form>
  );
}

export default Questionnaire;
