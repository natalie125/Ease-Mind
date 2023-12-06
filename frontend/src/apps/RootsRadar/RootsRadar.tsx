import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthTokenContext } from '../../App';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function RootsRadar() {
  const { token } = useContext(AuthTokenContext);
  const [id, setId] = useState('');
  const [text, setText] = useState('');

  const handlePostText = async () => {
    await axios
      .post(
        `${BASEURL}api/roots-radar/mvp-string`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          setId(response.data.id);
        } else {
          setId(`ERROR: ${response.data.msg}`);
        }
      });
  };

  const handleGetText = async () => {
    await axios
      .get(`${BASEURL}api/roots-radar/mvp-string`, {
        params: { id },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          setText(response.data.text);
        } else {
          setText(response.data.msg);
        }
      });
  };

  return (
    <div>
      <h1>Roots Radar</h1>
      <p>
        id:
        {id}
      </p>
      <input type="text" id="id_input" value={id} onChange={(e) => setId(e.target.value)} />
      <hr />
      <p>
        Text:
        {text}
      </p>
      <input type="text" id="text_input" value={text} onChange={(e) => setText(e.target.value)} />
      <hr />
      <button
        type="button"
        onClick={() => handleGetText()}
        disabled={id === ''}
      >
        get text of id
      </button>
      <button
        type="button"
        onClick={() => handlePostText()}
        disabled={text === ''}
      >
        add new text in db
      </button>
    </div>
  );
}

export default RootsRadar;
