import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  nanoid
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { createOrderApi, fetchIngredientsApi } from '../../utils/burger-api';
import { selectIngredientsLoading } from './IngredientsSlice';

type TBurgerConstructorState = {
  burgerItems: {
    bun: TIngredient | null;
    ingredients: Array<TConstructorIngredient>;
  };
  isOrderLoading: boolean;
  orderData: TOrder | null;
  isLoading: boolean;
  errorMessage: null | string | undefined;
};

const initialBurgerConstructorState: TBurgerConstructorState = {
  burgerItems: {
    bun: null,
    ingredients: []
  },
  isOrderLoading: false,
  orderData: null,
  isLoading: false,
  errorMessage: null
};

type IngredientWithKey = TIngredient & {
  key: string;
};

export const submitOrder = createAsyncThunk(
  'order/submitOrder',
  async (ingredients: string[]) => {
    const orderResponse = await createOrderApi(ingredients);
    return orderResponse;
  }
);

export const burgerConstructorSlice = createSlice({
  name: 'burgerconstructor',
  initialState: initialBurgerConstructorState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.burgerItems.bun = action.payload;
        } else {
          state.burgerItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const uniqueKey = nanoid();
        return { payload: { ...ingredient, id: uniqueKey } };
      }
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.burgerItems.ingredients = state.burgerItems.ingredients.filter(
        (item) => item.id !== action.payload.id
      );
    },
    moveUpIngredient: (state, action: PayloadAction<number>) => {
      const itemIndex = action.payload;
      if (itemIndex > 0) {
        const ingredientsList = state.burgerItems.ingredients;
        [ingredientsList[itemIndex - 1], ingredientsList[itemIndex]] = [
          ingredientsList[itemIndex],
          ingredientsList[itemIndex - 1]
        ];
      }
    },
    moveDownIngredient: (state, action: PayloadAction<number>) => {
      const itemIndex = action.payload;
      if (itemIndex < state.burgerItems.ingredients.length - 1) {
        const ingredientsList = state.burgerItems.ingredients;
        [ingredientsList[itemIndex + 1], ingredientsList[itemIndex]] = [
          ingredientsList[itemIndex],
          ingredientsList[itemIndex + 1]
        ];
      }
    },
    clearOrder: (state) => initialBurgerConstructorState
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.isOrderLoading = true;
        state.errorMessage = null;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderData = action.payload.order;
        state.burgerItems.bun = null;
        state.burgerItems.ingredients = [];
        state.errorMessage = null;
      });
  },
  selectors: {
    getConstructorItems: (state) => state.burgerItems,
    getOrderRequest: (state) => state.isOrderLoading,
    getOrderModalData: (state) => state.orderData,
    getLoading: (state) => state.isLoading,
    getError: (state) => state.errorMessage
  }
});

export default burgerConstructorSlice;
export const {
  getConstructorItems,
  getOrderRequest,
  getOrderModalData,
  getLoading,
  getError
} = burgerConstructorSlice.selectors;

export const {
  addIngredient,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient,
  clearOrder
} = burgerConstructorSlice.actions;
