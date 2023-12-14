import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { AuthTokenContext } from '../../App';

describe('Header', () => {
  it('renders header with title and buttons', () => {
    // Mock the context values
    const contextValues = {
      token: 'your_mocked_token',
      setToken: jest.fn(),
    };

    render(
      <AuthTokenContext.Provider value={contextValues}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </AuthTokenContext.Provider>,
    );

    // Assertions for the rendered header
    expect(screen.getByText('LARKS APP')).toBeInTheDocument();
    expect(screen.getByText('Apps')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('clicking on logout button calls setToken', () => {
    const contextValues = {
      token: 'your_mocked_token',
      setToken: jest.fn(),
    };

    render(
      <AuthTokenContext.Provider value={contextValues}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </AuthTokenContext.Provider>,
    );

    // Click on the logout button and assert that setToken is called
    fireEvent.click(screen.getByText('Logout'));
    expect(contextValues.setToken).toHaveBeenCalledWith(null);
  });
});
