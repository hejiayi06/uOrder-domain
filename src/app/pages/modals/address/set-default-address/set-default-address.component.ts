import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAddressService } from 'src/app/services/apis/user-address.service';
import { ErrorsService } from 'src/app/services/local/errors.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import { UserAddress } from 'src/app/share/types';

@Component({
  selector: 'uo-set-default-address',
  templateUrl: './set-default-address.component.html',
  styleUrls: ['./set-default-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetDefaultAddressComponent implements OnInit {
  loading: boolean = false;
  address!: UserAddress;
  addressForm: FormGroup = this.fb.group({
    user_id: [],
    is_deafult: [
      1,
      [Validators.required, Validators.minLength(2), Validators.maxLength(64)],
    ],
    // optional: [''],
    // city: [
    //   '',
    //   [Validators.required, Validators.minLength(2), Validators.maxLength(64)],
    // ],
    // state: [
    //   '',
    //   [Validators.required, Validators.minLength(2), Validators.maxLength(64)],
    // ],
    // zipcode: [
    //   '',
    //   [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
    // ],
    // phone: ['', [Validators.required, Validators.minLength(10)]],
  });
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private addressServe: UserAddressService,
    private messageServe: MessageService,
    private errorServe: ErrorsService
  ) {}

  ngOnInit(): void {}
  setDefault(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.addressServe
      .setDefault(this.address.id!, this.addressForm.value)
      .subscribe(
        (res) => {
          console.log('setDefault :>> ', res);
          this.loading = false;
          this.cdr.markForCheck();
          this.messageServe.success('Set default!');
          this.activeModal.close(res.data.item);
        },
        (err) => {
          this.loading = false;
          this.cdr.markForCheck();
          this.errorServe.errorHandler(err);
          this.activeModal.close(false);
        }
      );
  }
}
