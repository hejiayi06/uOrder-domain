import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnounceComponent } from './announce.component';

@NgModule({
  declarations: [AnnounceComponent],
  imports: [CommonModule],
  exports: [AnnounceComponent],
})
export class AnnounceModule {}
