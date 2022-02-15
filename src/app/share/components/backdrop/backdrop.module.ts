import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackdropComponent } from './backdrop.component';

@NgModule({
  declarations: [BackdropComponent],
  imports: [CommonModule],
  exports: [BackdropComponent],
})
export class BackdropModule {}
