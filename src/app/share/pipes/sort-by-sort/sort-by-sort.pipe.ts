import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBySort',
})
export class SortBySortPipe implements PipeTransform {
  transform(value: any[]): any[] | null {
    if (value?.length) {
      return value.filter((v) => v.status).sort((a, b) => a.sort - b.sort);
    } else {
      return null;
    }
  }
}
