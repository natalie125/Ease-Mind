import React, {
  useState, useContext, useEffect,
} from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { AuthTokenContext } from '../../App';
import Patient from './Patient';

// import PatientCard from './PatientCard';
// import { IDetailss } from './types';

import './Patient.scss';
import PatientChildren from './PatientChildren';

interface IPatientParentIds {
  father: number;
  mother: number;
}

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function PatientHistoryTree() {
  const [searchParams] = useSearchParams();
  console.log(searchParams.get('patient'));

  const { token } = useContext(AuthTokenContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [patient, setPatients] = useState<IPatientParentIds | null>(null);

  const callGetPatientAPI = async () => (
    axios
      .get(
        `${BASEURL}api/roots-radar/mimic-patient-parent-ids/${searchParams.get('patient')}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          return response.data as IPatientParentIds;
        }
        if (response.status === 204) {
          return null;
        }
        setError('Non 200 code returned. Patient parents not fetched.');
        return null;
      })
      .catch((_error) => {
        // https://axios-http.com/docs/handling_errors
        if (_error.response) {
          setError('Non 2xx code returned. Patient parents not fetched.');
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
    <div className="PatientHistoryTreeComponent">
      <div className="mother-and-father-box">
        <div className="patient-box">
          {patient
            ? (
              <>
                <a href={`/roots-radar/patient?patient=${patient.father.toString()}`}>
                  <h3>
                    Father (ID:
                    {patient.father.toString()}
                    )
                  </h3>
                </a>
                <Patient id={patient.father.toString()} />
              </>
            )
            : <p>Father not found.</p>}
        </div>
        <div className="patient-box">
          {patient
            ? (
              <>
                <a href={`/roots-radar/patient?patient=${patient.mother.toString()}`}>
                  <h3>
                    Mother (ID:
                    {patient.mother.toString()}
                    )
                  </h3>
                </a>
                <Patient id={patient.mother.toString()} />
              </>
            )
            : <p>Mother not found.</p>}
        </div>
      </div>
      <div className="patient-box">
        <h3>
          Patient (ID:
          {searchParams.get('patient')?.toString() ?? '-1'}
          )
        </h3>
        <Patient id={searchParams.get('patient')?.toString() ?? '-1'} />
      </div>
      <div className="patient-box" style={{ marginTop: '1rem' }}>
        <h3>Children:</h3>
        <PatientChildren id={searchParams.get('patient')?.toString() ?? '-1'} />
      </div>
    </div>
  );
}

export default PatientHistoryTree;
