import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SavedRestaurantsComponent } from './saved-restaurants.component';

const routes: Routes = [
  {path:'',component:SavedRestaurantsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SavedRestaurantsRoutingModule { }
