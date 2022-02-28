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
import { Store } from '@ngrx/store';
import { debounceTime, fromEvent, map, Subscription, throttleTime } from 'rxjs';
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
  storeId!: string;
  menuGroups!: Group[];
  selectedMenuGroup!: Group;
  categories!: Category[];
  selectedCategoryId!: number;
  canMove: boolean = false;
  disLeft: number | undefined;
  disRight: number | undefined;
  // moveLeft
  @Input() height!: number;
  heightLine!: number;
  @ViewChild('menuDiv', { static: true }) public menuEl!: ElementRef;
  @ViewChild('categoriesDiv', { static: true }) public cEl!: ElementRef;
  @ViewChildren('categories', { read: ElementRef })
  categoryList!: QueryList<ElementRef>;
  @HostListener('window:scroll', ['$event']) public onScroll = (): boolean => {
    // console.log('window.scroll :>> ', window.scrollY);
    return this.height + 80 - window.scrollY < 55;
  };
  scrollSubs!: Subscription;
  constructor(
    private scroller: ViewportScroller,
    private menuServe: MenuService,
    private winServe: WindowService,
    private cdr: ChangeDetectorRef,
    private loadingStore$: Store<LoadingStoreModule>,
    private diningTimeServe: DiningTimeService
  ) {}
  ngOnDestroy(): void {
    this.scrollSubs.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.heightLine =
      this.menuEl.nativeElement.offsetTop +
      this.menuEl.nativeElement.clientHeight;
    const sub = fromEvent(window, 'scroll');
    this.scrollSubs = sub
      .pipe(
        throttleTime(15 /* ms */),
        map((data) => {
          this.setCategories();
          return data;
        }),
        debounceTime(25)
      )
      .subscribe(
        (x) => {
          console.log(window.pageYOffset);
        },
        (err) => {
          console.log('Error: %s', err);
        },
        () => {
          console.log('Completed');
        }
      );
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
  setCategories(): void {
    this.categoryList.forEach((category) => {
      this.onScrollCategories(category);
    });
  }
  onScrollCategories(category: ElementRef<any>): void {
    this.heightLine =
      this.menuEl.nativeElement.offsetTop +
      this.menuEl.nativeElement.clientHeight;

    console.log('this.heightLine :>> ', this.heightLine);
    let categoryRect = category.nativeElement.getBoundingClientRect();
    // console.log('categoryRect :>> ', categoryRect);
    if (
      this.heightLine >= categoryRect.top &&
      this.heightLine <= categoryRect.bottom
    ) {
      this.selectedCategoryId = category.nativeElement.id;
      this.cdr.detectChanges();
    }
  }
  ngOnInit(): void {
    this.storeId = this.winServe.getLocalStorage(storageKeys.store) as string;
    this.getMenuGroup(this.storeId);
  }

  //get groups
  getMenuGroup(storeId: string): void {
    this.loadingStore$.dispatch(setLoading({ loading: true }));
    this.menuServe.getMenuGroups(storeId).subscribe(
      (res) => {
        if (res) {
          if (res.data.items) {
            this.menuGroups = res.data.items;
            this.selectedMenuGroup = this.menuGroups![0];
            if (this.selectedMenuGroup) {
              this.categories = this.selectedMenuGroup.categories;
              this.selectedCategoryId = this.categories[0].id;
              this.cdr.detectChanges();
            }
          }
        }
        this.loadingStore$.dispatch(setLoading({ loading: false }));
      },
      (err) => {
        this.loadingStore$.dispatch(setLoading({ loading: false }));
      }
    );
  }

  //change group func
  changeGroup(group: Group): void {
    this.selectedMenuGroup = group;
    if (this.selectedMenuGroup) {
      this.categories = this.selectedMenuGroup.categories;
      this.selectedCategoryId = this.categories[0].id;
      this.cdr.detectChanges();
    }
  }
  changeColor(category: Category): boolean {
    return category.id == this.selectedCategoryId;
  }
  onCategory(category: Category): void {
    this.selectedCategoryId = category.id;
    this.cdr.detectChanges();
    let res = this.categoryList.find(
      (elem) => elem.nativeElement.id === category.id.toString()
    );
    this.scroller.scrollToPosition([0, res?.nativeElement.offsetTop - 170]);
  }

  onCategoryLeft() {
    this.cEl.nativeElement.scrollLeft -= 200;
    this.cdr.markForCheck();
  }

  onCategoryRight() {
    this.cEl.nativeElement.scrollLeft += 200;
    this.cdr.markForCheck();
  }
  rightBtn(): boolean {
    return (
      this.cEl.nativeElement.scrollWidth - this.cEl.nativeElement.scrollLeft >
        window.screen.width - 59 &&
      this.cEl.nativeElement.scrollWidth >= window.screen.width
    );
  }
}
