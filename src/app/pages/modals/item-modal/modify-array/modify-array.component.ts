import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
export type CheckboxValue = {
  id: number;
  ref_id: number;
  store_id: number;
  quantity: number;
  price: string;
  name: string;
  item_id: number;
  modify_id: number;
  created_at: Date;
  updated_at: Date;
};
@Component({
  selector: 'uo-modify-array',
  template: `
    <div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ModifyArrayComponent),
      multi: true,
    },
  ],
})
export class ModifyArrayComponent implements OnInit, ControlValueAccessor {
  // private checkboxes:ModifyCheckComponent[] = [];
  private current: CheckboxValue[] = [];
  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {}
  private onChange = (value: CheckboxValue[]) => {};
  private onTouched = () => {};
  writeValue(value: CheckboxValue[]): void {
    this.current = value;
    console.log('value :>> ', this.current);

    this.cdr.markForCheck();
  }
  registerOnChange(fn: (value: CheckboxValue[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  addCheckbox(value: CheckboxValue): void {
    this.current.push(value);
    this.onChange(this.current);
    this.cdr.markForCheck();
  }
  deleteCheckbox(value: CheckboxValue): void {
    this.current.splice(
      this.current.findIndex((cb) => cb.id === value.id),
      1
    );
    this.onChange(this.current);
    this.cdr.markForCheck();
  }
}
