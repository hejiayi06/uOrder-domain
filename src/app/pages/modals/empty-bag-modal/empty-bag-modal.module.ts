import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyBagModalComponent } from './empty-bag-modal.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [EmptyBagModalComponent],
  imports: [CommonModule, NgbModalModule],
  exports: [EmptyBagModalComponent],
})
export class EmptyBagModalModule {}
