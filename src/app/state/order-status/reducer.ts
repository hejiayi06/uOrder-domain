import { Action, createReducer, on } from '@ngrx/store';
import { setOrderType, setPaymentType } from './action';

export const orderStatusFeatureKey = 'orderStatus';
export interface OrderStatusState {
  order_type: number;
  payment: number;
}

export const initialState: OrderStatusState = {
  order_type: 0,
  payment: 0,
};

const reducer = createReducer(
  initialState,
  on(setOrderType, (state, { order_type }) => ({ ...state, order_type })),
  on(setPaymentType, (state, { payment }) => ({ ...state, payment }))
);

export function orderStatusReducer(
  state: OrderStatusState | undefined,
  action: Action
): OrderStatusState {
  return reducer(state, action);
}
