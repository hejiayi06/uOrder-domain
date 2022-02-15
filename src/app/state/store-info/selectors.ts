import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StoreInfoFeatureKey, StoreInfoState } from './reducer';

export const selectStoreInfoFeature =
  createFeatureSelector<StoreInfoState>(StoreInfoFeatureKey);

const selectStoreInfosState = (state: StoreInfoState) => state;

export const getStoreName = createSelector(
  selectStoreInfosState,
  (state: StoreInfoState) => state.storeInfo?.store_name
);
export const getStoreInfo = createSelector(
  selectStoreInfosState,
  (state: StoreInfoState) => state.storeInfo
);
