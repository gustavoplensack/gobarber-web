/**
 * Auth hook testing suit
 */
import { renderHook } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';

import { AuthProvider, useAuth } from '../../hooks/auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

const EXPECTED_EMAIL = 'johndoe@example.com';

describe('Auth Hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      token: 'token-123',
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: EXPECTED_EMAIL,
      },
    };
    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    // get hook returned value
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: EXPECTED_EMAIL,
      password: '123456',
    });

    // Assert user is being set on state
    await waitForNextUpdate();
    expect(result.current.user.email).toEqual(EXPECTED_EMAIL);

    // Assert hook has set item to local storage
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token,
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    );
  });
});
