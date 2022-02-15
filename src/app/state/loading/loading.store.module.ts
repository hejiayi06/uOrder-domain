import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { loadingFeatureKey, loadingReducer } from './reducer';

@NgModule({
  declarations: [],
  imports: [StoreModule.forFeature(loadingFeatureKey, loadingReducer)],
})
export class LoadingStoreModule {}
