import './utils/matchMedia';

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: function () { },
    removeListener: function () { }
  };
};

describe('App', () => {
  it('renders button with default title', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Go LogIn/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Welcome to Bigbrain/i })).toBeInTheDocument();
  });
})
