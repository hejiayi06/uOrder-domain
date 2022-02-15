import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { WindowService } from 'src/app/services/local/window.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import { storageKeys } from 'src/app/share/configs';
import {
  OrderStatus,
  PlacedOrder,
  StoreRes,
  UserAddress,
} from 'src/app/share/types';
import {
  getPlacedOrder,
  selectPlacedOrderFeature,
} from 'src/app/state/placed-order/selectors';
import { ShoppingCartStoreModule } from 'src/app/state/shopping-cart/shopping-cart.store.module';

@Component({
  selector: 'uo-order-placed',
  templateUrl: './order-placed.component.html',
  styleUrls: ['./order-placed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPlacedComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  orderStatus!: OrderStatus;
  placedOrder!: PlacedOrder;
  deliveryAddress!: UserAddress;
  store!: StoreRes;
  orderSub!: Subscription;
  constructor(
    private router: Router,
    private winServe: WindowService,
    private messageServe: MessageService,
    private cdr: ChangeDetectorRef,
    private placedOrderStore$: Store<ShoppingCartStoreModule>
  ) {}
  ngOnDestroy(): void {
    this.orderSub.unsubscribe();
  }

  ngOnInit(): void {
    // console.log('this.route :>> ', this.route);
    // this.getStore();
    this.getPlacedOrder();
    // this.getOrderStatus();
  }

  // getStore(): void {
  //   this.loading = true;
  //   this.store = JSON.parse(
  //     this.winServe.getLocalStorage(storageKeys.storeInfo) as string
  //   );
  //   this.cdr.markForCheck();
  //   console.log('getLocalStorage this.store :>> ', this.store);
  //   console.log('this.store.tips :>> ', this.store.tips);
  //   if (this.store) {
  //     this.storeServe
  //       .getStore(this.winServe.getLocalStorage(storageKeys.store) as string)
  //       .subscribe(
  //         (data) => {
  //           console.log('getStore :>> ', data);
  //           if (data) {
  //             this.loading = false;
  //             this.store = data.data;
  //             this.cdr.markForCheck();
  //           }
  //         },
  //         (err) => {
  //           this.messageServe.danger('Something wrong!');
  //           this.loading = false;
  //           this.cdr.markForCheck();
  //         }
  //       );
  //   }
  // }
  getPlacedOrder(): void {
    this.orderSub = this.placedOrderStore$
      .select(selectPlacedOrderFeature)
      .pipe(select(getPlacedOrder))
      .subscribe(
        (res) => {
          if (res) {
            console.log('get PlacedOrders :>> ', res);
            this.placedOrder = res;
            this.cdr.markForCheck();
          } else {
            this.messageServe.warning('No data found!');
            this.router.navigate(['account/orders']);
          }
        },
        (err) => {
          if (err.error.message) {
            this.messageServe.danger(err.error.message);
          } else {
            this.messageServe.danger('No data found!');
          }
          if (err.error.message == 'Unauthenticated.') {
            this.router.navigateByUrl('sign-in');
          } else {
            this.router.navigate([
              'restaurant/' + this.winServe.getLocalStorage(storageKeys.store),
            ]);
          }
        }
      );
  }
  // getOrderStatus(): void {
  //   this.loading = true;
  //   this.cdr.markForCheck();
  //   let orderId = this.route.snapshot.params?.['orderId'];
  //   if (orderId) {
  //     this.orderServe.getOrderStatus(orderId).subscribe(
  //       (res) => {
  //         if (res) {
  //           this.loading = false;
  //           this.orderStatus = res;
  //           this.deliveryAddress = JSON.parse(res.delivery_address);
  //           console.log('this.deliveryAddress :>> ', this.deliveryAddress);
  //           console.log(' this.orderStatus :>> ', this.orderStatus);
  //           this.cdr.markForCheck();
  //         } else {
  //           this.loading = false;
  //           this.cdr.markForCheck();
  //           this.messageServe.warning('No data found!');
  //           this.router.navigate([
  //             'restaurant/' + this.winServe.getLocalStorage(storageKeys.store),
  //           ]);
  //         }
  //       },
  //       (err) => {
  //         this.loading = false;
  //         this.cdr.markForCheck();
  //         this.messageServe.warning('No data found!');
  //         this.router.navigate([
  //           'restaurant/' + this.winServe.getLocalStorage(storageKeys.store),
  //         ]);
  //       }
  //     );
  //   }
  // }
  onPrint() {
    window.print();
  }
}
