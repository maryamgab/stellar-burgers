import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import {
  getFeedOrders,
  getTotalEmountOrders,
  getTotalEmountToday,
  getLoading,
  getError
} from '../../services/slices/FeedDataSlice';
import { useSelector } from '../../services/store';

// Компонент для отображения статистики заказов в ленте

// Функция для получения номеров заказов по статусу
const filterOrdersByStatus = (
  ordersList: TOrder[],
  orderStatus: string
): number[] =>
  ordersList
    .filter((order) => order.status === orderStatus) // Фильтруем по статусу
    .map((order) => order.number) // Получаем номера заказов
    .slice(0, 20); // Ограничиваем до 20 элементов

export const FeedInfo: FC = () => {
  const feedOrders: TOrder[] = useSelector(getFeedOrders);
  const totalOrdersCount = useSelector(getTotalEmountOrders);
  const todayOrdersCount = useSelector(getTotalEmountToday);

  const completedOrders = filterOrdersByStatus(feedOrders, 'done');
  const inProgressOrders = filterOrdersByStatus(feedOrders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={completedOrders}
      pendingOrders={inProgressOrders}
      feed={{ total: totalOrdersCount, totalToday: todayOrdersCount }}
    />
  );
};
