import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  Input,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { StoreService } from 'src/app/services/apis/store.service';
import { ErrorsService } from 'src/app/services/local/errors.service';
import { WindowService } from 'src/app/services/local/window.service';
import { storageKeys } from 'src/app/share/configs';
import { StoreRes } from 'src/app/share/types';
import { setStoreInfo } from 'src/app/state/store-info/action';
import { StoreInfoStoreModule } from 'src/app/state/store-info/store-info.store.module';

@Component({
  selector: 'uo-restaurant-info',
  templateUrl: './restaurant-info.component.html',
  styleUrls: ['./restaurant-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantInfoComponent implements OnInit, AfterViewChecked {
  storeData!: StoreRes;
  day!: string;
  @Input() storeId!: string;
  @Output() heightEvent = new EventEmitter<number>();
  @ViewChild('info', { static: true }) private infoEl!: ElementRef;
  constructor(
    private cdr: ChangeDetectorRef,
    private storeServe: StoreService,
    private route: ActivatedRoute,
    private storeStore$: Store<StoreInfoStoreModule>,
    // private orderStatusStore$: Store<OrderStatusStoreModule>
    private winServe: WindowService,
    private errorServe: ErrorsService
  ) {}
  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('RestaurantInfoComponent changes :>> ', changes);
  // }
  ngAfterViewChecked(): void {
    this.heightEvent.emit(this.infoEl.nativeElement.offsetHeight);
  }
  ngOnInit(): void {
    this.getDay();
    this.getStore();
  }
  getDay(): void {
    let day = new Date().getDay();
    switch (day) {
      case 0: {
        this.day = 'Sun';
        break;
      }
      case 1: {
        this.day = 'Mon';
        break;
      }
      case 2: {
        this.day = 'Tue';
        break;
      }
      case 3: {
        this.day = 'Wed';
        break;
      }
      case 4: {
        this.day = 'Thu';
        break;
      }
      case 5: {
        this.day = 'Fri';
        break;
      }
      case 6: {
        this.day = 'Sat';
        break;
      }
      default: {
        this.day = '';
        break;
      }
    }
    console.log('this.day :>> ', this.day);
  }
  parseDay(string: string): boolean {
    let weekObj = JSON.parse(string);
    return weekObj[this.day];
  }
  getStore(): void {
    // this.storeStore$
    //   .select(selectStoreInfoFeature)
    //   .pipe(select(getStoreInfo))
    //   .subscribe((res) => {
    //     if (res) {
    //       console.log('getStoreInfo :>> ', res);
    //       this.storeData = res;
    //       this.cdr.markForCheck();
    //     }
    //   });
    // if (!this.storeData) {
    this.storeServe.getStore(this.storeId).subscribe(
      (data) => {
        console.log('getStore :>> ', data);
        if (data) {
          this.storeData = data.data;
          const order_type = JSON.parse(data.data.order_type);
          console.log('order_type :>> ', order_type);
          if (order_type) {
            if (order_type.delivery) {
              this.winServe.setLocalStorage(storageKeys.orderStatus, '1');
            } else {
              this.winServe.setLocalStorage(storageKeys.orderStatus, '2');
            }
          }
          const payment_type = JSON.parse(data.data.payment_type);
          if (payment_type) {
            if (payment_type.online) {
              this.winServe.setLocalStorage(storageKeys.payment, '1');
            } else if (payment_type.in_store) {
              this.winServe.setLocalStorage(storageKeys.payment, '2');
            }
          }
          this.cdr.markForCheck();
          this.winServe.setLocalStorage(
            storageKeys.storeInfo,
            JSON.stringify(data.data)
          );
          this.storeStore$.dispatch(setStoreInfo(data.data));
        }
      },
      (err) => {
        this.errorServe.errorHandler(err);
      }
    );
  }
}
