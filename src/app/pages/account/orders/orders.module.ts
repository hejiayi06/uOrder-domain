import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [OrdersComponent],
  imports: [CommonModule, NgbPaginationModule, OrdersRoutingModule],
  exports: [OrdersComponent],
})
export class OrdersModule {}
