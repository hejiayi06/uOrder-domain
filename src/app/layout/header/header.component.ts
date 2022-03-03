import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/apis/auth.service';
import { ShoppingCartService } from 'src/app/services/apis/shopping-cart.service';
import { WindowService } from 'src/app/services/local/window.service';
import { OverlayRef } from 'src/app/services/tools/overlay.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import { storageKeys } from 'src/app/share/configs';
import { ShoppingCartRes, StoreRes } from 'src/app/share/types';
import { setLoading } from 'src/app/state/loading/action';
import { LoadingStoreModule } from 'src/app/state/loading/loading.store.module';
import {
  setShoppingCart,
  setShoppingCartLength,
} from 'src/app/state/shopping-cart/action';
import {
  getShoppingCartLength,
  selectShoppingCartFeature,
} from 'src/app/state/shopping-cart/selectors';
import { ShoppingCartStoreModule } from 'src/app/state/shopping-cart/shopping-cart.store.module';

@Component({
  selector: 'uo-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() length: number = 0;
  isAccount: boolean = false;
  store!: StoreRes;
  @ViewChild('shoppingCart', { read: ElementRef, static: false })
  public sCRef!: ElementRef;
  isLog: boolean = false;
  shoppingCartRes: any;
  total!: number;
  loading: boolean = false;
  shoppingCartStoreId!: string;
  showShoppingCart: boolean = false;
  showNavbar: boolean = false;
  overlayRef!: OverlayRef | null;
  overlaySub!: Subscription | null;
  lengthSub!: Subscription;

  constructor(
    private winServe: WindowService,
    private authServe: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private shoppingCartServe: ShoppingCartService,
    private messageServe: MessageService,
    private shoppingCartStore$: Store<ShoppingCartStoreModule>,
    private loadingStore$: Store<LoadingStoreModule>,
    private eRef: ElementRef
  ) {}
  ngOnDestroy(): void {
    if (this.lengthSub) {
      this.lengthSub.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  handleOutsideClick(e: Event) {
    if (!this.eRef.nativeElement.contains(e.target)) {
      this.showNavbar = false;
    }
  }
  ngOnInit(): void {
    this.getStoreShoppingCartLength();
    this.getAuth();
  }
  getAuth(): void {
    if (this.winServe.getLocalStorage(storageKeys.auth)) {
      this.isLog = true;
      this.cdr.markForCheck();
      this.getLength();
    } else {
      this.isLog = false;
      let anonymousId = this.winServe.getLocalStorage(
        storageKeys.anonymous
      ) as string;
      console.log('this.anonymousID :>> ', anonymousId);
      if (anonymousId) {
        this.getAnonymousLength();
      }
      this.cdr.markForCheck();
    }
  }

  logout(): void {
    this.isLog = false;
    this.cdr.markForCheck();
    this.loadingStore$.dispatch(setLoading({ loading: true }));
    this.authServe
      .logout(this.winServe.getLocalStorage(storageKeys.user) as string)
      .subscribe(
        (res) => {
          this.winServe.removeLocalStorage(storageKeys.auth);
          this.winServe.removeLocalStorage(storageKeys.user);
          this.loadingStore$.dispatch(setLoading({ loading: false }));
          this.shoppingCartStore$.dispatch(
            setShoppingCartLength({ length: 0 })
          );
          this.shoppingCartStore$.dispatch(
            setShoppingCart({
              cart: [],
            })
          );
          this.router.navigate(['sign-in']);
          this.messageServe.warning('Logout successfully');
        },
        (err) => {
          this.winServe.removeLocalStorage(storageKeys.auth);
          this.winServe.removeLocalStorage(storageKeys.user);
          this.loadingStore$.dispatch(setLoading({ loading: false }));
          this.shoppingCartStore$.dispatch(
            setShoppingCartLength({ length: 0 })
          );
          this.shoppingCartStore$.dispatch(
            setShoppingCart({
              cart: [],
            })
          );
        }
      );
  }
  getStoreShoppingCartLength(): void {
    this.lengthSub = this.shoppingCartStore$
      .select(selectShoppingCartFeature)
      .pipe(select(getShoppingCartLength))
      .subscribe((res) => {
        if (res) {
          console.log('getShoppingCartLength :>> ', res);
          this.length = res;
          this.cdr.markForCheck();
        } else if (res == 0) {
          this.length = 0;
          this.cdr.markForCheck();
        }
      });
  }
  setShoppingCart(shoppingCart: ShoppingCartRes): void {
    let len = 0;
    shoppingCart.cart.forEach((item: { quantity: number }) => {
      len += item.quantity;
    });
    this.length = len;
    if (shoppingCart.store.id) {
      this.shoppingCartStoreId = shoppingCart.store.id.toString();
      this.winServe.setLocalStorage(
        storageKeys.shoppingCartStore,
        shoppingCart.store.id.toString()
      );
    }
    this.total = shoppingCart.total;
    this.shoppingCartStore$.dispatch(
      setShoppingCart({
        cart: shoppingCart.cart,
      })
    );
    this.shoppingCartStore$.dispatch(setShoppingCartLength({ length: len }));
  }
  getLength(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.shoppingCartServe.getShoppingCart().subscribe(
      (res) => {
        console.log('getShoppingCart length :>> ', res);
        if (res.data) {
          this.setShoppingCart(res.data);
        } else {
          this.length = 0;
          this.shoppingCartStoreId = '';
          this.total = 0;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      (err) => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    );
  }
  getAnonymousLength(): void {
    this.loading = true;
    this.cdr.markForCheck();
    let anonymousId = this.winServe.getLocalStorage(storageKeys.anonymous);
    if (anonymousId) {
      this.shoppingCartServe.getAnonymousShoppingCart(anonymousId).subscribe(
        (res) => {
          console.log('getAnonymousShoppingCart length :>> ', res);
          if (res.data) {
            this.setShoppingCart(res.data);
          } else {
            this.length = 0;
            this.shoppingCartStoreId = '';
            this.total = 0;
          }
          this.loading = false;
          this.cdr.markForCheck();
        },
        (err) => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      );
    } else {
      // this.shoppingCartStore$.dispatch(setShoppingCartLength({ length: 0 }));
      // this.shoppingCartStore$.dispatch(
      //   setShoppingCart({
      //     cart: [],
      //   })
      // );
      this.showShoppingCart = true;
      this.cdr.markForCheck();
      this.loadingStore$.dispatch(setLoading({ loading: false }));
    }
  }
  getShoppingCart(): void {
    this.loadingStore$.dispatch(setLoading({ loading: true }));
    this.shoppingCartServe.getShoppingCart().subscribe(
      (res) => {
        console.log('getShoppingCart :>> ', res);
        if (res.data) {
          this.setShoppingCart(res.data);
          this.store = res.data.store;
          this.showShoppingCart = true;
          this.cdr.markForCheck();
          this.loadingStore$.dispatch(setLoading({ loading: false }));
        } else {
          this.messageServe.warning('No data!');
          this.loadingStore$.dispatch(setLoading({ loading: false }));
        }
      },
      (err) => {
        this.loadingStore$.dispatch(setLoading({ loading: false }));
      }
    );
  }
  getAnonymousShoppingCart(): void {
    this.loadingStore$.dispatch(setLoading({ loading: true }));
    let anonymousId = this.winServe.getLocalStorage(storageKeys.anonymous);
    if (anonymousId) {
      this.shoppingCartServe.getAnonymousShoppingCart(anonymousId).subscribe(
        (res) => {
          console.log('getAnonymousShoppingCart :>> ', res);
          if (res.data) {
            this.setShoppingCart(res.data);
            this.store = res.data.store;
            this.showShoppingCart = true;
            this.cdr.markForCheck();
            this.loadingStore$.dispatch(setLoading({ loading: false }));
          } else {
            this.messageServe.warning('No data!');
            this.loadingStore$.dispatch(setLoading({ loading: false }));
          }
        },
        (err) => {
          this.loadingStore$.dispatch(setLoading({ loading: false }));
        }
      );
    } else {
      // this.shoppingCartStore$.dispatch(setShoppingCartLength({ length: 0 }));
      // this.shoppingCartStore$.dispatch(
      //   setShoppingCart({
      //     cart: [],
      //   })
      // );
      this.showShoppingCart = true;
      this.cdr.markForCheck();
      this.loadingStore$.dispatch(setLoading({ loading: false }));
    }
  }
  toUorder() {
    window.location.href = 'http://www.uorder.io/';
  }
}
