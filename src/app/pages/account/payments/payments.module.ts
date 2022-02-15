import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { AddCreditCardModalModule } from '../../modals/add-credit-card-modal/add-credit-card-modal.module';
import { PaymentsComponent } from './payments.component';


@NgModule({
  declarations: [
    PaymentsComponent,
  ],
  imports: [
    CommonModule,
    AddCreditCardModalModule,
    PaymentsRoutingModule
  ],
  exports: [
    PaymentsComponent,
  ]
})
export class PaymentsModule { }
