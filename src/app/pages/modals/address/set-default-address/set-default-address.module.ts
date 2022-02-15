import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetDefaultAddressComponent } from './set-default-address.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SetDefaultAddressComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [SetDefaultAddressComponent],
})
export class SetDefaultAddressModule {}
