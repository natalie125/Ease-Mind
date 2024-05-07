import React from 'react';
import { Outlet } from 'react-router';
import './AuthenticationLayout.scss';

function AuthenticationLayout() {
  return (
    <div className="authentication-body">
      <p style={{ color: 'white', marginTop: '2rem' }}>Warning: Backend is not connected.</p>
      <Outlet />
    </div>
  );
}

export default AuthenticationLayout;
