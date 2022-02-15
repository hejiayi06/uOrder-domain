import { createAction, props } from '@ngrx/store';
import { ShoppingCartItem } from 'src/app/share/types';

export const setShoppingCartLength = createAction(
  '[Shopping Cart Page] Set shopping cart length',
  props<{ length: number }>()
);
export const setShoppingCart = createAction(
  '[Shopping Cart Page] Set shopping cart',
  props<{ cart: ShoppingCartItem[] }>()
);
