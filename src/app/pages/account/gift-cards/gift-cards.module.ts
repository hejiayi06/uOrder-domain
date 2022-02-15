import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GiftCardsRoutingModule } from './gift-cards-routing.module';
import { GiftCardModalModule } from '../../modals/gift-card-modal/gift-card-modal.module';
import { GiftCardsComponent } from './gift-cards.component';


@NgModule({
  declarations: [
    GiftCardsComponent
  ],
  imports: [
    CommonModule,
    GiftCardModalModule,
    GiftCardsRoutingModule
  ],
  exports: [
    GiftCardsComponent
  ]
})
export class GiftCardsModule { }
