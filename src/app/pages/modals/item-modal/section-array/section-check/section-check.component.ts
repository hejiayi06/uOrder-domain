import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  forwardRef,
  ChangeDetectorRef,
  Optional,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MenuSectionItem, MenuSectionModify } from 'src/app/share/types';
import { SectionArrayComponent } from '../section-array.component';

@Component({
  selector: 'uo-section-check',
  templateUrl: './section-check.component.html',
  styleUrls: ['./section-check.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SectionCheckComponent),
      multi: true,
    },
    // {
    //   provide: NG_VALIDATORS,
    //   useExisting: forwardRef(() => SectionCheckComponent),
    //   multi: true,
    // }
  ],
})
export class SectionCheckComponent implements OnInit, ControlValueAccessor {
  checked: boolean = false;
  disabled: boolean = false;
  option!: MenuSectionItem | MenuSectionModify;
  @Input('sectionItem') secItem!: MenuSectionItem;
  @Input('sectionModify') secModify!: MenuSectionModify;
  @Input() is_duplicate!: number;
  @Input() is_multiple_select!: number;

  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() private parent: SectionArrayComponent
  ) {}

  ngOnInit(): void {}
  stopPropagation(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }
  onSectionOptionCheck(e: Event) {
    e.preventDefault();
    if (this.secItem) {
      this.option = this.secItem;
      this.option.itemOrModify = true;
    }
    if (this.secModify) {
      this.option = this.secModify;
      this.option.itemOrModify = false;
    }
    if ((e.target as HTMLInputElement).checked) {
      this.checked = true;
      this.option!.quantity = 1;
      // if (this.option?.itemOrModify) {
      //   this.secItem.quantity = 1;
      // } else {
      //   this.secModify.quantity = 1;
      // }
      this.parent.sec.selected!++;
      this.parent.sizerDisabled();
      this.onChange(this.checked);
      this.parent.addOption(this.option);
    } else {
      this.checked = false;
      console.log('this.option.quantity :>> ', this.option.quantity);
      this.parent.sec.selected! -= this.option.quantity!;
      this.parent.sizerDisabled();
      this.onChange(this.checked);
      this.parent.deleteOption(this.option);
      this.option!.quantity = 0;
    }
  }
  checkChange(e: boolean) {
    console.log('e :>> ', e);
    this.checked = e;
  }
  sizerChange(e: number) {
    if (this.secItem) {
      this.secItem.quantity = e;
    }
    if (this.secModify) {
      this.secModify.quantity = e;
    }
    this.cdr.markForCheck();
  }

  public onChange = (value: any) => {};
  private onTouched = () => {};
  writeValue(value: boolean): void {
    this.checked = value;
    this.cdr.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.cdr.markForCheck();
  }
}
