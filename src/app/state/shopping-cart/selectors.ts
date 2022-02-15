import { createFeatureSelector, createSelector } from '@ngrx/store';
import { shoppingCartFeatureKey, ShoppingCartState } from './reducer';

export const selectShoppingCartFeature =
  createFeatureSelector<ShoppingCartState>(shoppingCartFeatureKey);

const selectShoppingCartState = (state: ShoppingCartState) => state;

export const getShoppingCartLength = createSelector(
  selectShoppingCartState,
  (state: ShoppingCartState) => state.length
);

export const getShoppingCart = createSelector(
  selectShoppingCartState,
  (state: ShoppingCartState) => state.cart
);
