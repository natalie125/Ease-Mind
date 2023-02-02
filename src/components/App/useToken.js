import { useState } from 'react';

// Custom Hook that is used to save and get the authentication tokens
export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    console.log("Getting token")
    console.log(userToken?.data.token)
    return userToken?.data.token
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    console.log("Saving Token")
    console.log(userToken.data.token)
    setToken(userToken.data.token);
  };

  return {
    setToken: saveToken,
    token
  }
}