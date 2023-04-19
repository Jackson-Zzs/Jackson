import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from './Dashboard.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

import '../utils/matchMedia';

// Mock useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockToken = 'mock-token';

describe('Dashboard', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation((url, options) => {
      if (url.includes('/admin/quiz')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ quizzes: [] }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders dashboard title', () => {
    render(
      <Router>
        <Dashboard token={mockToken} />
      </Router>
    );
    expect(screen.getByText('Welcome to Dashboard')).toBeInTheDocument();
  });

  test('toggles create new game input', async () => {
    render(
      <Router>
        <Dashboard token={mockToken} />
      </Router>
    );
    const createButton = screen.getByLabelText('create button');
    fireEvent.click(createButton);
    expect(screen.getByLabelText('game name')).toBeInTheDocument();

    const cancelButton = screen.getByLabelText('cancel create button');
    fireEvent.click(cancelButton);
    expect(screen.queryByLabelText('game name')).not.toBeInTheDocument();
  });

  test('create new game', async () => {
    render(
      <Router>
        <Dashboard token={mockToken} />
      </Router>
    );
    const createButton = screen.getByLabelText('create button');
    fireEvent.click(createButton);

    const gameNameInput = screen.getByLabelText('game name');
    fireEvent.change(gameNameInput, { target: { value: 'Test Game' } });

    const createGameButton = screen.getByLabelText('create game button');
    await act(async () => {
      fireEvent.click(createGameButton);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5005/admin/quiz/new',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify({
          name: 'Test Game',
        }),
      })
    );
  });
});
