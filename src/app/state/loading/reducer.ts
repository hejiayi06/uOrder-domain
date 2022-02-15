import { Action, createReducer, on } from '@ngrx/store';
import { setLoading } from './action';

export const loadingFeatureKey = 'loading';
export interface LoadingState {
  loading: boolean;
}

export const initialState: LoadingState = {
  loading: false,
};

const reducer = createReducer(
  initialState,
  on(setLoading, (state, { loading }) => ({ ...state, loading }))
);

export function loadingReducer(
  state: LoadingState | undefined,
  action: Action
): LoadingState {
  return reducer(state, action);
}
