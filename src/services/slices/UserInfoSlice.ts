import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { readCookie, writeCookie, removeCookie } from '../../utils/cookie';
import {
  refreshAccessToken,
  apiRequestWithTokenRefresh,
  signUpUserApi,
  signInUserApi,
  fetchUserProfileApi,
  updateUserProfileApi,
  signOutUserApi,
  requestPasswordResetApi,
  confirmPasswordResetApi,
  TSignUpData
} from '../../utils/burger-api';

export type TUserState = {
  isAuthVerified: boolean; // Статус проверки токена пользователя
  isLoggedIn: boolean;
  currentUser: TUser | null; // null, если пользователь не авторизован
  authError: null | string; // Ошибка авторизации, если есть
  isAuthLoading: boolean; // Статус запроса авторизации
};

const initialUserState: TUserState = {
  isAuthVerified: false,
  isLoggedIn: false,
  currentUser: null,
  authError: null,
  isAuthLoading: false
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  fetchUserProfileApi
);

export const registerNewUser = createAsyncThunk(
  'user/register',
  async ({ email, password, name }: TSignUpData) => {
    const userData = await signUpUserApi({ email, password, name });

    writeCookie('accessToken', userData.accessToken);
    localStorage.setItem('refreshToken', userData.refreshToken);

    return userData.user;
  }
);

export const authenticateUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: Omit<TSignUpData, 'name'>) => {
    const authData = await signInUserApi({ email, password });

    writeCookie('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);

    return authData.user;
  }
);

export const logoutCurrentUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await signOutUserApi();
      removeCookie('accessToken');
      localStorage.clear();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/update',
  updateUserProfileApi
);

export const userStateSlice = createSlice({
  name: 'userstate',
  initialState: initialUserState,
  reducers: {
    setAuthVerified: (state) => {
      state.isAuthVerified = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoggedIn = false;
        state.authError = null;
        state.currentUser = null;
        state.isAuthLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.currentUser = action.payload as TUser;
        state.isAuthVerified = true;
        state.isAuthLoading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.authError = action.error.message || 'Failed to fetch user data';
        state.isLoggedIn = false;
        state.currentUser = null;
        state.isAuthVerified = true;
        state.isAuthLoading = false;
      })
      .addCase(registerNewUser.pending, (state) => {
        state.isLoggedIn = false;
        state.currentUser = null;
        state.isAuthLoading = true;
      })
      .addCase(registerNewUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.currentUser = action.payload as TUser;
        state.isAuthLoading = false;
      })
      .addCase(registerNewUser.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.authError =
          action.error.message || 'Failed to fetch register user ';
        state.isAuthLoading = false;
      })
      .addCase(authenticateUser.pending, (state) => {
        state.authError = null;
        state.isAuthLoading = true;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.currentUser = action.payload as TUser;
        state.isAuthLoading = false;
        state.isAuthVerified = true;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.isAuthLoading = false;
        state.authError =
          action.error.message || 'Failed to fetch Log in user ';
        state.isAuthVerified = true;
      })
      .addCase(logoutCurrentUser.pending, (state) => {
        state.isLoggedIn = true;
        state.isAuthLoading = true;
      })
      .addCase(logoutCurrentUser.fulfilled, (state, action) => {
        state.isLoggedIn = false;
        state.isAuthLoading = false;
        state.currentUser = null;
        removeCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(logoutCurrentUser.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.isAuthLoading = false;
        state.authError =
          action.error.message || 'Failed to fetch Log Out user ';
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoggedIn = true;
        state.isAuthLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.currentUser = action.payload as TUser;
        state.isAuthLoading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.authError = action.error.message || 'Failed to fetch update user';
        state.isAuthLoading = false;
      });
  },
  selectors: {
    selectUser: (state) => state.currentUser,
    selectIsAuthenticated: (state) => state.isLoggedIn,
    selectLoginUserError: (state) => state.authError,
    selectIsAuthChecked: (state) => state.isAuthVerified,
    selectloginUserRequest: (state) => state.isAuthLoading
  }
});

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  (_, { dispatch }) => {
    if (readCookie('accessToken')) {
      dispatch(fetchUserProfile()).finally(() => {
        dispatch(setAuthVerified());
      });
    } else {
      dispatch(setAuthVerified());
    }
  }
);

export const { setAuthVerified } = userStateSlice.actions;
export default userStateSlice;

export const {
  selectUser,
  selectIsAuthenticated,
  selectLoginUserError,
  selectIsAuthChecked,
  selectloginUserRequest
} = userStateSlice.selectors;
