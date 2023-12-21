import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypePipeModule } from 'src/app/share/pipes/type-pipe/type-pipe.module';
import { ModalCateringMenuComponent } from './cateringmenu.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ModalCateringMenuComponent],
  imports: [
    TypePipeModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  exports: [ModalCateringMenuComponent],
})
export class ModalCateringMenuModule {}
