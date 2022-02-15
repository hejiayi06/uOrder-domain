import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutGuard } from 'src/app/services/guards/checkout.guard';
import { CheckOutComponent } from './check-out.component';

const routes: Routes = [
  { path: '', component: CheckOutComponent, canActivate: [CheckoutGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckOutRoutingModule {}
