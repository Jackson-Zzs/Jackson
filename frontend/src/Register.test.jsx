import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from './component/Register';

test('renders register form', () => {
  const onSuccess = jest.fn();
  render(<Register onSuccess={onSuccess} />);

  const emailInput = screen.getByLabelText(/Email/i);
  expect(emailInput).toBeInTheDocument();

  const passwordInput = screen.getByLabelText(/Password/i);
  expect(passwordInput).toBeInTheDocument();

  const nameInput = screen.getByLabelText(/Name/i);
  expect(nameInput).toBeInTheDocument();

  const registerButton = screen.getByText(/Register/i);
  expect(registerButton).toBeInTheDocument();

  const goLogInButton = screen.getByText(/Go Log In/i);
  expect(goLogInButton).toBeInTheDocument();
});

test('clicking Go Log In button navigates to login page', () => {
  const onSuccess = jest.fn();
  const { container } = render(<Register onSuccess={onSuccess} />);

  const goLogInButton = screen.getByText(/Go Log In/i);
  userEvent.click(goLogInButton);

  expect(container.innerHTML).toMatch('Log In');
});
