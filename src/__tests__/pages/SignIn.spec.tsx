import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import SignIn from '../../pages/SignIn';
import { useAuth } from '../../hooks/auth';

// Mocking react-router-dom features to allow
// testing the component.
const mockedPush = jest.fn();
jest.mock('react-router-dom', () => {
  return {
    useHistory: () => {
      return { push: mockedPush };
    },
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

const mockedAddToast = jest.fn();
jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignIn Page', () => {
  beforeEach(() => {
    mockedPush.mockClear();
    mockedSignIn.mockClear();
    mockedAddToast.mockClear();
  });

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
      expect(mockedPush).toHaveBeenCalledWith('dashboard');
    });
  });

  it('should block API post on invalid password or mail', async () => {
    const { getByText, getByPlaceholderText } = render(<SignIn />);

    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Senha');
    const submitButton = getByText('Entrar');

    const email = 'not-a-valid-email';
    const password = '111';

    fireEvent.change(emailField, { target: { value: email } });
    fireEvent.change(passwordField, { target: { value: password } });

    fireEvent.click(submitButton);

    await wait(() => {
      expect(mockedPush).not.toHaveBeenCalled();
      expect(mockedAddToast).not.toHaveBeenCalled();
    });
  });

  it('should add a toast on sign in errors', async () => {
    // Override useAuth mock
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByText, getByPlaceholderText } = render(<SignIn />);

    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Senha');
    const submitButton = getByText('Entrar');

    const email = 'valid@mail.com.br';
    const password = '123456';

    fireEvent.change(emailField, { target: { value: email } });
    fireEvent.change(passwordField, { target: { value: password } });

    fireEvent.click(submitButton);

    await wait(() => {
      expect(mockedPush).not.toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
