import { Component, OnInit, ChangeDetectionStrategy, forwardRef, ChangeDetectorRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'uo-sizer',
  templateUrl: './sizer.component.html',
  styleUrls: ['./sizer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SizerComponent),
      multi:true,
    }
  ]
})
export class SizerComponent implements OnInit, ControlValueAccessor {
  size:number= 0;
  constructor(private cdr:ChangeDetectorRef) {
   }
  writeValue(value: number): void {
    if(value) {
      this.size = value;
    }
    this.onChange(this.size);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
  }

  inc(){
    this.size++;
    this.onChange(this.size);
  }

  dec() {
    if(this.size > 1) {
      this.size --;
    }
    this.onChange(this.size);
  }
  onChange = (value: number) => {};
  onTouched = () => {};
}
