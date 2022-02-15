import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleHeaderComponent } from './simple-header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SimpleHeaderComponent],
  imports: [RouterModule, CommonModule],
  exports: [SimpleHeaderComponent],
})
export class SimpleHeaderModule {}
