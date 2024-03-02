import React, {
  useState, useContext, useEffect,
} from 'react';
import axios from 'axios';
import { AuthTokenContext } from '../../App';
import { IPatients } from './types';
import PatientCard from './PatientCard';
import './GetPatients.scss';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function GetPatients() {
  const { token } = useContext(AuthTokenContext);

  const [searchQuery, setSearchQuery] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState<IPatients | null>(null);

  const callGetPatientsAPI = async () => (
    axios
      .get(
        `${BASEURL}api/roots-radar/list-patients`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          return response.data as IPatients;
        }
        setError('Non 200 code returned. Patients not fetched.');
        return null;
      })
      .catch((_error) => {
        // https://axios-http.com/docs/handling_errors
        if (_error.response) {
          setError('Non 2xx code returned. Patients not fetched.');
        } else if (_error.request) {
          setError('The request was made but no response was received.');
        }
        setError('Something happened in setting up the request that triggered an Error.');
        return null;
      })
  );

  const getAllPatients = async () => {
    setIsLoading(true);
    const response = await callGetPatientsAPI();
    setIsLoading(false);
    if (!response) return;
    setPatients(response);
  };

  useEffect(() => {
    getAllPatients();
  }, []);

  return (
    <div className="GetPatientsComponent">
      <a className="back-link" href="/roots-radar">← Back</a>
      <h2>Patients</h2>
      <label htmlFor="patients_search_input">Search patients by ID</label>
      <input
        id="patients_search_input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
      />
      <hr />
      {isLoading && error === ''
        ? <p>Loading...</p>
        : (
          <div className="patients">
            {patients?.patients
              .filter((patient) => patient.PatientID.toString().startsWith(searchQuery))
              .map((patient) => (
                <PatientCard patient={patient} />
              ))}
          </div>
        )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default GetPatients;
