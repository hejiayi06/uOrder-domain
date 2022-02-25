import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { BusinessHourDetail, StoreRes } from 'src/app/share/types';
import {
  getStoreInfo,
  selectStoreInfoFeature,
} from 'src/app/state/store-info/selectors';
import { StoreInfoStoreModule } from 'src/app/state/store-info/store-info.store.module';
@Component({
  selector: 'uo-full-footer',
  templateUrl: './full-footer.component.html',
  styleUrls: ['./full-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullFooterComponent implements OnInit {
  store!: StoreRes;
  storeSub!: Subscription;
  googleMapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    center: null,
    maxZoom: 15,
    panControl: true,
    minZoom: 8,
    zoom: 15,
  };
  marker!: {
    position: { lat: number; lng: number };
  };

  businessHours: { day: string; scope: BusinessHourDetail[] }[] = [
    { day: 'Sun', scope: [] },
    { day: 'Mon', scope: [] },
    { day: 'Tue', scope: [] },
    { day: 'Wed', scope: [] },
    { day: 'Thu', scope: [] },
    { day: 'Fri', scope: [] },
    { day: 'Sat', scope: [] },
  ];

  constructor(
    private storeStore$: Store<StoreInfoStoreModule>,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.getStore();
  }
  getStore(): void {
    this.storeSub = this.storeStore$
      .select(selectStoreInfoFeature)
      .pipe(select(getStoreInfo))
      .subscribe((res) => {
        if (res) {
          this.store = res;
          this.store.business_hour?.forEach((b) => {
            (
              Object.entries(JSON.parse(b.scope)) as [
                'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun',
                boolean
              ][]
            ).forEach((d) => {
              if (d[1]) {
                this.businessHours.forEach((bh) => {
                  if (bh.day == d[0]) {
                    bh.scope.push({
                      open_hour: b.open_hour,
                      close_hour: b.close_hour,
                    });
                  }
                });
              }
            });
          });

          console.log('this.businessHours :>> ', this.businessHours);
          const position = {
            lat: parseFloat(this.store.latitude),
            lng: parseFloat(this.store.longitude),
          };
          this.googleMapOptions.center = position;
          this.marker = {
            position: position,
          };
          console.log('this.maker :>> ', this.marker);
          console.log('this.store :>> ', this.store);
          this.cdr.markForCheck();
        }
      });
  }
}
