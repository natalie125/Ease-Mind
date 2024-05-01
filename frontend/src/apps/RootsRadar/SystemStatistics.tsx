import React, {
  useState, useContext, useEffect,
} from 'react';
import axios from 'axios';
import { AuthTokenContext } from '../../App';
import { ISystemStatistics } from './types';
// import './SystemStatistics.scss';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function SystemStatistics() {
  const { token } = useContext(AuthTokenContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [statistics, setStatistics] = useState<ISystemStatistics | null>(null);

  const callSystemStatisticsAPI = async () => (
    axios
      .get(
        `${BASEURL}api/roots-radar/system-statistics`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          return response.data as ISystemStatistics;
        }
        setError('Non 200 code returned.');
        return null;
      })
      .catch((_error) => {
        // https://axios-http.com/docs/handling_errors
        if (_error.response) {
          setError('Non 2xx code returned.');
        } else if (_error.request) {
          setError('The request was made but no response was received.');
        }
        setError('Something happened in setting up the request that triggered an Error.');
        return null;
      })
  );

  const getSystemStatistics = async () => {
    setIsLoading(true);
    const response = await callSystemStatisticsAPI();
    setIsLoading(false);
    if (!response) return;
    setStatistics(response);
  };

  useEffect(() => {
    getSystemStatistics();
  }, []);

  return (
    <div className="SystemStatisticsComponent">
      {/* <a className="back-link" href="/roots-radar">← Back</a>
      <h2>System Statistics</h2>
      <hr /> */}
      {isLoading && error === ''
        ? <p>Loading...</p>
        : (
          <p>{JSON.stringify(statistics)}</p>
        )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default SystemStatistics;
