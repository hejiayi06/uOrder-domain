import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { UserAddressService } from 'src/app/services/apis/user-address.service';
import { ErrorsService } from 'src/app/services/local/errors.service';
import { WindowService } from 'src/app/services/local/window.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import { storageKeys } from 'src/app/share/configs';
import { UserAddress } from 'src/app/share/types';
import { LoadingStoreModule } from 'src/app/state/loading/loading.store.module';

@Component({
  selector: 'uo-edit-address-modal',
  templateUrl: './edit-address-modal.component.html',
  styleUrls: ['./edit-address-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAddressModalComponent implements OnInit {
  loading: boolean = false;
  address!: UserAddress;
  addressForm: FormGroup = this.fb.group({
    user_id: [],
    address: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(64)],
    ],
    optional: [''],
    city: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(64)],
    ],
    state: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(64)],
    ],
    zipcode: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
    ],
    phone: ['', [Validators.required, Validators.minLength(10)]],
  });
  get street() {
    return this.addressForm.get('address');
  }
  get optional() {
    return this.addressForm.get('optional');
  }
  get city() {
    return this.addressForm.get('city');
  }
  get state() {
    return this.addressForm.get('state');
  }
  get zipcode() {
    return this.addressForm.get('zipcode');
  }
  get user_id() {
    return this.addressForm.get('user_id');
  }
  get phone() {
    return this.addressForm.get('phone');
  }
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private winServe: WindowService,
    // private httpClient: HttpClient,
    private messageServe: MessageService,
    // private geocoder: MapGeocoder,
    private loadingStore$: Store<LoadingStoreModule>,
    private addressServe: UserAddressService,
    private cdr: ChangeDetectorRef,
    private errorServe: ErrorsService
  ) {}

  ngOnInit(): void {
    this.getAddress();
  }
  getAddress(): void {
    if (this.address) {
      this.user_id?.setValue(this.address.user_id);
      this.phone?.setValue(this.address.phone);
      this.zipcode?.setValue(this.address.zipcode);
      this.street?.setValue(this.address.address);
      this.optional?.setValue(this.address.optional);
      this.city?.setValue(this.address.city);
      this.state?.setValue(this.address.state);
    }
    this.cdr.markForCheck();
  }
  onAddressSubmit(): void {
    this.loading = true;
    this.cdr.markForCheck();
    console.log('this.addressForm.value :>> ', this.addressForm.value);
    this.addressServe
      .editAddress(this.address.id!, this.addressForm.value)
      .subscribe(
        (res) => {
          console.log('editAddress :>> ', res);
          this.loading = false;
          this.messageServe.success('Edit address successfully!');
          this.activeModal.close(res.data.item);
        },
        (err) => {
          this.errorServe.errorHandler(err);
          this.loading = false;
          this.activeModal.close(false);
        }
      );
  }
}
