import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OrderService } from 'src/app/services/apis/order.service';
import { ErrorsService } from 'src/app/services/local/errors.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import {
  OrderStatus,
  PageBase,
  StoreRes,
  UserAddress,
} from 'src/app/share/types';
import { setLoading } from 'src/app/state/loading/action';
import { LoadingStoreModule } from 'src/app/state/loading/loading.store.module';
import { setStoreInfo } from 'src/app/state/store-info/action';
import { StoreInfoStoreModule } from 'src/app/state/store-info/store-info.store.module';

@Component({
  selector: 'uo-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent implements OnInit {
  orderLists!: PageBase<OrderStatus[]>;
  constructor(
    private cdr: ChangeDetectorRef,
    private orderServe: OrderService,
    private messageServe: MessageService,
    private loadingStore$: Store<LoadingStoreModule>,
    private storeStore$: Store<StoreInfoStoreModule>,
    private router: Router,
    private errorServe: ErrorsService
  ) {}

  ngOnInit(): void {
    this.getOrderList();
  }
  getOrderList(): void {
    this.loadingStore$.dispatch(setLoading({ loading: true }));
    this.orderServe.getOrdersList().subscribe(
      (res) => {
        // console.log('res :>> ', res);
        this.orderLists = res.data;
        console.log('this.orderLists :>> ', this.orderLists);
        this.cdr.markForCheck();
        this.loadingStore$.dispatch(setLoading({ loading: false }));
      },
      (err) => {
        this.loadingStore$.dispatch(setLoading({ loading: false }));
      }
    );
  }
  parseJSON(address: string): UserAddress {
    return JSON.parse(address);
  }
  getOrderListByPage(page: string): void {
    this.loadingStore$.dispatch(setLoading({ loading: true }));
    this.orderServe.getOrdersListByPage(page).subscribe(
      (res) => {
        // console.log('res :>> ', res);
        this.orderLists = res.data;
        console.log('this.orderLists :>> ', this.orderLists);
        this.cdr.markForCheck();
        this.loadingStore$.dispatch(setLoading({ loading: false }));
      },
      (err) => {
        this.loadingStore$.dispatch(setLoading({ loading: false }));
      }
    );
  }
  getStore(store: StoreRes): void {
    this.storeStore$.dispatch(setStoreInfo(store));
    this.router.navigateByUrl('');
    // this.router.navigateByUrl('restaurant/' + store.id);
  }
}
