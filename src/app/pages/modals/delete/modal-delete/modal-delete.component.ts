import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PromotionService } from 'src/app/services/apis/promotion.service';
import { UserAddressService } from 'src/app/services/apis/user-address.service';
import { ErrorsService } from 'src/app/services/local/errors.service';
import { MessageService } from 'src/app/share/components/message/message.service';

@Component({
  selector: 'uo-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDeleteComponent implements OnInit {
  modalType!: number;
  addressId!: number;
  merchantId!: number;
  coupon!: string;
  loading: boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    private addressServe: UserAddressService,
    private promoServe: PromotionService,
    private messageServe: MessageService,
    private cdr: ChangeDetectorRef,
    private errorServe: ErrorsService
  ) {}

  ngOnInit(): void {}
  errFunc(err: any): void {
    this.loading = false;
    this.cdr.detectChanges();
    this.activeModal.close(false);
  }
  deleteAddress(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.addressServe.deleteAddress(this.addressId).subscribe(
      (res) => {
        this.messageServe.warning('Address deleted!');
        console.log('res :>> ', res);
        if (res.data.value) {
          this.activeModal.close(true);
        } else {
          this.messageServe.danger('Something wrong');
        }
        this.loading = false;
      },
      (err) => {
        this.errFunc(err);
      }
    );
  }
  deleteCoupon(): void {
    this.loading = true;
    this.cdr.detectChanges();
    console.log('this.coupon :>> ', this.coupon);
    this.promoServe
      .deleteCoupon(this.coupon, this.merchantId.toString())
      .subscribe(
        (res) => {
          this.messageServe.warning('Coupon deleted!');
          console.log('deleteCoupon :>> ', res);
          if (res.data) {
            this.activeModal.close(res.data);
          }
          this.loading = false;
        },
        (err) => {
          this.errFunc(err);
        }
      );
  }
}
