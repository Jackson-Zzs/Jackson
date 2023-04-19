import React from 'react';
import { render, screen } from '@testing-library/react';
import LogIn from './component/LogIn';

test('renders login form', () => {
  const onSuccessMock = jest.fn();
  render(<LogIn onSuccess={onSuccessMock} />);

  // 检查Email和Password输入框是否存在
  const emailInput = screen.getByLabelText(/Email/i);
  expect(emailInput).toBeInTheDocument();

  const passwordInput = screen.getByLabelText(/Password/i);
  expect(passwordInput).toBeInTheDocument();

  // 检查登录按钮是否存在
  const loginButton = screen.getByText(/Log In/i);
  expect(loginButton).toBeInTheDocument();

  // 检查注册按钮是否存在
  const registerButton = screen.getByText(/Register/i);
  expect(registerButton).toBeInTheDocument();
});
