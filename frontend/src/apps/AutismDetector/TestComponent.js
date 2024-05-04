import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import TestComponent from './TestComponent';

// Utility to render the component within the Router context
function renderWithRouter(ui, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
}

describe('TestComponent', () => {
  it('should render the component correctly', () => {
    const { getByText } = renderWithRouter(<TestComponent />);
    expect(getByText(/go back/i)).toBeInTheDocument();
  });

  it('should navigate when Go Back is clicked', () => {
    const { getByText } = renderWithRouter(<TestComponent />);
    fireEvent.click(getByText(/go back/i));
    // Check if the navigate function was called, mock or check history object as needed
  });

  // Additional tests can be added here...
});
