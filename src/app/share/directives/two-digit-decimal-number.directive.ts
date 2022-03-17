import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[uoTwoDigitDecimalNumber]',
})
export class TwoDigitDecimalNumberDirective {
  private regex: RegExp = new RegExp(/^[0-9]*(\.[0-9]{0,2})?$/);
  private specialKeys: Array<string> = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    '-',
    'ArrowLeft',
    'ArrowRight',
    'Del',
    'Delete',
  ];
  constructor(private el: ElementRef) {}
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log(this.el.nativeElement.value);
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [
      current.slice(),
      event.key == 'Decimal' ? '.' : event.key,
    ].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
