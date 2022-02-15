import { Action, createReducer, on } from '@ngrx/store';
import { ShoppingCartItem } from 'src/app/share/types';
import { setShoppingCart, setShoppingCartLength } from './action';

export const shoppingCartFeatureKey = 'shoppingCart';
export interface ShoppingCartState {
  length: number;
  cart: ShoppingCartItem[];
}

export const initialState: ShoppingCartState = {
  length: 0,
  cart: [],
};

const reducer = createReducer(
  initialState,
  on(setShoppingCartLength, (state, { length }) => ({ ...state, length })),
  on(setShoppingCart, (state, { cart }) => ({ ...state, cart }))
);

export function shoppingCartReducer(
  state: ShoppingCartState | undefined,
  action: Action
): ShoppingCartState {
  return reducer(state, action);
}
