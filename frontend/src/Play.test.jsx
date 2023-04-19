import React from 'react';
import { render, screen } from '@testing-library/react';
import Play from './component/Play';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: function () { },
    removeListener: function () { }
  };
};

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('Play', () => {
  beforeEach(() => {
    useParams.mockImplementation(() => ({ sessionid: '12345' }));
    useLocation.mockImplementation(() => ({ pathname: '/play/id/12345' }));
    useNavigate.mockImplementation(() => jest.fn());
  });

  afterEach(() => {
    useParams.mockClear();
    useLocation.mockClear();
    useNavigate.mockClear();
  });

  test('renders Play Game title', () => {
    render(<Play />);
    const title = screen.getByText(/Play Game/i);
    expect(title).toBeInTheDocument();
  });

  // Add other tests here
});
