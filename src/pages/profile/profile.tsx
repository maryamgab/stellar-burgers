import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectUser,
  updateUserProfile,
  selectloginUserRequest
} from '../../services/slices/UserInfoSlice';
import { TUser } from '../../utils/types';
import { Preloader } from '@ui';

// Страница профиля пользователя
export const Profile: FC = () => {
  const reduxDispatch = useDispatch();
  const currentUser = useSelector(selectUser) as TUser;
  const isUpdating = useSelector(selectloginUserRequest);

  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    password: ''
  });

  useEffect(() => {
    setProfileForm((prevForm) => ({
      ...prevForm,
      name: currentUser?.name || '',
      email: currentUser?.email || ''
    }));
  }, []);

  const hasFormChanges =
    profileForm.name !== currentUser?.name ||
    profileForm.email !== currentUser?.email ||
    !!profileForm.password;

  const handleFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    reduxDispatch(
      updateUserProfile({
        name: profileForm.name,
        email: profileForm.email,
        password: profileForm.password
      })
    );
  };

  const handleFormReset = (e: SyntheticEvent) => {
    e.preventDefault();
    setProfileForm({
      name: currentUser.name,
      email: currentUser.email,
      password: ''
    });
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value
    }));
  };

  if (isUpdating) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={profileForm}
      isFormChanged={hasFormChanges}
      handleCancel={handleFormReset}
      handleSubmit={handleFormSubmit}
      handleInputChange={handleFieldChange}
    />
  );
};
