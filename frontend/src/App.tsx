import React, { createContext, useState, useEffect } from "react";
import Header from "./components/Header";
import Routes from "./Routes";

type Token = string | null;

interface ITokenContext {
  token: Token;
  setToken: React.Dispatch<React.SetStateAction<Token>>;
}

const AuthTokenContext = createContext<ITokenContext>({
  token: null,
  setToken: () => {},
});

const App = () => {
  const tokenString = sessionStorage.getItem("token");
  const [token, setToken] = useState<Token>(tokenString ? tokenString : null);

  useEffect(() => {
    sessionStorage.setItem("token", token ? token : "");
    console.log("token:" + token);
  }, [token]);

  return (
    <AuthTokenContext.Provider value={{token, setToken}}>
      <div className="App">
        <Header />
        <Routes />
      </div>
    </AuthTokenContext.Provider>
  );
};

export { AuthTokenContext };
export default App;
