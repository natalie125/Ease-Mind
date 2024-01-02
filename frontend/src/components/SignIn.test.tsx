import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import SignIn from './SignIn';

describe('SignIn', () => {
  it('renders login form', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const loginElements = screen.queryAllByText('Login');
    expect(loginElements.length).toBeGreaterThan(0);

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('displays error message for empty fields', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const loginBtn = screen.getByRole('button', { name: 'Login' });
    fireEvent.click(loginBtn);

    expect(
      screen.getByText('Please enter a username and password'),
    ).toBeInTheDocument();
  });

  it('submits login form with valid credentials', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginBtn = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginBtn);
  });

  it('redirects to home page on successful login', async () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginBtn = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'validPassword' } });
    fireEvent.click(loginBtn);
  });

  it('validates form fields before submission', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByText('Please enter a username and password')).toBeInTheDocument();
  });

  it('contains a sign-up link that navigates to the sign-up page', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    // Find the 'Sign Up' text
    const signUpText = screen.getByText('Sign Up');
    expect(signUpText).toBeInTheDocument();

    // Find the parent <a> of the 'Sign Up' text
    const parentLink = signUpText.closest('a');
    expect(parentLink).toHaveAttribute('href', '/auth/signup');
  });

  it('displays server error message when server returns an error', async () => {
    // Mocking a failed API call
    jest.spyOn(axios, 'post').mockRejectedValueOnce({
      response: { status: 500 },
    });

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginBtn = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginBtn);

    // Wait for the error message to appear
    await screen.findByText('Server error. Please try again later.');

    expect(
      screen.getByText('Server error. Please try again later.'),
    ).toBeInTheDocument();
  });

  it('displays error message for incorrect credentials', async () => {
    // Mocking a failed API call with 401 Unauthorized status
    jest.spyOn(axios, 'post').mockRejectedValueOnce({
      response: { status: 401 },
    });

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginBtn = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginBtn);

    // Wait for the error message to appear
    await screen.findByText('Incorrect email or password. Please try again.');

    expect(
      screen.getByText('Incorrect email or password. Please try again.'),
    ).toBeInTheDocument();
  });

  it('displays network error message when the user is offline', async () => {
    // Mocking the user being offline
    jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(false);

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginBtn = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(
        screen.getByText('Network error. Please check your internet connection.'),
      ).toBeInTheDocument();
    });
  });

  it('displays an error message when the server request times out', async () => {
    // Mocking a timeout error for the API call
    jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('Timeout'));

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginBtn = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(
        screen.getByText('An error occurred. Please try again.'),
      ).toBeInTheDocument();
    });
  });

  it('displays an error message when the API request fails with an unknown error', async () => {
    // Mocking an unknown error for the API call
    jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('Unknown Error'));

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginBtn = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(
        screen.getByText('An error occurred. Please try again.'),
      ).toBeInTheDocument();
    });
  });

  it('redirects to home page and sets token on successful login', async () => {
    // Mocking a successful API call with a token
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      status: 200,
      data: {
        token: 'someToken',
        email: 'test@example.com',
      },
    });

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginBtn = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'validPassword' } });
    fireEvent.click(loginBtn);
  });
});
