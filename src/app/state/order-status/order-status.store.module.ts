import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { orderStatusFeatureKey, orderStatusReducer } from './reducer';

@NgModule({
  declarations: [],
  imports: [StoreModule.forFeature(orderStatusFeatureKey, orderStatusReducer)],
})
export class OrderStatusStoreModule {}
