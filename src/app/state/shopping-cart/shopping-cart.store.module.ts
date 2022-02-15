import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { shoppingCartFeatureKey, shoppingCartReducer } from './reducer';

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature(shoppingCartFeatureKey, shoppingCartReducer),
  ],
})
export class ShoppingCartStoreModule {}
