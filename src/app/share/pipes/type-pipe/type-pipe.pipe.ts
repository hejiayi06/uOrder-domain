import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typePipe',
})
export class TypePipe implements PipeTransform {
  transform(value: number): string | null {
    if (value == 18) {
      return 'Address';
    } else if (value == 21) {
      return 'Coupon';
    } else {
      return null;
    }
  }
}
