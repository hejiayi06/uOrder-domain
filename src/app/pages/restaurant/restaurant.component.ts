import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  Inject,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DomainService } from 'src/app/services/apis/domain.service';
import { ErrorsService } from 'src/app/services/local/errors.service';
import { WindowService } from 'src/app/services/local/window.service';
import { storageKeys } from 'src/app/share/configs';
import { Category, Item } from 'src/app/share/types';
import { setLoading } from 'src/app/state/loading/action';
import { LoadingStoreModule } from 'src/app/state/loading/loading.store.module';
import {
  getLoading,
  selectLoadingFeature,
} from 'src/app/state/loading/selectors';

@Component({
  selector: 'uo-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// @ViewChild('listCategory1') listCategory1: ElementRef;
export class RestaurantComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  menuList!: Category[];
  selectItem!: Item;
  itemLength!: number;
  height!: number;
  menuHeight!: number;
  loadingSub!: Subscription;
  domainForm: FormGroup = this.fb.group({
    domain: [],
  });
  storeId!: number;
  merchantId!: number;
  constructor(
    private winServe: WindowService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private domainServe: DomainService,
    private errorServe: ErrorsService,
    private loadingStore$: Store<LoadingStoreModule> // private route: ActivatedRoute,
  ) {}
  get domain(): AbstractControl | null {
    return this.domainForm.get('domain');
  }
  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
  }
  ngOnInit(): void {
    this.getDomain();
    this.getLoading();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.initScroll();
  }
  getDomain(): void {
    this.loading = true;
    this.cdr.markForCheck();
    console.log('hostname :>> ', window.location.hostname);
    this.domain?.patchValue(window.location.hostname);
    this.domainServe
      .postDomain(
        { Domain: 'test.test.com' }
        // this.domainForm.value
      )
      .subscribe(
        (res) => {
          this.storeId = res.data.item.store_id;
          this.merchantId = res.data.item.merchant_id;
          this.winServe.setLocalStorage(
            storageKeys.store,
            this.storeId.toString()
          );
          this.winServe.setLocalStorage(
            storageKeys.merchant,
            this.merchantId.toString()
          );
          this.loading = false;
          this.cdr.markForCheck();
        },
        (err) => {
          this.errorServe.errorHandler(err);
          this.loading = false;
          this.cdr.markForCheck();
        }
      );
  }
  initScroll(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
  getLoading(): void {
    this.loadingSub = this.loadingStore$
      .select(selectLoadingFeature)
      .pipe(select(getLoading))
      .subscribe((res: boolean) => {
        this.loading = res;
        this.cdr.markForCheck();
      });
  }
  getHeight(e: number): void {
    this.height = e;
  }
  lengthChange(e: number): void {
    this.itemLength = e;
  }
}
