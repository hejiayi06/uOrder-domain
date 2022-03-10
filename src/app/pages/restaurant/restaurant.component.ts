import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Category, Item } from 'src/app/share/types';
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
export class RestaurantComponent implements OnInit, OnDestroy {
  @ViewChild('storeContent', { static: true }) public contentView!: ElementRef;
  loading: boolean = true;
  menuList!: Category[];
  selectItem!: Item;
  itemLength!: number;
  height!: number;
  menuHeight!: number;
  loadingSub!: Subscription;
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private loadingStore$: Store<LoadingStoreModule> // private route: ActivatedRoute,
  ) {}

  ngOnDestroy(): void {
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.getLoading();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.initScroll();
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
        this.cdr.detectChanges();
      });
  }
}
