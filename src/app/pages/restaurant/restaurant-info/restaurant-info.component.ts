import { ViewportScroller } from '@angular/common';
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
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { StoreService } from 'src/app/services/apis/store.service';
import { WindowService } from 'src/app/services/local/window.service';
import { storageKeys } from 'src/app/share/configs';
import { StoreRes } from 'src/app/share/types';
import { setStoreInfo } from 'src/app/state/store-info/action';
import { StoreInfoStoreModule } from 'src/app/state/store-info/store-info.store.module';
import { AnnounceComponent } from '../../modals/announce/announce.component';

@Component({
  selector: 'uo-restaurant-info',
  templateUrl: './restaurant-info.component.html',
  styleUrls: ['./restaurant-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantInfoComponent implements OnInit, AfterViewChecked {
  storeData!: StoreRes;
  day!: string;
  // @Input() storeId!: string;
  @Output() heightEvent = new EventEmitter<number>();
  @ViewChild('info', { static: true }) private infoEl!: ElementRef;
  constructor(
    private cdr: ChangeDetectorRef,
    private storeServe: StoreService,
    private storeStore$: Store<StoreInfoStoreModule>,
    private winServe: WindowService,
    private viewportScroller: ViewportScroller,
    private modalService: NgbModal
  ) {}

  ngAfterViewChecked(): void {
    this.heightEvent.emit(this.infoEl.nativeElement.offsetHeight);
  }
  ngOnInit(): void {
    this.getDay();
    this.getStore();
  }
  anchorToFooter(anchorId: string): void {
    this.viewportScroller.setOffset([0, 155]);
    this.viewportScroller.scrollToAnchor(anchorId);
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
    this.storeServe
      .getStore(this.winServe.getLocalStorage(storageKeys.store) as string)
      .subscribe((data) => {
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
          if (this.storeData.announce) {
            Object.entries(this.storeData.announce).forEach((a) => {
              let expired = JSON.parse(JSON.parse((a[1] as string)).expired);
              let started = JSON.parse(JSON.parse((a[1] as string)).start);
              if(expired != null){
                const today = new Date();
                const date = new Date();
                const from = new Date();
                from.setFullYear(started.year,started.month - 1,started.day);
                date.setFullYear(expired.year,expired.month - 1,expired.day);
                from.setHours(0,0,0,0);
                date.setHours(0,0,0,0);
                console.log(today.getTime() < date.getTime(),today.getTime(), date.getTime())
                if(from.getTime() <= today.getTime() && today.getTime()< date.getTime()){
                  const modal = this.modalService.open(AnnounceComponent, {
                    size: 'xl',
                  });
                  modal.componentInstance.announce = a[1];
                }
              }else if(expired == null){
                const modal = this.modalService.open(AnnounceComponent, {
                  size: 'xl',
                });
                modal.componentInstance.announce = a[1];
              }
            });
          }
          this.cdr.markForCheck();
          this.winServe.setLocalStorage(
            storageKeys.storeInfo,
            JSON.stringify(data.data)
          );
          this.winServe.setLocalStorage(
            storageKeys.timeZone,
            this.storeData.time_zone
          );
          this.winServe.setLocalStorage(
            storageKeys.is_utensil,
            this.storeData.is_utensil.toString()
          );
          this.storeStore$.dispatch(setStoreInfo(data.data));
        }
      });
  }
}
