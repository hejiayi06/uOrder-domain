import { createFeatureSelector, createSelector } from '@ngrx/store';
import { loadingFeatureKey, LoadingState } from './reducer';

export const selectLoadingFeature =
  createFeatureSelector<LoadingState>(loadingFeatureKey);

const selectLoadingState = (state: LoadingState) => state;

export const getLoading = createSelector(
  selectLoadingState,
  (state: LoadingState) => state.loading
);
