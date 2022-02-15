import { createFeatureSelector, createSelector } from '@ngrx/store';
import { placedOrderFeatureKey, PlaceOrderState } from './reducer';

export const selectPlacedOrderFeature = createFeatureSelector<PlaceOrderState>(
  placedOrderFeatureKey
);

const selectPlacedOrderState = (state: PlaceOrderState) => state;

export const getPlacedOrder = createSelector(
  selectPlacedOrderState,
  (state: PlaceOrderState) => state.placedOrder
);
