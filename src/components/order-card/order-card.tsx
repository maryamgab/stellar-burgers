import { FC, memo, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import { selectIngredientsList } from '../../services/slices/IngredientsSlice';
import { getUserOrdersHistory } from '../../services/slices/UserOrdersHistory';
import { TOrder } from '@utils-types';

const maxVisibleIngredients = 6;

// Карточка заказа с информацией об ингредиентах и стоимости
export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const currentLocation = useLocation();

  const userOrders = useSelector(getUserOrdersHistory); // Заказы пользователя из Redux

  // Получаем список ингредиентов для сопоставления с ID из заказа
  const availableIngredients: TIngredient[] = useSelector(
    selectIngredientsList
  );

  const processedOrderData = useMemo(() => {
    if (!availableIngredients.length) return;

    // Находим полную информацию об ингредиентах по их ID
    const orderIngredients = order.ingredients.reduce(
      (acc: TIngredient[], ingredientId: string) => {
        const foundIngredient = availableIngredients.find(
          (ing) => ing._id === ingredientId
        );
        if (foundIngredient) return [...acc, foundIngredient];
        return acc;
      },
      []
    );

    // Вычисляем общую стоимость заказа
    const orderTotal = orderIngredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );

    // Ограничиваем количество отображаемых ингредиентов
    const visibleIngredients = orderIngredients.slice(0, maxVisibleIngredients);

    // Количество скрытых ингредиентов
    const hiddenCount =
      orderIngredients.length > maxVisibleIngredients
        ? orderIngredients.length - maxVisibleIngredients
        : 0;

    const orderDate = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo: orderIngredients,
      ingredientsToShow: visibleIngredients,
      remains: hiddenCount,
      total: orderTotal,
      date: orderDate
    };
  }, [order, availableIngredients]);

  if (!processedOrderData) return null;

  return (
    <OrderCardUI
      orderInfo={processedOrderData}
      maxIngredients={maxVisibleIngredients}
      locationState={{ background: currentLocation }}
    />
  );
});
