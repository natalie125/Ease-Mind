import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthTokenContext } from '../../App';
import './Consent.scss';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function Consent() {
  const { token, id } = useContext(AuthTokenContext);

  const [flag, setFlag] = useState(false);

  const handlePostConsent = async () => {
    await axios
      .post(
        `${BASEURL}api/roots-radar/set-decendents-consent-flag/${id}/${flag ? 1 : 0}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          alert('Flag updated successfully!');
          // Might need the new patients subject ID in the response.
        } else {
          alert('Non 200 code returned.');
        }
      })
      .catch((error) => {
        // https://axios-http.com/docs/handling_errors
        if (error.response) {
          alert('Non 2xx code returned.');
        } else if (error.request) {
          alert('The request was made but no response was received.');
        } else {
          alert('Something happened in setting up the request that triggered an Error.');
        }
      });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // const [diag, setPatientsDiag] = useState<IDiagnosis[] | null>(null);

  const callGetPatientConsentAPI = async () => (
    axios
      .get(
        `${BASEURL}api/roots-radar/patient/${id}/consent`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          return response.data.isConsent as boolean;
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

  const getPatientConsent = async () => {
    setIsLoading(true);
    const response = await callGetPatientConsentAPI();
    setIsLoading(false);
    if (!response) return;
    setFlag(response);
  };

  useEffect(() => {
    getPatientConsent();
  }, []);

  if (error) {
    return <p>There was an error fetching consent.</p>;
  }

  if (isLoading) {
    return <p>Loading Consent</p>;
  }

  return (
    <div className="ConsentComponent">
      <h1>Roots Radar</h1>
      <div className="leftAlignDiv">
        <div>
          {isLoading
            ? (
              <p>Loading....</p>
            )
            : (
              <>
                <label htmlFor="label2">Your healthcare ID:</label>
                <input
                  type="text"
                  id="label2"
                  style={{ maxWidth: '10rem', marginLeft: '1rem' }}
                  value={id ?? ''}
                  disabled
                />
              </>
            )}
        </div>
        <h2>Consent Form</h2>
        <p style={{ marginBottom: '1rem' }}>
          Granting doctors consent to utilize your health records for diagnosing
          your descendants can prove immensely beneficial for several reasons.
          Firstly, it facilitates the identification of potential hereditary
          health conditions or genetic predispositions that your descendants may
          inherit, enabling proactive measures for prevention or early
          intervention. Secondly, it enhances medical understanding of familial
          health patterns, aiding in the development of personalized treatment
          plans and preventive strategies tailored to your family&apos;s genetic
          profile. Moreover, it fosters a continuum of care across generations,
          ensuring that pertinent medical information is readily accessible to
          guide healthcare decisions for your descendants. Ultimately, by allowing
          doctors access to your health records for diagnosing your descendants,
          you contribute to the advancement of medical knowledge and the well-being
          of future generations within your family lineage.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <input
              type="checkbox"
              id="label1"
              checked={flag}
              onChange={() => setFlag(!flag)}
            />
            <label htmlFor="label1">
              Allow my decendents&apos;s care givers to view my health records
              to assist in hereditary disease diagnosis.
            </label>
          </div>
          <div style={{ alignSelf: 'center' }}>
            <button
              type="button"
              style={{
                padding: '0.25rem',
              }}
              onClick={() => {
                handlePostConsent();
              }}
            >
              Submit Update To Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Consent;
