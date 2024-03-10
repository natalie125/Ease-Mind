import React, { useState, useEffect, useContext } from 'react';
import {
  CartesianGrid, Line, LineChart, Legend, Tooltip, ReferenceLine, XAxis, YAxis,
} from 'recharts';
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
  const [chartData, setChartData] = useState({ yearly: [], monthly: [], daily: [] });
  const [selectedGranularity, setSelectedGranularity] = useState('yearly');
  const [fetchError, setFetchError] = useState('');
  const [userFeedback, setUserFeedback] = useState('');
  const authTokenContext = useContext(AuthTokenContext);
  const token = authTokenContext?.token;
  const [suicidalRisk, setSuicidalRisk] = useState(false);

  useEffect(() => {
    const granularities = ['yearly', 'monthly', 'daily'];
    Promise.all(granularities.map((granularity) => fetch(`http://127.0.0.1:5000/get_test_results?granularity=${granularity}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch test results for ${granularity}, status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => ({
        granularity,
        data: augmentDataWithLevelAndFormatDate(responseData, granularity),
      }))))
      .then((allChartData) => {
        const newData = allChartData.reduce((acc, { granularity, data }) => {
          acc[granularity] = data;
          return acc;
        }, {});
        setChartData(newData);
      })
      .catch((error) => {
        setFetchError(error.message);
        setUserFeedback('Failed to load chart data.'); // Provide feedback to the user
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
        setSuicidalRisk(data.risk_detected); // Directly use the risk_detected boolean from the response
      })
      .catch((error) => {
        console.error('Failed to fetch word detection answers:', error);
      });
  }, [token]);

  const exportPDF = async () => {
    const input = document.getElementById(`chart-${selectedGranularity}`);
    if (!input) {
      setUserFeedback("Couldn't find the chart element for PDF generation."); // Update feedback for the user
      return;
    }

    try {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
      });

      pdf.addImage(imgData, 'PNG', 10, 10, 180, 150);
      pdf.save('chart.pdf');
      setUserFeedback('PDF successfully generated and downloaded.');
    } catch (error) {
      setUserFeedback('Failed to generate PDF.');
    }
  };

  const handleGranularityChange = (event) => {
    setSelectedGranularity(event.target.value);
    setUserFeedback('');
  };
  const styles = {
    pageContainer: {
      backgroundColor: '#E0F2F1',
      padding: '20px',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      width: '100vw',
      boxSizing: 'border-box',
    },
    chartContainer: {
      margin: '20px 0',
      padding: '20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    },
    header: {
      color: '#42A5F5',
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#42A5F5',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      margin: '10px 0',
    },
    alertSuccess: {
      color: 'green',
      backgroundColor: '#E8F5E9',
      padding: '10px',
      borderRadius: '5px',
      margin: '10px 0',
    },
    alertWarning: {
      color: 'darkorange',
      backgroundColor: '#FFF3E0',
      padding: '10px',
      borderRadius: '5px',
      margin: '10px 0',
    },
    selectContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: '100px',
      margin: '20px 0',
    },
    selectStyle: {
      width: '200px',
      padding: '10px',
      margin: '0 10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
  };

  return (
    <div style={styles.pageContainer}>
      {fetchError && <div className="alert alert-danger">{fetchError}</div>}
      {userFeedback && <div className="alert alert-info">{userFeedback}</div>}
      {' '}
      <div style={styles.selectContainer}>
        <label htmlFor="granularity-select">Choose a granularity:</label>
        <select
          id="granularity-select"
          onChange={handleGranularityChange}
          value={selectedGranularity}
          style={styles.selectStyle}
        >
          <option value="yearly">Yearly</option>
          <option value="monthly">Monthly</option>
          <option value="daily">Daily</option>
        </select>
      </div>
      {Object.keys(chartData).map((granularity) => (
        <div key={granularity} id={`chart-${granularity}`} style={{ display: granularity === selectedGranularity ? 'block' : 'none' }}>
          <h2>
            {granularity.toUpperCase()}
            {' '}
            Data
          </h2>
          <LineChart width={600} height={300} data={chartData[granularity]}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#8884d8" />
            <ReferenceLine y={10} label="Threshold" stroke="red" />
          </LineChart>
        </div>
      ))}
      <div style={{
        backgroundColor: suicidalRisk ? '#FFCDD2' : '#C8E6C9', // Red if there is risk, green if not
        color: suicidalRisk ? '#D32F2F' : '#2E7D32', // Dark red text for risk, dark green text for no risk
        padding: '20px',
        margin: '20px 0',
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: 'bold',
      }}
      >
        {suicidalRisk ? (
          'There might be a risk of suicidal thoughts based on recent responses. It is recommended to seek professional help.'
        ) : (
          'No indications of suicidal thoughts based on recent responses.'
        )}
      </div>
      <button
        type="button"
        onClick={exportPDF}
        style={{
          backgroundColor: '#42A5F5',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Export to PDF
      </button>
    </div>
  );
}

export default TestResultsChart;
