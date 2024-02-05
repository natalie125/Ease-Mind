import React, { useState } from 'react';
import './AnxietyLevelTest.css';

function AnxietyLevelTest() {
  const initialAnswers = {
    q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0,
  };
  const [answers, setAnswers] = useState(initialAnswers);
  const [resultMessage, setResultMessage] = useState('');

  const handleSelectChange = (event) => {
    setAnswers({ ...answers, [event.target.name]: parseInt(event.target.value, 10) });
  };

  const calculateScore = () => Object.values(answers).reduce((total, current) => total + current, 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    const score = calculateScore();
    let result = '';

    if (score >= 15) {
      result = 'Severe anxiety';
    } else if (score >= 10) {
      result = 'Moderate anxiety. Further evaluation is recommended.';
    } else if (score >= 5) {
      result = 'Mild anxiety';
    } else {
      result = 'Minimal or no anxiety';
    }

    setResultMessage(`Your score is ${score}. Level of anxiety: ${result}`);
  };

  return (
    <div className="anxietyLevelTestContainer">
      <h1>Anxiety Level Test</h1>
      <form onSubmit={handleSubmit}>
        {/* Questions 1 */}
        <div>
          <label htmlFor="q1">Feeling nervous, anxious or on edge?</label>
          <select name="q1" id="q1" value={answers.q1} onChange={handleSelectChange}>
            <option value="0">Not at all</option>
            <option value="1">Several days</option>
            <option value="2">More than half the days</option>
            <option value="3">Nearly every day</option>
          </select>
        </div>
        {/* Question 2 */}
        <div>
          <label htmlFor="q2">Not being able to stop or control worrying?</label>
          <select id="q2" name="q2" value={answers.q2} onChange={handleSelectChange}>
            <option value="0">Not at all</option>
            <option value="1">Several days</option>
            <option value="2">More than half the days</option>
            <option value="3">Nearly every day</option>
          </select>
        </div>
        {/* Question 3 */}
        <div>
          <label htmlFor="q3">Worrying too much about different things?</label>
          <select id="q3" name="q3" value={answers.q3} onChange={handleSelectChange}>
            <option value="0">Not at all</option>
            <option value="1">Several days</option>
            <option value="2">More than half the days</option>
            <option value="3">Nearly every day</option>
          </select>
        </div>
        {/* Question 4 */}
        <div>
          <label htmlFor="q4">Trouble relaxing?</label>
          <select id="q4" name="q4" value={answers.q4} onChange={handleSelectChange}>
            <option value="0">Not at all</option>
            <option value="1">Several days</option>
            <option value="2">More than half the days</option>
            <option value="3">Nearly every day</option>
          </select>
        </div>
        {/* Question 5 */}
        <div>
          <label htmlFor="q5">Being so restless that it is hard to sit still?</label>
          <select id="q5" name="q5" value={answers.q5} onChange={handleSelectChange}>
            <option value="0">Not at all</option>
            <option value="1">Several days</option>
            <option value="2">More than half the days</option>
            <option value="3">Nearly every day</option>
          </select>
        </div>
        {/* Question 6 */}
        <div>
          <label htmlFor="q6">Becoming easily annoyed or irritable?</label>
          <select id="q6" name="q6" value={answers.q6} onChange={handleSelectChange}>
            <option value="0">Not at all</option>
            <option value="1">Several days</option>
            <option value="2">More than half the days</option>
            <option value="3">Nearly every day</option>
          </select>
        </div>
        {/* Question 7 */}
        <div>
          <label htmlFor="q7">Feeling afraid as if something awful might happen?</label>
          <select id="q7" name="q7" value={answers.q7} onChange={handleSelectChange}>
            <option value="0">Not at all</option>
            <option value="1">Several days</option>
            <option value="2">More than half the days</option>
            <option value="3">Nearly every day</option>
          </select>
        </div>
        <button type="submit">Submit Test</button>
      </form>
      {resultMessage && <div className="result-display">{resultMessage}</div>}
    </div>

  );
}

export default AnxietyLevelTest;

/**
 * Anxiety Level Test based on the Generalised Anxiety Disorder Assessment (GAD-7).
 * This tool is used for screening and measuring the severity of generalized anxiety disorder.
 *
 * Source: "Generalised Anxiety Disorder Assessment (GAD-7)" from Patient.info
 * URL: https://patient.info/doctor/generalised-anxiety-disorder-assessment-gad-7
 */
