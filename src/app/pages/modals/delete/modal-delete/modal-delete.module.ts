import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDeleteComponent } from './modal-delete.component';
import { TypePipeModule } from 'src/app/share/pipes/type-pipe/type-pipe.module';

@NgModule({
  declarations: [ModalDeleteComponent],
  imports: [CommonModule, TypePipeModule],
  exports: [ModalDeleteComponent],
})
export class ModalDeleteModule {}
