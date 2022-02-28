import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  ChangeDetectorRef,
  Optional,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MenuSectionItem, MenuSectionModify } from 'src/app/share/types';
import { ItemModalComponent } from '../../item-modal.component';
import { SectionArrayComponent } from '../section-array.component';
import { SectionCheckComponent } from '../section-check/section-check.component';

@Component({
  selector: 'uo-section-sizer',
  templateUrl: './section-sizer.component.html',
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SectionSizerComponent),
      multi: true,
    },
  ],
})
export class SectionSizerComponent implements OnInit, ControlValueAccessor {
  @Input() price!: string;
  @Input() dis!: boolean;
  @Input() option!: MenuSectionItem | MenuSectionModify;
  @Output() checkEvent = new EventEmitter<boolean>();
  size: number = 0;
  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() private parent: SectionArrayComponent,
    @Optional() private grand: ItemModalComponent,
    @Optional() private check: SectionCheckComponent
  ) {}

  ngOnInit(): void {}
  onChange = (value: number) => {};
  onTouched = () => {};
  writeValue(value: number): void {
    if (value) {
      this.size = value;
    }
    this.onChange(this.size);
    this.cdr.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  stopPropagation(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }
  inc(e: Event) {
    this.stopPropagation(e);
    this.size++;
    this.parent.sec.selected!++;
    // console.log('this.parent.sec.selected :>> ', this.parent.sec.selected);
    this.parent.validate(this.parent.control);
    this.parent.onValidationChange();
    this.parent.sizerDisabled();
    this.onChange(this.size);
    this.grand.sizerPriceAdjust(this.price, true);
    this.cdr.markForCheck();
  }

  dec(e: Event) {
    this.stopPropagation(e);
    if (this.size > 0) {
      this.size--;
      this.parent.sec.selected!--;
      this.parent.validate(this.parent.control);
      this.parent.onValidationChange();
      this.parent.sizerDisabled();
      this.onChange(this.size);
      if (this.size == 0) {
        this.checkEvent.emit(false);
        this.check.onChange(false);
        this.parent.deleteOption(this.option);
      }
      this.grand.sizerPriceAdjust(this.price, false);
      this.cdr.markForCheck();
    }
  }
}
