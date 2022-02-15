import { createFeatureSelector, createSelector } from '@ngrx/store';
import { orderStatusFeatureKey, OrderStatusState } from './reducer';

export const selectOrderStatusFeature = createFeatureSelector<OrderStatusState>(
  orderStatusFeatureKey
);

const selectOrderStatusState = (state: OrderStatusState) => state;

export const getOrderType = createSelector(
  selectOrderStatusState,
  (state: OrderStatusState) => state.order_type
);
export const getPaymentType = createSelector(
  selectOrderStatusState,
  (state: OrderStatusState) => state.payment
);
export const getStatus = createSelector(
  selectOrderStatusState,
  (state: OrderStatusState) => state
);
