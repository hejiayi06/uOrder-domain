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
import { MessageService } from 'src/app/share/components/message/message.service';
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
    private messageServe: MessageService,
    private cdr: ChangeDetectorRef,
    private placedOrderStore$: Store<ShoppingCartStoreModule>
  ) {}
  ngOnDestroy(): void {
    if (this.orderSub) {
      this.orderSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.getPlacedOrder();
  }

  getPlacedOrder(): void {
    this.orderSub = this.placedOrderStore$
      .select(selectPlacedOrderFeature)
      .pipe(select(getPlacedOrder))
      .subscribe((res) => {
        if (res) {
          console.log('get PlacedOrders :>> ', res);
          this.placedOrder = res;
          this.cdr.markForCheck();
        } else {
          this.messageServe.warning('No data found!');
          this.router.navigate(['account/orders']);
        }
      });
  }
  onPrint() {
    window.print();
  }
}
