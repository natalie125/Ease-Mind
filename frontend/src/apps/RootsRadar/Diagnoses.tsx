import React, {
  useState, useContext, useEffect,
} from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { AuthTokenContext } from '../../App';
import './Diagnoses.scss';
import { IDiagnosis } from './types';

import Patient from './Patient';
import './Patient.scss';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function Diagnoses() {
  const { token } = useContext(AuthTokenContext);

  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [diag, setPatientsDiag] = useState<IDiagnosis[] | null>(null);

  const callGetPatientDiagnosesAPI = async (ID: string) => (
    axios
      .get(
        `${BASEURL}api/roots-radar/patient/${ID}/diagnoses`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          return response.data.diagnoses as IDiagnosis[];
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

  const getPatientDiagnoses = async (id:string) => {
    setIsLoading(true);
    const response = await callGetPatientDiagnosesAPI(id);
    setIsLoading(false);
    if (!response) return;
    setPatientsDiag(response);
  };

  useEffect(() => {
    getPatientDiagnoses(searchParams.get('patient') ?? '10');
  }, []);

  if (isLoading) {
    return <p>loading</p>;
  }

  if (error !== '') {
    return <p>{error}</p>;
  }

  let content = <p>loading</p>;

  if (diag !== null) {
    content = (
      <div className="DiagnosesComponent">
        {/* <a href="/roots-radar">Back to home</a> */}
        <h1>Roots Radar</h1>
        <h2>Diagnoses logged on you account:</h2>
        {/* {diag.map((d) => (
          <p>
            Diagnosis code: &nbsp;
            {d.ICD9_CODE}
            &nbsp;-&nbsp;
            {d.text}
          </p>
        ))} */}
        <div className="patient-box">
          <Patient id={searchParams.get('patient') ?? '-1'} onlyDiag />
        </div>
      </div>
    );
  }

  return content;
}

export default Diagnoses;
