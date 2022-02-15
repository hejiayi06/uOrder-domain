import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCouponComponent } from './add-coupon.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddCouponComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [AddCouponComponent],
})
export class AddCouponModule {}
