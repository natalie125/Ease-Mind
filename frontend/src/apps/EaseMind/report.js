import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CartesianGrid, Line, LineChart, Legend, Tooltip, ReferenceLine, XAxis, YAxis,
} from 'recharts';
import './report.css';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { AuthTokenContext } from '../../App';

const augmentDataWithLevelAndFormatDate = (responseData, granularity) => responseData.map((item) => {
  let level;
  if (item.score >= 15) {
    level = 'Severe anxiety';
  } else if (item.score >= 10) {
    level = 'Moderate anxiety. Further evaluation is recommended.';
  } else if (item.score >= 5) {
    level = 'Mild anxiety';
  } else {
    level = 'Minimal or no anxiety';
  }

  let formattedDate;
  switch (granularity) {
    case 'yearly':
      formattedDate = `${new Date(item.date).getFullYear()}`;
      break;
    case 'monthly':
      const month = new Date(item.date).toLocaleString('default', { month: 'short' });
      const year = new Date(item.date).getFullYear();
      formattedDate = `${month} ${year}`;
      break;
    default:
      formattedDate = new Date(item.date).toLocaleDateString();
      break;
  }

  return { ...item, level, date: formattedDate };
});

function TestResultsChart() {
  const [selectedGranularity, setSelectedGranularity] = useState('yearly');
  const [fetchError] = useState('');
  const [userFeedback, setUserFeedback] = useState('');
  const authTokenContext = useContext(AuthTokenContext);
  const token = authTokenContext?.token;
  const [suicidalRisk, setSuicidalRisk] = useState(false);
  const [userTestFeedback, setUserTestFeedback] = useState('');
  const navigate = useNavigate();
  const [testData, setTestData] = useState({
    anxiety: { yearly: [], monthly: [], daily: [] },
    spin: { yearly: [], monthly: [], daily: [] },
    pd: { yearly: [], monthly: [], daily: [] },
    ptsd: { yearly: [], monthly: [], daily: [] },
  });

  useEffect(() => {
    const tests = ['anxiety', 'spin', 'pd', 'ptsd'];
    const granularities = ['yearly', 'monthly', 'daily'];

    tests.forEach((test) => {
      Promise.all(granularities.map((granularity) => fetch(`http://127.0.0.1:5000/get_${test}_results?granularity=${granularity}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((responseData) => ({
          testKey: test, // Changed 'test' to 'testKey' here
          granularity,
          data: augmentDataWithLevelAndFormatDate(responseData, granularity),
        }))
        .catch((error) => {
          console.error(`Failed to fetch ${test} results for ${granularity}:`, error);
        })))
        .then((results) => {
          setTestData((prevData) => {
            const newData = { ...prevData };
            results.forEach(({ testKey, granularity, data }) => { // Changed 'test' to 'testKey' here
              newData[testKey][granularity] = data; // Changed 'test' to 'testKey' here
            });
            return newData;
          });
        });
    });

    fetch('http://127.0.0.1:5000/get_word_detection', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch word detection answers, status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSuicidalRisk(data.risk_detected);
      })
      .catch((error) => {
        console.error('Failed to fetch word detection answers:', error);
      });

    const fetchUserFeedback = () => {
      fetch('http://127.0.0.1:5000/get_user_feedback', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserTestFeedback(data.feedback.join(' '));
        })
        .catch(() => {
          setUserFeedback('Failed to load user feedback.'); // Updated to remove the 'error' variable and console statement
        });
    };

    fetchUserFeedback();
  }, [token]);

  const exportPDF = async () => {
    const input = document.getElementById('exportContainer');
    if (!input) {
      setUserFeedback("Couldn't find the container for PDF generation.");
      return;
    }

    try {
      const canvas = await html2canvas(input, {
        scale: 1,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('test-results.pdf');
      setUserFeedback('PDF successfully generated and downloaded.');
    } catch (error) {
      setUserFeedback(`Failed to generate PDF: ${error.message}`);
    }
  };

  const handleGranularityChange = (event) => {
    setSelectedGranularity(event.target.value);
    setUserFeedback('');
  };

  return (
    <div className="pageContainer">
      <button type="button" className="GoBackButton" onClick={() => navigate('/EaseMind')}>
        Go Back
      </button>
      {fetchError && <div className="alert alert-danger">{fetchError}</div>}
      {userFeedback && <div className="alert alert-info">{userFeedback}</div>}
      <div id="exportContainer">
        <div className="selectContainer">
          <label htmlFor="granularity-select">Choose a granularity:</label>
          <select
            id="granularity-select"
            onChange={handleGranularityChange}
            value={selectedGranularity}
            className="selectStyle"
          >
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
          </select>
        </div>
        {Object.entries(testData).map(([testName, dataByGranularity]) => (
          <div key={testName}>
            <h2>
              {testName.toUpperCase()}
              {' '}
              Test Results
            </h2>
            {Object.keys(dataByGranularity).map((granularity) => (
              <div key={granularity} style={{ display: granularity === selectedGranularity ? 'block' : 'none' }}>
                <LineChart width={600} height={300} data={dataByGranularity[granularity]}>
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" />
                  <ReferenceLine y={10} label="Moderate anxiety threshold" stroke="red" />
                </LineChart>
              </div>
            ))}
          </div>
        ))}
        <div className={suicidalRisk ? 'suicidalRiskSection alert-danger' : 'suicidalRiskSection alert-success'}>
          {userTestFeedback && (
            <div className="feedbackSection">
              {userTestFeedback}
            </div>
          )}
          {suicidalRisk ? (
            'There might be a risk of suicidal thoughts based on recent responses. It is recommended to seek professional help.'
          ) : (
            'No indications of suicidal thoughts based on recent responses.'
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={exportPDF}
        className="button"
      >
        Export to PDF
      </button>
    </div>
  );
}
export default TestResultsChart;
