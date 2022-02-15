import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { LoadingStoreModule } from './loading/loading.store.module';
import { OrderStatusStoreModule } from './order-status/order-status.store.module';
import { PlacedOrderStoreModule } from './placed-order/placed-order.store.module';
import { ShoppingCartStoreModule } from './shopping-cart/shopping-cart.store.module';
import { StoreInfoStoreModule } from './store-info/store-info.store.module';

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot({}),
    LoadingStoreModule,
    StoreInfoStoreModule,
    ShoppingCartStoreModule,
    PlacedOrderStoreModule,
    OrderStatusStoreModule,
  ],
})
export class StateModule {}
