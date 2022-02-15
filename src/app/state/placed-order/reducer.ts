import { Action, createReducer, on } from '@ngrx/store';
import { PlacedOrder } from 'src/app/share/types';
import { setPlacedOrder } from './action';

export const placedOrderFeatureKey = 'placedOrder';
export interface PlaceOrderState {
  placedOrder: PlacedOrder | null;
}

export const initialState: PlaceOrderState = {
  placedOrder: null,
};

const reducer = createReducer(
  initialState,
  on(setPlacedOrder, (state, { placedOrder }) => ({ ...state, placedOrder }))
);

export function placedOrderReducer(
  state: PlaceOrderState | undefined,
  action: Action
): PlaceOrderState {
  return reducer(state, action);
}
