import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI, Preloader } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  getConstructorItems,
  getOrderRequest,
  getOrderModalData,
  submitOrder,
  clearOrder
} from '../../services/slices/BurgerConstructorSlice';
import {
  selectUser,
  selectIsAuthChecked,
  selectIsAuthenticated,
  checkUserAuth
} from '../../services/slices/UserInfoSlice';

// Основной компонент для сборки бургера
export const BurgerConstructor: FC = () => {
  const reduxDispatch = useDispatch();
  const goTo = useNavigate();

  const burgerItems = useSelector(getConstructorItems); // Ингредиенты в конструкторе
  const isLoading = useSelector(getOrderRequest); // Статус загрузки заказа
  const orderData = useSelector(getOrderModalData); // Данные модального окна
  const isLoggedIn = useSelector(selectIsAuthenticated); // Статус авторизации

  // Проверяем, можно ли оформить заказ
  const canSubmitOrder =
    Boolean(burgerItems.bun) &&
    burgerItems.ingredients.length > 0 &&
    !isLoading;

  // Обработка клика по кнопке заказа
  const handleOrderSubmit = () => {
    if (!isLoggedIn) {
      return goTo('/login');
    }
    if (!canSubmitOrder) return;

    // Создаем список ID ингредиентов для заказа
    const ingredientsList = [
      burgerItems.bun?._id,
      ...burgerItems.ingredients.map((item) => item._id),
      burgerItems.bun?._id
    ].filter((id): id is string => Boolean(id)); // Убираем пустые значения и приводим к типу string[]

    reduxDispatch(submitOrder(ingredientsList));
  };

  // Закрытие модального окна заказа
  const handleModalClose = () => {
    reduxDispatch(clearOrder());
    goTo('/');
  };

  // Вычисляем итоговую стоимость с мемоизацией
  const totalPrice = useMemo(
    () =>
      (burgerItems.bun ? burgerItems.bun.price * 2 : 0) +
      burgerItems.ingredients.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [burgerItems] // Пересчитываем только при изменении состава
  );

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={isLoading}
      constructorItems={burgerItems}
      orderModalData={orderData}
      onOrderClick={handleOrderSubmit}
      closeOrderModal={handleModalClose}
      canSubmitOrder={canSubmitOrder}
    />
  );
};
