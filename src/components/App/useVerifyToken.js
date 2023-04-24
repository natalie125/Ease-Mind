import { useState } from "react";
import axios from "axios";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

//custom hook to verify that JWT token is a verified user in the backend
export default function useVerifyToken(token) {
	const getTokenVerification = async () => {
		const response = await axios(BASEURL + "verification", {
			method: "post",
			headers: {
				Authorization: "Bearer " + token,
			},
		})
			.then((response) => {
				if (response.status === 200) setTokenVerify(true);
				else setTokenVerify(false);
			})
			.catch((error) => {
				setTokenVerify(false);
			});
	};

	const [tokenVerify, setTokenVerify] = useState(getTokenVerification());

	return {
		setTokenVerify: tokenVerify,
	};
}
