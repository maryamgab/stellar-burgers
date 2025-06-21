//These tests check the request ingredients reducers

import { error } from 'console';
import ingredientsSlice, {
  fetchIngredients,
  TIngredientsState
} from './IngredientsSlice';

//инициализация начального состояния,  будет использоваться редьюсером перед применением экшена. Вынесли в глобальную переменную для удобства использования во всех блоках it
const initialState: TIngredientsState = {
  ingredientsList: [],
  isLoading: false,
  errorMessage: null
};

//глобальная переменная с тестовым ингредиентом для удобства использования во всех блоках it
const testIngredient = [
  {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  }
];

describe('Ingredients slice tests', () => {
  it('Test should set loading to true and err to null during pending status', () => {
    const actualState = ingredientsSlice.reducer(
      {
        ...initialState,
        // намеренно добавляем тестовую ошибку в начальное состояние, чтобы проверить её сброс редьюсером
        errorMessage: 'Test err'
      },
      //эмулируем вызов action pending, который моделирует начало асинхронной операции, ожидаемой редьюсером
      fetchIngredients.pending('')
    );

    //проверка, что что редьюсер правильно обновит состояние: загрузка началась (isLoading: true), ошибка сброшена (errorMessage: null), и список ингредиентов по-прежнему пуст
    expect(actualState).toEqual({
      ingredientsList: [],
      isLoading: true,
      errorMessage: null
    });
  });

  //проверяем, как редьюсер обрабатывает успешное завершение асинхронного запроса на получение ингредиентов
  it('Test should set loading to false and upd ingredients', () => {
    const actualState = ingredientsSlice.reducer(
      {
        ...initialState,
        isLoading: true //Устанавливаем `isLoading` в `true`, имитируя активную загрузку данных
      },
      fetchIngredients.fulfilled(testIngredient, '')
    );

    expect(actualState).toEqual({
      ingredientsList: testIngredient,
      isLoading: false,
      errorMessage: null
    });
  });

  //тест проверяет как редьюсер обрабатывает неуспешное завершение асинхронного запроса на получение ингредиентов
  it('Test should set loading to false and err to err message', () => {
    //создаем тестовый объект ошибки, который будет использоваться для эмуляции неудачного запроса
    const testErr = new Error('Test err');

    const actualState = ingredientsSlice.reducer(
      {
        ...initialState,
        isLoading: true //Устанавливаем `isLoading` в `true`, имитируя активную загрузку данных
      },
      //эмулируем неуспешное завершение запроса с созданной ранее тестовой ошибкой
      fetchIngredients.rejected(testErr, '')
    );

    //Проверка ОР:
    // - `isLoading` будет установлено в `false`, так как загрузка завершилась с ошибкой.
    // - `ingredientsList` останется пустым массивом, так как данные не были загружены.
    // - `errorMessage` будет содержать сообщение об ошибке, полученное из объекта ошибки.
    expect(actualState).toEqual({
      ingredientsList: [],
      isLoading: false,
      errorMessage: 'Test err'
    });
  });
});
