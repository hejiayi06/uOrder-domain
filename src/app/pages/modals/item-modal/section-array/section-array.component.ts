import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  forwardRef,
  ChangeDetectorRef,
  Optional,
  SkipSelf,
  Host,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import {
  MenuSectionConnection,
  MenuSectionItem,
  MenuSectionModify,
} from 'src/app/share/types';
import { SectionValue } from './section.type';

@Component({
  selector: 'uo-section-array',
  templateUrl: './section-array.component.html',
  styleUrls: ['./section-array.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SectionArrayComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SectionArrayComponent),
      multi: true,
    },
  ],
})
export class SectionArrayComponent
  implements OnInit, ControlValueAccessor, Validator
{
  @Input('section') sec!: MenuSectionConnection;
  @Input() index!: number;
  // @Input() formControlName!: number;
  public control!: AbstractControl;
  section!: SectionValue;
  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() @Host() @SkipSelf() private controlContainer: ControlContainer
  ) {}
  validate(control: AbstractControl): ValidationErrors | null {
    let max = this.sec.max;
    let min = this.sec.min;
    let selected = this.sec.selected;
    this.cdr.markForCheck();
    if (!max && !min) {
      return null;
    }
    if (selected! >= min && selected! <= max) {
      return null;
    }
    if (selected! < min) {
      return { required: { min: 'required min ' + min } };
    } else if (selected! > max) {
      return { exceed: { max: 'exceed max' + max } };
    } else {
      return { unknown: { unknown: 'minMaxRequiredValidator unknown errors' } };
    }
  }

  ngOnInit(): void {
    if (this.controlContainer) {
      this.control = this.controlContainer.control?.get(
        this.index.toString()
      ) as AbstractControl;
    }
  }

  sizerDisabled(): void {
    let max = this.sec.max;
    let selected = this.sec.selected;
    if (max && selected! >= max) {
      this.sec.isMax = true;
    } else {
      this.sec.isMax = false;
    }
  }
  addOption(option: MenuSectionItem | MenuSectionModify | null) {
    // if (!this.section.id) {
    //   this.section= {
    //     id : this.sec.id,
    //     store_id : this.sec.store_id,
    //     name : this.sec.menu_section.name,
    //     repeats : this.sec.repeats!,
    //     min : this.sec.min,
    //     max : this.sec.max,
    //     section_created_at : this.sec.created_at,
    //     section_updated_at : this.sec.updated_at,
    //     created_at : this.sec.menu_section.created_at,
    //     updated_at : this.sec.menu_section.updated_at,
    //   }
    // }
    if (option!.itemOrModify) {
      if (!this.section.sectionItems) {
        this.section.sectionItems = [option as MenuSectionItem];
      } else {
        this.section.sectionItems?.push(option as MenuSectionItem);
      }
    } else {
      if (!this.section.sectionModifiers) {
        this.section.sectionModifiers = [option as MenuSectionModify];
      } else {
        this.section.sectionModifiers?.push(option as MenuSectionModify);
      }
    }
    this.onChange(this.section);
    this.onValidationChange();
  }

  deleteOption(option: any) {
    if (option!.itemOrModify) {
      this.section.sectionItems?.splice(
        this.section.sectionItems?.findIndex((item) => item.id === option.id),
        1
      );
    } else {
      this.section.sectionModifiers?.splice(
        this.section.sectionModifiers?.findIndex(
          (modify) => modify.id === option.id
        ),
        1
      );
    }
    this.onChange(this.section);
    this.onValidationChange();
  }
  private onChange = (value: any) => {};
  private onTouched = () => {};
  public onValidationChange = () => {};

  writeValue(value: any): void {
    this.section = value;
    this.cdr.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidationChange = fn;
  }
}
