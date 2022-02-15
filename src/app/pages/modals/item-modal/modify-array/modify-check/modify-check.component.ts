import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  Input,
  ChangeDetectorRef,
  Optional,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MenuModify } from 'src/app/share/types';
import { ModifyArrayComponent } from '../modify-array.component';

@Component({
  selector: 'uo-modify-check',
  templateUrl: './modify-check.component.html',
  styleUrls: ['./modify-check.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ModifyCheckComponent),
      multi: true,
    },
  ],
})
export class ModifyCheckComponent implements OnInit, ControlValueAccessor {
  @Input() modify!: MenuModify;
  @Input() value: any;
  private disabled = false;
  checked = false;
  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() private parent: ModifyArrayComponent
  ) {}
  ngOnInit(): void {}
  private onChange = (value: any) => {};
  private onTouched = () => {};
  writeValue(value: any): void {
    this.checked = value;
    this.cdr.markForCheck();
    // console.log('value :>> ', value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: any): void {
    this.disabled = disabled;
  }

  onModifyCheck(e: Event) {
    e.preventDefault();
    const mod = {
      id: this.modify.id,
      name: this.modify?.menu_modify![0].name,
      store_id: this.modify.store_id,
      quantity: this.modify.quantity as number,
      price: this.modify.menu_modify![0].price,
      item_id: this.modify.item_id,
      modify_id: this.modify.modify_id,
      ref_id: this.modify.menu_modify![0].ref_id,
      created_at: this.modify.menu_modify![0].created_at,
      updated_at: this.modify.menu_modify![0].updated_at,
    };
    if ((e.target as HTMLInputElement).checked) {
      this.checked = true;
      this.modify.quantity = 1;
      mod.quantity = 1;
      this.onChange(this.checked);
      if (this.parent) {
        this.parent.addCheckbox(mod);
      }
    } else {
      this.checked = false;
      this.modify.quantity = 0;
      mod.quantity = 0;
      this.onChange(this.checked);
      if (this.parent) {
        this.parent.deleteCheckbox(mod);
      }
    }
  }
}
