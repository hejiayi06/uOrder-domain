import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTipsModalComponent } from './custom-tips-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CustomTipsModalComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CustomTipsModalComponent],
})
export class CustomTipsModalModule {}
