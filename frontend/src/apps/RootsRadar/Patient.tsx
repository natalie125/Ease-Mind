import React, {
  useState, useContext, useEffect,
} from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { AuthTokenContext } from '../../App';

import PatientCard from './PatientCard';
// import { IPatients } from './types';

import './Patient.scss';
import { IPatient } from './types';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function Patient() {
  const [searchParams] = useSearchParams();
  console.log(searchParams.get('patient'));

  const { token } = useContext(AuthTokenContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [patient, setPatients] = useState<IPatient | null>(null);

  const callGetPatientAPI = async (ID: string) => (
    axios
      .get(
        `${BASEURL}api/roots-radar/patient/${ID}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          return response.data.patients as IPatient;
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

  const getPatient = async (id:string) => {
    setIsLoading(true);
    const response = await callGetPatientAPI(id);
    setIsLoading(false);
    if (!response) return;
    setPatients(response);
  };

  useEffect(() => {
    getPatient(searchParams.get('patient') ?? '0');
  }, []);

  useEffect(() => {
    console.log(patient);
    if (patient?.PatientID) {
      // TODO: Get parents:
    }
  }, [patient]);

  // TODO: get patients parents by id from db
  // TODO: if parents are allowed to be shown then let them be shown in detail
  if (isLoading) {
    return <p>loading</p>;
  }

  if (error !== '') {
    return <p>{error}</p>;
  }

  let content = <p>loading</p>;

  if (patient?.PatientID) {
    content = (
      <div className="PatientComponent" key={patient?.PatientID ?? '-1'}>
        {/* TODO: Patient MOTHER AND FATHER */}
        {/* TODO: Make links to them. */}
        <div className="mother-and-father-box">
          <div>
            <h2>Mother</h2>
            <PatientCard patient={patient} />
          </div>
          <div>
            <h2>Father</h2>
            <PatientCard patient={patient} />
          </div>
        </div>

        <h2>
          Patient Name: TBD | Patient ID:
          {patient?.PatientID ?? '-1'}
        </h2>
        <PatientCard patient={patient} />
      </div>
    );
  }

  return content;
}

export default Patient;
