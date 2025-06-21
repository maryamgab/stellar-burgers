import { writeCookie, readCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

const API_BASE_URL =
  process.env.REACT_APP_BURGER_API_URL ||
  'https://norma.nomoreparties.space/api';

const validateResponse = <T>(response: Response): Promise<T> =>
  response.ok
    ? response.json()
    : response.json().then((error) => Promise.reject(error));

type TApiResponse<T> = {
  success: boolean;
} & T;

type TTokenRefreshResponse = TApiResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshAccessToken = (): Promise<TTokenRefreshResponse> =>
  fetch(`${API_BASE_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((response) => validateResponse<TTokenRefreshResponse>(response))
    .then((tokenData) => {
      if (!tokenData.success) {
        return Promise.reject(tokenData);
      }
      localStorage.setItem('refreshToken', tokenData.refreshToken);
      writeCookie('accessToken', tokenData.accessToken);
      return tokenData;
    });

export const apiRequestWithTokenRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const response = await fetch(url, options);
    return await validateResponse<T>(response);
  } catch (error) {
    if ((error as { message: string }).message === 'jwt expired') {
      const tokenData = await refreshAccessToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          tokenData.accessToken;
      }
      const response = await fetch(url, options);
      return await validateResponse<T>(response);
    } else {
      return Promise.reject(error);
    }
  }
};

type TIngredientsApiResponse = TApiResponse<{
  data: TIngredient[];
}>;

type TFeedApiResponse = TApiResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

type TOrdersApiResponse = TApiResponse<{
  data: TOrder[];
}>;

export const fetchIngredientsApi = () =>
  fetch(`${API_BASE_URL}/ingredients`)
    .then((response) => validateResponse<TIngredientsApiResponse>(response))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });

export const fetchFeedApi = () =>
  fetch(`${API_BASE_URL}/orders/all`)
    .then((response) => validateResponse<TFeedApiResponse>(response))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const fetchUserOrdersApi = () =>
  apiRequestWithTokenRefresh<TFeedApiResponse>(`${API_BASE_URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: readCookie('accessToken')
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(data);
  });

type TCreateOrderResponse = TApiResponse<{
  order: TOrder;
  name: string;
}>;

export const createOrderApi = (ingredients: string[]) =>
  apiRequestWithTokenRefresh<TCreateOrderResponse>(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: readCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: ingredients
    })
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

type TOrderByNumberResponse = TApiResponse<{
  orders: TOrder[];
}>;

export const fetchOrderByNumberApi = (orderNumber: number) =>
  fetch(`${API_BASE_URL}/orders/${orderNumber}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => validateResponse<TOrderByNumberResponse>(response))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export type TSignUpData = {
  email: string;
  name: string;
  password: string;
};

type TAuthApiResponse = TApiResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const signUpUserApi = (userData: TSignUpData) =>
  fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(userData)
  })
    .then((response) => validateResponse<TAuthApiResponse>(response))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export type TSignInData = {
  email: string;
  password: string;
};

export const signInUserApi = (credentials: TSignInData) =>
  fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(credentials)
  })
    .then((response) => validateResponse<TAuthApiResponse>(response))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const requestPasswordResetApi = (emailData: { email: string }) =>
  fetch(`${API_BASE_URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(emailData)
  })
    .then((response) => validateResponse<TApiResponse<{}>>(response))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const confirmPasswordResetApi = (resetData: {
  password: string;
  token: string;
}) =>
  fetch(`${API_BASE_URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(resetData)
  })
    .then((response) => validateResponse<TApiResponse<{}>>(response))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

type TUserApiResponse = TApiResponse<{ user: TUser }>;

export const fetchUserProfileApi = () =>
  apiRequestWithTokenRefresh<TUserApiResponse>(`${API_BASE_URL}/auth/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: readCookie('accessToken')
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.user;
    return Promise.reject(data);
  });

export const updateUserProfileApi = (profileData: Partial<TSignUpData>) =>
  apiRequestWithTokenRefresh<TUserApiResponse>(`${API_BASE_URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: readCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(profileData)
  }).then((data) => {
    if (data?.success) return data.user;
    return Promise.reject(data);
  });

export const signOutUserApi = () =>
  fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((response) => validateResponse<TApiResponse<{}>>(response))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });
