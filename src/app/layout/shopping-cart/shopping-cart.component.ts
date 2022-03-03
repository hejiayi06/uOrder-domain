import {
  animate,
  style,
  transition,
  AnimationEvent,
  trigger,
} from '@angular/animations';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { empty, merge, of, Subscription } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';
import { ShoppingCartService } from 'src/app/services/apis/shopping-cart.service';
import { WindowService } from 'src/app/services/local/window.service';
import {
  OverlayRef,
  OverlayService,
} from 'src/app/services/tools/overlay.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import { storageKeys } from 'src/app/share/configs';
import { ShoppingCartItem, StoreRes } from 'src/app/share/types';
import {
  setShoppingCart,
  setShoppingCartLength,
} from 'src/app/state/shopping-cart/action';
import {
  getShoppingCart,
  selectShoppingCartFeature,
} from 'src/app/state/shopping-cart/selectors';
import { ShoppingCartStoreModule } from 'src/app/state/shopping-cart/shopping-cart.store.module';

@Component({
  selector: 'uo-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('offcanvas', [
      transition(':enter', [
        style({
          opacity: 1,
          transform: 'translateX(100%)',
        }),
        animate(
          '.2s',
          style({
            opacity: 1,
            transform: 'translateX(0)',
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '.3s',
          style({
            opacity: 1,
            transform: 'translateX(100%)',
          })
        ),
      ]),
    ]),
  ],
})
export class ShoppingCartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() show = false;
  items!: ShoppingCartItem[];
  isCheckout: boolean = false;
  @Input() store!: StoreRes;
  @Input() length: number = 0;
  @Input() shoppingCartStoreId!: string;
  @Input() isLog!: boolean;
  @Output() hide = new EventEmitter<void>();
  @Input() total: number = 0;
  loading: boolean = false;
  deleteLoadingId!: string;
  overlayRef!: OverlayRef | null;
  overlaySub!: Subscription | null;
  visible: boolean = false;
  refresh: boolean = false;
  cartSub!: Subscription;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shoppingCartServe: ShoppingCartService,
    private winServe: WindowService,
    private cdr: ChangeDetectorRef,
    private messageServe: MessageService,
    private overlayServe: OverlayService,
    private shoppingCartStore$: Store<ShoppingCartStoreModule>
  ) {}
  ngOnDestroy(): void {
    this.hideOverlay();
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }
  ngOnChanges(): void {
    if (this.show) {
      this.showOverlay();
    } else {
      this.visible = false;
      this.refresh = false;
    }
  }

  ngOnInit(): void {
    this.getShoppingCart();
  }
  isStore(): boolean {
    return !(this.route.snapshot.data['page'] == 'store');
  }
  getShoppingCart(): void {
    this.cartSub = this.shoppingCartStore$
      .select(selectShoppingCartFeature)
      .pipe(select(getShoppingCart))
      .subscribe((res) => {
        if (res) {
          this.items = cloneDeep(res);
          this.isCheckout = false;
          this.items.forEach((i) => {
            if (i.options.expired) {
              this.isCheckout = true;
              return;
            }
          });
        }
      });
  }
  toCheckout(): void {
    this.router.navigate(['/checkout']);
    this.hide.emit();
    this.hideOverlay();
  }
  mergeEvent() {
    this.overlaySub = merge(
      this.overlayRef!.backdropClick(),
      this.overlayRef!.backdropKeyup().pipe(
        pluck('key'),
        switchMap((key) => {
          return key.toUpperCase() === 'ESCAPE' ? of(key) : empty();
        })
      )
    ).subscribe(() => {
      this.hide.emit();
    });
  }
  showOverlay(): void {
    if (!this.refresh) {
      this.overlayRef = this.overlayServe.create({
        fade: false,
        // responseEvent: false,
      });
    }
    this.refresh = true;
    this.mergeEvent();
    console.log('this.overlayRef :>> ', this.overlayRef);
    this.visible = true;
  }
  animationDone(event: AnimationEvent): void {
    if (event.toState === 'void') {
      this.hideOverlay();
    }
  }
  hideOverlay() {
    if (this.overlaySub) {
      this.overlaySub.unsubscribe();
      this.overlaySub = null;
    }
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
  isEmpty(cart: any): boolean {
    if (!cart || !Object.keys(cart).length) return false;
    return true;
  }

  deleteItem(item: ShoppingCartItem) {
    this.loading = true;
    this.deleteLoadingId = item.unique_id;
    this.cdr.markForCheck();
    // this.loadingEvent.emit(true);
    if (this.isLog) {
      this.shoppingCartServe.deleteShoppingCart(item.unique_id).subscribe(
        (res) => {
          console.log('deleteShoppingCart :>> ', res);
          if (res.data) {
            this.messageServe.warning('Delete item successfully!');
            this.setShoppingCart(res.data);
          }
          this.loadingFalse();
        },
        (err) => {
          this.loadingFalse();
        }
      );
    } else {
      let anonymousId = this.winServe.getLocalStorage(
        storageKeys.anonymous
      ) as string;
      this.shoppingCartServe
        .deleteAnonymousShoppingCart(item.unique_id, anonymousId)
        .subscribe(
          (res) => {
            console.log('deleteShoppingCart :>> ', res);
            if (res) {
              this.messageServe.warning('Delete item successfully!');
              this.setShoppingCart(res.data);
            }
            this.loadingFalse();
          },
          (err) => {
            this.loadingFalse();
          }
        );
    }
  }
  setShoppingCart(data: any): void {
    this.items = data.cart;
    this.total = data.total;
    this.shoppingCartStore$.dispatch(setShoppingCart({ cart: this.items }));
    let len = 0;
    this.items.forEach((i) => {
      len += i.quantity;
    });
    this.shoppingCartStore$.dispatch(setShoppingCartLength({ length: len }));
  }
  loadingFalse(): void {
    this.loading = false;
    this.cdr.markForCheck();
  }
  deleteAllItems(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.shoppingCartServe.deleteShoppingCartAll().subscribe(
      (res) => {
        this.visible = false;
        console.log('deleteShoppingCartAll :>> ', res);
        this.winServe.removeLocalStorage(storageKeys.shoppingCartStore);
        this.shoppingCartStore$.dispatch(setShoppingCartLength({ length: 0 }));
        this.shoppingCartStore$.dispatch(setShoppingCart({ cart: [] }));
        this.loadingFalse();
      },
      (err) => {
        this.loadingFalse();
      }
    );
  }
  returnToOrder(): void {
    this.visible = false;
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }
  cleanOrder(): void {
    this.deleteAllItems();
  }
}
