import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDetailsComponent } from './order-details.component';
import { RouterModule, Routes } from '@angular/router';
import { PhonePipeModule } from 'src/app/share/pipes/phone/phone.module';

const routes: Routes = [
  {
    path: '',
    component: OrderDetailsComponent,
  },
];

@NgModule({
  declarations: [OrderDetailsComponent],
  imports: [CommonModule, PhonePipeModule, RouterModule.forChild(routes)],
  exports: [OrderDetailsComponent],
})
export class OrderDetailsModule {}
