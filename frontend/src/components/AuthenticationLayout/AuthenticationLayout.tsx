import React from 'react';
import { Outlet } from 'react-router';
import './AuthenticationLayout.scss';

function AuthenticationLayout() {
  return (
    <div className="authentication-body">
      <Outlet />
    </div>
  );
}

export default AuthenticationLayout;
