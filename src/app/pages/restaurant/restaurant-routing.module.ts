import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DomainGuard } from 'src/app/services/guards/domain.guard';
import { RestaurantComponent } from './restaurant.component';

const route: Routes = [
  {
    path: '',
    component: RestaurantComponent,
    resolve: { domain: DomainGuard },
  },
];

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class RestaurantRoutingModule {}
