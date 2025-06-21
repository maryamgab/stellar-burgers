//These tests are cheking reducers and actions statuses user info slice

import {
  TUserState,
  registerNewUser,
  authenticateUser,
  logoutCurrentUser,
  updateUserProfile,
  userStateSlice,
  setAuthVerified
} from './UserInfoSlice';

const initialState: TUserState = {
  isAuthVerified: false,
  isLoggedIn: false,
  currentUser: null,
  authError: null,
  isAuthLoading: false
};

const testUser = {
  success: true,
  user: {
    email: 'test35@mail.ru',
    name: 'test'
  },
  accessToken: 'test',
  refreshToken: 'test'
};

const testLogIn = {
  email: 'test35@mail.ru',
  password: 'password'
};

const testRegisterUser = {
  email: 'test35@mail.ru',
  name: 'test',
  password: 'password'
};

const updatedUser = {
  success: true,
  user: {
    email: 'test35@mail.ru',
    name: 'test35'
  }
};

describe('User state slice reducers tests', () => {
  it('should handle authChecked', () => {
    // Задаем начальное состояние
    const previousState = {
      ...initialState,
      isAuthVerified: false // Предполагаем, что проверка аутентификации еще не завершена
    };

    // Вызываем редьюсер с предыдущим состоянием и экшеном authChecked
    const actualState = userStateSlice.reducer(
      previousState,
      setAuthVerified()
    );

    // Ожидаемое состояние после вызова редьюсера
    const expectedState = {
      ...previousState,
      isAuthVerified: true // Ожидаем, что флаг isAuthVerified станет true
    };

    // Сравниваем фактическое состояние с ожидаемым
    expect(actualState).toEqual(expectedState);
  });
});

describe('User state slice extrareducers tests', () => {
  it('should handle toRegisterUser into pending status', () => {
    const actualState = userStateSlice.reducer(
      initialState,
      registerNewUser.pending('', testRegisterUser)
    );

    expect(actualState).toEqual({
      ...initialState,
      isLoggedIn: false,
      currentUser: null,
      isAuthLoading: true
    });
  });

  it('should handle toRegisterUser into fulfilled status', () => {
    const actualState = userStateSlice.reducer(
      initialState,
      registerNewUser.fulfilled(testUser.user, '', testRegisterUser)
    );

    expect(actualState).toEqual({
      ...initialState,
      isLoggedIn: true,
      currentUser: testUser.user,
      isAuthLoading: false
    });
  });

  it('should handle toRegisterUser into rejected status', () => {
    const error = new Error('User register error');
    const actualState = userStateSlice.reducer(
      initialState,
      registerNewUser.rejected(error, '', testRegisterUser)
    );

    expect(actualState).toEqual({
      ...initialState,
      isLoggedIn: false,
      authError: 'User register error',
      isAuthLoading: false
    });
  });

  it('should handle logInUser into pending status', () => {
    const actualState = userStateSlice.reducer(
      initialState,
      authenticateUser.pending('', testLogIn)
    );

    expect(actualState).toEqual({
      ...initialState,
      authError: null,
      isAuthLoading: true
    });
  });

  it('should handle logInUser into fulfilled status', () => {
    const actualState = userStateSlice.reducer(
      initialState,
      authenticateUser.fulfilled(testUser.user, '', testRegisterUser)
    );

    expect(actualState).toEqual({
      ...initialState,
      currentUser: testUser.user,
      isLoggedIn: true,
      isAuthVerified: true,
      isAuthLoading: false
    });
  });

  it('should handle logInUser into rejected status', () => {
    const error = new Error('User Log in Error');
    const actualState = userStateSlice.reducer(
      initialState,
      authenticateUser.rejected(error, '', testLogIn)
    );

    expect(actualState).toEqual({
      ...initialState,
      isAuthVerified: true,
      isAuthLoading: false,
      isLoggedIn: false,
      authError: 'User Log in Error'
    });
  });

  it('should handle logOutUser into pending status', () => {
    const previousState = {
      ...initialState,
      isLoggedIn: true,
      currentUser: testUser.user
    };

    const actualState = userStateSlice.reducer(
      previousState,
      logoutCurrentUser.pending('')
    );

    expect(actualState).toEqual({
      ...previousState,
      isAuthLoading: true
    });
  });

  it('should handle logOutUser into fulfilled status', () => {
    const actualState = userStateSlice.reducer(
      initialState,
      logoutCurrentUser.fulfilled(undefined, '')
    );

    expect(actualState).toEqual({
      isLoggedIn: false,
      currentUser: null,
      isAuthLoading: false,
      isAuthVerified: false,
      authError: null
    });
  });

  it('should handle logOutUser into rejected status', () => {
    const error = new Error('Failed to log out');
    const previousState = {
      ...initialState,
      isLoggedIn: true,
      currentUser: testUser.user
    };

    const actualState = userStateSlice.reducer(
      previousState,
      logoutCurrentUser.rejected(error, '')
    );

    expect(actualState).toEqual({
      ...previousState,
      isLoggedIn: false,
      isAuthLoading: false,
      authError: 'Failed to log out'
    });
  });

  it('should handle updateUser into pending status', () => {
    const previousState = {
      ...initialState,
      isLoggedIn: true,
      currentUser: testUser.user
    };

    const actualState = userStateSlice.reducer(
      previousState,
      updateUserProfile.pending('', { email: 'test@test.com', name: 'Test User' })
    );

    expect(actualState).toEqual({
      ...previousState,
      isAuthLoading: true
    });
  });

  it('should handle updateUser into fulfilled status', () => {
    const previousState = {
      ...initialState,
      isLoggedIn: true,
      currentUser: testUser.user
    };

    const actualState = userStateSlice.reducer(
      previousState,
      updateUserProfile.fulfilled(updatedUser.user, '', { email: 'test@test.com', name: 'Test User' })
    );

    expect(actualState).toEqual({
      ...previousState,
      currentUser: updatedUser.user,
      isAuthLoading: false
    });
  });

  it('should handle updateUser into rejected status', () => {
    const error = new Error('Failed to update user');
    const previousState = {
      ...initialState,
      isLoggedIn: true,
      currentUser: testUser.user
    };

    const actualState = userStateSlice.reducer(
      previousState,
      updateUserProfile.rejected(error, '', { email: 'test@test.com', name: 'Test User' })
    );

    expect(actualState).toEqual({
      ...previousState,
      isAuthLoading: false,
      authError: 'Failed to update user'
    });
  });
});
