import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OrderService } from 'src/app/services/apis/order.service';
import { ErrorsService } from 'src/app/services/local/errors.service';
import { WindowService } from 'src/app/services/local/window.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import { storageKeys } from 'src/app/share/configs';
import {
  Checkout,
  OrderItem,
  OrderStatus,
  UserAddress,
} from 'src/app/share/types';
import { setLoading } from 'src/app/state/loading/action';
import { LoadingStoreModule } from 'src/app/state/loading/loading.store.module';

@Component({
  selector: 'uo-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailsComponent implements OnInit {
  orderItem!: OrderItem;
  orderStatus!: OrderStatus;
  deliveryAddress!: UserAddress;
  details!: Checkout;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderServe: OrderService,
    private winServe: WindowService,
    private messageServe: MessageService,
    private cdr: ChangeDetectorRef,
    private loadingStore$: Store<LoadingStoreModule>,
    private errorServe: ErrorsService
  ) {}

  ngOnInit(): void {
    this.getOrderItem();
  }
  getOrderItem(): void {
    this.loadingStore$.dispatch(setLoading({ loading: true }));
    let orderId = this.route.snapshot.queryParams?.['orderId'];
    if (orderId) {
      this.orderServe.getOrderStatus(orderId).subscribe(
        (res) => {
          if (res) {
            this.orderStatus = res;
            this.details = JSON.parse(res.details);
            console.log('this.details :>> ', this.details);
            // this.deliveryAddress = JSON.parse(res.delivery_address);
            console.log('this.deliveryAddress :>> ', this.deliveryAddress);
            console.log(' this.orderStatus :>> ', this.orderStatus);
            this.cdr.markForCheck();
            this.loadingStore$.dispatch(setLoading({ loading: false }));
          } else {
            this.messageServe.warning('No data found!');
            this.router.navigate(['account/orders']);
            this.loadingStore$.dispatch(setLoading({ loading: false }));
          }
        },
        (err) => {
          this.errorServe.errorHandler(err);
          this.loadingStore$.dispatch(setLoading({ loading: false }));
          // this.messageServe.warning('No data found!');
          // this.router.navigate([
          //   'restaurant/' + this.winServe.getLocalStorage(storageKeys.store),
          // ]);
        }
      );
    }
  }
  onPrint() {
    window.print();
  }
}
