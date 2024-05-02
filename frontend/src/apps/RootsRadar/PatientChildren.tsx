import React, {
  useState, useContext, useEffect,
} from 'react';
import axios from 'axios';
import { AuthTokenContext } from '../../App';

import './Patient.scss';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function PatientChildren({ id }: {id: string;}) {
  const { token } = useContext(AuthTokenContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [patient, setPatients] = useState<string[] | null>(null);

  const callGetPatientAPI = async () => (
    axios
      .get(
        `${BASEURL}api/roots-radar/mimic-patient-children/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          return response.data as string[];
        }
        if (response.status === 204) {
          return null;
        }
        setError('Non 200 code returned. Patient not fetched.');
        return null;
      })
      .catch((_error) => {
        // https://axios-http.com/docs/handling_errors
        if (_error.response) {
          setError('Non 2xx code returned. Patient not fetched.');
        } else if (_error.request) {
          setError('The request was made but no response was received.');
        }
        setError('Something happened in setting up the request that triggered an Error.');
        return null;
      })
  );

  const getPatient = async () => {
    setIsLoading(true);
    const response = await callGetPatientAPI();
    setIsLoading(false);
    if (!response) return;
    setPatients(response);
  };

  useEffect(() => {
    getPatient();
  }, []);

  if (isLoading) {
    return <p>loading</p>;
  }

  if (error !== '') {
    return <p>{error}</p>;
  }

  return (
    <ul>
      {patient
        ? (
          <>
            {patient.map((child) => (
              <li>
                <a href={`/roots-radar/patient?patient=${child}`}>
                  ID:
                  {child}
                </a>
              </li>
            ))}
          </>
        )
        : <p>This patient has no children.</p>}
    </ul>
  );
}

export default PatientChildren;
