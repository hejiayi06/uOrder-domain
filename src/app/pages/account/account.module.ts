import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { HeaderModule } from 'src/app/layout/header/header.module';
import { FooterModule } from 'src/app/layout/footer/footer.module';


@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    FooterModule,
    AccountRoutingModule,
  ],
  exports: [
    AccountComponent,
    AccountRoutingModule,
  ]
})
export class AccountModule { }
