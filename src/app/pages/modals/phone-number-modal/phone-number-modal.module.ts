import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneNumberModalComponent } from './phone-number-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DirectivesModule } from 'src/app/share/directives/directives.module';

@NgModule({
  declarations: [PhoneNumberModalComponent],
  imports: [
    CommonModule,
    DirectivesModule,
    NgbModalModule,
    ReactiveFormsModule,
  ],
  exports: [PhoneNumberModalComponent],
})
export class PhoneNumberModalModule {}
