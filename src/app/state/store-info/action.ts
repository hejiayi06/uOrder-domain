import { createAction, props } from '@ngrx/store';
import { StoreRes } from 'src/app/share/types';
import { StoreInfoState } from './reducer';

// export const setStoreName = createAction(
//   '[Store Page] Set store name',
//   props<StoreInfosState>()
// );
export const setStoreInfo = createAction(
  '[Store Page] Set store information',
  props<StoreRes>()
);
