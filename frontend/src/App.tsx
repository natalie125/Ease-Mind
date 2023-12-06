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
}

const AuthTokenContext = createContext<ITokenContext>({
  token: null,
  setToken: () => { throw new Error('AuthTokenContext uninitialised.'); },
});

function App() {
  const tokenString = sessionStorage.getItem('token');
  const [token, setToken] = useState<Token>(tokenString || null);

  useEffect(() => {
    sessionStorage.setItem('token', token || '');
  }, [token]);

  const authTokenContext = useMemo(() => (
    { token, setToken }
  ), [token, setToken]);

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
