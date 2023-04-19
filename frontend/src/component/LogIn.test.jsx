import '../utils/matchMedia';

import React from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LogIn from './LogIn';

const mockAlert = () => {
  const alertMock = jest.fn();
  jest.spyOn(window, 'alert').mockImplementation(alertMock);

  return alertMock;
}

const setup = () => {
  const onSuccessMock = jest.fn();

  const router = createMemoryRouter(
    [
      {
        path: '/login',
        element: <LogIn onSuccess={onSuccessMock} />
      },
      {
        path: '/register',
        element: <p>Register page</p>
      }
    ],
    {
      initialEntries: ['/login'],
      initialIndex: 0
    }
  );

  render(<RouterProvider router={router}/>);

  return { router, onSuccessMock };
}

test('renders login form', () => {
  setup();

  expect(
    screen.getByRole('form', {
      name: /login form/i
    })
  ).toHaveFormValues({
    email: '',
    password: ''
  })

  const emailInput = screen.getByLabelText(/Email/i);
  expect(emailInput).toBeInTheDocument();

  const passwordInput = screen.getByLabelText(/Password/i);
  expect(passwordInput).toBeInTheDocument();
  expect(passwordInput).toHaveAttribute('type', 'password');

  const loginButton = screen.getByRole('button', {
    name: /login button/i
  })
  expect(loginButton).toBeInTheDocument();

  const registerButton = screen.getByRole('button', {
    name: /register button/i
  })
  expect(registerButton).toBeInTheDocument();
});

test('empty login has alert', () => {
  setup();

  const alertMock = mockAlert();

  const loginButton = screen.getByRole('button', {
    name: /login button/i
  });

  userEvent.click(loginButton);

  expect(alertMock).toHaveBeenCalled();
  expect(alertMock.mock.calls[0][0]).toMatch(/email and password should not be empty/i);
});

test('empty password has alert', () => {
  setup();

  const alertMock = mockAlert();

  const emailInput = screen.getByLabelText(/Email/i);
  const loginButton = screen.getByRole('button', {
    name: /login button/i
  });

  userEvent.type(emailInput, 'invalidemail@invalidemail.com');

  userEvent.click(loginButton);

  expect(alertMock).toHaveBeenCalled();
  expect(alertMock.mock.calls[0][0]).toMatch(/email and password should not be empty/i);
});

test('empty email has alert', () => {
  setup();

  const alertMock = mockAlert();

  const passwordInput = screen.getByLabelText(/Password/i);
  const loginButton = screen.getByRole('button', {
    name: /login button/i
  });

  userEvent.type(passwordInput, 'wrongpassword');
  userEvent.click(loginButton);

  expect(alertMock).toHaveBeenCalled();
  expect(alertMock.mock.calls[0][0]).toMatch(/email and password should not be empty/i);
});

test('invalid login has alert', async () => {
  setup();

  const alertMock = mockAlert();

  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const loginButton = screen.getByRole('button', {
    name: /login button/i
  });

  userEvent.type(emailInput, 'invalidemail@invalidemail.com');
  userEvent.type(passwordInput, 'wrongpassword');

  userEvent.click(loginButton);

  await waitFor(() => expect(alertMock).toHaveBeenCalled());
  expect(alertMock.mock.calls[0][0]).toMatch(/please enter the right email and password/i);
});
