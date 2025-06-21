import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { TSignUpData } from '@api';
import {
  registerNewUser,
  selectloginUserRequest
} from '../../services/slices/UserInfoSlice';
import { Preloader } from '@ui';

// Страница регистрации нового пользователя
export const Register: FC = () => {
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const reduxDispatch = useDispatch();
  const isLoading = useSelector(selectloginUserRequest);

  const handleFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const registrationData: TSignUpData = {
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword
    };
    reduxDispatch(registerNewUser(registrationData));
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText=''
      email={newUserEmail}
      userName={newUserName}
      password={newUserPassword}
      setEmail={setNewUserEmail}
      setPassword={setNewUserPassword}
      setUserName={setNewUserName}
      handleSubmit={handleFormSubmit}
    />
  );
};
