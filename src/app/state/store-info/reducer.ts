import { Action, createReducer, on } from '@ngrx/store';
import { StoreRes } from 'src/app/share/types';
import { setStoreInfo } from './action';

export const StoreInfoFeatureKey = 'storeInfos';
export interface StoreInfoState {
  storeInfo: StoreRes | null;
}

export const initialState: StoreInfoState = {
  storeInfo: null,
};

const reducer = createReducer(
  initialState,
  on(setStoreInfo, (state, storeInfo) => ({ ...state, storeInfo }))
);

export function storeInfoReducer(
  state: StoreInfoState | undefined,
  action: Action
): StoreInfoState {
  return reducer(state, action);
}
