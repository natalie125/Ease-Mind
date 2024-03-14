import React from 'react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  render, screen, fireEvent, act, waitFor,
} from '@testing-library/react';
import Routes from './Routes';
import { AuthTokenContext } from './App';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

// renderWithRouter to include AuthTokenContext with a mock token
const renderWithRouterAndAuth = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <AuthTokenContext.Provider value={{ token: 'mockToken', setToken: () => console.log('setToken called') }}>
      <Router>
        {ui}
      </Router>
    </AuthTokenContext.Provider>,
  );
};

beforeEach(() => {
  // Mock sessionStorage
  Storage.prototype.getItem = jest.fn(() => '"test@example.com"'); // Mocks email string including JSON string quotes
});

describe('SignIn', () => {
  const setTokenMock = jest.fn();

  beforeEach(async () => {
    await act(async () => {
      render(
        <Router>
          <AuthTokenContext.Provider value={{ token: null, setToken: setTokenMock }}>
            <SignIn />
          </AuthTokenContext.Provider>
        </Router>,
      );
    });
  });

  it('renders login form', () => {
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('allows the user to enter email and password', async () => {
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password123!' } });
    });
  });
});

describe('SignUp Component', () => {
  const mockSetToken = jest.fn();

  beforeEach(async () => {
    await act(async () => {
      render(
        <AuthTokenContext.Provider value={{ token: null, setToken: mockSetToken }}>
          <Router>
            <SignUp />
          </Router>
        </AuthTokenContext.Provider>,
      );
    });
  });

  test('renders email and password input fields for sign up', () => {
    expect(screen.getByLabelText(/Enter Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Enter Password/i)).toBeInTheDocument();
  });

  test('allows the user to enter email and password for sign up', async () => {
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Enter Email/i), { target: { value: 'newuser@example.com' } });
      fireEvent.change(screen.getByLabelText(/Enter Password/i), { target: { value: 'NewPassword123!' } });
    });

    expect(screen.getByLabelText(/Enter Email/i).value).toBe('newuser@example.com');
    expect(screen.getByLabelText(/Enter Password/i).value).toBe('NewPassword123!');
  });
});

describe('Route tests with error handling', () => {
  // Tests for routes
  test('landing on the home page', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/home' });
    await waitFor(() => expect(screen.getByAltText('home')).toBeInTheDocument());

    // Check for each app link
    expect(screen.getByAltText('Skin-Scan_App_Kevin')).toBeInTheDocument();
    expect(screen.getByAltText('Dipstik_App_Lanre')).toBeInTheDocument();
    expect(screen.getByAltText('Stroke_App_Ramat')).toBeInTheDocument();
    expect(screen.getByAltText('Tonsilitis_App_Shreyas')).toBeInTheDocument();
    expect(screen.getByAltText('Roots Radar App')).toBeInTheDocument();
    expect(screen.getByAltText('EaseMind App')).toBeInTheDocument();
    expect(screen.getByAltText('Autism_App')).toBeInTheDocument();
    expect(screen.getByAltText('chatbotLogo')).toBeInTheDocument();
    expect(screen.getByAltText('DepressiLess App')).toBeInTheDocument();
  });

  test('navigating to the Paralysis Analysis page', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/paralysis-analysis' });
    await waitFor(() => expect(screen.getByText('Welcome to Paralysis Analysis')).toBeInTheDocument());
  });

  test('navigating to Skin Scan main page', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/skin-scan' });
    await waitFor(() => {
      expect(screen.getByText('Skin Scan')).toBeInTheDocument();
      expect(screen.getByText('Product Disclaimer')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });
  });

  test('navigating to Skin Scan take photo page', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/skin-scan/take_photo' });
    await waitFor(() => {
      expect(screen.getByText('Skin Scan')).toBeInTheDocument();
      expect(screen.getByText('Image Submission')).toBeInTheDocument();
    });
  });

  test('navigating to Skin Scan outcome positive', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/skin-scan/outcome_positive' });
    await waitFor(() => {
      expect(screen.getByText('Skin Scan')).toBeInTheDocument();
      expect(screen.getByText('Image Analysis Results')).toBeInTheDocument();
      expect(screen.getByText('Outcome - Positive')).toBeInTheDocument();
      expect(screen.getByText(/Prediction Probability:/)).toBeInTheDocument();
    });
  });

  test('navigating to Skin Scan outcome negative', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/skin-scan/outcome_negative' });
    await waitFor(() => {
      expect(screen.getByText('Skin Scan')).toBeInTheDocument();
      expect(screen.getByText('Image Analysis Results')).toBeInTheDocument();
      expect(screen.getByText('Outcome - Benign')).toBeInTheDocument();
      expect(screen.getByText(/Prediction Probability:/)).toBeInTheDocument();
    });
  });

  test('navigating to Skin Scan instructions', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/skin-scan/instructions' });
    await waitFor(() => {
      expect(screen.getByText('Skin Scan')).toBeInTheDocument();
      expect(screen.getByText('Instructions:')).toBeInTheDocument();
      expect(screen.getByText(/Please read the following instructions carefully/)).toBeInTheDocument();
    });
  });

  test('navigating to shreyas Detector main page', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/shreyas/shreyas' });
    await waitFor(() => {
      expect(screen.getByText("Shreyas' app")).toBeInTheDocument();
      expect(screen.getByText(/Webcam capture below/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    });
  });

  test('navigating to shreyas Photo Instructions page', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/shreyas/tonsillitis_instructions' });
    await waitFor(() => {
      expect(screen.getByText('Instructions for using the tonsillitis detector')).toBeInTheDocument();
      expect(screen.getByText(/This diagnostic tool has been found to have 88% accuracy in testing/)).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem').length).toBe(4);
      expect(screen.getByAltText('Example picture')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });
  });

  test('navigating to shreyas tonsillitis outcome 1', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/shreyas/tonsillitis_outcome_1' });
    await waitFor(() => {
      expect(screen.getByText('Outcome of your results')).toBeInTheDocument();
      expect(screen.getByText("You aren't showing any signs of throat infection!")).toBeInTheDocument();
      expect(screen.getByText('Enjoy the rest of your day :)')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Go back to home' })).toBeInTheDocument();
    });
  });

  test('navigating to shreyas tonsillitis outcome 2', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/shreyas/tonsillitis_outcome_2' });
    await waitFor(() => {
      expect(screen.getByText('Outcome of your results')).toBeInTheDocument();
      expect(screen.getByText('You may have tonsillitis or are showing early signs of tonsillitis!')).toBeInTheDocument();
      expect(screen.getByText('Please observe the following questions:')).toBeInTheDocument();
      expect(screen.getByText('Is there swelling on your tonsils with yellow spots?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Go back to home' })).toBeInTheDocument();
    });
  });

  test('navigating to Dipstik Instructions page', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/dipstik' });
    await waitFor(() => {
      expect(screen.getByText('Welcome to dipstik')).toBeInTheDocument();
      expect(screen.getByText('Disclaimer! (1/3)')).toBeInTheDocument();
      expect(screen.getByText(/not intended to treat, diagnose, or cure any conditions/)).toBeInTheDocument();
    });
  });

  test('navigating to Dipstik Camera page shows initial instructions', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/dipstik/dipstik-camera' });
    const instructionMessage = await screen.findByText('Fit the dipstick within the guides');
    expect(instructionMessage).toBeInTheDocument();
  });

  test('navigating to Dipstik Timer', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/dipstik/dipstik-timer' });
    await waitFor(() => {
      expect(screen.getByText(/:/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Skip' })).toBeInTheDocument();
    });
  });

  test('navigating to Dipstik result', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/dipstik/dipstik-results' });
    await waitFor(() => {
      expect(screen.getByText('Dipstik Results')).toBeInTheDocument();
      expect(screen.getByText('By Parameters')).toBeInTheDocument();
      expect(screen.getByText('By Health Conditions')).toBeInTheDocument();
      expect(screen.getByText(/LEUKOCYTES/)).toBeInTheDocument();
      expect(screen.getByText(/Nitrite/)).toBeInTheDocument();
    });
  });

  test('navigating to Roots Radar page', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/roots-radar' });
    await waitFor(() => {
      expect(screen.getByText('Roots Radar')).toBeInTheDocument();
      expect(screen.getByText('get text of id')).toBeInTheDocument();
      expect(screen.getByText('add new text in db')).toBeInTheDocument();
    });
  });

  test('navigating to EaseMind main page', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/EaseMind' });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit My Details' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Anxiety Tests' })).toBeInTheDocument();
    });
  });

  test('navigating to EaseMind Personal Details page', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/EaseMind_personal_details' });
    await waitFor(() => {
      expect(screen.getByLabelText(/First Name:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Last Name:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Date of Birth:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Gender:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/House Number:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Street Name:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Post Code:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/City:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Country:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Highest Education Level:/i)).toBeInTheDocument();
    });
  });

  test('navigating to Autism Detector Personal Details page', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/autism_instructions/personaldetails' });
    await waitFor(() => {
      expect(screen.getByLabelText('First Name:')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name:')).toBeInTheDocument();
      expect(screen.getByLabelText('Date of Birth:')).toBeInTheDocument();
      expect(screen.getByLabelText('Gender:')).toBeInTheDocument();
    });
  });

  // mock window.matchMedia before Austism Detector tests run
  beforeAll(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  test('navigating to Autism Detector main page', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/autism_instructions' });
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Personal Details/i })).toBeInTheDocument();
      expect(screen.getByText(/Understanding: Educate yourself about autism to better understand yourself./i)).toBeInTheDocument();
    });
  });

  test('navigating to DepressiLess main page', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/DepressiLess' });
    await waitFor(() => {
      expect(screen.getByAltText('User Profile')).toBeInTheDocument();
      expect(screen.getByAltText('Chat with Support')).toBeInTheDocument();
      expect(screen.getByAltText('Fill Questionnaire')).toBeInTheDocument();
      expect(screen.getByAltText('Online Resources')).toBeInTheDocument();
    });
  });

  test('navigating to the error 400 page', async () => {
    renderWithRouterAndAuth(<Routes />, { route: '/error400' });
    await waitFor(() => expect(screen.getByText('Bad HTTP Request')).toBeInTheDocument());
  });
});

export default renderWithRouterAndAuth;
