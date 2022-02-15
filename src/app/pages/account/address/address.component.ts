import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { UserAddressService } from 'src/app/services/apis/user-address.service';
import { ErrorsService } from 'src/app/services/local/errors.service';
import { UserAddress } from 'src/app/share/types';
import { setLoading } from 'src/app/state/loading/action';
import { LoadingStoreModule } from 'src/app/state/loading/loading.store.module';
import { AddAddressModalComponent } from '../../modals/address/add-address-modal/add-address-modal.component';
import { EditAddressModalComponent } from '../../modals/address/edit-address-modal/edit-address-modal.component';
import { SetDefaultAddressComponent } from '../../modals/address/set-default-address/set-default-address.component';
import { ModalDeleteComponent } from '../../modals/delete/modal-delete/modal-delete.component';

@Component({
  selector: 'uo-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent implements OnInit {
  addresses: UserAddress[] = [];
  addressForm = this.fb.group({
    street: ['', [Validators.required]],
    apt: [''],
    city: [''],
    state: [''],
    zipcode: [''],
    crossStreet: [''],
    deliveryInstructions: [''],
    name: [''],
  });
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private addressServe: UserAddressService,
    private cdr: ChangeDetectorRef,
    private loadingStore$: Store<LoadingStoreModule>,
    private errorServe: ErrorsService
  ) {}

  ngOnInit(): void {
    this.getAddresses();
  }
  getAddresses(): void {
    this.loadingStore$.dispatch(setLoading({ loading: true }));
    this.addressServe.getAddresses().subscribe(
      (res) => {
        console.log('res :>> ', res);
        this.addresses = res.data.items;
        this.cdr.markForCheck();
        this.loadingStore$.dispatch(setLoading({ loading: false }));
      },
      (err) => {
        this.errorServe.errorHandler(err);
        this.loadingStore$.dispatch(setLoading({ loading: false }));
      }
    );
  }
  addAddress(): void {
    const modalRef = this.modalService.open(AddAddressModalComponent, {
      centered: true,
      scrollable: true,
    });
    modalRef.closed.subscribe((res) => {
      if (res) {
        this.addresses.push(res);
        this.cdr.markForCheck();
      }
    });
  }
  setDefault(address: UserAddress): void {
    const modalRef = this.modalService.open(SetDefaultAddressComponent, {
      centered: true,
      scrollable: true,
    });
    modalRef.componentInstance.address = address;
    const i = this.addresses.findIndex((a) => a.id == address.id);
    modalRef.closed.subscribe((res) => {
      if (res) {
        this.addresses.forEach((address) => {
          address.is_default = 0;
        });
        this.addresses[i].is_default = 1;
        this.cdr.detectChanges();
      }
    });
  }
  editAddress(address: UserAddress): void {
    const modalRef = this.modalService.open(EditAddressModalComponent, {
      centered: true,
      scrollable: true,
    });
    modalRef.componentInstance.address = address;
    const i = this.addresses.findIndex((a) => a.id == address.id);
    modalRef.closed.subscribe((res) => {
      if (res) {
        this.addresses[i] = res;
        this.cdr.markForCheck();
      }
    });
  }
  deleteAddress(type: number, address_id: number): void {
    const modalRef = this.modalService.open(ModalDeleteComponent, {
      centered: true,
      scrollable: true,
    });
    modalRef.componentInstance.modalType = type;
    modalRef.componentInstance.addressId = address_id;
    const i = this.addresses.findIndex((a) => a.id == address_id);
    modalRef.closed.subscribe((res) => {
      if (res) {
        this.addresses.splice(i, 1);
        this.cdr.markForCheck();
      }
    });
  }
}
