import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Welcome from './component/Welcome';

window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: function () { },
    removeListener: function () { }
  };
};

describe('Welcome', () => {
  it('renders welcome page elements', () => {
    render(
      <BrowserRouter>
        <Welcome />
      </BrowserRouter>
    );

    expect(screen.getByText(/Welcome to Bigbrain/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go LogIn/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go Register/i })).toBeInTheDocument();
  });
});
