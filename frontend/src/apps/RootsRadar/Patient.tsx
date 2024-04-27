import React, {
  useState, useContext, useEffect,
} from 'react';
import axios from 'axios';
// import { useSearchParams } from 'react-router-dom';
import { AuthTokenContext } from '../../App';

// import PatientCard from './PatientCard';
// import { IDetailss } from './types';

import './Patient.scss';
import { IDetails } from './types';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function Patient({ id, onlyDiag }: {id: string; onlyDiag?: boolean}) {
  // const [searchParams] = useSearchParams();
  // console.log(searchParams.get('patient'));

  const { token } = useContext(AuthTokenContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [patient, setPatients] = useState<IDetails | null>(null);

  const callGetPatientAPI = async () => (
    axios
      .get(
        `${BASEURL}api/roots-radar/mimic-patient-details/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          return response.data as IDetails;
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

  if (!patient) {
    return <p>Patient not found</p>;
  }

  if (patient.consent !== 'True') {
    return <p>This patient has not given consent to share their data.</p>;
  }

  return (
    <div>
      {/* <p>
        id:
        {patient.id}
      </p> */}
      <div>
        <h3>diagnoses:</h3>
        <table>
          <tr>
            <td>
              ROW_ID:
            </td>
            <td>
              SUBJECT_ID:
            </td>
            <td>
              SEQ_NUM:
            </td>
            <td>
              ICD9_CODE:
            </td>
            <td>
              SHORT_TITLE:
            </td>
            <td>
              LONG_TITLE:
            </td>
            <td>
              SELF_REPORTED:
            </td>
          </tr>
          {patient.diagnoses.map((diag) => (
            <tr>
              <td>
                {diag.ROW_ID}
              </td>
              <td>
                {diag.SUBJECT_ID}
              </td>
              <td>
                {diag.SEQ_NUM}
              </td>
              <td>
                {diag.ICD9_CODE}
              </td>
              <td>
                {diag.SHORT_TITLE}
              </td>
              <td>
                {diag.LONG_TITLE}
              </td>
              <td>
                {diag.SELF_REPORTED_FLAG ? 'YES' : ''}
              </td>
            </tr>
          ))}
        </table>
      </div>
      {onlyDiag !== true && (
        <>
          <div>
            <h3>chartevents:</h3>
            <table>
              <tr>
                <td>
                  ROW_ID:
                </td>
                <td>
                  SUBJECT_ID:
                </td>
                <td>
                  ITEMID:
                </td>
                <td>
                  CHARTTIME:
                </td>
                <td>
                  STORETIME:
                </td>
                <td>
                  VALUE:
                </td>
                <td>
                  VALUENUM:
                </td>
                <td>
                  VALUEUOM:
                </td>
              </tr>
              {patient.chartevents.map((chartevent) => (
                <tr>
                  <td>
                    ROW_ID:
                    {chartevent.ROW_ID}
                  </td>
                  <td>
                    SUBJECT_ID:
                    {chartevent.SUBJECT_ID}
                  </td>
                  <td>
                    ITEMID:
                    {chartevent.ITEMID}
                  </td>
                  <td>
                    CHARTTIME:
                    {chartevent.CHARTTIME}
                  </td>
                  <td>
                    STORETIME:
                    {chartevent.STORETIME}
                  </td>
                  <td>
                    VALUE:
                    {chartevent.VALUE}
                  </td>
                  <td>
                    VALUENUM:
                    {chartevent.VALUENUM}
                  </td>
                  <td>
                    VALUEUOM:
                    {chartevent.VALUEUOM}
                  </td>
                </tr>
              ))}
            </table>
          </div>
          <div>
            <h3>labevents:</h3>
            <table>
              <tr>
                <td>
                  ROW_ID:
                </td>
                <td>
                  SUBJECT_ID:
                </td>
                <td>
                  ITEMID:
                </td>
                <td>
                  CHARTTIME:
                </td>
                <td>
                  VALUE:
                </td>
                <td>
                  VALUENUM:
                </td>
                <td>
                  VALUEUOM:
                </td>
                <td>
                  FLAG:
                </td>
              </tr>
              {patient.labevents.map((labevent) => (
                <tr>
                  <td>
                    {labevent.ROW_ID}
                  </td>
                  <td>
                    {labevent.SUBJECT_ID}
                  </td>
                  <td>
                    {labevent.ITEMID}
                  </td>
                  <td>
                    {labevent.CHARTTIME}
                  </td>
                  <td>
                    {labevent.VALUE}
                  </td>
                  <td>
                    {labevent.VALUENUM}
                  </td>
                  <td>
                    {labevent.VALUEUOM}
                  </td>
                  <td>
                    {labevent.FLAG}
                  </td>
                </tr>
              ))}
            </table>
          </div>
          <div>
            <h3>noteevents:</h3>
            <table>
              <tr>
                <td>
                  ROW_ID:
                </td>
                <td>
                  SUBJECT_ID:
                </td>
                <td>
                  CHARTDATE:
                </td>
                <td>
                  CHARTTIME:
                </td>
                <td>
                  STORETIME:
                </td>
                <td>
                  CATEGORY:
                </td>
                <td>
                  DESCRIPTION:
                </td>
                <td>
                  TEXT:
                </td>
              </tr>
              {patient.noteevents.map((noteevent) => (
                <tr>
                  <td>
                    {noteevent.ROW_ID}
                  </td>
                  <td>
                    {noteevent.SUBJECT_ID}
                  </td>
                  <td>
                    {noteevent.CHARTDATE}
                  </td>
                  <td>
                    {noteevent.CHARTTIME}
                  </td>
                  <td>
                    {noteevent.STORETIME}
                  </td>
                  <td>
                    {noteevent.CATEGORY}
                  </td>
                  <td>
                    {noteevent.DESCRIPTION}
                  </td>
                  <td>
                    {noteevent.TEXT}
                  </td>
                </tr>
              ))}
            </table>
          </div>
          <div>
            <h3>datetimeevents:</h3>
            <table>
              <tr>
                <td>
                  ROW_ID:
                </td>
                <td>
                  SUBJECT_ID:
                </td>
                <td>
                  ITEMID:
                </td>
                <td>
                  CHARTTIME:
                </td>
                <td>
                  STORETIME:
                </td>
                <td>
                  VALUE:
                </td>
              </tr>
              {patient.datetimeevents.map((datetimeevent) => (
                <tr>
                  <td>
                    {datetimeevent.ROW_ID}
                  </td>
                  <td>
                    {datetimeevent.SUBJECT_ID}
                  </td>
                  <td>
                    {datetimeevent.ITEMID}
                  </td>
                  <td>
                    {datetimeevent.CHARTTIME}
                  </td>
                  <td>
                    {datetimeevent.STORETIME}
                  </td>
                  <td>
                    {datetimeevent.VALUE}
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Patient;
