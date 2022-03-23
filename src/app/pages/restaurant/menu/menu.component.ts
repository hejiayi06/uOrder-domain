import { ViewportScroller } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  HostListener,
  Input,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  debounceTime,
  fromEvent,
  map,
  Subscription,
  tap,
  throttleTime,
} from 'rxjs';
import { MenuService } from 'src/app/services/apis/menu.service';
import { DiningTimeService } from 'src/app/services/local/dining-time.service';
import { WindowService } from 'src/app/services/local/window.service';
import { storageKeys } from 'src/app/share/configs';
import { Category, Group } from 'src/app/share/types';
import { setLoading } from 'src/app/state/loading/action';
import { LoadingStoreModule } from 'src/app/state/loading/loading.store.module';

@Component({
  selector: 'uo-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {
  restaurantId!: string;
  menuGroups!: Group[];
  selectedMenuGroup!: Group;
  categories!: Category[];
  selectedCategoryId!: number;
  canMove: boolean = false;
  disLeft: number | undefined;
  disRight: number | undefined;
  @Input() height!: number;
  @Input() contentHeight!: number;
  categoriesHeight: {
    id: number;
    offsetHeight: number;
    offsetTop: number;
    index: number;
  }[] = [];
  heightLine!: number;
  @ViewChild('menuDiv', { static: true }) public menuView!: ElementRef;
  @ViewChild('categoriesScrollBar', { static: true })
  public categoryView!: ElementRef;
  @ViewChildren('categories')
  categoryList!: QueryList<ElementRef>;
  @HostListener('window:scroll', ['$event']) public onScroll = (): boolean => {
    return (
      this.height < window.scrollY && this.contentHeight >= window.scrollY + 100
    );
  };
  scrollSubs!: Subscription;
  constructor(
    private scroller: ViewportScroller,
    private menuServe: MenuService,
    private winServe: WindowService,
    private cdr: ChangeDetectorRef,
    private diningTimeServe: DiningTimeService,
    private loadingStore$: Store<LoadingStoreModule>
  ) {}
  ngOnInit(): void {
    this.initScroll();
  }
  ngAfterViewInit(): void {
    this.getMenuGroup(
      this.winServe.getLocalStorage(storageKeys.store) as string
    );
  }
  ngOnDestroy(): void {
    this.scrollSubs.unsubscribe();
  }
  initScroll(): void {
    this.scrollSubs = fromEvent(window, 'scroll')
      .pipe(
        throttleTime(20),
        debounceTime(5),
        map(() => {
          this.setCategories();
        })
      )
      .subscribe();
  }
  setCategories(): void {
    this.categoriesHeight.forEach((h) => {
      if (
        window.scrollY > h.offsetTop - 158 &&
        window.scrollY < h.offsetTop + h.offsetHeight - 158
      ) {
        if (this.selectedCategoryId !== h.id) {
          this.selectedCategoryId = h.id;
          const childNode = this.categoryView.nativeElement.children[
            h.index
          ] as HTMLElement;
          // console.log(
          //   'childNode.offsetLeft - this.categoryView.nativeElement :>> ',
          //   childNode.offsetLeft - this.categoryView.nativeElement.offsetLeft
          // );
          this.categoryView.nativeElement.scrollTo({
            top: 0,
            left:
              childNode.offsetLeft - this.categoryView.nativeElement.offsetLeft,
          });
          this.cdr.markForCheck();
        }
      }
    });
  }
  getMenuGroup(restaurantId: string): void {
    this.loadingStore$.dispatch(setLoading({ loading: true }));
    this.menuServe.getMenuGroups(restaurantId).subscribe(
      (res) => {
        console.log('getMenuGroups :>> ', res);
        if (res) {
          if (res.data.items) {
            this.menuGroups = res.data.items;
            this.selectedMenuGroup = this.menuGroups![0];
            if (this.selectedMenuGroup) {
              this.categories = this.selectedMenuGroup.categories.sort(
                (a, b) => a.sort - b.sort
              );
            }
          }
          this.cdr.markForCheck();
        }
        this.loadingStore$.dispatch(setLoading({ loading: false }));
      },
      () => {
        this.loadingStore$.dispatch(setLoading({ loading: false }));
      },
      () => {
        this.setHeights();
        // this.setScroll();
        this.cdr.markForCheck();
      }
    );
  }
  setHeights(): void {
    this.categoriesHeight = [];
    this.categoryList.map((category, i) => {
      const c = category.nativeElement;
      this.categoriesHeight[i] = {
        id: c.id,
        offsetHeight: c.offsetHeight,
        offsetTop: c.offsetTop,
        index: i,
      };
    });
    console.log('this.categoriesHeight :>> ', this.categoriesHeight);
  }
  //change group func
  changeGroup(group: Group): void {
    this.selectedMenuGroup = group;
    if (this.selectedMenuGroup) {
      this.categories = this.selectedMenuGroup.categories.sort(
        (a, b) => a.sort - b.sort
      );
      this.selectedCategoryId = this.categories[0].id;
      this.onCategory(this.categories[0]);
      this.setHeights();
    }
  }
  categoryShow(category: Category): boolean {
    if (!category?.menu_list?.length) {
      return false;
    }
    if (category.is_dining_time_display) {
      return true;
    } else {
      if (category.dining_times.length) {
        return this.diningTimeServe.detectDiningTime(category.dining_times);
      }
    }
    return true;
  }
  onCategory(category: Category): void {
    this.selectedCategoryId = category.id;
    this.cdr.detectChanges();
    this.scroller.setOffset([0, 153]);
    this.scroller.scrollToAnchor(category.id.toString());
  }
  onCategoryLeft() {
    (this.categoryView.nativeElement as HTMLElement).scrollBy({
      top: 0,
      left: -200,
      behavior: 'smooth',
    });
  }
  onCategoryRight() {
    (this.categoryView.nativeElement as HTMLElement).scrollBy({
      top: 0,
      left: 200,
      behavior: 'smooth',
    });
  }
  rightBtn(): boolean {
    return (
      this.categoryView.nativeElement.scrollWidth -
        this.categoryView.nativeElement.scrollLeft >=
      this.categoryView.nativeElement.offsetWidth + 26
    );
  }
}
