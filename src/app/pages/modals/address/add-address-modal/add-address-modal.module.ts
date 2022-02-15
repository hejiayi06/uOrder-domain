import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAddressModalComponent } from './add-address-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/share/directives/directives.module';

@NgModule({
  declarations: [AddAddressModalComponent],
  imports: [CommonModule, DirectivesModule, ReactiveFormsModule],
  exports: [AddAddressModalComponent],
})
export class AddAddressModalModule {}
