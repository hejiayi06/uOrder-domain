import { createAction, props } from '@ngrx/store';

export const setOrderType = createAction(
  '[Order Status Page] Set order type',
  props<{ order_type: number }>()
);
export const setPaymentType = createAction(
  '[Order Status Page] Set payment type',
  props<{ payment: number }>()
);
