import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { selectIngredientsList } from '../../services/slices/IngredientsSlice';
import {
  getFeedOrders,
  getOrderByNum
} from '../../services/slices/FeedDataSlice';
import { useSelector, useDispatch } from '../../services/store';
import { useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { selectOrderById } from '../../services/selector';

export const OrderInfo: FC = () => {
  // Получаем номер заказа из URL параметров
  const { number } = useParams();
  const feedOrders = useSelector(getFeedOrders); // Список заказов из Redux
  const reduxDispatch = useDispatch();

  const currentOrder = useSelector(selectOrderById(Number(number)));
  const availableIngredients: TIngredient[] = useSelector(
    selectIngredientsList
  );

  useEffect(() => {
    if (!currentOrder) {
      reduxDispatch(getOrderByNum(Number(number)));
    }
  }, [reduxDispatch]);

  // Подготавливаем данные для отображения с мемоизацией
  const processedOrderData = useMemo(() => {
    if (!currentOrder || !availableIngredients.length) return; // Проверяем наличие данных

    const orderDate = new Date(currentOrder.createdAt); // Дата создания заказа

    type TIngredientWithQuantity = {
      [key: string]: TIngredient & { count: number };
    };

    // Собираем информацию об ингредиентах с количеством
    const ingredientsWithCount = currentOrder.ingredients.reduce(
      (acc: TIngredientWithQuantity, ingredientId) => {
        if (!acc[ingredientId]) {
          // Добавляем новый ингредиент
          const foundIngredient = availableIngredients.find(
            (ing) => ing._id === ingredientId
          );
          if (foundIngredient) {
            acc[ingredientId] = {
              ...foundIngredient,
              count: 1
            };
          }
        } else {
          acc[ingredientId].count++; // Увеличиваем количество существующего ингредиента
        }

        return acc;
      },
      {}
    );

    // Вычисляем общую стоимость заказа
    const orderTotal = Object.values(ingredientsWithCount).reduce(
      (sum, ingredient) => sum + ingredient.price * ingredient.count,
      0
    );

    // Возвращаем обработанные данные заказа
    return {
      ...currentOrder,
      ingredientsInfo: ingredientsWithCount,
      date: orderDate,
      total: orderTotal
    };
  }, [currentOrder, availableIngredients]);

  if (!processedOrderData) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={processedOrderData} />;
};
