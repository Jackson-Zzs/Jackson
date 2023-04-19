import '../utils/matchMedia';

import React from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from './Register';

afterEach(() => {
  jest.clearAllMocks();
})

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
        element: <p>Login page</p>
      },
      {
        path: '/register',
        element: <Register onSuccess={onSuccessMock} />
      }
    ],
    {
      initialEntries: ['/register'],
      initialIndex: 0
    }
  );

  render(<RouterProvider router={router}/>);

  return { router, onSuccessMock };
}

test('renders register form', () => {
  setup();

  expect(
    screen.getByRole('form', {
      name: /register form/i
    })
  ).toHaveFormValues({
    email: '',
    password: '',
    name: ''
  })

  const emailInput = screen.getByLabelText(/Email/i);
  expect(emailInput).toBeInTheDocument();

  const passwordInput = screen.getByLabelText(/Password/i);
  expect(passwordInput).toBeInTheDocument();
  expect(passwordInput).toHaveAttribute('type', 'password');

  const nameInput = screen.getByLabelText(/Name/i);
  expect(nameInput).toBeInTheDocument();

  const registerButton = screen.getByRole('button', {
    name: /register button/i
  })
  expect(registerButton).toBeInTheDocument();

  const loginButton = screen.getByRole('button', {
    name: /login button/i
  })
  expect(loginButton).toBeInTheDocument();
});

test('empty register has alert', () => {
  setup();

  const alertMock = mockAlert();

  const registerButton = screen.getByRole('button', {
    name: /register button/i
  })

  userEvent.click(registerButton);

  expect(alertMock).toHaveBeenCalled();
  expect(alertMock.mock.calls[0][0]).toMatch(/email or password or name should not be empty/i);
});

test('empty email has alert', () => {
  setup();

  const alertMock = mockAlert();

  const passwordInput = screen.getByLabelText(/Password/i);
  const nameInput = screen.getByLabelText(/Name/i);
  const registerButton = screen.getByRole('button', {
    name: /register button/i
  })

  userEvent.type(passwordInput, 'wrongpassword');
  userEvent.type(nameInput, 'Not Aperson');

  userEvent.click(registerButton);

  expect(alertMock).toHaveBeenCalled();
  expect(alertMock.mock.calls[0][0]).toMatch(/email or password or name should not be empty/i);
});

test('empty password has alert', () => {
  setup();

  const alertMock = mockAlert();

  const emailInput = screen.getByLabelText(/Email/i);
  const nameInput = screen.getByLabelText(/Name/i);
  const registerButton = screen.getByRole('button', {
    name: /register button/i
  })

  userEvent.type(emailInput, 'invalidemail@invalidemail.com');
  userEvent.type(nameInput, 'Not Aperson');

  userEvent.click(registerButton);

  expect(alertMock).toHaveBeenCalled();
  expect(alertMock.mock.calls[0][0]).toMatch(/email or password or name should not be empty/i);
});

test('empty name has alert', () => {
  setup();

  const alertMock = mockAlert();

  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const registerButton = screen.getByRole('button', {
    name: /register button/i
  })

  userEvent.type(emailInput, 'invalidemail@invalidemail.com');
  userEvent.type(passwordInput, 'wrongpassword');

  userEvent.click(registerButton);

  expect(alertMock).toHaveBeenCalled();
  expect(alertMock.mock.calls[0][0]).toMatch(/email or password or name should not be empty/i);
});

test('full register navigates correctly', async () => {
  const { router, onSuccessMock } = setup();

  global.fetch = jest.fn(async () => {
    console.log('HIIIIIIII\n\n\n\n\n\n\n\n\nHIIIIIIIII');
    return {
      json: async () => {
        return {
          token: 'REAL_TOKEN'
        };
      }
    };
  });

  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const nameInput = screen.getByLabelText(/Name/i);
  const registerButton = screen.getByRole('button', {
    name: /register button/i
  });

  userEvent.type(emailInput, 'validemail@validemail.com');
  userEvent.type(passwordInput, 'rightpassword');
  userEvent.type(nameInput, 'Areal Person');

  userEvent.click(registerButton);

  await waitFor(() => expect(onSuccessMock).toHaveBeenCalled());
  expect(onSuccessMock).toHaveBeenCalledWith('REAL_TOKEN');

  expect(router.state.location.pathname).toEqual('/login');
});
