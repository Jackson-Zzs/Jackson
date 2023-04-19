import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './component/Dashboard';

const mockToken = 'mock-token';

window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: function () { },
    removeListener: function () { }
  };
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Dashboard', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Dashboard token={mockToken} />
      </BrowserRouter>
    );
  });

  it('renders dashboard elements', () => {
    expect(screen.getByText(/Welcome to Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Wanna Create New Game/i)).toBeInTheDocument();
  });

  it('renders new game form when the button is clicked', () => {
    const newGameButton = screen.getByText(/Wanna Create New Game/i);
    fireEvent.click(newGameButton);

    expect(screen.getByText(/Please enter the new game name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Create new game/i)).toBeInTheDocument();
  });
});
