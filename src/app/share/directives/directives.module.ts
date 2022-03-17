import { NgModule } from '@angular/core';
import { ImgLazyDirective } from './img-lazy.directive';
import { PhoneMaskDirective } from './phone-mask.directive';
import { TwoDigitDecimalNumberDirective } from './two-digit-decimal-number.directive';

@NgModule({
  declarations: [
    ImgLazyDirective,
    PhoneMaskDirective,
    TwoDigitDecimalNumberDirective,
  ],
  exports: [
    ImgLazyDirective,
    PhoneMaskDirective,
    TwoDigitDecimalNumberDirective,
  ],
})
export class DirectivesModule {}
