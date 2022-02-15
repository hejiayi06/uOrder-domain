import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreInfoFeatureKey, storeInfoReducer } from './reducer';

@NgModule({
  declarations: [],
  imports: [StoreModule.forFeature(StoreInfoFeatureKey, storeInfoReducer)],
})
export class StoreInfoStoreModule {}
