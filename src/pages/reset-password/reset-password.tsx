import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmPasswordResetApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

// Страница подтверждения сброса пароля
export const ResetPassword: FC = () => {
  const goTo = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetError, setResetError] = useState<Error | null>(null);

  const handlePasswordReset = (e: SyntheticEvent) => {
    e.preventDefault();
    setResetError(null);
    confirmPasswordResetApi({ password: newPassword, token: resetToken })
      .then(() => {
        localStorage.removeItem('resetPassword');
        goTo('/login');
      })
      .catch((error) => setResetError(error));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      goTo('/forgot-password', { replace: true });
    }
  }, [goTo]);

  return (
    <ResetPasswordUI
      errorText={resetError?.message}
      password={newPassword}
      token={resetToken}
      setPassword={setNewPassword}
      setToken={setResetToken}
      handleSubmit={handlePasswordReset}
    />
  );
};
