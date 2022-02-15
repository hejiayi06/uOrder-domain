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
import { WindowService } from 'src/app/services/local/window.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import { storageKeys } from 'src/app/share/configs';

@Component({
  selector: 'uo-add-address-modal',
  templateUrl: './add-address-modal.component.html',
  styleUrls: ['./add-address-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAddressModalComponent implements OnInit {
  loading: boolean = false;
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
  // addressChecked: boolean = false;
  // isAddress: boolean = true;
  // geoData!: MapGeocoderResponse;
  // commaSpace: string = ',';
  // private isApiLoaded: BehaviorSubject<boolean> = new BehaviorSubject(
  //   false
  // ) as BehaviorSubject<boolean>;
  // isApiLoaded$ = this.isApiLoaded.asObservable();
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private winServe: WindowService,
    // private httpClient: HttpClient,
    private messageServe: MessageService,
    // private geocoder: MapGeocoder,
    // private loadingStore$: Store<LoadingStoreModule>,
    private addressServe: UserAddressService,
    private cdr: ChangeDetectorRef,
    private errorServe: ErrorsService
  ) {}

  ngOnInit(): void {}
  onAddressSubmit(): void {
    this.loading = true;
    this.cdr.markForCheck();
    let phoneValue: string = this.phone!.value.replace(/\D/g, '');
    this.phone?.setValue(phoneValue);
    this.user_id?.setValue(this.winServe.getLocalStorage(storageKeys.user));
    console.log('this.addressForm.value :>> ', this.addressForm.value);
    this.addressServe.addAddress(this.addressForm.value).subscribe(
      (res) => {
        console.log('res :>> ', res);
        this.loading = false;
        this.cdr.markForCheck();
        this.messageServe.success('Add address successfully!');
        this.activeModal.close(res.data.item);
      },
      (err) => {
        this.errorServe.errorHandler(err);
        this.loading = false;
        this.cdr.markForCheck();
        this.activeModal.close(false);
      }
    );
  }
  // checkAddress(): void {
  //   this.loading = true;
  //   this.cdr.markForCheck();
  //   this.loadingStore$.dispatch(setLoading({ loading: true }));
  //   const address =
  //     this.street?.value +
  //     ', ' +
  //     this.city?.value +
  //     ', ' +
  //     this.state?.value +
  //     ', ' +
  //     this.zipcode?.value;
  //   console.log('address :>> ', address);

  //   this.geocoder
  //     .geocode({
  //       address: address,
  //     })
  //     .subscribe(
  //       (res) => {
  //         this.geoData = res;
  //         this.loading = false;
  //         this.cdr.markForCheck();
  //         console.log('res google map:>> ', res);
  //         console.log(
  //           'res.results[0] :>> ',
  //           res.results[0].geometry.location.lat()
  //         );
  //         this.loadingStore$.dispatch(setLoading({ loading: false }));
  //       },
  //       (err) => {
  //         this.loading = false;
  //         this.loadingStore$.dispatch(setLoading({ loading: false }));
  //       }
  //     );
  // }
  // googleMap(): void {
  //   const key = environment.googleMapsApiKey;
  //   this.httpClient
  //     .jsonp(`https://maps.googleapis.com/maps/api/js?key=${key}`, 'callback')
  //     .subscribe(
  //       () => {
  //         console.log('🚀 ~ GoogleMapsService ~ google maps api loaded');
  //         this.isApiLoaded.next(true);
  //       },
  //       (error) => {
  //         console.log(
  //           '🚀 ~ GoogleMapsService ~ google maps api cannot be loaded',
  //           error
  //         );
  //       }
  //     );
  // }
  // onAddressClick(e: Event, result: google.maps.GeocoderResult): void {
  //   if ((e.target! as HTMLInputElement).checked) {
  //     this.street?.patchValue(
  //       result.address_components[0].long_name +
  //         ' ' +
  //         result.address_components[1].long_name
  //     );
  //     console.log('this.street.value :>> ', this.street?.value);
  //     this.city?.patchValue(result.address_components[2].long_name);
  //     this.state?.patchValue(result.address_components[5].long_name);
  //     this.zipcode?.patchValue(result.address_components[7].long_name);
  //     this.latitude?.patchValue(result.geometry.location.lat());
  //     this.longitude?.patchValue(result.geometry.location.lng());
  //     console.log('this.addressForm.value :>> ', this.addressForm.value);
  //     this.addressChecked = true;
  //   } else {
  //     this.addressChecked = false;
  //   }
  //   this.cdr.markForCheck();
  // }
}
