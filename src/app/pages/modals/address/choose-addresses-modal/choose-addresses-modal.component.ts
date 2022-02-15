import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { UserAddressService } from 'src/app/services/apis/user-address.service';
import { WindowService } from 'src/app/services/local/window.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import { UserAddress } from 'src/app/share/types';
import { LoadingStoreModule } from 'src/app/state/loading/loading.store.module';
import { AddAddressModalComponent } from '../add-address-modal/add-address-modal.component';

@Component({
  selector: 'uo-choose-addresses-modal',
  templateUrl: './choose-addresses-modal.component.html',
  styleUrls: ['./choose-addresses-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChooseAddressesModalComponent implements OnInit {
  loading: boolean = false;
  addresses!: UserAddress[];
  // address!: UserAddress;
  addressId!: number;
  constructor(
    public activeModal: NgbActiveModal,
    // private modalService: NgbModal,
    // private httpClient: HttpClient,
    // private geocoder: MapGeocoder,
    private loadingStore$: Store<LoadingStoreModule>
  ) {}

  ngOnInit(): void {
    console.log('this.addresses :>> ', this.addresses);
  }

  onCheck(e: Event, addressId: number): void {
    if ((e.target as HTMLInputElement).checked) {
      this.addressId = addressId;
    }
  }
  onAddress(): void {
    this.activeModal.close(this.addressId);
  }
  addAddress(): void {
    this.activeModal.close('add');
  }
}
