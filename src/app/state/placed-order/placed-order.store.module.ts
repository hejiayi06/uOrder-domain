import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { placedOrderFeatureKey, placedOrderReducer } from './reducer';

@NgModule({
  declarations: [],
  imports: [StoreModule.forFeature(placedOrderFeatureKey, placedOrderReducer)],
})
export class PlacedOrderStoreModule {}
