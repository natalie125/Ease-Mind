import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CartesianGrid, Line, LineChart, Legend, Tooltip, ReferenceLine, XAxis, YAxis,
} from 'recharts';
import './report.css';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { AuthTokenContext } from '../../App';
// Cut-off points for different test
const thresholds = {
  anxiety: 7,
  ptsd: 30,
  spin: 19,
  pd: 8,
};
// Define cut-off score for different levels of anxiety
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
  const [fetchError, setFetchError] = useState('');
  const [userFeedback, setUserFeedback] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const authTokenContext = useContext(AuthTokenContext);
  const token = authTokenContext?.token;
  const [suicidalRisk, setSuicidalRisk] = useState(false);
  const [userTestFeedback, setUserTestFeedback] = useState('');
  const navigate = useNavigate();
  const [setErrorMessage] = useState('');
  const [testData, setTestData] = useState({
    anxiety: { yearly: [], monthly: [], daily: [] },
    spin: { yearly: [], monthly: [], daily: [] },
    pd: { yearly: [], monthly: [], daily: [] },
    ptsd: { yearly: [], monthly: [], daily: [] },
  });
  // Get user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      const endpoint = 'http://127.0.0.1:5000/user_details';
      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch details');
        }
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        setFetchError('Error fetching user details. Please try again.');
      }
    };

    fetchUserDetails();
  }, [token]);
  useEffect(() => {
    // Ffetch average score for different test based on the time period
    const tests = ['anxiety', 'spin', 'pd', 'ptsd'];
    const granularities = ['yearly', 'monthly', 'daily'];

    tests.forEach((test) => {
      Promise.all(granularities.map((granularity) => fetch(`http://127.0.0.1:5000/get_${test}_results?granularity=${granularity}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((responseData) => ({
          testKey: test,
          granularity,
          data: augmentDataWithLevelAndFormatDate(responseData, granularity),
        }))
        .catch((error) => {
          setErrorMessage(`Failed to fetch ${test} results: ${error.message}`);
        })))
        .then((results) => {
          setTestData((prevData) => {
            const newData = { ...prevData };
            results.forEach(({ testKey, granularity, data }) => {
              newData[testKey][granularity] = data;
            });
            return newData;
          });
        });
    });
    // Check if user has suicidal thought in the past 2 weeks
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
      });
    // Create feedback for the user
    const fetchUserFeedback = () => {
      fetch('http://127.0.0.1:5000/get_user_feedback', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserTestFeedback(data.feedback.join(' '));
        })
        .catch(() => {
          setUserFeedback('Failed to load user feedback.');
        });
    };

    fetchUserFeedback();
  }, [token]);
  // export the report page to PDF
  const exportPDF = async () => {
    const input = document.getElementById('exportContainer');
    if (!input) {
      setUserFeedback("Couldn't find the container for PDF generation.");
      return;
    }

    try {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('test-results.pdf');
      setUserFeedback('PDF successfully generated and downloaded.');
    } catch (error) {
      setUserFeedback(`Failed to generate PDF: ${error.message}`);
    }
  };
  // Handle changes in the granularity of test result displays
  const handleGranularityChange = (event) => {
    setSelectedGranularity(event.target.value);
    setUserFeedback('');
  };

  return (
    <div className="pageContainer">
      <button type="button" className="GoBackButton" onClick={() => navigate('/EaseMind')}>
        Go Back
      </button>
      <div className="userInfo">
        <h1>Personal Report</h1>
        <p>
          <strong>Full Name:</strong>
          {' '}
          {userDetails.fullName}
        </p>
        <p>
          <strong>Date of Birth:</strong>
          {' '}
          {userDetails.DOB}
        </p>
        <p>
          <strong>Gender:</strong>
          {' '}
          {userDetails.gender}
        </p>
        <p>
          <strong>Address:</strong>
          {' '}
          {userDetails.address}
        </p>
      </div>
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
                  <ReferenceLine
                    y={thresholds[testName]}
                    label={`${testName.toUpperCase()} cut-off`}
                    stroke="red"
                  />
                </LineChart>
              </div>
            ))}
          </div>
        ))}
        <div className={suicidalRisk ? 'suicidalRiskSection alert-danger' : 'suicidalRiskSection alert-success'}>
          {userTestFeedback && (
            <div className="feedbackSection">
              <strong>Feedback:</strong>
              {' '}
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
