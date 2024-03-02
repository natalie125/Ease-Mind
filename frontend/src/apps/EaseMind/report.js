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
  const [userFeedback, setUserFeedback] = useState(''); // New state for user feedback
  const authTokenContext = useContext(AuthTokenContext);
  const token = authTokenContext?.token;

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
      setUserFeedback('PDF successfully generated and downloaded.'); // Success feedback
    } catch (error) {
      setUserFeedback('Failed to generate PDF.'); // Error feedback
    }
  };

  const handleGranularityChange = (event) => {
    setSelectedGranularity(event.target.value);
    setUserFeedback(''); // Reset user feedback when changing options
  };

  return (
    <div>
      {fetchError && <div className="alert alert-danger">{fetchError}</div>}
      {userFeedback && <div className="alert alert-info">{userFeedback}</div>}
      {' '}
      {/* Display feedback to the user */}
      <div>
        <label htmlFor="granularity-select">Choose a granularity:</label>
        <select id="granularity-select" onChange={handleGranularityChange} value={selectedGranularity}>
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
      <button type="button" onClick={exportPDF}>Export to PDF</button>
    </div>
  );
}

export default TestResultsChart;
