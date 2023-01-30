import React from "react";
import Main from "../../Main";
import "../App/App.css";
import Login from '../Login';
import Lanre from "../Lanre/Lanre";
import Alex from "../Alex/Alex";
import Ramat from "../Ramat/Ramat";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Redirect } from 'react-router'
import {Navigate} from 'react-router-dom';


export default function App() {
	return (
		<div className="App">
			<Main />
		</div>
	);
}
