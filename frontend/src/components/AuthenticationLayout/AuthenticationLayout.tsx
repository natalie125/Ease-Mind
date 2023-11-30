import React from "react";
import { Outlet } from "react-router";
import "./AuthenticationLayout.scss";

const AuthenticationLayout = () => (
  <div className="authentication-body">
    <Outlet />
  </div>
);

export default AuthenticationLayout;
