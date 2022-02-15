import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders.component';

const routes: Routes = [
  {
    path:'',
    component:OrdersComponent,
  },
  {
    path: 'order-details',
    loadChildren: () => import('./order-details/order-details.module').then(m => m.OrderDetailsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
