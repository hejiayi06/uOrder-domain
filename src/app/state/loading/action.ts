import { createAction, props } from '@ngrx/store';
import { LoadingState } from './reducer';

export const setLoading = createAction(
  '[Loading Page] Set loading',
  props<LoadingState>()
);
