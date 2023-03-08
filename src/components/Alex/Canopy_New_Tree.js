import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import "../App/App.css";

var baseurl = "http://localhost:5000/canopy/";
	if(window.location.href.includes("localhost")) {
		baseurl = "http://localhost:5000/canopy/";
	}
	else {
		baseurl = "https://d23bykmxle9vsv.cloudfront.net/";
	}

function Canopy_New_Tree(props) {
	const navigate = useNavigate();
	const location = useLocation();
	const user_email = sessionStorage.getItem("email").substring(1, sessionStorage.getItem("email").length - 1);

	const [name, setName] = useState("Tree Name");
	const [owner, setOwner] = useState(user_email);

	// create a new tree with the name, owner set under the logged in user
	const postTree = async (url_input, tree_data) => {
		const post_response = await axios.post(url_input, null, {params: tree_data});	// should return the patient's ID
		console.log(JSON.stringify(post_response));
	}

	useEffect(() => {
	}, []);

	return (
		<div className="App">
			<header className="App-header-primary">
				<h1>Add New Tree Owned By: {owner}</h1>
			</header>

			<br/>

			<form>
				<label>
					Name:
					<input
					name="name"
					type="text"
					value={name}
					onChange={e => setName(e.target.value)} />
				</label>
			</form>

			<br/>

			<button onClick={() => {
				postTree(baseurl + "tree/prod", {name: name, owner: user_email })
				alert("New Tree: " + name + " Added!")
				navigate(-1);
			}}> 
				Add New Tree
			</button>

			<br/>

			<button onClick={() => {
				navigate(-1);
			}}> 
				Back 
			</button>
		</div>
	);
}

export default Canopy_New_Tree;
