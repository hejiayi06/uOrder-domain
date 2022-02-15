import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPlacedComponent } from './order-placed.component';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutHeaderModule } from 'src/app/layout/checkout-header/checkout-header.module';
import { PhonePipeModule } from 'src/app/share/pipes/phone/phone.module';

const route: Routes = [
  {
    path: '',
    component: OrderPlacedComponent,
  },
];

@NgModule({
  declarations: [OrderPlacedComponent],
  imports: [
    CommonModule,
    CheckoutHeaderModule,
    PhonePipeModule,
    RouterModule.forChild(route),
  ],
  exports: [OrderPlacedComponent],
})
export class OrderPlacedModule {}
