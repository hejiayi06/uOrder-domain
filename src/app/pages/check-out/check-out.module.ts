import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckOutRoutingModule } from './check-out-routing.module';
import { CheckOutComponent } from './check-out.component';
import { FooterModule } from 'src/app/layout/footer/footer.module';
import { NgbModalModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeModalModule } from '../modals/time-modal/time-modal.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { PhoneNumberModalModule } from '../modals/phone-number-modal/phone-number-modal.module';
import { ChooseAddressesModalModule } from '../modals/address/choose-addresses-modal/choose-addresses-modal.module';
import { AddAddressModalModule } from '../modals/address/add-address-modal/add-address-modal.module';
import { CheckoutHeaderModule } from 'src/app/layout/checkout-header/checkout-header.module';
import { PhonePipeModule } from 'src/app/share/pipes/phone/phone.module';
import { CustomTipsModalModule } from '../modals/custom-tips-modal/custom-tips-modal.module';
import { AddCouponModule } from '../modals/add-coupon/add-coupon.module';
import { NameModalModule } from '../modals/name-modal/name-modal.module';
@NgModule({
  declarations: [CheckOutComponent],
  imports: [
    AddCouponModule,
    NgbModalModule,
    NgbPopoverModule,
    GoogleMapsModule,
    CommonModule,
    TimeModalModule,
    PhoneNumberModalModule,
    CustomTipsModalModule,
    AddAddressModalModule,
    ChooseAddressesModalModule,
    CheckoutHeaderModule,
    PhonePipeModule,
    NameModalModule,
    FooterModule,
    FormsModule,
    ReactiveFormsModule,
    CheckOutRoutingModule,
  ],
  exports: [CheckOutComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CheckOutModule {}
