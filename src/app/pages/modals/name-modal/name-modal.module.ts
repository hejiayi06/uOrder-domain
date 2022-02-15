import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NameModalComponent } from './name-modal.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [NameModalComponent],
  imports: [CommonModule, NgbModalModule, ReactiveFormsModule],
  exports: [NameModalComponent],
})
export class NameModalModule {}
