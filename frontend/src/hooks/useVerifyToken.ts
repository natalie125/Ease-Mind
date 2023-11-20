import { useMemo } from "react";
import axios from "axios";

let BASEURL = process.env.NODE_ENV === "development"
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

// TODO: Is this needed and where?

// Custom hook to verify that JWT token is a verified user in the backend.
export default function useVerifyToken(token: string) {
  let isVerified = useMemo(async () => {
    return await axios(BASEURL + "verification", {
      method: "post",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      if (response.status === 200) return true;
      else return false;
    })
      .catch((error) => {
        console.log(error); // TODO: Do something with this?
        return false;
      });
  }, [token]);

  return isVerified;
}
