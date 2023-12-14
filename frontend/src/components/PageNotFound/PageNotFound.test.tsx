import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import PageNotFound from './PageNotFound';

describe('PageNotFound', () => {
  it('renders page not found message and link to home', () => {
    render(
      <BrowserRouter>
        <PageNotFound />
      </BrowserRouter>,
    );

    // Assertions for the rendered content
    expect(screen.getByAltText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Click here to go home!/i })).toBeInTheDocument();
  });
});
