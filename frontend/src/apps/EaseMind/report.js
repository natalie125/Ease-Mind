import React, { useState, useEffect, useContext } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList,
} from 'recharts';
import { AuthTokenContext } from '../../App';

const augmentDataWithLevelAndFormatDate = (data, granularity) => data.map((item) => {
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

  // Decide on date format based on granularity
  let formattedDate;
  switch (granularity) {
    case 'yearly':
      formattedDate = new Date(item.date).getFullYear().toString();
      break;
    case 'monthly':
      const month = new Date(item.date).toLocaleString('default', { month: 'short' });
      const year = new Date(item.date).getFullYear();
      formattedDate = `${month} ${year}`;
      break;
    default:
      // For 'daily' and any other case, use full date
      formattedDate = new Date(item.date).toLocaleDateString();
  }

  return { ...item, level, date: formattedDate };
});

function TestResultsChart() {
  const [data, setData] = useState([]);
  const [granularity, setGranularity] = useState('monthly');
  const [fetchError, setFetchError] = useState('');
  const { token } = useContext(AuthTokenContext);

  useEffect(() => {
    const fetchTestResults = async () => {
      const endpoint = `http://127.0.0.1:5000/get_test_results?granularity=${granularity}`;
      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch test results');
        }
        const responseData = await response.json();
        const augmentedData = augmentDataWithLevelAndFormatDate(responseData, granularity);
        setData(augmentedData);
      } catch (error) {
        setFetchError('Error fetching test results. Please try again.');
      }
    };
    fetchTestResults();
  }, [token, granularity]);

  return (
    <div>
      <select onChange={(e) => setGranularity(e.target.value)} value={granularity}>
        <option value="yearly">Yearly</option>
        <option value="monthly">Monthly</option>
        <option value="daily">Daily</option>
      </select>
      {fetchError ? (
        <div className="fetch-error">{fetchError}</div>
      ) : (
        <LineChart
          width={600}
          height={400}
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="#8884d8">
            <LabelList dataKey="level" position="top" />
          </Line>
        </LineChart>
      )}
    </div>
  );
}

export default TestResultsChart;
