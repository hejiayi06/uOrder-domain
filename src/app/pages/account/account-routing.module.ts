import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AccountComponent } from './account.component';

const routes: Routes = [
  { path: '', redirectTo: '/account/profile', pathMatch: 'full' }, // redirect to `profile`
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: 'orders',
        loadChildren: () =>
          import('./orders/orders.module').then((m) => m.OrdersModule),
      },
      // {
      //   path: 'gift-cards',
      //   loadChildren: () =>
      //     import('./gift-cards/gift-cards.module').then(
      //       (m) => m.GiftCardsModule
      //     ),
      // },
      {
        path: 'address',
        loadChildren: () =>
          import('./address/address.module').then((m) => m.AddressModule),
      },
      // {
      //   path: 'phone',
      //   loadChildren: () =>
      //     import('./phone/phone.module').then((m) => m.PhoneModule),
      // },
      // {
      //   path: 'payments',
      //   loadChildren: () =>
      //     import('./payments/payments.module').then((m) => m.PaymentsModule),
      // },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'saved-restaurants',
        loadChildren: () =>
          import('./saved-restaurants/saved-restaurants.module').then(
            (m) => m.SavedRestaurantsModule
          ),
      },
    ],
  },
  { path: '**', component: PageNotFoundComponent }, // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
