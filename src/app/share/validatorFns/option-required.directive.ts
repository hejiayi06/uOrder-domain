import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minMaxRequiredValidator(
  requiredMin: number,
  requiredMax: number
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let selectedTotal: number = 0;
    let sectionId = control.value.section.id;
    control.value.sectionItems?.forEach(
      (secItem: {
        [x: string]: any;
        value: { id: string; item_id: string };
      }) => {
        // let itemId = 'si-' + sectionId + '-' + secItem.value.id + '-' + secItem.value.item_id;
        selectedTotal += secItem['quantity'];
      }
    );
    control.value.sectionModifies?.forEach(
      (secModify: {
        [x: string]: any;
        value: { id: string; item_id: string };
      }) => {
        // let modifyId = 'sm-' + sectionId + '-' + secModify.value.id + '-' + secModify.value.item_id
        selectedTotal += secModify['quantity'];
      }
    );
    if (selectedTotal < requiredMin) {
      return { min: { min: 'required min' + requiredMin } };
    } else if (!requiredMax) {
      return null;
    } else if (selectedTotal > requiredMax) {
      return { max: { max: 'exceed max' + requiredMax } };
    } else if (selectedTotal >= requiredMin && selectedTotal <= requiredMax) {
      return null;
    } else {
      return { unknown: { unknown: 'minMaxRequiredValidator unknown errors' } };
    }
  };
}
