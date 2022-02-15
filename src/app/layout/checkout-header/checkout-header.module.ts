import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutHeaderComponent } from './checkout-header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CheckoutHeaderComponent],
  imports: [CommonModule, RouterModule],
  exports: [CheckoutHeaderComponent],
})
export class CheckoutHeaderModule {}
