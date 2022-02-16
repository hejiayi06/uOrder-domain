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

  storeId!: number;
  merchantId!: number;
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private loadingStore$: Store<LoadingStoreModule> // private route: ActivatedRoute,
  ) {}

  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
  }
  ngOnInit(): void {
    this.getLoading();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.initScroll();
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
