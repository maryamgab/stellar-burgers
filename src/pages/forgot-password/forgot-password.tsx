import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordResetApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';

// Страница запроса сброса пароля
export const ForgotPassword: FC = () => {
  const [userEmail, setUserEmail] = useState(''); // Email пользователя для восстановления
  const [resetError, setResetError] = useState<Error | null>(null); // Ошибка при запросе сброса

  // Навигация между страницами
  const goTo = useNavigate();

  // Обработка отправки формы сброса пароля
  const handleResetRequest = (e: SyntheticEvent) => {
    e.preventDefault();

    setResetError(null); // Очищаем предыдущие ошибки
    requestPasswordResetApi({ email: userEmail })
      .then(() => {
        localStorage.setItem('resetPassword', 'true'); // Сохраняем флаг успешного запроса
        goTo('/reset-password', { replace: true }); // Переходим на страницу сброса пароля
      })
      .catch((error) => setResetError(error)); // Сохраняем ошибку в состоянии
  };

  // Отображение формы восстановления пароля
  return (
    <ForgotPasswordUI
      errorText={resetError?.message}
      email={userEmail}
      setEmail={setUserEmail}
      handleSubmit={handleResetRequest}
    />
  );
};
