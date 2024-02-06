import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import SignUp from './SignUp';
import { AuthTokenContext } from '../App';

jest.mock('axios');
const mockedAxios = axios;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockSetToken = jest.fn();

const renderSignUp = () => render(
  <BrowserRouter>
    <AuthTokenContext.Provider value={{ token: null, setToken: mockSetToken }}>
      <SignUp />
      ,
    </AuthTokenContext.Provider>
    ,
  </BrowserRouter>,
);

describe('SignUp Component', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders SignUp component', () => {
    renderSignUp();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('allows the user to enter their email', () => {
    renderSignUp();
    const emailInput = document.querySelector('[data-cy="signUpEmail"]');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('allows the user to enter their password', () => {
    renderSignUp();
    const passwordInput = document.querySelector('[data-cy="signUpPasswd"]');
    fireEvent.change(passwordInput, { target: { value: 'SecurePass123!' } });
    expect(passwordInput.value).toBe('SecurePass123!');
  });

  it('submits the form with the entered values', async () => {
    mockedAxios.post.mockResolvedValue({ data: { token: 'fakeToken123' }, status: 200 });

    renderSignUp();

    const emailInput = document.querySelector('[data-cy="signUpEmail"]');
    const passwordInput = document.querySelector('[data-cy="signUpPasswd"]');
    const confirmPasswordInput = document.querySelector('[data-cy="confirmSignUpPasswd"]');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SecurePass123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'SecurePass123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(expect.any(String), {
        email: 'test@example.com',
        password: 'SecurePass123!', // Added trailing comma
      });
    });
  });

  it('displays an error message when the user already exists', async () => {
    mockedAxios.post.mockResolvedValue({ status: 409 });

    renderSignUp();

    const emailInput = document.querySelector('[data-cy="signUpEmail"]');
    const passwordInput = document.querySelector('[data-cy="signUpPasswd"]');
    const confirmPasswordInput = document.querySelector('[data-cy="confirmSignUpPasswd"]');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'existinguser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SecurePass123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'SecurePass123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/user with this email already exists/i)).toBeInTheDocument();
    });
  });
});
