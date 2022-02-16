import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { RestaurantComponent } from './restaurant.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { RestaurantInfoComponent } from './restaurant-info/restaurant-info.component';
import { UItemsComponent } from './items-usually/u-items.component';
import { PItemsComponent } from './items-popular/p-items.component';
import { MenuComponent } from './menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/layout/header/header.module';
import { ItemModalModule } from '../modals/item-modal/item-modal.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { PhonePipeModule } from 'src/app/share/pipes/phone/phone.module';
import { EmptyBagModalModule } from '../modals/empty-bag-modal/empty-bag-modal.module';
import { SortBySortModule } from 'src/app/share/pipes/sort-by-sort/sort-by-sort.module';
import { FullFooterModule } from 'src/app/layout/full-footer/full-footer.module';

@NgModule({
  declarations: [
    RestaurantComponent,
    UItemsComponent,
    PItemsComponent,
    CategoriesListComponent,
    RestaurantInfoComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    HeaderModule,
    FullFooterModule,
    NgbModalModule,
    ItemModalModule,
    PhonePipeModule,
    SortBySortModule,
    EmptyBagModalModule,
    FormsModule,
    ReactiveFormsModule,
    RestaurantRoutingModule,
  ],
  exports: [
    RestaurantComponent,
    UItemsComponent,
    PItemsComponent,
    ReactiveFormsModule,
    RestaurantRoutingModule,
    CategoriesListComponent,
    RestaurantRoutingModule,
  ],
})
export class RestaurantModule {}
