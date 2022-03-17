import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTipsModalComponent } from './custom-tips-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/share/directives/directives.module';

@NgModule({
  declarations: [CustomTipsModalComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DirectivesModule],
  exports: [CustomTipsModalComponent],
})
export class CustomTipsModalModule {}
