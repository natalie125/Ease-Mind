import React, {
  useState, useContext, useEffect,
} from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { AuthTokenContext } from '../../App';

import Patient from './Patient';
import './Patient.scss';

interface IDiag {
  ICD9_CODE: string;
  SHORT_TITLE: string;
  LONG_TITLE: string;
}

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function SelfReportHistory() {
  const [searchParams] = useSearchParams();

  const { token, id } = useContext(AuthTokenContext);

  const [searchFilter, setSearchFilter] = useState('');

  // const [isLoadingSelfReport, setIsLoadingSelfReport] = useState(false);
  // const [errorSelfReport, setErrorSelfReport] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [
    patientHistory, setPatientsHistory,
  ] = useState<IDiag[] | null>(null);

  const callGetPatientHistoryAPI = async () => (
    axios
      .get(
        `${BASEURL}api/roots-radar/diagnoses`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          return response.data.diagnoses as IDiag[];
        }
        setError('Non 200 code returned. Patient history not fetched.');
        return null;
      })
      .catch((_error) => {
        // https://axios-http.com/docs/handling_errors
        if (_error.response) {
          setError('Non 2xx code returned. Patient history not fetched.');
        } else if (_error.request) {
          setError('The request was made but no response was received.');
        }
        setError('Something happened in setting up the request that triggered an Error.');
        return null;
      })
  );

  const getPatientHistory = async () => {
    setIsLoading(true);
    const response = await callGetPatientHistoryAPI();
    setIsLoading(false);
    if (!response) return;
    setPatientsHistory(response);
  };

  useEffect(() => {
    getPatientHistory();
  }, []);

  const callSelfReportAPI = async (icd9Code: string) => (
    axios
      .post(
        `${BASEURL}api/roots-radar/self-diagnose`,
        {
          data: {
            id,
            icd9Code,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          // return response.data as IPatients;
          // getAllPatients();
          alert('Self reported diagnosis successfully.');
          return 200;
        }
        // setErrorSelfReport('Non 200 code returned. Patients not fetched.');
        return null;
      })
      .catch((_error) => {
        // https://axios-http.com/docs/handling_errors
        if (_error.response) {
          // setErrorSelfReport('Non 2xx code returned. Patients not fetched.');
        } else if (_error.request) {
          // setErrorSelfReport('The request was made but no response was received.');
        }
        // setErrorSelfReport('Something happened in setting up the request that triggered an Error.');
        return null;
      })
  );

  const selfReport = async (icd9Code: string) => {
    // setIsLoadingSelfReport(true);
    await callSelfReportAPI(icd9Code);
    // setIsLoadingSelfReport(false);
    window.location.reload();
    // if (!response) return;
    // alert('Predictions Completed!');
  };

  if (isLoading) {
    return <p>loading</p>;
  }

  if (error !== '') {
    return <p>{error}</p>;
  }

  let content = <p>loading</p>;

  if (patientHistory) {
    content = (
      <div className="SelfReportHistoryComponent">
        <h2>Your current diagnoses:</h2>
        <div className="patient-box">
          <Patient id={searchParams.get('patient') ?? '-1'} onlyDiag />
        </div>
        <h2>Self report family history diagnoses:</h2>
        <input
          type="text"
          placeholder="search diagnoses"
          value={searchFilter}
          onChange={(e) => { setSearchFilter(e.target.value); }}
        />
        <table>
          <tr>
            <td>Add</td>
            <td>ICD9_CODE</td>
            <td>SHORT_TITLE</td>
            <td>LONG_TITLE</td>
          </tr>
          {patientHistory
            .filter((d) => (
              d.ICD9_CODE.startsWith(searchFilter) || d.SHORT_TITLE.startsWith(searchFilter) || d.LONG_TITLE.startsWith(searchFilter)
            ))
            .map((d) => (
              <tr>
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      // TODO: Add diagnosis
                      // send icd9 code an user id to backend
                      selfReport(d.ICD9_CODE);
                    }}
                  >
                    Add
                  </button>
                </td>
                <td>{d.ICD9_CODE}</td>
                <td>{d.SHORT_TITLE}</td>
                <td>{d.LONG_TITLE}</td>
              </tr>
            ))}
        </table>
      </div>
    );
  }

  return content;
}

export default SelfReportHistory;
