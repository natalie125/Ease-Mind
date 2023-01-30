import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    console.log("Getting token")
    console.log(userToken?.token)
    return userToken?.token
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