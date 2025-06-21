import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addIngredient } from '../../services/slices/BurgerConstructorSlice';
import { useDispatch } from '../../services/store';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const currentPath = useLocation(); // Текущий путь для модального окна
    const reduxDispatch = useDispatch();

    // Добавление ингредиента в конструктор
    const handleIngredientAdd = () => {
      // Отправляем ингредиент в конструктор
      reduxDispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: currentPath }}
        handleAdd={handleIngredientAdd}
      />
    );
  }
);
