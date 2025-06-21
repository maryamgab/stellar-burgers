import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { fetchIngredientsApi } from '../../utils/burger-api';

export type TIngredientsState = {
  ingredientsList: Array<TIngredient>;
  isLoading: boolean;
  errorMessage: null | string | undefined;
};

const initialIngredientsState: TIngredientsState = {
  ingredientsList: [],
  isLoading: false,
  errorMessage: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const ingredientsData = await fetchIngredientsApi();
    return ingredientsData;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialIngredientsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredientsList = action.payload;
      });
  }
});

// Селекторы
export const selectIngredientsList = (state: {
  ingredients: TIngredientsState;
}) => state.ingredients.ingredientsList;
export const selectIngredientsLoading = (state: {
  ingredients: TIngredientsState;
}) => state.ingredients.isLoading;

export default ingredientsSlice;
