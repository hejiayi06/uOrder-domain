import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemResolveService } from 'src/app/services/resolve/item-resolve.service';
import { RestaurantComponent } from './restaurant.component';

const route: Routes = [
  {
    path: '',
    component: RestaurantComponent,
    children: [
      // {
      //   path:'',
      //   loadChildren: () => import('../modals/item-modal/item-modal.module').then(m => m.ItemModalModule),
      //   // component: ItemModalModule,
      //   data: {
      //     page: 'item-modal',
      //     // preload:true,
      //   },
      //   outlet:'item',
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class RestaurantRoutingModule {}
