import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressRoutingModule } from './address-routing.module';
import { AddressComponent } from './address.component';
import { AddAddressModalModule } from '../../modals/address/add-address-modal/add-address-modal.module';
import { EditAddressModalModule } from '../../modals/address/edit-address-modal/edit-address-modal.module';
import { ModalDeleteModule } from '../../modals/delete/modal-delete/modal-delete.module';
import { SetDefaultAddressModule } from '../../modals/address/set-default-address/set-default-address.module';

@NgModule({
  declarations: [AddressComponent],
  imports: [
    CommonModule,
    AddAddressModalModule,
    EditAddressModalModule,
    SetDefaultAddressModule,
    ModalDeleteModule,
    AddressRoutingModule,
  ],
  exports: [AddressComponent],
})
export class AddressModule {}
