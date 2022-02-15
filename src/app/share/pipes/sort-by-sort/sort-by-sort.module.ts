import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortBySortPipe } from './sort-by-sort.pipe';

@NgModule({
  declarations: [SortBySortPipe],
  imports: [CommonModule],
  exports: [SortBySortPipe],
})
export class SortBySortModule {}
