import { NgModule } from '@angular/core';
import { ImgLazyDirective } from './img-lazy.directive';
import { PhoneMaskDirective } from './phone-mask.directive';

@NgModule({
  declarations: [ImgLazyDirective, PhoneMaskDirective],
  exports: [ImgLazyDirective, PhoneMaskDirective],
})
export class DirectivesModule {}
