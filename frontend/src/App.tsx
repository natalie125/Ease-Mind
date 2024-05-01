import React, {
  createContext, useState, useEffect, useMemo,
} from 'react';
import Header from './components/Header/Header';
import Routes from './Routes';
import './App.scss';

type Token = string | null;

interface ITokenContext {
  token: Token;
  setToken: React.Dispatch<React.SetStateAction<Token>>;
  email: string | null;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
  rootsRadarRole: string | null;
  setRootsRadarRole: React.Dispatch<React.SetStateAction<string | null>>;
  id: string | null;
  setId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthTokenContext = createContext<ITokenContext>({
  token: null,
  setToken: () => { throw new Error('AuthTokenContext uninitialised.'); },
  email: null,
  setEmail: () => { throw new Error('AuthTokenContext uninitialised.'); },
  rootsRadarRole: null,
  setRootsRadarRole: () => { throw new Error('AuthTokenContext uninitialised.'); },
  id: null,
  setId: () => { throw new Error('AuthTokenContext uninitialised.'); },
});

function App() {
  const tokenString = sessionStorage.getItem('token');
  const emailString = sessionStorage.getItem('email');
  const rootsRadarRoleNumber = sessionStorage.getItem('rootsRadarRole');
  const idString = sessionStorage.getItem('id');
  const [token, setToken] = useState<Token>(tokenString || null);
  const [email, setEmail] = useState<string | null>(emailString || null);
  const [rootsRadarRole, setRootsRadarRole] = useState<string | null>(rootsRadarRoleNumber);
  const [id, setId] = useState<string | null>(idString || null);

  useEffect(() => {
    sessionStorage.setItem('token', token || '');
  }, [token]);

  useEffect(() => {
    sessionStorage.setItem('email', email || '');
  }, [email]);

  useEffect(() => {
    sessionStorage.setItem('rootsRadarRole', rootsRadarRole?.toString() || '');
  }, [rootsRadarRole]);

  useEffect(() => {
    sessionStorage.setItem('id', id || '');
  }, [id]);

  const authTokenContext = useMemo(() => (
    {
      token, setToken, email, setEmail, rootsRadarRole, setRootsRadarRole, id, setId,
    }
  ), [token, setToken, email, setEmail, rootsRadarRole, setRootsRadarRole]);

  return (
    <AuthTokenContext.Provider value={authTokenContext}>
      <div className="app">
        <Header />
        <Routes />
      </div>
    </AuthTokenContext.Provider>
  );
}

export { AuthTokenContext };
export default App;
