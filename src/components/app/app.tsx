import {
  ConstructorPage as MainConstructor,
  Feed as FeedPage,
  Login as SignIn,
  Register as SignUp,
  ForgotPassword as LostPassword,
  ResetPassword as NewPassword,
  Profile as UserProfile,
  ProfileOrders as UserOrders,
  NotFound404 as PageNotFound
} from '@pages'; // Импортируем страницы для маршрутизации

import '../../index.css';
import styles from './app.module.css';
import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/IngredientsSlice';
import { ProtectedRoute } from '../protected-route';
import { checkUserAuth } from '../../services/slices/UserInfoSlice';

const App = () => {
  const goTo = useNavigate(); // Навигация между страницами
  const currentLocation = useLocation(); // Получение текущего пути
  const reduxDispatch = useDispatch(); // Диспатч для redux

  // Получаем background для модальных окон, если он есть
  const state = currentLocation.state as { background?: Location };
  const modalBackground = state && currentLocation.state?.background;

  // Закрытие модального окна — возвращаемся назад
  const handleModalClose = () => {
    goTo(-1);
  };

  // Загружаем ингредиенты при монтировании
  useEffect(() => {
    reduxDispatch(fetchIngredients());
  }, [reduxDispatch]);

  // Проверяем авторизацию пользователя при монтировании
  useEffect(() => {
    reduxDispatch(checkUserAuth());
  }, [reduxDispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={modalBackground || currentLocation}>
        <Route path='/' element={<MainConstructor />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed' element={<FeedPage />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <SignIn />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <SignUp />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <LostPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <NewPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <UserOrders />
            </ProtectedRoute>
          }
        />
        {/* Если не найдено совпадений — страница 404 */}
        <Route path='*' element={<PageNotFound />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* Модальные окна, если был переход по background */}
      {modalBackground && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={''} onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title={'Информация об ингредиенте'}
                onClose={handleModalClose}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title={''} onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
