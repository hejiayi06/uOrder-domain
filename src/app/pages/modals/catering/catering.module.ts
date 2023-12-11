import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCateringComponent } from './catering.componet';
import { TypePipeModule } from 'src/app/share/pipes/type-pipe/type-pipe.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ModalCateringComponent],
  imports: [CommonModule, TypePipeModule,ReactiveFormsModule,FormsModule],
  exports: [ModalCateringComponent],
})
export class ModalCateringModule {}
