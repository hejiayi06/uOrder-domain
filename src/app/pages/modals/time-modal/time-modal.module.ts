import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeModalComponent } from './time-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [TimeModalComponent],
  imports: [CommonModule, NgbModalModule, FormsModule, ReactiveFormsModule],
  exports: [TimeModalComponent],
})
export class TimeModalModule {}
