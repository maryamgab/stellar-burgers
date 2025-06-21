import { useSelector } from '../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../components/ui/preloader/preloader';
import {
  selectUser,
  selectIsAuthChecked
} from '../services/slices/UserInfoSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthVerified = useSelector(selectIsAuthChecked);
  const currentUser = useSelector(selectUser);
  const currentLocation = useLocation();

  if (!isAuthVerified) {
    // Показываем загрузку во время проверки авторизации
    return <Preloader />;
  }

  if (!onlyUnAuth && !currentUser) {
    // Если пользователь не авторизован и пытается получить доступ к защищенной странице
    return <Navigate replace to='/login' state={{ from: currentLocation }} />;
  }

  if (onlyUnAuth && currentUser) {
    // Если авторизованный пользователь пытается получить доступ к страницам авторизации
    const redirectPath = currentLocation.state?.from || { pathname: '/' };

    return <Navigate replace to={redirectPath} />;
  }

  return children;
};
