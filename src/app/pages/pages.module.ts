import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RestaurantModule } from './restaurant/restaurant.module';
import { RouterModule, Routes } from '@angular/router';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { CheckOutModule } from './check-out/check-out.module';
import { AuthModule } from './auth/auth.module';
import { RestaurantNotFoundComponent } from './restaurant-not-found/restaurant-not-found.component';

const routes: Routes = [
  {
    path: 'checkout',
    loadChildren: () =>
      import('./check-out/check-out.module').then((m) => m.CheckOutModule),
    data: { page: 'checkout' },
  },
  {
    path: 'store',
    loadChildren: () =>
      import('./restaurant/restaurant.module').then((m) => m.RestaurantModule),
    data: { page: 'store' },
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    data: { page: 'auth' },
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.module').then((m) => m.AccountModule),
    data: { page: 'account' },
  },
  {
    path: 'order-placed',
    loadChildren: () =>
      import('./order-placed/order-placed.module').then(
        (m) => m.OrderPlacedModule
      ),
    data: { page: 'order-placed' },
  },
  { path: 'terms', component: TermsOfUseComponent },
  { path: 'privacy', component: PrivacyComponent },
];

@NgModule({
  declarations: [PageNotFoundComponent, RestaurantNotFoundComponent],
  imports: [
    AuthModule,
    RestaurantModule,
    CheckOutModule,
    RouterModule.forChild(routes),
  ],
  exports: [AuthModule, RestaurantModule, CheckOutModule],
})
export class PagesModule {}
