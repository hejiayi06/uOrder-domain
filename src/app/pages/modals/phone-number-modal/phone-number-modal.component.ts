import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core';

@Component({
  selector: 'uo-phone-number-modal',
  templateUrl: './phone-number-modal.component.html',
  styleUrls: ['./phone-number-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PhoneNumberModalComponent implements OnInit {
  @Input() public data:any;
  phoneForm = this.fb.group({
    phoneNumber: [
      '',
      [Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/), Validators.required],
    ],
  });
  get phoneNumber() {
    return this.phoneForm.get('phoneNumber');
  }
  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {
  }
  ngOnInit(): void {
    this.phoneForm.patchValue({phoneNumber:this.data})
  }
  update(): void {
    this.activeModal.close(this.phoneNumber!.value);
  }
}
