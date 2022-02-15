import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditAddressModalComponent } from './edit-address-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EditAddressModalComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [EditAddressModalComponent],
})
export class EditAddressModalModule {}
