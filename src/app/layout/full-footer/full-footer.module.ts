import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullFooterComponent } from './full-footer.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [FullFooterComponent],
  imports: [CommonModule, GoogleMapsModule],
  exports: [FullFooterComponent],
})
export class FullFooterModule {}
