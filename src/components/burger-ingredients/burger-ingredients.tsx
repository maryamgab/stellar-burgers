import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { selectIngredientsList } from '../../services/slices/IngredientsSlice';
import { Preloader } from '../../components/ui';
import { selectIngredientsLoading } from '../../services/slices/IngredientsSlice';

// Компонент для отображения списка ингредиентов с логикой фильтрации и навигации
export const BurgerIngredients: FC = () => {
  const ingredientsList = useSelector(selectIngredientsList);
  const isLoading = useSelector(selectIngredientsLoading);

  if (isLoading) {
    return <Preloader />;
  }

  // Разделяем ингредиенты по категориям
  const bunIngredients = ingredientsList.filter((item) => item.type === 'bun');
  const mainIngredients = ingredientsList.filter(
    (item) => item.type === 'main'
  );
  const sauceIngredients = ingredientsList.filter(
    (item) => item.type === 'sauce'
  );

  // Активная вкладка
  const [activeTab, setActiveTab] = useState<TTabMode>('bun');

  // Ссылки на заголовки секций для навигации
  const bunSectionRef = useRef<HTMLHeadingElement>(null);
  const mainSectionRef = useRef<HTMLHeadingElement>(null);
  const sauceSectionRef = useRef<HTMLHeadingElement>(null);

  const [bunSectionInView, isBunSectionVisible] = useInView({
    threshold: 0
  });

  const [mainSectionInView, isMainSectionVisible] = useInView({
    threshold: 0
  });

  const [sauceSectionInView, isSauceSectionVisible] = useInView({
    threshold: 0
  });

  // Автоматическое переключение вкладок при прокрутке
  useEffect(() => {
    if (isBunSectionVisible) {
      setActiveTab('bun');
    } else if (isSauceSectionVisible) {
      setActiveTab('sauce');
    } else if (isMainSectionVisible) {
      setActiveTab('main');
    }
  }, [isBunSectionVisible, isMainSectionVisible, isSauceSectionVisible]);

  // Навигация по клику на вкладки
  const handleTabClick = (tab: string) => {
    setActiveTab(tab as TTabMode);
    if (tab === 'bun')
      bunSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      mainSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      sauceSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={activeTab}
      buns={bunIngredients}
      mains={mainIngredients}
      sauces={sauceIngredients}
      titleBunRef={bunSectionRef}
      titleMainRef={mainSectionRef}
      titleSaucesRef={sauceSectionRef}
      bunsRef={bunSectionInView}
      mainsRef={mainSectionInView}
      saucesRef={sauceSectionInView}
      onTabClick={handleTabClick}
    />
  );
};
