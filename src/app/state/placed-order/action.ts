import { createAction, props } from '@ngrx/store';
import { PlacedOrder } from 'src/app/share/types';

export const setPlacedOrder = createAction(
  '[Placed Order Page] Set place order',
  props<{ placedOrder: PlacedOrder }>()
);
