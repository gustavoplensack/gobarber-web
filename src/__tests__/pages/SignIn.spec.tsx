import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import SignIn from '../../pages/SignIn';

// Mocking react-router-dom features to allow
// testing the component.
jest.mock('react-router-dom', () => {
  return {
    useHistory: jest.fn(),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

const mockedSignIn = jest.fn();
jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

describe('SignIn Page', () => {
  it('should be able to sign in', async () => {
    const { getByText, getByPlaceholderText } = render(<SignIn />);

    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Senha');
    const submitButton = getByText('Entrar');

    const email = 'email@mail.com.br';
    const password = '123456';

    fireEvent.change(emailField, { target: { value: email } });
    fireEvent.change(passwordField, { target: { value: password } });

    fireEvent.click(submitButton);

    await wait(() => {
      expect(mockedSignIn).toHaveBeenCalledWith({ email, password });
    });
  });
});
