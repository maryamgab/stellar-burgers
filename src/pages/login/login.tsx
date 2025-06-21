import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { TSignInData } from '../../utils/burger-api';
import {
  authenticateUser,
  selectIsAuthenticated
} from '../../services/slices/UserInfoSlice';
import { useSelector } from '../../services/store';
import { Navigate } from 'react-router-dom';

// Страница авторизации пользователя
export const Login: FC = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const reduxDispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsAuthenticated);

  const handleFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const credentials: TSignInData = {
      email: userEmail,
      password: userPassword
    };
    reduxDispatch(authenticateUser(credentials));
  };

  if (isLoggedIn) {
    return <Navigate to={'/'} />;
  }

  return (
    <LoginUI
      errorText=''
      email={userEmail}
      setEmail={setUserEmail}
      password={userPassword}
      setPassword={setUserPassword}
      handleSubmit={handleFormSubmit}
    />
  );
};
